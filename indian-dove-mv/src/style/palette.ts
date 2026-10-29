// 色板（视觉风格圣经第三部分）。天空统一按「顶部 → 地平线」排列，各 4 条硬边色带。
export type Palette = {
  sky: [string, string, string, string];
  mesaFar: string; // 最远层
  mesa: string; // 平顶山 / 峡谷
  mesaDark: string; // 暗面
  sand: string;
  sandShadow: string;
  cactus: string;
  cactusDark: string;
  /** 物体整体的色偏（乘到前景物体上的颜色，白色 = 不偏） */
  tint: string;
  /** 色偏强度 0–1 */
  tintAmount: number;
  sun: string;
};

export const INK = "#3A2418"; // 描边：深棕黑，不用纯黑
export const CREAM = "#F6E7C8"; // 高光 / 奶油色

export const PALETTES: Record<"day" | "dusk" | "night" | "dawn", Palette> = {
  day: {
    sky: ["#F7D58B", "#F4BB75", "#F0A15E", "#E07A4F"],
    mesaFar: "#D98A6A",
    mesa: "#C1502E",
    mesaDark: "#8E3B2A",
    sand: "#E9C48F",
    sandShadow: "#C99A62",
    cactus: "#5E8C4A",
    cactusDark: "#3F6634",
    tint: "#FFFFFF",
    tintAmount: 0,
    sun: "#FBE7A1",
  },
  dusk: {
    sky: ["#6B4A7A", "#9A5579", "#C8607A", "#F0A15E"],
    mesaFar: "#C67A78",
    mesa: "#B0433A",
    mesaDark: "#6E2E35",
    sand: "#DDA383",
    sandShadow: "#B07560",
    cactus: "#56724A",
    cactusDark: "#3A4E38",
    tint: "#E8705A",
    tintAmount: 0.18,
    sun: "#F7C27A",
  },
  night: {
    sky: ["#2E3A5C", "#3A3F64", "#4A456E", "#5B4A7A"],
    mesaFar: "#5E4F7A",
    mesa: "#5A3A5C",
    mesaDark: "#3A2A48",
    sand: "#7C6E8E",
    sandShadow: "#5C5072",
    cactus: "#3E5A5A",
    cactusDark: "#2C3E48",
    tint: "#4A3F7A",
    tintAmount: 0.42,
    sun: "#F6E7C8", // 夜里是月亮
  },
  dawn: {
    sky: ["#5B4A7A", "#A2748D", "#E8A0A0", "#F7D58B"],
    mesaFar: "#C48A8E",
    mesa: "#A85048",
    mesaDark: "#6E3540",
    sand: "#E2B593",
    sandShadow: "#B88A72",
    cactus: "#557A52",
    cactusDark: "#3A5440",
    tint: "#E8A0A0",
    tintAmount: 0.15,
    sun: "#FCE3A6",
  },
};
