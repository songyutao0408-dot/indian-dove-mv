// 沙漠峡谷背景：硬边色带天空 + 4 层视差（远山、中景峡谷、近景仙人掌和石头、前景草丛）
// 白天 / 黄昏 / 夜晚 / 黎明 都是同一个组件，颜色全部来自 theme（可插值）。
// camX = 镜头横移量（像素，按近景层计），各层按视差系数移动；镜头运动保持 24fps 平滑。
import React from "react";
import { random } from "remotion";
import { INK } from "../style/palette";
import type { Theme } from "../style/theme";
import { DeadTree, DryBush, PricklyPear, Rock, SmallSaguaro, StarField, CowSkull, Moon, Sun } from "./props";

export const SCREEN_W = 1920;
export const SCREEN_H = 1080;
const WORLD = 3600; // 每层内容的循环宽度

export const PARALLAX = { sky: 0.02, far: 0.12, mid: 0.35, ground: 0.6, near: 1, fg: 1.5 };

/** 把世界坐标换成屏幕坐标，并循环铺开；返回需要画的若干个 x（通常 1 个，接缝处 2 个） */
export function wrapX(x: number, camX: number, par: number, margin = 700): number[] {
  const sx = (((x - camX * par) % WORLD) + WORLD) % WORLD;
  const out: number[] = [];
  for (const k of [sx - WORLD, sx, sx + WORLD]) if (k > -margin && k < SCREEN_W + margin) out.push(k);
  return out;
}

export type DesertProps = {
  theme: Theme;
  frame: number;
  camX?: number;
  /** 地平线高度（屏幕 y） */
  horizon?: number;
  seed?: number;
  sun?: { x: number; y: number; r?: number; face?: "none" | "smug" | "yawn" | "sleepy" | "wave" };
  moon?: { x: number; y: number; r?: number; face?: "none" | "wink" | "calm" };
  /** 风力 0–1：草丛、灌木摆动幅度 */
  wind?: number;
  /** 关掉某些层（特写镜头里用） */
  near?: boolean;
  fg?: boolean;
  mid?: boolean;
  stars?: boolean;
};

export const Desert: React.FC<DesertProps> = ({
  theme, frame, camX = 0, horizon = 600, seed = 1, sun, moon, wind = 0.3, near = true, fg = true, mid = true, stars = true,
}) => {
  const t = frame / 24;
  const R = (k: string) => random(`desert${seed}-${k}`);
  const H = horizon;

  // ---------- 天空：4 条硬边色带 ----------
  const bandFrac = [0.36, 0.26, 0.21, 0.17];
  let y = 0;
  const bands = theme.sky.map((c, i) => {
    const h = H * bandFrac[i];
    const el = <rect key={i} x={0} y={y} width={SCREEN_W} height={h + 1} fill={c} />;
    y += h;
    return el;
  });

  // ---------- 远山：平涂的大色块，一串平顶山轮廓 ----------
  const farPath = (() => {
    let d = `M 0 ${H} `;
    let x = 0;
    let i = 0;
    while (x < WORLD) {
      const w = 220 + R(`fw${i}`) * 380;
      const h = 50 + R(`fh${i}`) * 140;
      const slope = 30 + R(`fs${i}`) * 50;
      d += `L ${x + slope} ${H - h} L ${x + w - slope} ${H - h} L ${x + w} ${H - (i % 3 === 0 ? 20 : 0)} `;
      x += w;
      i++;
    }
    return d + `L ${WORLD} ${H} Z`;
  })();

  // ---------- 中景：平顶山 / 峡谷岩壁 ----------
  const mesas = Array.from({ length: 7 }, (_, i) => {
    const narrow = R(`mn${i}`) < 0.3; // 窄高的孤峰
    return {
      x: (i / 7) * WORLD + R(`mx${i}`) * 260,
      w: narrow ? 160 + R(`mw${i}`) * 120 : 340 + R(`mw${i}`) * 420,
      h: narrow ? 260 + R(`mh${i}`) * 120 : 150 + R(`mh${i}`) * 200,
      step: !narrow && R(`ms${i}`) < 0.45,
    };
  });

  // ---------- 近景：仙人掌、石头、灌木、枯树、牛头骨 ----------
  type NearItem = { x: number; y: number; kind: number; s: number; k: number };
  const nearItems: NearItem[] = Array.from({ length: 14 }, (_, i) => ({
    x: (i / 14) * WORLD + R(`nx${i}`) * 180,
    y: H + 120 + R(`ny${i}`) * 200,
    kind: Math.floor(R(`nk${i}`) * 6),
    s: 0.7 + R(`ns${i}`) * 0.6,
    k: i,
  }));
  nearItems.sort((a, b) => a.y - b.y);

  const sway = Math.sin(t * 2.4) * 6 * wind + wind * 6;

  return (
    <svg width={SCREEN_W} height={SCREEN_H} style={{ position: "absolute", inset: 0 }}>
      {bands}
      {stars && <StarField frame={frame} theme={theme} height={H} offsetX={camX * PARALLAX.sky} />}
      {sun && (
        <g transform={`translate(${sun.x - camX * PARALLAX.sky} ${sun.y})`}>
          <Sun r={sun.r ?? 90} frame={frame} color={theme.sun} face={sun.face} />
        </g>
      )}
      {moon && (
        <g transform={`translate(${moon.x - camX * PARALLAX.sky} ${moon.y})`}>
          <Moon r={moon.r ?? 80} frame={frame} face={moon.face} glow={theme.night} />
        </g>
      )}
      {/* 远山 */}
      {wrapX(0, camX, PARALLAX.far, WORLD).map((x, i) => (
        <path key={i} d={farPath} fill={theme.mesaFar} transform={`translate(${x} 0)`} />
      ))}
      {/* 中景平顶山 */}
      {mid &&
        mesas.map((m, i) =>
          wrapX(m.x, camX, PARALLAX.mid).map((x, j) => (
            <g key={`${i}-${j}`} transform={`translate(${x} ${H})`}>
              {/* 山脚碎石坡：从崖底一直铺到地平线 */}
              <path
                d={`M ${-m.w * 0.12} 0 C ${m.w * 0.02} ${-m.h * 0.18} ${m.w * 0.08} ${-m.h * 0.4} ${m.w * 0.12} ${-m.h * 0.46} L ${m.w * 0.9} ${-m.h * 0.46} C ${m.w * 0.94} ${-m.h * 0.4} ${m.w * 1.0} ${-m.h * 0.18} ${m.w * 1.14} 0 Z`}
                fill={theme.mesa}
                stroke={INK}
                strokeWidth={3}
                strokeLinejoin="round"
              />
              <path d={`M ${m.w * 0.7} ${-m.h * 0.46} L ${m.w * 0.9} ${-m.h * 0.46} C ${m.w * 0.94} ${-m.h * 0.4} ${m.w * 1.0} ${-m.h * 0.18} ${m.w * 1.14} 0 L ${m.w * 0.78} 0 Z`} fill={theme.mesaDark} opacity={0.85} />
              {/* 垂直崖壁（顶部可能是两级台阶） */}
              <path
                d={
                  m.step
                    ? `M ${m.w * 0.14} ${-m.h * 0.45} L ${m.w * 0.16} ${-m.h * 0.82} L ${m.w * 0.36} ${-m.h * 0.82} L ${m.w * 0.38} ${-m.h} L ${m.w * 0.84} ${-m.h} L ${m.w * 0.88} ${-m.h * 0.45} Z`
                    : `M ${m.w * 0.14} ${-m.h * 0.45} L ${m.w * 0.17} ${-m.h} L ${m.w * 0.84} ${-m.h * 1.01} L ${m.w * 0.88} ${-m.h * 0.45} Z`
                }
                fill={theme.mesa}
                stroke={INK}
                strokeWidth={3}
                strokeLinejoin="round"
              />
              {/* 暗面 */}
              <path d={`M ${m.w * 0.66} ${-m.h * 1.0} L ${m.w * 0.84} ${-m.h * 1.0} L ${m.w * 0.88} ${-m.h * 0.46} L ${m.w * 0.7} ${-m.h * 0.46} Z`} fill={theme.mesaDark} />
              {/* 岩层线 + 竖向裂缝 */}
              {[0.78, 0.62].map((k, q) => (
                <path key={q} d={`M ${m.w * (m.step && k > 0.7 ? 0.4 : 0.19)} ${-m.h * k} L ${m.w * 0.66} ${-m.h * k}`} stroke={theme.mesaDark} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
              ))}
              <path d={`M ${m.w * 0.3} ${-m.h * 0.6} l 6 ${m.h * 0.12} M ${m.w * 0.52} ${-m.h * 0.9} l -4 ${m.h * 0.16}`} stroke={theme.mesaDark} strokeWidth={3} strokeLinecap="round" />
              {/* 顶上的高光边 */}
              <path d={`M ${m.w * (m.step ? 0.4 : 0.19)} ${-m.h * 0.995} L ${m.w * 0.62} ${-m.h * 1.0}`} stroke={theme.sky[0]} strokeWidth={5} strokeLinecap="round" opacity={0.6} />
            </g>
          )),
        )}
      {/* 地面 */}
      <rect x={0} y={H} width={SCREEN_W} height={SCREEN_H - H} fill={theme.sand} />
      <rect x={0} y={H} width={SCREEN_W} height={10} fill={theme.sandShadow} opacity={0.8} />
      <rect x={0} y={H + 26} width={SCREEN_W} height={6} fill={theme.sandShadow} opacity={0.5} />
      {/* 沙丘阴影（地面层视差） */}
      {Array.from({ length: 7 }, (_, i) => {
        const gx = (i / 7) * WORLD + R(`gx${i}`) * 300;
        const gy = H + 70 + R(`gy${i}`) * 300;
        const gw = 260 + R(`gw${i}`) * 300;
        return wrapX(gx, camX, PARALLAX.ground).map((x, j) => (
          <ellipse key={`${i}-${j}`} cx={x} cy={gy} rx={gw} ry={18 + gw * 0.04} fill={theme.sandShadow} opacity={0.55} />
        ));
      })}
      {/* 碎石点 */}
      {Array.from({ length: 30 }, (_, i) => {
        const px = R(`px${i}`) * WORLD;
        const py = H + 40 + R(`py${i}`) * (SCREEN_H - H - 40);
        return wrapX(px, camX, PARALLAX.ground + (py - H) / 1200).map((x, j) => (
          <ellipse key={`${i}-${j}`} cx={x} cy={py} rx={4 + R(`pr${i}`) * 5} ry={3} fill={theme.sandShadow} />
        ));
      })}
      {/* 近景 */}
      {near &&
        nearItems.map((it) =>
          wrapX(it.x, camX, PARALLAX.near).map((x, j) => {
            const s = it.s * (0.6 + ((it.y - H) / (SCREEN_H - H)) * 0.7);
            return (
              <g key={`${it.k}-${j}`} transform={`translate(${x} ${it.y}) scale(${s})`}>
                <ellipse cx={0} cy={2} rx={70} ry={10} fill={theme.sandShadow} opacity={0.7} />
                {it.kind === 0 && <SmallSaguaro h={230} color={theme.cactus} dark={theme.cactusDark} arms={2} sway={sway * 0.15} />}
                {it.kind === 1 && <Rock w={150} h={80} color={theme.mesa} shade={theme.mesaDark} seed={it.k} />}
                {it.kind === 2 && <PricklyPear color={theme.cactus} dark={theme.cactusDark} s={0.8} />}
                {it.kind === 3 && <DryBush sway={sway} color={theme.sandShadow} />}
                {it.kind === 4 && <SmallSaguaro h={160} color={theme.cactus} dark={theme.cactusDark} arms={1} sway={sway * 0.15} />}
                {it.kind === 5 && (it.k % 2 ? <CowSkull s={0.7} /> : <DeadTree s={0.6} color={theme.mesaDark} />)}
              </g>
            );
          }),
        )}
      {/* 前景草丛：深色剪影，跟着风摆 */}
      {fg &&
        Array.from({ length: 9 }, (_, i) => {
          const fx = (i / 9) * WORLD + R(`fx${i}`) * 200;
          return wrapX(fx, camX, PARALLAX.fg).map((x, j) => {
            const blades = Array.from({ length: 7 }, (_, b) => {
              const a = -Math.PI / 2 + (b - 3) * 0.22;
              const len = 70 + ((b * 37 + i * 13) % 50);
              const bend = sway * (1 + b * 0.15);
              return `M ${(b - 3) * 8} 0 Q ${Math.cos(a) * len * 0.4 + bend * 0.4} ${Math.sin(a) * len * 0.6} ${Math.cos(a) * len + bend} ${Math.sin(a) * len}`;
            }).join(" ");
            return (
              <g key={`${i}-${j}`} transform={`translate(${x} ${SCREEN_H + 10})`}>
                <path d={blades} fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
                <path d={blades} fill="none" stroke={theme.cactusDark} strokeWidth={5} strokeLinecap="round" />
              </g>
            );
          });
        })}
    </svg>
  );
};
