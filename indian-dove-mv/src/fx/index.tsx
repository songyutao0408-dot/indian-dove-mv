// 特效：尘土、撞击星星、速度线、热浪、光圈转场、木牌翻转、胶片烧穿、花瓣、萤火虫
// 泪水喷泉和汗珠在 characters/parts.tsx 里（和角色表情绑在一起），这里一并导出方便场景使用。
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { Star, onTwos, useSvgId } from "../characters/parts";
import { TITLE_FONT } from "../fonts";
import { CREAM, INK } from "../style/palette";

export { TearFountain, Sweat, SpiralEye, StarsOrbit, Smoke } from "../characters/parts";

/** 尘土云：age = 出现后的帧数，大约 24 帧散完 */
export const DustCloud: React.FC<{ x: number; y: number; age: number; size?: number; color?: string; seed?: number; life?: number }> = ({
  x, y, age, size = 1, color = "#E9C48F", seed = 0, life = 26,
}) => {
  const a = onTwos(age);
  if (a < 0 || a > life) return null;
  const k = a / life;
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`} opacity={1 - k * k}>
      {Array.from({ length: 9 }, (_, i) => {
        const ang = Math.PI * (1 + (i / 8)) + (random(`dc${seed}${i}`) - 0.5) * 0.4;
        const d = 30 + k * (90 + random(`dcd${seed}${i}`) * 60);
        const r = 24 + k * 40 + random(`dcr${seed}${i}`) * 14;
        return <circle key={i} cx={Math.cos(ang) * d} cy={Math.sin(ang) * d * 0.45 - k * 20} r={r} fill={color} stroke={INK} strokeWidth={3} />;
      })}
      <ellipse cx={0} cy={-10} rx={60 + k * 60} ry={30 + k * 20} fill={color} />
    </g>
  );
};

/** 跑动扬起的小尘土（每隔几帧在脚下冒一团） */
export const DustPuff: React.FC<{ x: number; y: number; age: number; color?: string }> = ({ x, y, age, color = "#E9C48F" }) => {
  const a = onTwos(age);
  if (a < 0 || a > 14) return null;
  const k = a / 14;
  return <circle cx={x - k * 30} cy={y - k * 16} r={10 + k * 18} fill={color} stroke={INK} strokeWidth={2.5} opacity={1 - k} />;
};

/** 撞击：一圈星星往外炸开 + 「砰」形的爆炸框 */
export const ImpactStars: React.FC<{ x: number; y: number; age: number; s?: number; burst?: boolean }> = ({ x, y, age, s = 1, burst = true }) => {
  const a = onTwos(age);
  if (a < 0 || a > 30) return null;
  const k = a / 30;
  const pts = Array.from({ length: 16 }, (_, i) => {
    const r = i % 2 ? 50 : 110;
    const ang = (i / 16) * Math.PI * 2;
    return `${Math.cos(ang) * r},${Math.sin(ang) * r}`;
  }).join(" ");
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {burst && a < 8 && <polygon points={pts} fill="#F7D58B" stroke={INK} strokeWidth={5} transform={`scale(${0.5 + a / 8})`} />}
      {Array.from({ length: 7 }, (_, i) => {
        const ang = (i / 7) * Math.PI * 2 + 0.3;
        const d = 40 + k * 160;
        return <Star key={i} x={Math.cos(ang) * d} y={Math.sin(ang) * d * 0.7 - k * 30} r={18 * (1 - k * 0.5)} rot={a * 15} />;
      })}
    </g>
  );
};

/** 速度线：一组横向的线条从一侧掠过 */
export const SpeedLines: React.FC<{ frame: number; y0?: number; y1?: number; dir?: 1 | -1; count?: number; color?: string; opacity?: number }> = ({
  frame, y0 = 0, y1 = 1080, dir = 1, count = 18, color = CREAM, opacity = 0.8,
}) => {
  const f = onTwos(frame);
  return (
    <g opacity={opacity}>
      {Array.from({ length: count }, (_, i) => {
        const y = y0 + random(`sl${i}`) * (y1 - y0);
        const len = 200 + random(`sll${i}`) * 500;
        const speed = 120 + random(`sls${i}`) * 100;
        const x = ((random(`slx${i}`) * 2400 + f * speed) % 2600) - 400;
        const xx = dir === 1 ? x : 1920 - x;
        return <path key={i} d={`M ${xx} ${y} l ${-dir * len} 0`} stroke={color} strokeWidth={3 + (i % 3) * 2} strokeLinecap="round" />;
      })}
    </g>
  );
};

/** 放射状速度线（集中线）：用于惊吓、急推镜头 */
export const FocusLines: React.FC<{ frame: number; cx?: number; cy?: number; inner?: number; color?: string }> = ({ frame, cx = 960, cy = 540, inner = 320, color = INK }) => {
  const f = onTwos(frame);
  return (
    <g>
      {Array.from({ length: 48 }, (_, i) => {
        const a = (i / 48) * Math.PI * 2 + random(`fl${i}${Math.floor(f / 2)}`) * 0.05;
        const r0 = inner + random(`flr${i}${Math.floor(f / 2)}`) * 120;
        return <path key={i} d={`M ${cx + Math.cos(a) * r0} ${cy + Math.sin(a) * r0} L ${cx + Math.cos(a) * 1400} ${cy + Math.sin(a) * 1400}`} stroke={color} strokeWidth={2 + (i % 4)} opacity={0.6} />;
      })}
    </g>
  );
};

/** 热浪扭曲：包住一组图形，让它们像在热空气里一样晃 */
export const HeatHaze: React.FC<{ frame: number; strength?: number; children: React.ReactNode }> = ({ frame, strength = 8, children }) => {
  const id = useSvgId("haze");
  const t = frame / 24;
  return (
    <g>
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="turbulence" baseFrequency={`0.012 ${0.05 + Math.sin(t * 2) * 0.01}`} numOctaves="2" seed={Math.floor(frame / 2) % 50} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={strength} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={`url(#${id})`}>{children}</g>
    </g>
  );
};

/** 热浪线：往上飘的波浪线 */
export const HeatLines: React.FC<{ frame: number; x: number; y: number; w?: number; n?: number; color?: string }> = ({ frame, x, y, w = 300, n = 4, color = CREAM }) => {
  const t = frame / 24;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const tt = (t * 0.6 + i / n) % 1;
        const xx = x - w / 2 + (i + 0.5) * (w / n) + Math.sin(t * 3 + i) * 6;
        return (
          <path
            key={i}
            d={`M ${xx} ${y - tt * 80} q 12 -14 0 -28 q -12 -14 0 -28 q 12 -14 0 -28`}
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
            opacity={Math.sin(tt * Math.PI) * 0.8}
          />
        );
      })}
    </g>
  );
};

/** 光圈转场：open 0 = 全黑，1 = 全开；圆心可指定（收缩到角色脸上） */
export const Iris: React.FC<{ open: number; cx?: number; cy?: number }> = ({ open, cx = 960, cy = 540 }) => {
  if (open >= 1) return null;
  const maxR = Math.hypot(Math.max(cx, 1920 - cx), Math.max(cy, 1080 - cy)) + 20;
  const r = Math.max(0, open) * maxR;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={`M 0 0 H 1920 V 1080 H 0 Z M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0 Z`} fill="#0E0906" fillRule="evenodd" />
      {r > 2 && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0E0906" strokeWidth={6} />}
    </svg>
  );
};

/** 木牌（HTML，方便放进 3D 翻转里） */
export const WoodBoard: React.FC<{ w: number; h: number; children: React.ReactNode; dark?: boolean }> = ({ w, h, children, dark }) => {
  const id = useSvgId("wood");
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id={id}>
            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.12" numOctaves="3" seed="3" />
            <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0.9 -0.25" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <rect x={4} y={4} width={w - 8} height={h - 8} rx={18} fill={dark ? "#4A2E1C" : "#B5783E"} />
        <rect x={4} y={4} width={w - 8} height={h - 8} rx={18} fill={dark ? "#4A2E1C" : "#B5783E"} filter={`url(#${id})`} />
        {[0.33, 0.66].map((k) => (
          <path key={k} d={`M 14 ${h * k} L ${w - 14} ${h * k}`} stroke={dark ? "#2E1C12" : "#8E5A34"} strokeWidth={4} />
        ))}
        <rect x={4} y={4} width={w - 8} height={h - 8} rx={18} fill="none" stroke={INK} strokeWidth={7} />
        {[
          [26, 26],
          [w - 26, 26],
          [26, h - 26],
          [w - 26, h - 26],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={8} fill="#8A8A8A" stroke={INK} strokeWidth={3} />
            <path d={`M ${x - 4} ${y} L ${x + 4} ${y}`} stroke={INK} strokeWidth={2} />
          </g>
        ))}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>{children}</div>
    </div>
  );
};

/** 木牌翻转：progress 0 = 正面，1 = 翻到背面（绕水平轴翻，像挂着的牌子） */
export const FlipCard: React.FC<{ progress: number; front: React.ReactNode; back: React.ReactNode; axis?: "x" | "y" }> = ({ progress, front, back, axis = "x" }) => {
  const deg = Math.min(1, Math.max(0, progress)) * 180;
  const rot = axis === "x" ? "rotateX" : "rotateY";
  return (
    <div style={{ perspective: 1600, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", transformStyle: "preserve-3d", transform: `${rot}(${deg}deg)` }}>
        <div style={{ backfaceVisibility: "hidden" }}>{front}</div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: `${rot}(180deg)` }}>{back}</div>
      </div>
    </div>
  );
};

/** 西部字体标题文字（奶油色 + 深棕描边） */
export const WesternText: React.FC<{ children: React.ReactNode; size: number; color?: string; font?: string }> = ({ children, size, color = CREAM, font = TITLE_FONT }) => (
  <div
    style={{
      fontFamily: font,
      fontSize: size,
      color,
      WebkitTextStroke: `${Math.max(6, size * 0.08)}px ${INK}`,
      paintOrder: "stroke fill",
      lineHeight: 1.1,
      textAlign: "center",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

/** 胶片烧穿：progress 0–1，中间烧出一个不规则的洞，边缘橙红，洞里是白光，最后全白 */
export const FilmBurn: React.FC<{ progress: number; frame: number; cx?: number; cy?: number }> = ({ progress, frame, cx = 980, cy = 500 }) => {
  const id = useSvgId("burn");
  if (progress <= 0) return null;
  const r = Math.pow(progress, 1.6) * 1300;
  const f = onTwos(frame);
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080}>
        <defs>
          <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed={7 + (f % 4)} />
            <feDisplacementMap in="SourceGraphic" scale={60} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        {/* 整体变暖变亮 */}
        <rect width={1920} height={1080} fill="#F0A15E" opacity={Math.min(0.45, progress * 0.8)} style={{ mixBlendMode: "screen" }} />
        <g filter={`url(#${id})`}>
          <circle cx={cx} cy={cy} r={r * 1.18 + 20} fill="#2A1206" opacity={0.85} />
          <circle cx={cx} cy={cy} r={r * 1.1 + 14} fill="#C8402E" />
          <circle cx={cx} cy={cy} r={r * 1.04 + 8} fill="#F0A15E" />
          <circle cx={cx} cy={cy} r={r} fill="#FFF8E8" />
        </g>
        {progress > 0.92 && <rect width={1920} height={1080} fill="#FFF8E8" opacity={(progress - 0.92) / 0.08} />}
      </svg>
    </AbsoluteFill>
  );
};

/** 飘落的花瓣（心动场景） */
export const Petals: React.FC<{ frame: number; count?: number; color?: string }> = ({ frame, count = 24, color = "#F2A0B4" }) => {
  const t = frame / 24;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const speed = 0.08 + random(`pt${i}`) * 0.06;
        const tt = (t * speed + random(`pty${i}`)) % 1;
        const x = random(`ptx${i}`) * 2100 - 90 + Math.sin(t * 1.5 + i) * 60;
        const y = -40 + tt * 1160;
        const rot = t * 90 * (i % 2 ? 1 : -1) + i * 40;
        return <ellipse key={i} cx={x} cy={y} rx={14} ry={8} fill={color} stroke={INK} strokeWidth={2} transform={`rotate(${rot} ${x} ${y})`} />;
      })}
    </g>
  );
};

/** 萤火虫 */
export const Fireflies: React.FC<{ frame: number; count?: number; x0?: number; x1?: number; y0?: number; y1?: number; seed?: number }> = ({
  frame, count = 20, x0 = 0, x1 = 1920, y0 = 300, y1 = 1000, seed = 0,
}) => {
  const t = frame / 24;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const bx = x0 + random(`ffx${seed}${i}`) * (x1 - x0);
        const by = y0 + random(`ffy${seed}${i}`) * (y1 - y0);
        const x = bx + Math.sin(t * 0.7 + i * 1.3) * 40;
        const y = by + Math.cos(t * 0.9 + i * 0.7) * 30;
        const glow = 0.4 + 0.6 * Math.max(0, Math.sin(t * 2.5 + i * 2.1));
        return (
          <g key={i} opacity={glow}>
            <circle cx={x} cy={y} r={16} fill="#F7E36A" opacity={0.25} />
            <circle cx={x} cy={y} r={5} fill="#FBF1A8" />
          </g>
        );
      })}
    </g>
  );
};

/** 风吹过：几道弯弯的白色风线 */
export const WindGusts: React.FC<{ frame: number; y0?: number; y1?: number; dir?: 1 | -1 }> = ({ frame, y0 = 200, y1 = 900, dir = 1 }) => {
  const t = frame / 24;
  return (
    <g>
      {Array.from({ length: 6 }, (_, i) => {
        const tt = (t * 0.55 + i / 6) % 1;
        const x = dir === 1 ? -300 + tt * 2500 : 2200 - tt * 2500;
        const y = y0 + random(`wg${i}`) * (y1 - y0);
        return (
          <path
            key={i}
            d={`M ${x} ${y} q ${dir * 80} -30 ${dir * 160} 0 t ${dir * 160} 0 q ${dir * 40} 20 ${dir * 20} 40 q ${-dir * 30} 10 ${-dir * 30} -14`}
            fill="none"
            stroke={CREAM}
            strokeWidth={5}
            strokeLinecap="round"
            opacity={Math.sin(tt * Math.PI) * 0.9}
          />
        );
      })}
    </g>
  );
};

