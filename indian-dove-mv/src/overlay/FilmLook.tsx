// 全局质感后期（全片叠加）：
// - 胶片颗粒：SVG feTurbulence，每 2 帧换一次 seed（半分辨率生成再放大，颗粒更像胶片，也更省渲染时间）
// - 画面轻微抖动（gate weave）：±1.5px，平滑漂移 + 细微跳动
// - 暗角
// - 整体轻微褪色：饱和度约 90%
// - 做旧模式（sepia > 0）：棕褐滤镜 + 竖向划痕 + 闪烁黑点 + 亮度闪烁
import React from "react";
import { AbsoluteFill, random } from "remotion";

const W = 1920;
const H = 1080;

export function gateWeave(frame: number, amount = 1.5): [number, number] {
  const t = frame / 24;
  const smoothX = Math.sin(t * 1.3 + 0.7) * 0.6 + Math.sin(t * 3.1 + 2.1) * 0.4;
  const smoothY = Math.sin(t * 1.7 + 1.9) * 0.6 + Math.sin(t * 2.6 + 0.3) * 0.4;
  const j = Math.floor(frame / 2);
  const jx = (random(`wx${j}`) - 0.5) * 0.6;
  const jy = (random(`wy${j}`) - 0.5) * 0.6;
  return [(smoothX * 0.75 + jx) * amount, (smoothY * 0.75 + jy) * amount];
}

export const Grain: React.FC<{ frame: number; opacity?: number }> = ({ frame, opacity = 0.32 }) => {
  const seed = Math.floor(frame / 2) % 997;
  return (
    <svg
      width={W / 2}
      height={H / 2}
      style={{ position: "absolute", left: 0, top: 0, width: W, height: H, mixBlendMode: "overlay", opacity, pointerEvents: "none" }}
      viewBox={`0 0 ${W / 2} ${H / 2}`}
      preserveAspectRatio="none"
    >
      <filter id={`grain${seed}`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="linear" slope="1.6" intercept="-0.3" />
          <feFuncG type="linear" slope="1.6" intercept="-0.3" />
          <feFuncB type="linear" slope="1.6" intercept="-0.3" />
        </feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter={`url(#grain${seed})`} />
    </svg>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 75% 72% at 50% 50%, rgba(0,0,0,0) 58%, rgba(34,18,8,${strength * 0.6}) 84%, rgba(26,12,4,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

/** 做旧胶片的划痕、黑点、毛发；amount 0–1 */
export const OldFilmArtifacts: React.FC<{ frame: number; amount: number }> = ({ frame, amount }) => {
  if (amount <= 0.01) return null;
  const seg = Math.floor(frame / 3); // 划痕每 3 帧换一次位置
  const scratches = Array.from({ length: 3 }, (_, i) => {
    const on = random(`scr-on${seg}-${i}`) < 0.65;
    if (!on) return null;
    const x = random(`scr-x${seg}-${i}`) * W;
    const light = random(`scr-l${seg}-${i}`) < 0.5;
    const y0 = random(`scr-y${seg}-${i}`) * H * 0.4;
    const len = H * (0.5 + random(`scr-len${seg}-${i}`) * 0.6);
    const wob = (random(`scr-w${seg}-${i}`) - 0.5) * 20;
    return (
      <path
        key={i}
        d={`M ${x} ${y0} q ${wob} ${len / 2} 0 ${len}`}
        stroke={light ? "#FFF6E0" : "#1E140C"}
        strokeWidth={1 + random(`scr-sw${seg}-${i}`) * 1.6}
        fill="none"
        opacity={0.35 + random(`scr-o${seg}-${i}`) * 0.4}
      />
    );
  });
  const dots = Array.from({ length: 7 }, (_, i) => {
    if (random(`dot-on${frame}-${i}`) < 0.55) return null;
    const x = random(`dot-x${frame}-${i}`) * W;
    const y = random(`dot-y${frame}-${i}`) * H;
    const r = 1.5 + random(`dot-r${frame}-${i}`) * 5;
    return <ellipse key={i} cx={x} cy={y} rx={r} ry={r * (0.6 + random(`dot-e${frame}-${i}`) * 0.8)} fill="#140C06" opacity={0.75} />;
  });
  const hair =
    random(`hair${Math.floor(frame / 4)}`) < 0.15 ? (
      <path
        d={`M ${random(`hx${frame}`) * W} ${random(`hy${frame}`) * H} c 20 -30 40 10 60 -12 s 30 20 50 -8`}
        stroke="#140C06"
        strokeWidth={1.5}
        fill="none"
        opacity={0.6}
      />
    ) : null;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: amount, pointerEvents: "none" }}>
      {scratches}
      {dots}
      {hair}
    </svg>
  );
};

/** 包住整个画面：抖动 + 褪色/做旧滤镜 + 暗角 + 颗粒 + 做旧痕迹 */
export const FilmLook: React.FC<{
  frame: number;
  sepia?: number;
  /** 关掉画面抖动（比如片头木牌需要绝对稳定时） */
  weave?: boolean;
  children: React.ReactNode;
}> = ({ frame, sepia = 0, weave = true, children }) => {
  const [wx, wy] = weave ? gateWeave(frame) : [0, 0];
  // 做旧时亮度一闪一闪
  const flicker = 1 + sepia * (random(`flk${frame}`) - 0.5) * 0.08;
  const filter = `saturate(${0.9 * (1 - sepia * 0.35)}) sepia(${sepia * 0.88}) contrast(${1 + sepia * 0.1}) brightness(${flicker})`;
  return (
    <AbsoluteFill style={{ background: "#120A05", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter }}>
        <AbsoluteFill style={{ transform: `translate(${wx}px, ${wy}px) scale(1.006)` }}>{children}</AbsoluteFill>
        <Vignette strength={0.5 + sepia * 0.2} />
        <OldFilmArtifacts frame={frame} amount={sepia} />
      </AbsoluteFill>
      <Grain frame={frame} opacity={0.26 + sepia * 0.14} />
      {/* 轻微褪色：抬一点暗部 */}
      <AbsoluteFill style={{ background: "#F6E7C8", mixBlendMode: "lighten", opacity: 0.06, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
