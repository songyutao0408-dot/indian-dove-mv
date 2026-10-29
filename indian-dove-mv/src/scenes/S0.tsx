// S0 前奏：三张片头卡（TitleCards.tsx）→ 光圈打开峡谷大横移 → 风起，风滚草滚向镜头
import React from "react";
import { AbsoluteFill } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { Tumbleweed } from "../backgrounds/props";
import { Vulture } from "../characters";
import { Iris, WindGusts } from "../fx";
import { TitleCards } from "../TitleCards";
import { At, Cam, Layer, Stage, beatHop, easeIn, easeInOut, lerp, shake, useShot, type ShotComponent } from "./common";

/** 天上盘旋的秃鹰小点 */
export const CirclingVulture: React.FC<{ cx: number; cy: number; r: number; s: number; t: number; speed?: number }> = ({ cx, cy, r, s, t, speed = 1.1 }) => {
  const a = t * speed;
  const x = cx + Math.cos(a) * r;
  const y = cy + Math.sin(a) * r * 0.35;
  return (
    <At x={x} y={y} s={s} flip={Math.sin(a) < 0}>
      <Vulture frame={Math.round(t * 24)} pose="fly" />
    </At>
  );
};

const S0_4: ShotComponent = () => {
  // 光圈打开 → 峡谷全景大横移（四层视差）
  const { f, dur, g, theme, t } = useShot();
  const camX = lerp(f, [0, dur], [0, 1700], easeInOut);
  const open = lerp(f, [0, 22], [0, 1], easeInOut);
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, dur], [1.08, 1.0])}>
        <Desert theme={theme} frame={g} camX={camX} sun={{ x: 1450, y: 170, face: "smug" }} wind={0.5} />
        <Stage>
          <CirclingVulture cx={1100 - camX * 0.05} cy={220} r={110} s={0.16} t={t} />
        </Stage>
        <Layer>
          <WindGusts frame={g} y0={250} y1={760} dir={-1} />
        </Layer>
      </Cam>
      <Iris open={open} cx={960} cy={540} />
    </AbsoluteFill>
  );
};

const S0_5: ShotComponent = () => {
  // 低机位，风越刮越大，一团风滚草从远处一路滚到镜头前，撞满画面
  const { f, dur, g, theme, T, p } = useShot();
  const k = easeIn(p);
  const s = lerp(k, [0, 1], [0.35, 14]);
  const x = lerp(k, [0, 1], [1500, 980]);
  const y = lerp(k, [0, 1], [740, 560]) + beatHop(T, 40 * (0.3 + p));
  const [sx, sy, sr] = shake(g, lerp(p, [0.4, 1], [0, 10]));
  // 沙粒被风吹着往左跑
  const grains = Array.from({ length: 40 }, (_, i) => {
    const gx = ((i * 211 + f * (28 + (i % 5) * 6)) % 2200) - 140;
    const gy = 640 + ((i * 53) % 420);
    return <path key={i} d={`M ${1920 - gx} ${gy} l 24 2`} stroke={theme.sand} strokeWidth={4} strokeLinecap="round" opacity={0.8} />;
  });
  return (
    <AbsoluteFill>
      <Cam x={sx} y={sy} rot={sr}>
        <Desert theme={theme} frame={g} camX={1700 + f * 6} horizon={700} sun={{ x: 1450, y: 160, face: "smug" }} wind={1.2} />
        <Layer>
          <WindGusts frame={g + 30} y0={300} y1={900} dir={-1} />
          {grains}
        </Layer>
        <Stage>
          <At x={x} y={y}>
            <Tumbleweed r={60 * s} rot={-T * 300} seed={5} />
          </At>
        </Stage>
      </Cam>
      {/* 最后几帧风滚草糊满镜头 */}
      <AbsoluteFill style={{ background: "#8E6A3A", opacity: lerp(f, [dur - 5, dur], [0, 0.9]) }} />
    </AbsoluteFill>
  );
};

export const S0: ShotComponent[] = [TitleCards, TitleCards, TitleCards, S0_4, S0_5];
