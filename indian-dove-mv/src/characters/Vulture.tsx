// 秃鹰：秃头加大鹰钩鼻，在空中绕圈，眼睛一直死盯着下方
import React from "react";
import { INK } from "../style/palette";
import { Eye, QuestionMark, autoBlink, dl, ol, onTwos } from "./parts";

export type VulturePose = "perch" | "fly";
export type VultureExpression = "stare" | "puzzled" | "glow";

const V = { body: "#4C3829", dark: "#33251B", ruff: "#EFE5D2", head: "#D98C7A", headDark: "#B86E5E", beak: "#E8C27A", leg: "#B8A58A" };

export const Vulture: React.FC<{
  frame: number;
  pose?: VulturePose;
  expression?: VultureExpression;
  facing?: 1 | -1;
  /** 视线，默认死盯下方 */
  look?: [number, number];
  seed?: number;
}> = ({ frame, pose = "perch", expression = "stare", facing = 1, look, seed = 8 }) => {
  const f = onTwos(frame);
  const t = f / 24;
  const b = autoBlink(frame, seed);
  const lk: [number, number] = look ?? [0.2, 0.85];
  const glow = expression === "glow";
  const eyeWhite = glow ? "#F7E36A" : "#FFFDF4";

  const head = (
    <g>
      {/* 光秃秃的长脖子 */}
      <path d="M 10 -190 C 20 -230 50 -250 70 -246" fill="none" stroke={INK} strokeWidth={30} strokeLinecap="round" />
      <path d="M 10 -190 C 20 -230 50 -250 70 -246" fill="none" stroke={V.head} strokeWidth={22} strokeLinecap="round" />
      <circle cx={80} cy={-258} r={34} fill={V.head} {...ol} />
      {/* 皱纹 */}
      <path d="M 56 -282 q 8 -6 16 0 M 50 -268 q 6 -4 12 0" fill="none" stroke={V.headDark} strokeWidth={3} strokeLinecap="round" />
      {/* 大鹰钩鼻 */}
      <path d="M 100 -276 C 136 -282 154 -256 146 -226 C 144 -216 132 -214 132 -226 C 134 -238 124 -246 104 -246 Z" fill={V.beak} {...ol} />
      <circle cx={116} cy={-262} r={3} fill={INK} />
      {/* 眼睛 + 粗眉 */}
      <Eye cx={86} cy={-262} rx={11} ry={12} white={eyeWhite} lid={expression === "puzzled" ? b : Math.max(0.42, b)} lidTilt={-10} look={lk} pupil={0.42} lidColor={V.headDark} />
      <path d={expression === "puzzled" ? "M 70 -286 Q 86 -298 102 -284" : "M 68 -282 L 104 -274"} fill="none" {...dl} strokeWidth={6} />
      {glow && <circle cx={86} cy={-262} r={22} fill="#F7E36A" opacity={0.25} />}
    </g>
  );

  if (pose === "fly") {
    const flap = Math.sin(t * Math.PI * 2 * 0.6) * 10; // 滑翔，偶尔扇一下
    return (
      <g transform={`scale(${facing} 1)`}>
        {[-1, 1].map((side) => (
          <g key={side} transform={`translate(0 -160) rotate(${side * flap}) scale(1 ${side === -1 ? 0.92 : 1})`}>
            <path
              d={`M 0 0 C ${side * -40} -50 ${side * -140} -70 ${side * -250} -40 L ${side * -236} -26 L ${side * -262} -14 L ${side * -240} -2 L ${side * -262} 12 L ${side * -232} 16 L ${side * -248} 32 L ${side * -200} 30 C ${side * -130} 30 ${side * -60} 30 0 30 Z`}
              fill={side === -1 ? V.dark : V.body}
              {...ol}
            />
          </g>
        ))}
        <ellipse cx={0} cy={-150} rx={70} ry={40} fill={V.body} {...ol} />
        <path d="M -70 -150 L -120 -134 L -110 -120 L -64 -134 Z" fill={V.dark} {...ol} />
        <path d="M 30 -180 q 20 -16 40 -6 q -4 20 -30 24 Z" fill={V.ruff} {...dl} />
        <g transform="translate(-30 64)">{head}</g>
      </g>
    );
  }

  return (
    <g transform={`scale(${facing} 1)`}>
      {/* 爪子 */}
      {[-20, 20].map((x) => (
        <path key={x} d={`M ${x} -30 L ${x} -4 M ${x} -4 l 14 4 M ${x} -4 l -12 4 M ${x} -4 l 4 8`} stroke={INK} strokeWidth={7} strokeLinecap="round" fill="none" />
      ))}
      {/* 驼背的身子，翅膀像披风一样合着 */}
      <path d="M -70 -60 C -96 -150 -60 -210 0 -214 C 60 -210 84 -150 66 -60 C 40 -24 -44 -24 -70 -60 Z" fill={V.body} {...ol} />
      <path d="M -60 -150 C -86 -110 -82 -60 -60 -30 L -50 -46 L -42 -24 L -30 -44 L -14 -30 C -24 -80 -30 -130 -60 -150 Z" fill={V.dark} {...ol} />
      <path d="M -20 -120 q 8 8 16 0 M 10 -90 q 8 8 16 0 M -10 -66 q 8 8 16 0" fill="none" stroke="#6B5240" strokeWidth={3} strokeLinecap="round" />
      {/* 白色毛领 */}
      <path d="M -30 -196 q -10 -22 10 -26 q 6 -18 26 -12 q 16 -14 30 2 q 22 0 18 22 q 8 14 -10 22 q -36 10 -74 -8 Z" fill={V.ruff} {...dl} />
      {head}
      {expression === "puzzled" && <QuestionMark x={60} y={-330} frame={frame} s={0.8} />}
    </g>
  );
};
