// 角色共用部件：线条样式、眼睛、表情特效（金星、螺旋眼、心形眼、泪水、冒烟、问号、Zzz、气泡……）
// 所有部件都画在角色自己的局部坐标里，单位 = 像素（1080p 下的原始尺寸）。
import React, { useId } from "react";
import { random } from "remotion";
import { LYRIC_FONT } from "../fonts";
import { CREAM, INK } from "../style/palette";

// ---------- 线条 ----------
export const OUTLINE = 5; // 外轮廓
export const DETAIL = 3; // 内部细节
export const ol = { stroke: INK, strokeWidth: OUTLINE, strokeLinejoin: "round", strokeLinecap: "round" } as const;
export const dl = { stroke: INK, strokeWidth: DETAIL, strokeLinejoin: "round", strokeLinecap: "round" } as const;
export const thin = { stroke: INK, strokeWidth: 2, strokeLinejoin: "round", strokeLinecap: "round" } as const;

/** 角色动作「一拍二」：每 2 帧更新一次姿态 */
export const onTwos = (frame: number) => Math.floor(frame / 2) * 2;

/** SVG 里能用的唯一 id（React 的 useId 带冒号等字符，不能直接放进 url(#...)） */
export const useSvgId = (prefix: string) => `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

/** 自动眨眼：大约每 3–4 秒眨一次，每次 4 帧。返回 0（睁）→ 1（闭） */
export function autoBlink(frame: number, seed = 0): number {
  const period = 78 + Math.floor(random(`blink${seed}`) * 20);
  const p = (frame + Math.floor(random(`blinkoff${seed}`) * period)) % period;
  return p === 0 || p === 3 ? 0.6 : p === 1 || p === 2 ? 1 : 0;
}

// ---------- 眼睛 ----------
export type EyeProps = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** 视线方向 -1..1 */
  look?: [number, number];
  /** 眼皮闭合程度：0 全睁，1 全闭 */
  lid?: number;
  lidColor?: string;
  /** 眼皮倾斜（度），正数 = 外眼角下垂（生气时用负数让内眼角压低） */
  lidTilt?: number;
  pupil?: number; // 瞳孔半径占 rx 的比例
  white?: string;
  lashes?: number; // 睫毛数
  lashSide?: 1 | -1;
};

export const Eye: React.FC<EyeProps> = ({
  cx, cy, rx, ry, look = [0, 0], lid = 0, lidColor = "#8A7866", lidTilt = 0, pupil = 0.38, white = "#FFFDF4", lashes = 0, lashSide = 1,
}) => {
  if (lid >= 0.97) {
    // 闭眼：一条向下弯的弧线
    return (
      <g transform={`rotate(${lidTilt} ${cx} ${cy})`}>
        <path d={`M ${cx - rx} ${cy} Q ${cx} ${cy + ry * 0.55} ${cx + rx} ${cy}`} fill="none" {...dl} strokeWidth={4} />
        {lashes > 0 && <Lashes cx={cx} cy={cy} rx={rx} ry={ry * 0.2} n={lashes} side={lashSide} />}
      </g>
    );
  }
  const pr = rx * pupil;
  const px = cx + look[0] * (rx - pr - 2);
  const py = cy + look[1] * (ry - pr - 2);
  // 眼皮：在 y = lineY 处横切椭圆，上半部分涂成眼皮色
  const lineY = cy - ry + 2 * ry * lid;
  const k = (lineY - cy) / ry;
  const half = rx * Math.sqrt(Math.max(0, 1 - k * k));
  const large = lineY > cy ? 1 : 0;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={white} />
      <circle cx={px} cy={py} r={pr} fill={INK} />
      <circle cx={px + pr * 0.35} cy={py - pr * 0.35} r={pr * 0.3} fill="#FFFFFF" />
      {lid > 0.02 && (
        <g transform={`rotate(${lidTilt} ${cx} ${cy})`}>
          <path d={`M ${cx - half} ${lineY} A ${rx} ${ry} 0 ${large} 1 ${cx + half} ${lineY} Z`} fill={lidColor} />
          <path d={`M ${cx - half - 2} ${lineY} L ${cx + half + 2} ${lineY}`} {...dl} strokeWidth={4.5} />
        </g>
      )}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" {...dl} />
      {lashes > 0 && <Lashes cx={cx} cy={lid > 0.02 ? lineY : cy - ry} rx={half || rx} ry={0} n={lashes} side={lashSide} />}
    </g>
  );
};

const Lashes: React.FC<{ cx: number; cy: number; rx: number; ry: number; n: number; side: 1 | -1 }> = ({ cx, cy, rx, n, side }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const a = (i + 1) / (n + 1);
      const x = cx + side * (rx * (a * 1.1 - 0.1));
      const len = 10 + a * 8;
      return <path key={i} d={`M ${x} ${cy} q ${side * 4} ${-len * 0.6} ${side * 10} ${-len}`} fill="none" {...thin} strokeWidth={3} />;
    })}
  </g>
);

// ---------- 表情特效 ----------
export const Star: React.FC<{ x: number; y: number; r: number; fill?: string; rot?: number }> = ({ x, y, r, fill = "#F7D58B", rot = 0 }) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${x + rr * Math.cos(a)},${y + rr * Math.sin(a)}`;
  }).join(" ");
  return <polygon points={pts} fill={fill} {...thin} strokeWidth={2.5} transform={`rotate(${rot} ${x} ${y})`} />;
};

/** 眼冒金星：一圈星星绕头转 */
export const StarsOrbit: React.FC<{ cx: number; cy: number; rx: number; frame: number; n?: number }> = ({ cx, cy, rx, frame, n = 4 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const a = (onTwos(frame) / 24) * Math.PI * 1.4 + (i / n) * Math.PI * 2;
      const x = cx + Math.cos(a) * rx;
      const y = cy + Math.sin(a) * rx * 0.28;
      const front = Math.sin(a) > 0;
      return <Star key={i} x={x} y={y} r={front ? 22 : 15} rot={onTwos(frame) * 6} fill={i % 2 ? "#F7D58B" : "#F6E7C8"} />;
    })}
  </g>
);

/** 螺旋眼（秀逗） */
export const SpiralEye: React.FC<{ cx: number; cy: number; r: number; frame: number; dir?: 1 | -1 }> = ({ cx, cy, r, frame, dir = 1 }) => {
  const turns = 3;
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const tt = i / 60;
    const a = tt * turns * Math.PI * 2;
    const rr = tt * r * 0.85;
    pts.push(`${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`);
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#FFFDF4" {...dl} />
      <polyline points={pts.join(" ")} fill="none" {...dl} strokeWidth={3.5} transform={`rotate(${dir * onTwos(frame) * 18} ${cx} ${cy})`} />
    </g>
  );
};

export const Heart: React.FC<{ x: number; y: number; s: number; fill?: string; stroke?: boolean }> = ({ x, y, s, fill = "#E0485A", stroke = true }) => (
  <path
    d={`M ${x} ${y + s * 0.9} C ${x - s * 1.4} ${y - s * 0.1} ${x - s * 0.7} ${y - s} ${x} ${y - s * 0.35} C ${x + s * 0.7} ${y - s} ${x + s * 1.4} ${y - s * 0.1} ${x} ${y + s * 0.9} Z`}
    fill={fill}
    {...(stroke ? thin : {})}
    strokeWidth={stroke ? 3 : 0}
  />
);

/** 心形眼：跟着节奏扑通扑通放大 */
export const HeartEye: React.FC<{ cx: number; cy: number; s: number; frame: number }> = ({ cx, cy, s, frame }) => {
  const beat = 1 + 0.18 * Math.max(0, Math.sin((onTwos(frame) / 24) * Math.PI * 2 * 1.6));
  return (
    <g transform={`translate(${cx} ${cy}) scale(${beat}) translate(${-cx} ${-cy})`}>
      <Heart x={cx} y={cy} s={s} />
      <ellipse cx={cx - s * 0.35} cy={cy - s * 0.3} rx={s * 0.18} ry={s * 0.1} fill="#FFD3D8" transform={`rotate(-30 ${cx - s * 0.35} ${cy - s * 0.3})`} />
    </g>
  );
};

export const Blush: React.FC<{ cx: number; cy: number; rx?: number; opacity?: number }> = ({ cx, cy, rx = 16, opacity = 0.75 }) => (
  <g opacity={opacity}>
    <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.55} fill="#E9827A" />
    {[-0.5, 0, 0.5].map((o, i) => (
      <path key={i} d={`M ${cx + o * rx - 3} ${cy + 4} l 5 -9`} {...thin} strokeWidth={2} />
    ))}
  </g>
);

/** 泪水喷泉：从眼角往外喷出一道带描边的抛物线水柱，末端溅出水滴 */
export const TearFountain: React.FC<{ x: number; y: number; dir: 1 | -1; frame: number; power?: number }> = ({ x, y, dir, frame, power = 1 }) => {
  const f = onTwos(frame);
  const len = 130 * power;
  const wob = Math.sin(f * 0.9) * 6;
  const d = `M ${x} ${y} Q ${x + dir * len * 0.5} ${y - 80 * power + wob} ${x + dir * len} ${y + 40 * power}`;
  const endX = x + dir * len;
  const endY = y + 40 * power;
  const drops = Array.from({ length: 6 }, (_, i) => {
    const tt = (f / 14 + i / 6) % 1;
    const spread = (i % 3) - 1;
    const px = endX + dir * (tt * 30 + spread * 14);
    const py = endY + tt * 70 - Math.sin(tt * Math.PI) * 18;
    return <path key={i} d={`M ${px} ${py - 11} Q ${px + 8} ${py + 2} ${px} ${py + 7} Q ${px - 8} ${py + 2} ${px} ${py - 11} Z`} fill="#8FD3F4" {...thin} strokeWidth={2} opacity={1 - tt * 0.6} />;
  });
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={22 * power} strokeLinecap="round" />
      <path d={d} fill="none" stroke="#8FD3F4" strokeWidth={15 * power} strokeLinecap="round" />
      <path d={d} fill="none" stroke="#E2F6FD" strokeWidth={4} strokeLinecap="round" strokeDasharray="14 18" strokeDashoffset={-f * 4} />
      {drops}
    </g>
  );
};

/** 单颗大泪滴 */
export const TearDrop: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <path d={`M ${x} ${y - 14 * s} Q ${x + 10 * s} ${y + 2 * s} ${x} ${y + 8 * s} Q ${x - 10 * s} ${y + 2 * s} ${x} ${y - 14 * s} Z`} fill="#8FD3F4" {...thin} />
);

/** 头顶冒烟（生气） */
export const Smoke: React.FC<{ x: number; y: number; frame: number; color?: string }> = ({ x, y, frame, color = "#D8CFC4" }) => {
  const f = onTwos(frame);
  return (
    <g>
      {Array.from({ length: 4 }, (_, i) => {
        const tt = (f / 30 + i / 4) % 1;
        const r = 10 + tt * 26;
        return (
          <circle key={i} cx={x + Math.sin(tt * 6 + i) * 14} cy={y - tt * 110} r={r} fill={color} opacity={1 - tt * 0.8} {...thin} strokeOpacity={1 - tt} />
        );
      })}
    </g>
  );
};

/** 问号（困惑），上下轻轻晃 */
export const QuestionMark: React.FC<{ x: number; y: number; frame: number; s?: number }> = ({ x, y, frame, s = 1 }) => {
  const bob = Math.sin(onTwos(frame) / 5) * 6;
  return (
    <text
      x={x}
      y={y + bob}
      fontSize={90 * s}
      fontFamily={LYRIC_FONT}
      fill={CREAM}
      stroke={INK}
      strokeWidth={6}
      paintOrder="stroke"
      textAnchor="middle"
      transform={`rotate(${Math.sin(onTwos(frame) / 7) * 10} ${x} ${y})`}
    >
      ?
    </text>
  );
};

/** Zzz：一串字母往右上飘 */
export const Zzz: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => {
  const f = onTwos(frame);
  return (
    <g fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={5} paintOrder="stroke">
      {[0, 1, 2].map((i) => {
        const tt = (f / 48 + i / 3) % 1;
        return (
          <text key={i} x={x + tt * 60} y={y - tt * 90} fontSize={30 + tt * 30} opacity={tt < 0.85 ? 1 : (1 - tt) / 0.15}>
            Z
          </text>
        );
      })}
    </g>
  );
};

/** 对话气泡 / 思维气泡 */
export const Bubble: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  tail: [number, number]; // 尾巴尖的位置（局部坐标）
  text?: string;
  fontSize?: number;
  thought?: boolean;
  /** 角色朝左（scale(-1,1)）时传 true，让文字保持正向 */
  flip?: boolean;
  children?: React.ReactNode;
}> = ({ x, y, w, h, tail, text, fontSize = 40, thought, flip, children }) => {
  const cx = x + w / 2;
  const cy = y + h / 2;
  return (
    <g>
      {thought ? (
        <>
          {[0.25, 0.55].map((k, i) => (
            <ellipse key={i} cx={tail[0] + (cx - tail[0]) * k} cy={tail[1] + (y + h - tail[1]) * k} rx={8 + i * 6} ry={6 + i * 5} fill="#FFFDF4" {...dl} />
          ))}
          {/* 云朵形 */}
          <path
            d={cloudPath(x, y, w, h)}
            fill="#FFFDF4"
            {...dl}
          />
        </>
      ) : (
        <>
          <path
            d={`M ${cx - w * 0.12} ${y + h - 6} L ${tail[0]} ${tail[1]} L ${cx + w * 0.08} ${y + h - 6}`}
            fill="#FFFDF4"
            {...dl}
          />
          <rect x={x} y={y} width={w} height={h} rx={Math.min(w, h) * 0.45} fill="#FFFDF4" {...dl} />
          <path d={`M ${cx - w * 0.12 + 4} ${y + h - 2} L ${cx + w * 0.08 - 4} ${y + h - 2}`} stroke="#FFFDF4" strokeWidth={6} />
        </>
      )}
      {text && (
        <text x={cx} y={cy + fontSize * 0.35} fontSize={fontSize} fontFamily={LYRIC_FONT} fill={INK} textAnchor="middle" transform={flip ? `translate(${2 * cx} 0) scale(-1 1)` : undefined}>
          {text}
        </text>
      )}
      {children}
    </g>
  );
};

function cloudPath(x: number, y: number, w: number, h: number): string {
  const n = 9;
  const cx = x + w / 2;
  const cy = y + h / 2;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const px = cx + (w / 2) * Math.cos(a);
    const py = cy + (h / 2) * Math.sin(a);
    if (i === 0) d += `M ${px} ${py} `;
    else {
      const am = ((i - 0.5) / n) * Math.PI * 2;
      const qx = cx + (w / 2) * 1.28 * Math.cos(am);
      const qy = cy + (h / 2) * 1.32 * Math.sin(am);
      d += `Q ${qx} ${qy} ${px} ${py} `;
    }
  }
  return d + "Z";
}

/** 声波线（肚子咕咕叫、闹钟响） */
export const SoundWaves: React.FC<{ x: number; y: number; dir: 1 | -1; frame: number; n?: number }> = ({ x, y, dir, frame, n = 3 }) => {
  const f = onTwos(frame);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const r = 14 + i * 14 + ((f / 2) % 2) * 4;
        return (
          <path
            key={i}
            d={`M ${x + dir * r * 0.6} ${y - r * 0.8} Q ${x + dir * r * 1.15} ${y} ${x + dir * r * 0.6} ${y + r * 0.8}`}
            fill="none"
            {...dl}
            opacity={1 - i * 0.2}
          />
        );
      })}
    </g>
  );
};

/** 汗珠 */
export const Sweat: React.FC<{ x: number; y: number; frame: number; s?: number; seed?: number }> = ({ x, y, frame, s = 1, seed = 0 }) => {
  const tt = ((onTwos(frame) / 30 + random(`sw${seed}`)) % 1);
  return <TearDrop x={x} y={y + tt * 30 * s} s={s * (1 - tt * 0.3)} />;
};

/** 简单的动作线 / 速度线 */
export const MotionLines: React.FC<{ x: number; y: number; dir: 1 | -1; n?: number; len?: number; gap?: number }> = ({ x, y, dir, n = 3, len = 60, gap = 22 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => (
      <path key={i} d={`M ${x} ${y + i * gap} l ${dir * (len - i * 10)} 0`} {...dl} />
    ))}
  </g>
);
