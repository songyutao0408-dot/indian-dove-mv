// 废弃的白蚁丘：几根土塔挤在一起，有裂缝、小洞，顶上塌了一块。原点 = 底部中心，丘顶平台约在 y = -430。
import React from "react";
import { INK } from "../style/palette";
import type { Theme } from "../style/theme";
import { interpolateColors } from "remotion";

export const MOUND_TOP: [number, number] = [10, -432]; // 老斑鸠站的位置

export const TermiteMound: React.FC<{ theme: Theme; s?: number; moonlight?: boolean }> = ({ theme, s = 1, moonlight }) => {
  // 土色跟随时段：取沙色和岩石色之间
  const earth = interpolateColors(0.45, [0, 1], [theme.sand, theme.mesa]);
  const earthDark = interpolateColors(0.6, [0, 1], [theme.sandShadow, theme.mesaDark]);
  const earthLight = interpolateColors(0.2, [0, 1], [theme.sand, theme.mesa]);
  const night = moonlight ?? theme.night > 0.6;
  return (
    <g transform={`scale(${s})`}>
      <ellipse cx={0} cy={4} rx={260} ry={26} fill={theme.sandShadow} opacity={0.8} />
      {/* 后面的两根细土塔 */}
      <path d="M -160 0 C -170 -120 -150 -260 -120 -330 C -110 -350 -90 -350 -86 -326 C -76 -250 -70 -120 -60 0 Z" fill={earthDark} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M 90 0 C 96 -140 110 -280 140 -360 C 150 -384 172 -380 174 -356 C 176 -240 180 -120 190 0 Z" fill={earthDark} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      {/* 主体 */}
      <path
        d="M -210 0 C -200 -60 -160 -110 -140 -170 C -120 -230 -110 -300 -80 -360 C -60 -400 -40 -420 -30 -432 L 50 -432 C 62 -420 80 -396 92 -360 C 116 -290 130 -220 150 -160 C 170 -100 200 -50 214 0 Z"
        fill={earth}
        stroke={INK}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      {/* 顶上塌掉的缺口 */}
      <path d="M -30 -432 L -14 -446 L 2 -436 L 18 -452 L 36 -438 L 50 -432 Z" fill={earthLight} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      {/* 暗面 */}
      <path d="M 40 -420 C 70 -380 96 -300 116 -230 C 136 -160 168 -80 214 0 L 120 0 C 100 -90 84 -170 70 -250 C 60 -320 50 -380 40 -420 Z" fill={earthDark} opacity={0.75} />
      {/* 横向的土层纹 */}
      {[-90, -170, -250, -330].map((y, i) => (
        <path key={y} d={`M ${-150 + i * 22} ${y} q 40 ${-8 + (i % 2) * 14} 80 0 q 30 10 60 -4`} fill="none" stroke={earthDark} strokeWidth={4} strokeLinecap="round" />
      ))}
      {/* 小洞 */}
      {[
        [-60, -120, 14, 10],
        [30, -200, 11, 8],
        [-40, -300, 9, 7],
        [70, -80, 16, 12],
        [-110, -40, 10, 8],
      ].map(([x, y, rx, ry], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#2E1C12" />
          <path d={`M ${x - rx} ${y - 2} q ${rx} ${-ry * 1.2} ${rx * 2} 0`} fill="none" stroke={INK} strokeWidth={3} />
        </g>
      ))}
      {/* 裂缝 */}
      <path d="M -20 -60 l 10 -30 l -8 -20 l 12 -26 M 0 -360 l -10 30 l 8 16" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      {/* 月光勾边 */}
      {night && <path d="M -30 -430 C -60 -400 -80 -360 -100 -300 C -116 -240 -130 -190 -150 -150" fill="none" stroke="#F6E7C8" strokeWidth={5} strokeLinecap="round" opacity={0.55} />}
    </g>
  );
};
