// 篝火：火焰一拍二地跳动、火星往上飘、地面一圈暖光。intensity 0–1 控制火的大小（篝火渐熄用）。
import React from "react";
import { random } from "remotion";
import { onTwos } from "../characters/parts";
import { INK } from "../style/palette";

export const Campfire: React.FC<{ frame: number; intensity?: number; s?: number }> = ({ frame, intensity = 1, s = 1 }) => {
  const f = onTwos(frame);
  const k = Math.max(0, intensity);
  const flame = (w: number, h: number, color: string, phase: number) => {
    const wob = (i: number) => Math.sin(f / 3 + phase + i) * w * 0.12;
    const hh = h * (0.9 + 0.12 * Math.sin(f / 2.5 + phase)) * k;
    return (
      <path
        d={`M ${-w} 0 C ${-w * 1.05} ${-hh * 0.4} ${-w * 0.4 + wob(1)} ${-hh * 0.55} ${-w * 0.3 + wob(2)} ${-hh * 0.8} C ${-w * 0.1} ${-hh * 0.65} ${wob(3)} ${-hh * 0.9} ${wob(4) * 2} ${-hh} C ${w * 0.3} ${-hh * 0.75} ${w * 0.25 + wob(5)} ${-hh * 0.55} ${w * 0.5 + wob(6)} ${-hh * 0.62} C ${w * 0.9} ${-hh * 0.4} ${w * 1.05} ${-hh * 0.2} ${w} 0 Z`}
        fill={color}
        stroke={INK}
        strokeWidth={color === "#C8402E" ? 4 : 0}
        strokeLinejoin="round"
      />
    );
  };
  return (
    <g transform={`scale(${s})`}>
      {/* 地上的暖光 */}
      <ellipse cx={0} cy={0} rx={420 * (0.4 + 0.6 * k)} ry={90 * (0.4 + 0.6 * k)} fill="#F0A15E" opacity={0.28 * k + 0.04} />
      <ellipse cx={0} cy={0} rx={240 * (0.4 + 0.6 * k)} ry={52 * (0.4 + 0.6 * k)} fill="#F7D58B" opacity={0.3 * k} />
      {/* 石头圈 */}
      {Array.from({ length: 9 }, (_, i) => {
        const a = Math.PI * (0.05 + (i / 8) * 0.9);
        return <ellipse key={i} cx={Math.cos(a) * 110} cy={Math.sin(a) * 22 + 6} rx={26} ry={16} fill="#7A6A6A" stroke={INK} strokeWidth={3} />;
      })}
      {/* 木柴 */}
      <path d="M -90 4 L 80 -30 M -80 -30 L 90 6" stroke={INK} strokeWidth={30} strokeLinecap="round" />
      <path d="M -90 4 L 80 -30 M -80 -30 L 90 6" stroke="#7A4A2A" strokeWidth={22} strokeLinecap="round" />
      <circle cx={80} cy={-30} r={9} fill="#C99A62" stroke={INK} strokeWidth={2} />
      <circle cx={90} cy={6} r={9} fill="#C99A62" stroke={INK} strokeWidth={2} />
      {/* 火焰：外红、中橙、内黄 */}
      {k > 0.02 && (
        <g transform="translate(0 -14)">
          {flame(80, 260, "#C8402E", 0)}
          {flame(58, 200, "#F0A15E", 1.3)}
          {flame(34, 130, "#F7D58B", 2.1)}
        </g>
      )}
      {/* 余烬 */}
      {k < 0.5 &&
        Array.from({ length: 8 }, (_, i) => (
          <circle key={i} cx={-60 + i * 17} cy={-12 + (i % 3) * 6} r={5} fill="#F0A15E" opacity={(0.5 + 0.5 * Math.sin(f / 3 + i)) * (1 - k)} />
        ))}
      {/* 火星 */}
      {Array.from({ length: 12 }, (_, i) => {
        const tt = (f / 50 + random(`spark${i}`)) % 1;
        const x = (random(`sparkx${i}`) - 0.5) * 120 + Math.sin(tt * 8 + i) * 30;
        return <circle key={i} cx={x} cy={-60 - tt * 380 * (0.5 + k * 0.5)} r={3 + (1 - tt) * 3} fill="#F7D58B" opacity={(1 - tt) * k} />;
      })}
    </g>
  );
};
