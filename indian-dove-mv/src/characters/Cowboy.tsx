// 牛仔：大帽檐、八字胡、皮套裤，腰间别着左轮
import React from "react";
import { INK } from "../style/palette";
import { Limb } from "./limb";
import { Eye, MotionLines, autoBlink, dl, ol, onTwos, thin } from "./parts";

export type CowboyPose = "stand" | "walk" | "back" | "dance";
export type CowboyExpression = "squint" | "surprised" | "talk" | "grin";

export const CB = {
  skin: "#E8B48A",
  skinDark: "#C98F68",
  hat: "#C08A55",
  hatDark: "#8E5A34",
  band: "#5A3A22",
  shirt: "#E8D7B5",
  vest: "#6B4226",
  bandana: "#C0392B",
  jeans: "#4E6E8E",
  chaps: "#9A6438",
  boot: "#5A3A22",
  stache: "#6B4226",
  metal: "#C9C9C9",
  gold: "#E8B93C",
};

export const Cowboy: React.FC<{
  frame: number;
  pose?: CowboyPose;
  expression?: CowboyExpression;
  facing?: 1 | -1;
  beat?: number;
  seed?: number;
}> = ({ frame, pose = "stand", expression = "squint", facing = 1, beat, seed = 12 }) => {
  const f = onTwos(frame);
  const t = f / 24;
  const b = autoBlink(frame, seed);
  const back = pose === "back";
  let stepL = 0;
  let stepR = 0;
  let bob = 0;
  let armSwing = 0;
  if (pose === "walk" || pose === "back") {
    const ph = (f % 24) / 24; // 一拍一步的慢步（决斗时）
    const s = Math.sin(ph * Math.PI * 2);
    stepL = s * 18;
    stepR = -s * 18;
    bob = -Math.abs(s) * 6;
    armSwing = s * 12;
  } else if (pose === "dance") {
    const ph = beat ?? (t * 1.6) % 1;
    const s = Math.sin(ph * Math.PI * 2);
    stepL = s > 0 ? 30 : 0;
    stepR = s < 0 ? -30 : 0;
    bob = -Math.abs(Math.cos(ph * Math.PI)) * 14;
    armSwing = s * 40;
  }
  const surprised = expression === "surprised";
  const hatPop = surprised ? -30 - Math.abs(Math.sin(t * 8)) * 10 : 0;

  const leg = (x: number, step: number) => (
    <g transform={`rotate(${step} ${x} -190)`}>
      <Limb d={`M ${x} -190 L ${x} -20`} color={CB.jeans} w={38} />
      {/* 皮套裤 + 流苏 */}
      <path d={`M ${x - 22} -186 L ${x + 22} -186 L ${x + 20} -40 L ${x - 22} -40 Z`} fill={CB.chaps} {...dl} />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M ${x + (x < 0 ? -22 : 20)} ${-170 + i * 22} l ${x < 0 ? -12 : 12} 6`} stroke={CB.chaps} strokeWidth={5} strokeLinecap="round" />
      ))}
      {/* 靴子 + 马刺 */}
      <path d={`M ${x - 20} -46 L ${x + 18} -46 L ${x + 20} -12 L ${x + 44} -10 Q ${x + 48} 0 ${x + 40} 2 L ${x - 22} 2 Z`} fill={CB.boot} {...dl} />
      <g transform={`translate(${x - 26} -12) rotate(${f * 8})`}>
        <path d="M 0 -10 L 3 -3 L 10 0 L 3 3 L 0 10 L -3 3 L -10 0 L -3 -3 Z" fill={CB.metal} {...thin} strokeWidth={1.5} />
      </g>
    </g>
  );

  return (
    <g transform={`scale(${facing} 1) translate(0 ${bob})`}>
      {leg(-24, stepL)}
      {leg(26, stepR)}
      {/* 躯干 */}
      <path d="M -50 -200 C -56 -250 -52 -296 -30 -306 L 34 -306 C 56 -296 60 -250 54 -200 Z" fill={CB.shirt} {...ol} />
      {!back ? (
        <>
          <path d="M -50 -200 C -56 -250 -52 -296 -30 -306 L -6 -306 L -10 -200 Z" fill={CB.vest} {...dl} />
          <path d="M 54 -200 C 60 -250 56 -296 34 -306 L 14 -306 L 18 -200 Z" fill={CB.vest} {...dl} />
          <circle cx={-18} cy={-262} r={5} fill={CB.gold} {...thin} />
          {/* 警徽一样的星星 */}
          <path d="M -32 -268 l 4 9 l 10 1 l -8 6 l 3 10 l -9 -6 l -9 6 l 3 -10 l -8 -6 l 10 -1 Z" fill={CB.gold} {...thin} strokeWidth={1.5} />
        </>
      ) : (
        <path d="M -50 -200 C -56 -250 -52 -296 -30 -306 L 34 -306 C 56 -296 60 -250 54 -200 Z" fill={CB.vest} {...dl} />
      )}
      {/* 皮带 + 大扣 + 枪套 */}
      <rect x={-54} y={-212} width={110} height={18} fill={CB.band} {...dl} />
      {!back && <rect x={-12} y={-216} width={26} height={24} rx={4} fill={CB.gold} {...dl} />}
      <g transform="translate(56 -206) rotate(-8)">
        <path d="M -6 0 L 18 0 L 14 58 L -2 58 Z" fill={CB.vest} {...dl} />
        <path d="M 0 -2 Q 8 -26 22 -22 L 20 -8 L 8 2 Z" fill={CB.hatDark} {...dl} />
        <circle cx={14} cy={-14} r={3} fill={CB.metal} />
      </g>
      {/* 胳膊 */}
      <g transform={`rotate(${armSwing} -44 -290)`}>
        <Limb d={pose === "stand" ? "M -44 -290 Q -70 -250 -40 -214" : "M -44 -290 Q -62 -250 -60 -200"} color={CB.shirt} w={24} />
        <circle cx={pose === "stand" ? -38 : -60} cy={pose === "stand" ? -212 : -196} r={13} fill={CB.skin} {...dl} />
      </g>
      <g transform={`rotate(${-armSwing} 46 -290)`}>
        <Limb d={pose === "stand" ? "M 46 -290 Q 74 -250 46 -214" : "M 46 -290 Q 66 -250 64 -200"} color={CB.shirt} w={24} />
        <circle cx={pose === "stand" ? 42 : 64} cy={pose === "stand" ? -212 : -196} r={13} fill={CB.skin} {...dl} />
      </g>
      {/* 头 */}
      <g>
        <rect x={-14} y={-322} width={30} height={22} fill={CB.skin} {...dl} />
        {/* 领巾 */}
        <path d="M -30 -312 Q 2 -296 36 -312 L 30 -300 Q 2 -284 -24 -300 Z" fill={CB.bandana} {...dl} />
        {!back && <path d="M -4 -300 L 6 -272 L 16 -300 Z" fill={CB.bandana} {...dl} />}
        <ellipse cx={4} cy={-356} rx={42} ry={46} fill={CB.skin} {...ol} />
        {!back ? (
          <>
            <ellipse cx={-36} cy={-352} rx={9} ry={13} fill={CB.skin} {...dl} />
            {/* 胡茬 */}
            {Array.from({ length: 12 }, (_, i) => (
              <circle key={i} cx={-18 + (i % 6) * 9} cy={-326 + Math.floor(i / 6) * 8 + (i % 2) * 3} r={1.6} fill={CB.skinDark} />
            ))}
            {surprised ? (
              <>
                <Eye cx={2} cy={-366} rx={11} ry={14} lid={0} pupil={0.3} look={[0.3, 0]} />
                <Eye cx={28} cy={-366} rx={10} ry={13} lid={0} pupil={0.3} look={[0.3, 0]} />
              </>
            ) : (
              <>
                <Eye cx={2} cy={-364} rx={9} ry={9} lid={Math.max(0.55, b)} lidTilt={-8} pupil={0.45} look={[0.4, 0.2]} lidColor={CB.skinDark} />
                <Eye cx={28} cy={-364} rx={8} ry={9} lid={Math.max(0.55, b)} lidTilt={-8} pupil={0.45} look={[0.4, 0.2]} lidColor={CB.skinDark} />
              </>
            )}
            <path d={surprised ? "M -10 -386 q 10 -10 22 -2 M 20 -388 q 10 -8 20 2" : "M -10 -378 L 12 -374 M 18 -374 L 40 -378"} fill="none" {...dl} strokeWidth={5} />
            {/* 大鼻子 */}
            <path d="M 30 -358 Q 54 -356 52 -340 Q 48 -330 32 -334" fill={CB.skin} {...dl} />
            {/* 嘴（藏在胡子下） */}
            {(expression === "talk" && Math.floor(f / 4) % 2) || surprised ? <ellipse cx={22} cy={-318} rx={8} ry={8} fill="#6B2A2A" {...thin} /> : null}
            {expression === "grin" && <path d="M 8 -320 Q 22 -310 36 -320" fill="#FFFDF4" {...dl} />}
            {/* 八字胡 */}
            <path d="M 22 -334 C 4 -340 -16 -334 -26 -314 C -10 -320 4 -322 18 -324 C 30 -322 46 -320 62 -312 C 54 -330 40 -340 22 -334 Z" fill={CB.stache} {...dl} />
          </>
        ) : (
          <>
            {/* 后脑勺：头发 + 两只耳朵 */}
            <path d="M -38 -370 C -40 -400 46 -404 46 -370 C 48 -340 40 -322 28 -314 Q 4 -306 -20 -314 C -34 -324 -40 -344 -38 -370 Z" fill={CB.stache} {...dl} />
            <path d="M -18 -334 q 6 8 0 16 M 4 -336 q 6 10 0 18 M 24 -334 q 6 8 0 16" fill="none" stroke="#4E2E18" strokeWidth={3} strokeLinecap="round" />
            <ellipse cx={-42} cy={-352} rx={8} ry={12} fill={CB.skin} {...dl} />
            <ellipse cx={48} cy={-352} rx={8} ry={12} fill={CB.skin} {...dl} />
          </>
        )}
        {/* 大帽檐 */}
        <g transform={`translate(4 ${-388 + hatPop}) rotate(${surprised ? -10 : -4})`}>
          <path d="M -106 6 Q -70 -16 0 -14 Q 70 -18 112 4 Q 120 16 100 16 Q 40 2 0 4 Q -50 2 -96 18 Q -116 18 -106 6 Z" fill={CB.hat} {...ol} />
          <path d="M -46 -8 C -52 -66 -26 -84 0 -72 C 26 -86 52 -66 46 -8 Z" fill={CB.hat} {...ol} />
          <path d="M -46 -18 Q 0 -6 46 -18 L 46 -8 Q 0 4 -46 -8 Z" fill={CB.band} />
          <path d="M 0 -72 L 0 -46" {...thin} />
        </g>
        {surprised && <MotionLines x={-70} y={-450} dir={-1} n={2} len={30} />}
      </g>
      {pose === "back" && <path d="M -2 -306 L -2 -214" stroke={INK} strokeWidth={2} opacity={0.4} />}
    </g>
  );
};
