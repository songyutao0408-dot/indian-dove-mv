// 干涸的河床：一条蜿蜒的深色泥带，上面是龟裂的泥块（S2、S10 用）
import React from "react";
import { random } from "remotion";
import { INK } from "../style/palette";
import type { Theme } from "../style/theme";
import { interpolateColors } from "remotion";

/** y0 = 河床中线所在的屏幕高度，w = 河床宽度 */
export const Riverbed: React.FC<{ theme: Theme; y0?: number; w?: number; camX?: number; seed?: number }> = ({ theme, y0 = 860, w = 220, camX = 0, seed = 1 }) => {
  const mud = interpolateColors(0.55, [0, 1], [theme.sand, theme.sandShadow]);
  const crack = interpolateColors(0.6, [0, 1], [theme.sandShadow, INK]);
  const N = 24;
  const center = (x: number) => y0 + Math.sin((x + camX) / 260) * 40;
  const top: string[] = [];
  const bot: string[] = [];
  for (let i = 0; i <= N; i++) {
    const x = -100 + (i / N) * 2120;
    const half = (w / 2) * (0.85 + 0.25 * Math.sin((x + camX) / 180 + 1));
    top.push(`${x.toFixed(1)},${(center(x) - half * 0.55).toFixed(1)}`);
    bot.push(`${x.toFixed(1)},${(center(x) + half).toFixed(1)}`);
  }
  // 龟裂：在河床里画一片不规则多边形网格
  const cells: React.ReactNode[] = [];
  for (let i = 0; i < 26; i++) {
    const x = ((i * 97 + seed * 31 - camX * 1) % 2200 + 2200) % 2200 - 140;
    const cy = center(x) + (random(`rb${seed}${i}`) - 0.3) * w * 0.5;
    const r = 30 + random(`rbr${seed}${i}`) * 22;
    const pts = Array.from({ length: 6 }, (_, k) => {
      const a = (k / 6) * Math.PI * 2 + random(`rba${seed}${i}${k}`) * 0.5;
      const rr = r * (0.7 + random(`rbb${seed}${i}${k}`) * 0.4);
      return `${(x + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr * 0.45).toFixed(1)}`;
    }).join(" ");
    cells.push(<polygon key={i} points={pts} fill={i % 3 ? theme.sand : mud} stroke={crack} strokeWidth={3} strokeLinejoin="round" opacity={0.9} />);
  }
  return (
    <g>
      <polygon points={[...top, ...bot.reverse()].join(" ")} fill={mud} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      {cells}
      {/* 河岸的阴影边 */}
      <polyline points={top.join(" ")} fill="none" stroke={theme.sandShadow} strokeWidth={8} opacity={0.8} />
    </g>
  );
};
