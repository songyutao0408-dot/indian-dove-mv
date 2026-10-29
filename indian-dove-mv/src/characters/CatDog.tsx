// 像猫的狗：狗的身体，猫的动作（舔爪子、弓背、伸懒腰、追激光点），旁边可以加一个问号
import React from "react";
import { INK } from "../style/palette";
import { Limb } from "./limb";
import { Eye, QuestionMark, autoBlink, dl, ol, onTwos, thin } from "./parts";

export type CatDogPose = "stand" | "lick" | "arch" | "stretch" | "pounce";

const D = { fur: "#E0C18E", spot: "#9A6236", ear: "#8E5A34", nose: "#2E2420", collar: "#C8402E", tag: "#F2C14E", tongue: "#E58C8C" };

export const CatDog: React.FC<{
  frame: number;
  pose?: CatDogPose;
  facing?: 1 | -1;
  question?: boolean;
  /** 盯着的方向（追激光点时用） */
  look?: [number, number];
  seed?: number;
}> = ({ frame, pose = "stand", facing = 1, question = false, look, seed = 10 }) => {
  const f = onTwos(frame);
  const t = f / 24;
  const b = autoBlink(frame, seed);
  const tailWave = Math.sin(t * 4) * 12;

  // 按姿态决定身体各部位位置
  let hipY = -110;
  let shoulderY = -110;
  let backArch = 0; // 弓背高度
  let headX = 120;
  let headY = -160;
  let headRot = 0;
  let frontLegs = "M 80 -110 L 84 -60 L 86 -8|M 96 -110 L 104 -60 L 108 -8";
  let backLegs = "M -70 -110 L -80 -60 L -76 -8|M -54 -110 L -60 -60 L -54 -8";
  let tail = `M -90 -130 Q -130 ${-170 + tailWave} -120 ${-210 + tailWave}`;
  let eyesClosed = false;
  let tongue = false;
  let pupils: [number, number] = look ?? [0.4, 0];
  let fluff = false;

  if (pose === "lick") {
    // 坐着，抬起一只前爪舔
    hipY = -60;
    shoulderY = -140;
    headX = 96;
    headY = -210;
    headRot = 18;
    backLegs = "M -40 -60 L -70 -40 L -40 -8|M -24 -60 L -50 -36 L -20 -8";
    frontLegs = "M 70 -130 L 74 -70 L 74 -8|M 86 -134 Q 132 -150 128 -" + (196 + Math.sin(f / 2) * 4);
    tail = `M -60 -40 Q -110 -10 -140 ${-20 + tailWave * 0.3}`;
    eyesClosed = true;
    tongue = true;
  } else if (pose === "arch") {
    backArch = 70;
    fluff = true;
    tail = "M -90 -150 L -96 -260";
    pupils = [0.3, 0];
  } else if (pose === "stretch") {
    // 前低后高伸懒腰
    shoulderY = -60;
    hipY = -120;
    headX = 140;
    headY = -96;
    headRot = -6;
    frontLegs = "M 76 -60 L 150 -20 L 190 -8|M 90 -60 L 170 -24 L 206 -8";
    tail = `M -90 -140 Q -110 ${-210 + tailWave} -80 ${-250 + tailWave}`;
    eyesClosed = true;
    tongue = Math.floor(f / 24) % 2 === 0;
  } else if (pose === "pounce") {
    // 压低身子、屁股翘起扭来扭去
    shoulderY = -70;
    hipY = -110 + Math.sin(f * 0.8) * 6;
    headX = 120;
    headY = -110;
    frontLegs = "M 76 -70 L 96 -40 L 90 -8|M 92 -70 L 116 -40 L 110 -8";
    tail = `M -90 -130 Q ${-130 + Math.sin(f) * 14} -150 ${-150 + Math.sin(f) * 20} -130`;
    pupils = look ?? [0.6, 0.3];
  }

  const torso = `M -96 ${hipY} C -100 ${hipY - 50 - backArch} -40 ${Math.min(hipY, shoulderY) - 60 - backArch * 1.4} 20 ${Math.min(hipY, shoulderY) - 50 - backArch} C 80 ${shoulderY - 50 - backArch * 0.4} 112 ${shoulderY - 30} 110 ${shoulderY} C 104 ${shoulderY + 30} 60 ${Math.max(hipY, shoulderY) + 26} 0 ${Math.max(hipY, shoulderY) + 22} C -60 ${hipY + 30} -94 ${hipY + 26} -96 ${hipY} Z`;

  return (
    <g transform={`scale(${facing} 1)`}>
      <Limb d={tail} color={D.fur} w={18} />
      {backLegs.split("|").map((d, i) => (
        <Limb key={`b${i}`} d={d} color={i ? D.fur : "#CBAA78"} w={24} />
      ))}
      {frontLegs.split("|").map((d, i) => (i === 0 ? <Limb key={`f${i}`} d={d} color="#CBAA78" w={22} /> : null))}
      <path d={torso} fill={D.fur} {...ol} />
      {fluff && (
        <path
          d={Array.from({ length: 8 }, (_, i) => {
            const x = -70 + i * 22;
            const y = -186 - backArch * 0.9 - Math.sin((i / 7) * Math.PI) * 26;
            return `M ${x} ${y + 14} l 6 -18 l 6 18`;
          }).join(" ")}
          fill={D.fur}
          {...dl}
        />
      )}
      {/* 斑点 */}
      <ellipse cx={-40} cy={Math.min(hipY, shoulderY) - 26 - backArch * 0.9} rx={30} ry={18} fill={D.spot} transform={`rotate(-10 -40 ${hipY - 30})`} />
      <ellipse cx={40} cy={Math.max(hipY, shoulderY) - 4} rx={16} ry={11} fill={D.spot} />
      {frontLegs.split("|").map((d, i) => (i === 1 ? <Limb key={`f${i}`} d={d} color={D.fur} w={22} /> : null))}
      {/* 头 */}
      <g transform={`translate(${headX} ${headY}) rotate(${headRot})`}>
        <path d="M -30 -40 C -60 -40 -62 10 -40 30 L -30 6 Z" fill={D.ear} {...ol} />
        <circle cx={0} cy={0} r={44} fill={D.fur} {...ol} />
        <ellipse cx={-6} cy={-10} rx={18} ry={14} fill={D.spot} />
        {/* 长嘴 */}
        <path d="M 24 -10 C 60 -18 80 -6 80 12 C 80 28 50 32 24 26 Z" fill="#F0DAB0" {...ol} />
        <ellipse cx={78} cy={0} rx={11} ry={9} fill={D.nose} />
        <path d="M 50 22 Q 62 26 74 18" fill="none" {...dl} />
        {tongue && <path d="M 62 22 Q 64 46 76 44 Q 84 40 76 22 Z" fill={D.tongue} {...dl} />}
        {/* 猫一样的胡须 */}
        <path d="M 56 6 l 30 -8 M 56 12 l 32 2 M 56 18 l 28 10" {...thin} strokeWidth={2} />
        {eyesClosed ? (
          <>
            <path d="M -2 -14 q 10 8 20 0" fill="none" {...dl} strokeWidth={4} />
            <path d="M 28 -14 q 8 7 16 0" fill="none" {...dl} strokeWidth={4} />
          </>
        ) : (
          <>
            <Eye cx={8} cy={-12} rx={12} ry={15} lid={pose === "pounce" ? 0 : b} look={pupils} pupil={pose === "pounce" ? 0.6 : 0.42} lidColor="#CBAA78" />
            <Eye cx={36} cy={-12} rx={10} ry={13} lid={pose === "pounce" ? 0 : b} look={pupils} pupil={pose === "pounce" ? 0.6 : 0.42} lidColor="#CBAA78" />
          </>
        )}
        <path d="M 16 -40 C 30 -64 50 -44 40 -18 Z" fill={D.ear} {...dl} />
        {/* 项圈 */}
        <path d="M -30 30 Q 0 46 26 34" fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" />
        <path d="M -30 30 Q 0 46 26 34" fill="none" stroke={D.collar} strokeWidth={8} strokeLinecap="round" />
        <circle cx={4} cy={48} r={8} fill={D.tag} {...thin} />
      </g>
      {question && <QuestionMark x={headX + 30} y={headY - 80} frame={frame} />}
    </g>
  );
};
