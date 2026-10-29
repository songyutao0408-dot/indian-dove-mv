// 乌鸦：黑色、戴蒙面眼罩像小偷，叼着树枝逃跑
import React from "react";
import { INK } from "../style/palette";
import { MotionLines, autoBlink, dl, ol, onTwos, thin } from "./parts";

export type CrowPose = "stand" | "sneak" | "run";
export type CrowExpression = "sly" | "scared" | "sheepish";

const C = { body: "#3B3846", shade: "#2A2733", mask: "#14121A", beak: "#6E6976", leg: "#5B5560", twig: "#8E5A34" };

export const Crow: React.FC<{
  frame: number;
  pose?: CrowPose;
  expression?: CrowExpression;
  facing?: 1 | -1;
  /** 嘴里叼着树枝 */
  twig?: boolean;
  seed?: number;
}> = ({ frame, pose = "stand", expression = "sly", facing = 1, twig = false, seed = 2 }) => {
  const f = onTwos(frame);
  let lean = 8;
  let bodyY = 0;
  let legA = 0;
  let legB = 0;
  let wing = 10;
  if (pose === "sneak") {
    // 踮着脚，一步一停
    const ph = (f % 24) / 24;
    lean = 18;
    legA = ph < 0.5 ? -Math.sin(ph * 2 * Math.PI) * 30 : 0;
    legB = ph >= 0.5 ? -Math.sin((ph - 0.5) * 2 * Math.PI) * 30 : 0;
    bodyY = -10 - Math.abs(Math.sin(ph * Math.PI * 2)) * 6;
    wing = 30;
  } else if (pose === "run") {
    const ph = (f % 8) / 8;
    lean = 28;
    legA = Math.sin(ph * Math.PI * 2) * 45;
    legB = -legA;
    bodyY = -Math.abs(Math.sin(ph * Math.PI * 2)) * 14;
    wing = 60 + Math.sin(ph * Math.PI * 4) * 30;
  }
  const b = autoBlink(frame, seed);
  const scared = expression === "scared";
  const sheep = expression === "sheepish";
  const eyeR = scared ? 13 : 10;
  const lid = scared ? b * 0.5 : Math.max(sheep ? 0.5 : 0.45, b);

  const Leg: React.FC<{ x: number; rot: number }> = ({ x, rot }) => (
    <g transform={`translate(${x} -62) rotate(${rot})`}>
      <path d="M 0 0 L 0 58" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <path d="M 0 0 L 0 58" stroke={C.leg} strokeWidth={4} strokeLinecap="round" />
      <path d="M 0 58 l 16 2 M 0 58 l 10 9 M 0 58 l -9 5" stroke={INK} strokeWidth={5} strokeLinecap="round" />
    </g>
  );

  // 眼罩里的眼睛：白眼 + 眼皮
  const MaskEye: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => {
    const lineY = cy - eyeR + 2 * eyeR * lid;
    const k = (lineY - cy) / eyeR;
    const half = eyeR * Math.sqrt(Math.max(0, 1 - k * k));
    return (
      <g>
        <circle cx={cx} cy={cy} r={eyeR} fill="#FFFDF4" />
        <circle cx={cx + (scared ? 0 : 4)} cy={cy + (sheep ? 4 : 1)} r={scared ? 3.5 : 5} fill={INK} />
        {lid > 0.05 && <path d={`M ${cx - half} ${lineY} A ${eyeR} ${eyeR} 0 ${lineY > cy ? 1 : 0} 1 ${cx + half} ${lineY} Z`} fill={C.mask} />}
        <path d={`M ${cx - eyeR} ${lineY} L ${cx + eyeR} ${lineY}`} stroke={C.mask} strokeWidth={3} />
      </g>
    );
  };

  return (
    <g transform={`scale(${facing} 1) translate(0 ${bodyY})`}>
      {pose === "run" && <MotionLines x={-120} y={-150} dir={-1} n={4} len={70} gap={26} />}
      <Leg x={-12} rot={legA} />
      <g transform={`rotate(${lean} 0 -70)`}>
        {/* 尾羽 */}
        <path d="M -54 -98 L -104 -118 Q -112 -106 -100 -98 L -112 -90 Q -112 -76 -98 -80 L -104 -66 Q -94 -56 -84 -66 L -50 -76 Z" fill={C.shade} {...ol} />
        {/* 身体：前倾的水滴形 */}
        <path d="M -60 -96 C -64 -150 -20 -178 20 -168 C 64 -158 70 -110 52 -80 C 34 -52 -50 -50 -60 -96 Z" fill={C.body} {...ol} />
        <path d="M -20 -90 q 6 6 12 0 M 0 -76 q 6 6 12 0" fill="none" stroke="#5A566A" strokeWidth={3} strokeLinecap="round" />
        {/* 翅膀 */}
        <g transform={`translate(-14 -140) rotate(${-wing})`}>
          <path d="M 0 0 C -40 -6 -70 20 -76 50 L -60 44 L -64 60 L -46 52 L -46 66 C -20 50 6 30 0 0 Z" fill={C.shade} {...ol} />
        </g>
        {/* 头 */}
        <circle cx={42} cy={-178} r={44} fill={C.body} {...ol} />
        <path d="M 30 -220 q -6 -22 8 -30 M 40 -221 q 4 -20 20 -24" fill="none" {...dl} />
        {/* 蒙面眼罩（带两条飘带） */}
        <path d={`M 2 -190 q -24 ${-10 + Math.sin(f / 3) * 6} -46 ${4 + Math.sin(f / 3) * 8} M 2 -184 q -22 ${8 + Math.sin(f / 3 + 1) * 6} -40 ${22 + Math.sin(f / 3 + 1) * 6}`} fill="none" stroke={C.mask} strokeWidth={9} strokeLinecap="round" />
        <path d="M 0 -196 Q 42 -214 86 -196 L 84 -170 Q 42 -184 2 -172 Z" fill={C.mask} {...dl} />
        <MaskEye cx={30} cy={-188} />
        <MaskEye cx={64} cy={-186} />
        {/* 大嘴 */}
        <path d="M 80 -172 Q 120 -170 132 -156 Q 112 -150 80 -156 Z" fill={C.beak} {...dl} />
        <path d="M 80 -156 Q 108 -150 124 -152" fill="none" {...thin} />
        {twig && (
          <g transform="translate(108 -158) rotate(-8)">
            <path d="M -40 0 L 70 4" stroke={INK} strokeWidth={10} strokeLinecap="round" />
            <path d="M -40 0 L 70 4" stroke={C.twig} strokeWidth={6} strokeLinecap="round" />
            <path d="M 20 2 l 20 -18 M 44 3 l 14 14 M -10 1 l -10 -14" stroke={C.twig} strokeWidth={4} strokeLinecap="round" />
            <ellipse cx={40} cy={-18} rx={7} ry={4} fill="#5E8C4A" {...thin} />
          </g>
        )}
        {scared && <path d="M 100 -240 q 6 -10 0 -20 M 112 -232 q 10 -6 12 -18" fill="none" {...dl} />}
      </g>
      <Leg x={14} rot={legB} />
    </g>
  );
};
