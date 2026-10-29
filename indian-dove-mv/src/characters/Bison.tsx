// 野牛：毛发蓬乱，鼻孔喷气，蹄子刨地；远景对冲撞出一团尘土
import React from "react";
import { INK } from "../style/palette";
import { Limb } from "./limb";
import { Eye, MotionLines, StarsOrbit, autoBlink, dl, ol, onTwos, thin } from "./parts";

export type BisonPose = "stand" | "paw" | "charge" | "dazed";

const B = { body: "#7A5234", mane: "#4A2F1C", dark: "#3E2716", horn: "#EFE3C8", nose: "#2E2018", hoof: "#2E2018", steam: "#F6E7C8" };

export const Bison: React.FC<{
  frame: number;
  pose?: BisonPose;
  facing?: 1 | -1;
  /** 鼻孔喷气 */
  snort?: boolean;
  seed?: number;
  /** 毛色微调，用来区分两头牛 */
  tint?: string;
}> = ({ frame, pose = "stand", facing = 1, snort = true, seed = 9, tint }) => {
  const f = onTwos(frame);
  const t = f / 24;
  const b = autoBlink(frame, seed);
  const body = tint ?? B.body;
  let headDrop = 0;
  let paw = 0;
  let bodyY = 0;
  let gallop = 0;
  if (pose === "paw") {
    const ph = (f % 16) / 16;
    paw = Math.sin(ph * Math.PI * 2);
    headDrop = 10;
  } else if (pose === "charge") {
    gallop = Math.sin(((f % 8) / 8) * Math.PI * 2);
    headDrop = 34;
    bodyY = -Math.abs(gallop) * 12;
  }
  const dazed = pose === "dazed";

  const leg = (x: number, swing: number, front: boolean) => {
    const top = -110;
    const footX = x + swing * 26;
    const lift = front && pose === "paw" ? Math.max(0, paw) * 26 : 0;
    const scrape = front && pose === "paw" ? paw * 30 : 0;
    return (
      <g>
        <Limb d={`M ${x} ${top} L ${x + swing * 12} -50`} color={front ? B.mane : body} w={34} />
        <Limb d={`M ${x + swing * 12} -50 L ${footX + scrape} ${-12 - lift}`} color={front ? B.mane : body} w={22} />
        {front && (
          <path
            d={`M ${x - 24} ${top + 10} L ${x - 20} -64 L ${x - 10} -76 L ${x - 2} -58 L ${x + 8} -74 L ${x + 18} -60 L ${x + 24} ${top + 10} Z`}
            fill={B.mane}
            {...dl}
            transform={`rotate(${swing * 10} ${x} ${top})`}
          />
        )}
        <path d={`M ${footX + scrape - 16} ${-2 - lift} L ${footX + scrape - 12} ${-18 - lift} L ${footX + scrape + 14} ${-18 - lift} L ${footX + scrape + 18} ${-2 - lift} Z`} fill={B.hoof} {...dl} />
      </g>
    );
  };

  return (
    <g transform={`scale(${facing} 1) translate(0 ${bodyY})`}>
      {pose === "charge" && <MotionLines x={-230} y={-200} dir={-1} n={4} len={90} gap={36} />}
      {/* 远侧两条腿 */}
      {leg(-110, pose === "charge" ? -gallop : 0, false)}
      {leg(70, pose === "charge" ? gallop : 0, true)}
      {/* 身体：后半身较瘦 */}
      <path d="M -186 -146 C -196 -206 -136 -230 -66 -218 C -6 -212 40 -202 60 -170 L 60 -112 C 20 -94 -40 -92 -104 -98 C -154 -100 -182 -112 -186 -146 Z" fill={body} {...ol} />
      <path d="M -170 -170 q 10 -10 22 -2 M -130 -196 q 12 -8 24 0 M -120 -130 q 12 -8 22 0" fill="none" stroke={B.mane} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      {/* 尾巴 */}
      <path d={`M -170 -170 Q -200 ${-140 + Math.sin(t * 3) * 10} -196 ${-110 + Math.sin(t * 3) * 10}`} fill="none" {...dl} strokeWidth={6} />
      <path d={`M -196 ${-110 + Math.sin(t * 3) * 10} l -10 20 l 14 -6 l 4 16 l 6 -22 Z`} fill={B.dark} {...thin} />
      {/* 近侧两条腿 */}
      {leg(-80, pose === "charge" ? gallop : 0, false)}
      {leg(100, pose === "charge" ? -gallop : 0, true)}
      {/* 前半身的大驼峰 + 乱蓬蓬的鬃毛 */}
      <path
        d="M -44 -190 C -44 -300 60 -334 130 -292 C 176 -264 186 -210 172 -160 C 162 -110 124 -82 84 -84 C 30 -88 -12 -110 -32 -140 C -40 -156 -44 -172 -44 -190 Z"
        fill={B.mane}
        {...ol}
      />
      {Array.from({ length: 9 }, (_, i) => {
        const x = -10 + i * 20;
        const y = -270 + Math.abs(i - 4) * 10;
        return <path key={i} d={`M ${x} ${y} q ${6 + Math.sin(f / 3 + i) * 2} -18 ${14} -4`} fill="none" stroke={B.dark} strokeWidth={4} strokeLinecap="round" />;
      })}
      <path d="M 20 -200 q 10 -10 20 0 q 10 -10 20 0 M 40 -150 q 10 -10 20 0 q 10 -10 20 0" fill="none" stroke={B.dark} strokeWidth={3} strokeLinecap="round" />
      {/* 头：低垂，带胡子 */}
      <g transform={`rotate(${headDrop} 140 -210)`}>
        <path d="M 120 -240 C 170 -250 214 -230 220 -190 C 224 -160 210 -134 186 -130 C 160 -128 128 -150 116 -180 Z" fill={B.dark} {...ol} />
        {/* 胡子 */}
        <path d="M 150 -140 L 156 -100 L 166 -126 L 176 -96 L 182 -132 Z" fill={B.dark} {...dl} />
        {/* 角 */}
        <path d="M 132 -236 C 120 -262 132 -284 152 -284 C 140 -270 140 -254 150 -240 Z" fill={B.horn} {...dl} />
        <path d="M 186 -236 C 200 -258 220 -262 228 -252 C 214 -250 206 -238 202 -226 Z" fill={B.horn} {...dl} />
        {/* 刘海 */}
        <path d="M 130 -238 q 14 -20 30 -6 q 12 -18 28 -2 q 10 -10 22 4" fill="none" stroke={B.mane} strokeWidth={10} strokeLinecap="round" />
        {/* 眼 */}
        {dazed ? (
          <path d="M 162 -214 l 12 8 m -12 0 l 12 -8" {...dl} />
        ) : (
          <Eye cx={170} cy={-210} rx={10} ry={9} lid={Math.max(0.45, b)} lidTilt={-18} look={[0.6, 0.1]} pupil={0.45} lidColor={B.dark} white="#FFF1D6" />
        )}
        <path d="M 154 -226 L 186 -218" {...dl} strokeWidth={5} />
        {/* 大鼻孔 */}
        <ellipse cx={212} cy={-172} rx={16} ry={14} fill="#5B3D2A" {...dl} />
        <ellipse cx={210} cy={-176} rx={5} ry={6} fill={B.nose} />
        <ellipse cx={218} cy={-166} rx={4} ry={5} fill={B.nose} />
        {/* 喷气 */}
        {snort && (pose === "paw" || pose === "charge" || Math.floor(f / 18) % 2 === 0) && (
          <g>
            {[0, 1].map((i) => {
              const tt = (f / 10 + i * 0.5) % 1;
              return (
                <g key={i} opacity={1 - tt}>
                  <circle cx={232 + tt * 50} cy={-166 + tt * 10} r={10 + tt * 16} fill={B.steam} {...thin} />
                  <circle cx={244 + tt * 60} cy={-150 + tt * 14} r={6 + tt * 10} fill={B.steam} {...thin} />
                </g>
              );
            })}
          </g>
        )}
      </g>
      {dazed && <StarsOrbit cx={180} cy={-270} rx={70} frame={frame} />}
      {pose === "paw" && (
        <g>
          {[0, 1, 2].map((i) => {
            const tt = (f / 12 + i / 3) % 1;
            return <circle key={i} cx={130 - tt * 60} cy={-10 - Math.sin(tt * Math.PI) * 30} r={8 + tt * 10} fill="#E9C48F" stroke={INK} strokeWidth={2} opacity={1 - tt} />;
          })}
        </g>
      )}
    </g>
  );
};
