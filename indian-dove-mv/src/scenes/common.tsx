// 场景通用工具：镜头上下文、图层、摆位、镜头运动、跟拍蹦跳、缓动
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, interpolate, random } from "remotion";
import { Ambient } from "../style/Ambient";
import { themeAt, type Theme } from "../style/theme";
import { BEATS, FPS, type Shot } from "../timeline";

export type ShotCtx = {
  shot: Shot;
  /** 镜头内的局部帧 */
  f: number;
  /** 全片帧 */
  g: number;
  /** 镜头时长（帧） */
  dur: number;
  /** 镜头进度 0–1 */
  p: number;
  /** 镜头内秒数 */
  t: number;
  /** 全片秒数 */
  T: number;
  theme: Theme;
};

export const ShotContext = createContext<ShotCtx | null>(null);
export const useShot = (): ShotCtx => {
  const c = useContext(ShotContext);
  if (!c) throw new Error("useShot 必须在镜头里用");
  return c;
};

export function makeCtx(shot: Shot, f: number): ShotCtx {
  const g = shot.startFrame + f;
  return { shot, f, g, dur: shot.durationInFrames, p: f / shot.durationInFrames, t: f / FPS, T: g / FPS, theme: themeAt(g) };
}

export type ShotComponent = React.FC;

/** 1920×1080 的 SVG 图层 */
export const Layer: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", ...style }}>
    {children}
  </svg>
);

/** 角色层：自动套环境光 */
export const Stage: React.FC<{ children: React.ReactNode; theme?: Theme }> = ({ children, theme }) => {
  const ctx = useShot();
  return (
    <Layer>
      <Ambient theme={theme ?? ctx.theme}>{children}</Ambient>
    </Layer>
  );
};

/** 摆位 */
export const At: React.FC<{ x: number; y: number; s?: number; r?: number; flip?: boolean; children: React.ReactNode; opacity?: number }> = ({
  x, y, s = 1, r = 0, flip, children, opacity,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${flip ? -s : s} ${s})`} opacity={opacity}>
    {children}
  </g>
);

/** 地面上的影子 */
export const Shadow: React.FC<{ rx?: number; theme?: Theme; opacity?: number }> = ({ rx = 110, theme, opacity = 0.75 }) => {
  const ctx = useShot();
  return <ellipse cx={0} cy={4} rx={rx} ry={rx * 0.14} fill={(theme ?? ctx.theme).sandShadow} opacity={opacity} />;
};

/** 镜头运动（平滑，24fps）：缩放、平移、旋转、抖动；以 (ox, oy) 为缩放中心 */
export const Cam: React.FC<{
  zoom?: number;
  x?: number;
  y?: number;
  rot?: number;
  ox?: number;
  oy?: number;
  children: React.ReactNode;
}> = ({ zoom = 1, x = 0, y = 0, rot = 0, ox = 960, oy = 540, children }) => (
  <AbsoluteFill style={{ transformOrigin: `${ox}px ${oy}px`, transform: `translate(${x}px, ${y}px) scale(${zoom}) rotate(${rot}deg)` }}>{children}</AbsoluteFill>
);

/** 镜头剧烈晃动：返回 [dx, dy, rot] */
export function shake(g: number, amount: number): [number, number, number] {
  const k = Math.floor(g / 2);
  return [(random(`shx${k}`) - 0.5) * 2 * amount, (random(`shy${k}`) - 0.5) * 2 * amount, (random(`shr${k}`) - 0.5) * amount * 0.08];
}

/** 当前帧离最近一个已过去的节拍有多少秒 */
export function sinceBeat(T: number): number {
  let lo = 0;
  let hi = BEATS.length - 1;
  if (T < BEATS[0]) return 99;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (BEATS[mid] <= T) lo = mid;
    else hi = mid - 1;
  }
  return T - BEATS[lo];
}

/** 跟拍的「蹦」：拍点上为 1，0.25 秒内衰减到 0 */
export function beatPulse(T: number, decay = 0.25): number {
  const d = sinceBeat(T);
  return d < decay ? 1 - d / decay : 0;
}

/** 跟拍跳跃高度（抛物线），一拍一跳 */
export function beatHop(T: number, height = 20): number {
  let lo = 0;
  while (lo < BEATS.length - 1 && BEATS[lo + 1] <= T) lo++;
  const a = BEATS[lo] ?? 0;
  const b = BEATS[lo + 1] ?? a + 0.627;
  const ph = Math.min(1, Math.max(0, (T - a) / (b - a)));
  return -Math.sin(ph * Math.PI) * height;
}

/** 当前拍内的相位 0–1（给角色的 dance 姿态用） */
export function beatPhaseAt(T: number): number {
  let lo = 0;
  while (lo < BEATS.length - 1 && BEATS[lo + 1] <= T) lo++;
  const a = BEATS[lo] ?? 0;
  const b = BEATS[lo + 1] ?? a + 0.627;
  return Math.min(1, Math.max(0, (T - a) / (b - a)));
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const easeOut = Easing.out(Easing.cubic);
export const easeIn = Easing.in(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);

/** interpolate 的简写（默认两端夹住） */
export function lerp(x: number, input: number[], output: number[], easing?: (t: number) => number): number {
  return interpolate(x, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
}

/** 弹出（overshoot）：0→1，带一点回弹 */
export function pop(x: number): number {
  const t = clamp01(x);
  return Easing.out(Easing.back(2.2))(t);
}

/** 秒 → 当前镜头的局部帧（给定全片秒数） */
export const secToLocal = (ctx: ShotCtx, sec: number) => Math.round(sec * FPS) - ctx.shot.startFrame;
