// 背景道具：风滚草、石头、小仙人掌、灌木、枯树、牛头骨、太阳（带脸）、月亮、星空
import React from "react";
import { random } from "remotion";
import { dl, ol, onTwos, thin } from "../characters/parts";
import { CREAM, INK } from "../style/palette";
import type { Theme } from "../style/theme";

/** 风滚草：一团乱糟糟的枯枝球，rot 控制滚动角度 */
export const Tumbleweed: React.FC<{ r?: number; rot?: number; color?: string; seed?: number }> = ({ r = 60, rot = 0, color = "#B88A50", seed = 1 }) => {
  const strokes = Array.from({ length: 16 }, (_, i) => {
    const a1 = random(`tw${seed}a${i}`) * Math.PI * 2;
    const a2 = a1 + 1.4 + random(`tw${seed}b${i}`) * 2;
    const r1 = r * (0.3 + random(`tw${seed}c${i}`) * 0.7);
    const r2 = r * (0.3 + random(`tw${seed}d${i}`) * 0.7);
    const mid = a1 + (a2 - a1) / 2;
    return `M ${Math.cos(a1) * r1} ${Math.sin(a1) * r1} Q ${Math.cos(mid) * r * 1.05} ${Math.sin(mid) * r * 1.05} ${Math.cos(a2) * r2} ${Math.sin(a2) * r2}`;
  });
  return (
    <g transform={`rotate(${rot})`}>
      <circle r={r * 0.92} fill={color} opacity={0.25} />
      <path d={strokes.join(" ")} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <path d={strokes.join(" ")} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

export const Rock: React.FC<{ w?: number; h?: number; color: string; shade: string; seed?: number }> = ({ w = 120, h = 70, color, shade, seed = 0 }) => {
  const k = random(`rock${seed}`);
  return (
    <g>
      <path d={`M ${-w / 2} 0 C ${-w / 2} ${-h * (0.7 + k * 0.3)} ${-w * 0.2} ${-h} ${w * 0.05} ${-h} C ${w * 0.35} ${-h} ${w / 2} ${-h * 0.6} ${w / 2} 0 Z`} fill={color} {...ol} />
      <path d={`M ${w * 0.1} ${-h * 0.95} C ${w * 0.35} ${-h * 0.9} ${w * 0.46} ${-h * 0.5} ${w * 0.47} -3 L ${w * 0.15} -3 C ${w * 0.25} ${-h * 0.4} ${w * 0.22} ${-h * 0.7} ${w * 0.1} ${-h * 0.95} Z`} fill={shade} />
      <path d={`M ${-w * 0.3} ${-h * 0.45} q ${w * 0.1} ${-h * 0.1} ${w * 0.2} 0`} fill="none" {...thin} />
    </g>
  );
};

/** 不带脸的普通仙人掌（背景用） */
export const SmallSaguaro: React.FC<{ h?: number; color: string; dark: string; arms?: number; sway?: number }> = ({ h = 200, color, dark, arms = 2, sway = 0 }) => {
  const w = h * 0.2;
  return (
    <g transform={`rotate(${sway} 0 0)`}>
      {arms >= 1 && <path d={`M ${-w / 2} ${-h * 0.45} L ${-w * 1.4} ${-h * 0.45} L ${-w * 1.4} ${-h * 0.75}`} fill="none" stroke={INK} strokeWidth={w * 0.75 + 6} strokeLinecap="round" strokeLinejoin="round" />}
      {arms >= 2 && <path d={`M ${w / 2} ${-h * 0.55} L ${w * 1.4} ${-h * 0.55} L ${w * 1.4} ${-h * 0.82}`} fill="none" stroke={INK} strokeWidth={w * 0.75 + 6} strokeLinecap="round" strokeLinejoin="round" />}
      {arms >= 1 && <path d={`M ${-w / 2} ${-h * 0.45} L ${-w * 1.4} ${-h * 0.45} L ${-w * 1.4} ${-h * 0.75}`} fill="none" stroke={color} strokeWidth={w * 0.75} strokeLinecap="round" strokeLinejoin="round" />}
      {arms >= 2 && <path d={`M ${w / 2} ${-h * 0.55} L ${w * 1.4} ${-h * 0.55} L ${w * 1.4} ${-h * 0.82}`} fill="none" stroke={color} strokeWidth={w * 0.75} strokeLinecap="round" strokeLinejoin="round" />}
      <rect x={-w / 2} y={-h} width={w} height={h} rx={w / 2} fill={color} {...dl} />
      <path d={`M ${w * 0.15} ${-h + w * 0.4} L ${w * 0.15} -4`} stroke={dark} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

export const PricklyPear: React.FC<{ s?: number; color: string; dark: string }> = ({ s = 1, color, dark }) => (
  <g transform={`scale(${s})`}>
    {[
      [0, -40, 34, 42, 0],
      [-40, -90, 26, 34, -25],
      [36, -96, 28, 36, 20],
      [6, -130, 22, 28, 5],
    ].map(([x, y, rx, ry, r], i) => (
      <g key={i} transform={`rotate(${r} ${x} ${y})`}>
        <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={color} {...dl} />
        {[0, 1, 2].map((j) => (
          <circle key={j} cx={x - rx * 0.4 + j * rx * 0.4} cy={y - ry * 0.2 + (j % 2) * ry * 0.4} r={2} fill={dark} />
        ))}
      </g>
    ))}
    <circle cx={6} cy={-160} r={9} fill="#C8405E" {...thin} />
  </g>
);

export const DryBush: React.FC<{ s?: number; color?: string; sway?: number }> = ({ s = 1, color = "#9A7A4A", sway = 0 }) => {
  const d = Array.from({ length: 9 }, (_, i) => {
    const a = -Math.PI * (0.1 + (i / 8) * 0.8);
    const len = 50 + (i % 3) * 16;
    return `M 0 0 Q ${Math.cos(a) * len * 0.5 + sway * 0.5} ${Math.sin(a) * len * 0.6} ${Math.cos(a) * len + sway} ${Math.sin(a) * len}`;
  }).join(" ");
  return (
    <g transform={`scale(${s})`}>
      <path d={d} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

export const DeadTree: React.FC<{ s?: number; color?: string }> = ({ s = 1, color = "#7A5A3A" }) => {
  const d = "M 0 0 L 4 -120 L -30 -190 M 4 -120 L 10 -170 L 50 -220 M 10 -170 L 0 -240 M -30 -190 L -60 -200 M 50 -220 L 80 -222";
  return (
    <g transform={`scale(${s})`}>
      <path d={d} fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

export const CowSkull: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M -50 -40 C -70 -50 -80 -66 -76 -78 C -64 -64 -48 -58 -30 -56 Z M 50 -40 C 70 -50 80 -66 76 -78 C 64 -64 48 -58 30 -56 Z" fill="#EFE6D2" {...dl} />
    <path d="M -34 -60 C -30 -20 -16 0 0 0 C 16 0 30 -20 34 -60 C 20 -70 -20 -70 -34 -60 Z" fill="#EFE6D2" {...dl} />
    <ellipse cx={-14} cy={-44} rx={7} ry={9} fill={INK} />
    <ellipse cx={14} cy={-44} rx={7} ry={9} fill={INK} />
    <path d="M -6 -18 L 0 -10 L 6 -18" fill="none" {...thin} />
  </g>
);

/** 太阳：硬边光圈 + 旋转光芒，可以带一张脸 */
export const Sun: React.FC<{
  r?: number;
  frame: number;
  color: string;
  face?: "none" | "smug" | "yawn" | "sleepy" | "wave";
}> = ({ r = 90, frame, color, face = "none" }) => {
  const f = onTwos(frame);
  const rot = (frame / 24) * 6;
  return (
    <g>
      <g transform={`rotate(${rot})`}>
        {Array.from({ length: 14 }, (_, i) => (
          <path key={i} d={`M ${-r * 0.16} ${-r * 1.12} L 0 ${-r * 1.55} L ${r * 0.16} ${-r * 1.12} Z`} fill={color} opacity={0.75} transform={`rotate(${(360 / 14) * i})`} />
        ))}
      </g>
      <circle r={r * 1.08} fill={color} opacity={0.35} />
      <circle r={r} fill={color} {...ol} />
      <circle r={r * 0.78} fill="#FFF3C4" opacity={0.45} />
      {face !== "none" && (
        <g>
          {face === "smug" && (
            <>
              {/* 得意：眯眼 + 挑眉 + 斜嘴笑 */}
              <path d={`M ${-r * 0.5} ${-r * 0.12} q ${r * 0.18} ${-r * 0.14} ${r * 0.36} 0`} fill="none" {...dl} strokeWidth={5} />
              <path d={`M ${r * 0.14} ${-r * 0.12} q ${r * 0.18} ${-r * 0.14} ${r * 0.36} 0`} fill="none" {...dl} strokeWidth={5} />
              <path d={`M ${-r * 0.52} ${-r * 0.38} L ${-r * 0.16} ${-r * 0.3} M ${r * 0.14} ${-r * 0.34} L ${r * 0.5} ${-r * 0.46}`} {...dl} strokeWidth={5} />
              <path d={`M ${-r * 0.36} ${r * 0.26} Q ${r * 0.05} ${r * 0.5} ${r * 0.44} ${r * 0.18}`} fill="#E07A4F" {...dl} />
              <ellipse cx={-r * 0.58} cy={r * 0.12} rx={r * 0.13} ry={r * 0.08} fill="#F0A15E" />
              <ellipse cx={r * 0.6} cy={r * 0.1} rx={r * 0.13} ry={r * 0.08} fill="#F0A15E" />
            </>
          )}
          {face === "yawn" && (
            <>
              <path d={`M ${-r * 0.5} ${-r * 0.16} q ${r * 0.18} ${r * 0.1} ${r * 0.36} 0 M ${r * 0.14} ${-r * 0.16} q ${r * 0.18} ${r * 0.1} ${r * 0.36} 0`} fill="none" {...dl} strokeWidth={5} />
              <ellipse cx={0} cy={r * 0.32} rx={r * 0.22} ry={r * (0.18 + 0.1 * Math.abs(Math.sin(f / 10)))} fill="#8E3B2A" {...dl} />
            </>
          )}
          {face === "sleepy" && (
            <>
              <path d={`M ${-r * 0.5} ${-r * 0.1} l ${r * 0.36} 0 M ${r * 0.14} ${-r * 0.1} l ${r * 0.36} 0`} {...dl} strokeWidth={5} />
              <path d={`M ${-r * 0.2} ${r * 0.3} q ${r * 0.2} ${r * 0.1} ${r * 0.4} 0`} fill="none" {...dl} />
            </>
          )}
          {face === "wave" && (
            <>
              <circle cx={-r * 0.3} cy={-r * 0.14} r={r * 0.09} fill={INK} />
              <circle cx={r * 0.3} cy={-r * 0.14} r={r * 0.09} fill={INK} />
              <path d={`M ${-r * 0.36} ${r * 0.2} Q 0 ${r * 0.5} ${r * 0.36} ${r * 0.2}`} fill="none" {...dl} strokeWidth={5} />
            </>
          )}
        </g>
      )}
    </g>
  );
};

/** 月亮：奶油色，带环形山，可以眨眼 */
export const Moon: React.FC<{ r?: number; frame: number; face?: "none" | "wink" | "calm"; glow?: number }> = ({ r = 80, frame, face = "none", glow = 1 }) => {
  const f = onTwos(frame);
  const wink = face === "wink" && Math.floor(f / 12) % 3 === 1;
  return (
    <g>
      <circle r={r * 1.9} fill={CREAM} opacity={0.08 * glow} />
      <circle r={r * 1.35} fill={CREAM} opacity={0.14 * glow} />
      <circle r={r} fill={CREAM} {...ol} />
      <circle cx={-r * 0.35} cy={r * 0.3} r={r * 0.16} fill="#E2D2B0" />
      <circle cx={r * 0.42} cy={-r * 0.32} r={r * 0.1} fill="#E2D2B0" />
      <circle cx={r * 0.2} cy={r * 0.5} r={r * 0.08} fill="#E2D2B0" />
      {face !== "none" && (
        <g>
          <path d={`M ${-r * 0.42} ${-r * 0.1} q ${r * 0.15} ${r * 0.12} ${r * 0.3} 0`} fill="none" {...dl} strokeWidth={4} />
          {wink ? (
            <path d={`M ${r * 0.12} ${-r * 0.1} q ${r * 0.15} ${r * 0.12} ${r * 0.3} 0`} fill="none" {...dl} strokeWidth={4} />
          ) : (
            <circle cx={r * 0.27} cy={-r * 0.12} r={r * 0.08} fill={INK} />
          )}
          <path d={`M ${-r * 0.2} ${r * 0.25} q ${r * 0.2} ${r * 0.15} ${r * 0.4} 0`} fill="none" {...dl} />
        </g>
      )}
    </g>
  );
};

/** 星空：一闪一闪；alpha 由主题的夜晚程度决定 */
export const StarField: React.FC<{ frame: number; theme: Theme; width?: number; height: number; count?: number; offsetX?: number }> = ({
  frame, theme, width = 1920, height, count = 90, offsetX = 0,
}) => {
  const alpha = Math.max(0, (theme.night - 0.25) / 0.75);
  if (alpha <= 0.01) return null;
  const f = onTwos(frame);
  return (
    <g opacity={alpha}>
      {Array.from({ length: count }, (_, i) => {
        const x = (((random(`sx${i}`) * width * 1.5 - offsetX) % width) + width) % width;
        const y = random(`sy${i}`) * height * 0.9;
        const tw = 0.5 + 0.5 * Math.sin(f / 6 + i * 1.7);
        const big = i % 9 === 0;
        return big ? (
          <path key={i} d={`M ${x} ${y - 7} L ${x + 2} ${y - 2} L ${x + 7} ${y} L ${x + 2} ${y + 2} L ${x} ${y + 7} L ${x - 2} ${y + 2} L ${x - 7} ${y} L ${x - 2} ${y - 2} Z`} fill={CREAM} opacity={0.5 + tw * 0.5} />
        ) : (
          <circle key={i} cx={x} cy={y} r={1.6 + random(`sr${i}`) * 1.4} fill={CREAM} opacity={0.35 + tw * 0.6} />
        );
      })}
    </g>
  );
};

/** 水壶（带背带），rot 控制倒过来 */
export const Canteen: React.FC<{ s?: number; rot?: number }> = ({ s = 1, rot = 0 }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <path d="M -50 -60 Q -70 -110 -20 -120" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
    <path d="M -50 -60 Q -70 -110 -20 -120" fill="none" stroke="#8E5A34" strokeWidth={5} strokeLinecap="round" />
    <ellipse cx={0} cy={0} rx={56} ry={62} fill="#7C8C9A" {...ol} />
    <ellipse cx={0} cy={0} rx={40} ry={46} fill="none" stroke="#5E6C78" strokeWidth={4} />
    <path d="M -20 -20 q 8 -10 18 -12" fill="none" stroke="#C9D3DA" strokeWidth={6} strokeLinecap="round" />
    <rect x={-12} y={-82} width={24} height={22} rx={4} fill="#5E6C78" {...dl} />
    <rect x={-16} y={-92} width={32} height={12} rx={4} fill="#8E5A34" {...dl} />
  </g>
);

/** 死掉的甲虫：四脚朝天、X 眼 */
export const DeadBeetle: React.FC<{ s?: number; frame?: number }> = ({ s = 1, frame = 0 }) => {
  const twitch = Math.floor(frame / 12) % 5 === 0 ? 4 : 0;
  return (
    <g transform={`scale(${s})`}>
      {[-24, 0, 24].map((x, i) => (
        <path key={i} d={`M ${x} -30 l ${-6 + i * 6} -26 l ${i === 1 ? 0 : (i - 1) * 8} -8`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" transform={i === 2 ? `rotate(${twitch} ${x} -30)` : undefined} />
      ))}
      <ellipse cx={0} cy={-20} rx={44} ry={26} fill="#3E5A6E" {...ol} />
      <path d="M 0 -44 L 0 4" stroke={INK} strokeWidth={3} />
      <ellipse cx={52} cy={-14} rx={18} ry={16} fill="#2E4252" {...dl} />
      <path d="M 46 -22 l 8 8 m -8 0 l 8 -8" stroke={CREAM} strokeWidth={3} />
      <path d="M 64 -24 q 14 -14 22 -10 M 62 -10 q 16 -2 22 6" fill="none" stroke={INK} strokeWidth={3} />
    </g>
  );
};

/** 鸟窝（一圈乱树枝） */
export const Nest: React.FC<{ s?: number; twigs?: number }> = ({ s = 1, twigs = 14 }) => {
  const d = Array.from({ length: twigs }, (_, i) => {
    const a = (i / twigs) * Math.PI;
    const x1 = -80 + i * (160 / twigs);
    return `M ${x1} ${-10 - Math.sin(a) * 6} q 30 ${-14 + (i % 3) * 8} 70 ${4 - (i % 2) * 8}`;
  }).join(" ");
  return (
    <g transform={`scale(${s})`}>
      <path d="M -90 -24 Q -84 16 0 18 Q 84 16 90 -24 Z" fill="#9A6A40" {...ol} />
      <path d={d} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <path d={d} fill="none" stroke="#B88A50" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};
