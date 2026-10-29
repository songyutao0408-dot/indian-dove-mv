// 检查点 3 预览：沙漠横移 + 色调循环（白天→黄昏→夜晚→黎明→白天），接小镇做旧推镜 + 正午 + 胶片烧穿
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { Tumbleweed } from "../backgrounds/props";
import { TownStreet } from "../backgrounds/Town";
import { Dove } from "../characters";
import { LYRIC_FONT } from "../fonts";
import { FilmBurn, WindGusts } from "../fx";
import { FilmLook } from "../overlay/FilmLook";
import { Ambient } from "../style/Ambient";
import { CREAM, INK } from "../style/palette";
import { mixTheme, staticTheme } from "../style/theme";

const KEYS: ["day" | "dusk" | "night" | "dawn", number][] = [
  ["day", 0],
  ["day", 40],
  ["dusk", 80],
  ["night", 130],
  ["night", 170],
  ["dawn", 220],
  ["day", 270],
];

const themeFor = (f: number) => {
  let i = 0;
  while (i < KEYS.length - 2 && KEYS[i + 1][1] <= f) i++;
  const [a, fa] = KEYS[i];
  const [b, fb] = KEYS[i + 1];
  const k = Math.min(1, Math.max(0, (f - fa) / (fb - fa)));
  return mixTheme(staticTheme(a), staticTheme(b), k * k * (3 - 2 * k));
};

export const THEME_PREVIEW_FRAMES = 384;

export const ThemePreview: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 288) {
    const theme = themeFor(frame);
    const sunY = interpolate(frame, [0, 110, 170, 240, 288], [180, 640, 800, 520, 260], { extrapolateRight: "clamp" });
    const moonY = interpolate(frame, [90, 150, 210, 250], [700, 200, 220, 700], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <FilmLook frame={frame}>
        <Desert
          theme={theme}
          frame={frame}
          camX={frame * 14}
          sun={sunY < 700 ? { x: 1300, y: sunY, face: frame < 60 ? "smug" : frame > 220 ? "yawn" : "sleepy" } : undefined}
          moon={moonY < 690 ? { x: 600, y: moonY, face: "calm" } : undefined}
          wind={0.6}
        />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <WindGusts frame={frame} y0={620} y1={900} dir={-1} />
          <Ambient theme={theme}>
            <g transform="translate(900 930) scale(1.1)">
              <ellipse cx={0} cy={4} rx={110} ry={16} fill={theme.sandShadow} opacity={0.8} />
              <Dove frame={frame} pose="walk" expression={theme.night > 0.7 ? "sleep" : "daze"} />
            </g>
            <g transform={`translate(${1700 - ((frame * 20) % 2400)} ${880 - Math.abs(Math.sin(frame / 5)) * 40})`}>
              <Tumbleweed r={50} rot={-frame * 14} />
            </g>
          </Ambient>
        </svg>
        <div style={{ position: "absolute", left: 30, top: 24, fontFamily: LYRIC_FONT, fontSize: 32, color: CREAM, WebkitTextStroke: `5px ${INK}`, paintOrder: "stroke fill" }}>
          色调插值 + 四层视差横移
        </div>
      </FilmLook>
    );
  }
  // 小镇：做旧 + 推镜 + 百叶窗关上 + 正午敲钟 + 胶片烧穿
  const f = frame - 288;
  const theme = staticTheme("day", 1);
  const minute = interpolate(f, [0, 40], [57, 60], { extrapolateRight: "clamp" });
  const bell = f > 40 ? Math.sin((f - 40) / 3) * Math.max(0, 1 - (f - 40) / 50) : 0;
  return (
    <FilmLook frame={frame} sepia={1}>
      <TownStreet
        theme={theme}
        frame={frame}
        camZ={interpolate(f, [0, 60, 80], [0, 400, 1700], { extrapolateRight: "clamp", easing: (x) => x * x })}
        shut={interpolate(f, [10, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        clock={{ hour: minute >= 60 ? 12 : 11, minute: minute % 60, bell }}
      />
      <FilmBurn progress={interpolate(f, [70, 96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} frame={frame} />
      <div style={{ position: "absolute", left: 30, top: 24, fontFamily: LYRIC_FONT, fontSize: 32, color: CREAM, WebkitTextStroke: `5px ${INK}`, paintOrder: "stroke fill" }}>
        小镇做旧：百叶窗关上 → 正午敲钟 → 推镜 → 胶片烧穿
      </div>
    </FilmLook>
  );
};
