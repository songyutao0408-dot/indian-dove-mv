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
    night: a.night + (b.night - a.night) * k,
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

/** 不随时间变化的主题（静帧、测试用） */
export function staticTheme(name: keyof typeof PALETTES, sepia = 0): Theme {
  return { ...PALETTES[name], sepia };
}

/** 两个主题之间插值（场景内部想自己控制过渡时用） */
export function mixTheme(a: Theme, b: Theme, k: number): Theme {
  return { ...mixPalette(a, b, k), sepia: a.sepia + (b.sepia - a.sepia) * k };
}

const hex = (c: string): [number, number, number] => {
  if (c.startsWith("#")) {
    const n = parseInt(c.slice(1), 16);
    return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const m = c.match(/[\d.]+/g)?.map(Number) ?? [255, 255, 255];
  return [m[0] / 255, m[1] / 255, m[2] / 255];
};

/**
 * 环境光：把角色、道具这类「前景物体」按当前时段压暗偏色。
 * 返回 feColorMatrix 的 values：每个通道乘以 (1-a) + a*tint，夜里再整体压暗一些。
 */
export function ambientMatrix(theme: Theme): string {
  const [r, g, b] = hex(theme.tint);
  const a = theme.tintAmount;
  const dark = 1 - 0.22 * theme.night;
  const k = (c: number) => ((1 - a) + a * c) * dark;
  return `${k(r)} 0 0 0 0  0 ${k(g)} 0 0 0  0 0 ${k(b)} 0 0  0 0 0 1 0`;
}
