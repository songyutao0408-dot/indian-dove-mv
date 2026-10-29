// 全局主题插值：按 timeline.ts 的 THEME_KEYS 在相邻关键帧之间平滑过渡色板和做旧强度。
import { interpolateColors } from "remotion";
import { FPS, THEME_KEYS } from "../timeline";
import { PALETTES, type Palette } from "./palette";

export type Theme = Palette & { sepia: number };

function mixPalette(a: Palette, b: Palette, k: number): Palette {
  const c = (x: string, y: string) => interpolateColors(k, [0, 1], [x, y]);
  return {
    sky: a.sky.map((s, i) => c(s, b.sky[i])) as Palette["sky"],
    mesaFar: c(a.mesaFar, b.mesaFar),
    mesa: c(a.mesa, b.mesa),
    mesaDark: c(a.mesaDark, b.mesaDark),
    sand: c(a.sand, b.sand),
    sandShadow: c(a.sandShadow, b.sandShadow),
    cactus: c(a.cactus, b.cactus),
    cactusDark: c(a.cactusDark, b.cactusDark),
    tint: c(a.tint, b.tint),
    tintAmount: a.tintAmount + (b.tintAmount - a.tintAmount) * k,
    sun: c(a.sun, b.sun),
  };
}

const ease = (x: number) => x * x * (3 - 2 * x); // smoothstep

export function themeAt(frame: number): Theme {
  const t = frame / FPS;
  let i = 0;
  while (i < THEME_KEYS.length - 1 && THEME_KEYS[i + 1].t <= t) i++;
  const a = THEME_KEYS[i];
  const b = THEME_KEYS[Math.min(i + 1, THEME_KEYS.length - 1)];
  const k = b === a ? 0 : ease(Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t))));
  const pal = mixPalette(PALETTES[a.palette], PALETTES[b.palette], k);
  return { ...pal, sepia: a.sepia + (b.sepia - a.sepia) * k };
}
