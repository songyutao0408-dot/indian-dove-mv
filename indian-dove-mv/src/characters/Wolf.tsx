// 灰狼：瘦长、龇牙，啃骨头时骨头被咬出缺口；说唱段换成正经脸、戴牛仔帽
import React from "react";
import { Limb } from "./limb";
import { Eye, autoBlink, dl, ol, onTwos, thin } from "./parts";

export type WolfExpression = "grin" | "chew" | "serious" | "howl";
export type WolfPose = "stand" | "lean" | "dance";

const W = { fur: "#8D8F98", dark: "#6B6D78", belly: "#CFCAC0", nose: "#2E2A30", gum: "#B84A55", eye: "#F2C14E", bone: "#EFE6D2", hat: "#B07A45", hatBand: "#6B3E22" };

export const Bone: React.FC<{ bites?: number }> = ({ bites = 1 }) => (
  <g>
    <path d="M -50 -8 L 50 -8 L 50 8 L -50 8 Z" fill={W.bone} {...dl} />
    {[-50, 50].map((x) => (
      <g key={x}>
        <circle cx={x} cy={-10} r={12} fill={W.bone} {...dl} />
        <circle cx={x} cy={10} r={12} fill={W.bone} {...dl} />
      </g>
    ))}
    <rect x={-46} y={-7} width={92} height={14} fill={W.bone} />
    {/* 咬出来的缺口 */}
    {Array.from({ length: bites }, (_, i) => (
      <path key={i} d={`M ${-6 + i * 22} -9 q 6 10 12 0`} fill="#F3E2C0" {...thin} />
    ))}
  </g>
);

export const Wolf: React.FC<{
  frame: number;
  expression?: WolfExpression;
  pose?: WolfPose;
  facing?: 1 | -1;
  /** 手里的骨头（chew 时会举到嘴边） */
  bone?: boolean;
  bites?: number;
  hat?: boolean;
  beat?: number;
  seed?: number;
}> = ({ frame, expression = "grin", pose = "stand", facing = 1, bone = false, bites = 1, hat = false, beat, seed = 7 }) => {
  const f = onTwos(frame);
  const t = f / 24;
  const b = autoBlink(frame, seed);
  const ex = expression;
  let lean = 4 + Math.sin(t * Math.PI) * 1.5;
  let headRot = 0;
  let bodyY = 0;
  if (pose === "lean") lean = 22;
  if (ex === "howl") headRot = -38;
  if (pose === "dance") {
    const ph = beat ?? (t * 1.6) % 1;
    lean = Math.sin(ph * Math.PI * 2) * 10;
    bodyY = -Math.abs(Math.cos(ph * Math.PI)) * 16;
  }
  const chewing = ex === "chew";
  const jaw = chewing ? (Math.floor(f / 3) % 2 ? 16 : 2) : ex === "howl" ? 30 : ex === "grin" ? 6 : 0;
  const tail = Math.sin(t * 3) * 8;

  return (
    <g transform={`scale(${facing} 1) translate(0 ${bodyY})`}>
      {/* 蓬松尾巴 */}
      <path d={`M -30 -150 C -90 -150 -120 ${-110 + tail} -128 ${-60 + tail} C -100 ${-80 + tail} -80 ${-96 + tail} -62 -110 C -96 -100 -90 -130 -30 -130 Z`} fill={W.fur} {...ol} />
      <path d={`M -128 ${-60 + tail} C -118 ${-74 + tail} -110 ${-82 + tail} -100 ${-86 + tail}`} fill="none" stroke={W.belly} strokeWidth={8} strokeLinecap="round" />
      {/* 腿：细长、反关节 */}
      <Limb d="M -20 -150 L -34 -84 L -16 -40 L -26 -6" color={W.fur} w={20} />
      <Limb d="M 20 -150 L 26 -84 L 44 -40 L 36 -6" color={W.fur} w={20} />
      <path d="M -50 0 Q -26 -16 -6 0 Z M 20 0 Q 44 -16 62 0 Z" fill={W.dark} {...dl} />
      <g transform={`rotate(${lean} 0 -150)`}>
        {/* 瘦长的身子 */}
        <path d="M -40 -150 C -46 -220 -30 -280 6 -290 C 44 -284 50 -220 40 -150 C 20 -136 -20 -136 -40 -150 Z" fill={W.fur} {...ol} />
        <path d="M -12 -156 C -16 -210 -6 -250 8 -262 C 22 -248 26 -210 18 -156 Z" fill={W.belly} />
        <path d="M -30 -200 l 6 6 l 6 -6 M 22 -230 l 6 6 l 6 -6" fill="none" {...thin} />
        {/* 后面的胳膊 */}
        <Limb d={chewing ? "M -24 -262 Q -40 -220 6 -236" : "M -24 -262 Q -50 -210 -40 -170"} color={W.dark} w={16} />
        {/* 头 */}
        <g transform={`rotate(${headRot} 4 -290)`}>
          {/* 耳朵 */}
          <path d="M -26 -330 L -36 -392 L 2 -352 Z" fill={W.fur} {...ol} />
          <path d="M 16 -342 L 22 -404 L 46 -352 Z" fill={W.fur} {...ol} />
          <path d="M -26 -338 L -32 -376 L -8 -350 Z M 20 -348 L 24 -386 L 38 -354 Z" fill={W.gum} opacity={0.6} />
          {/* 下巴 */}
          <g transform={`rotate(${jaw} 30 -296)`}>
            <path d="M 20 -300 L 112 -298 Q 110 -278 30 -280 Z" fill={W.fur} {...ol} />
            {(ex === "grin" || chewing || ex === "howl") &&
              [44, 60, 76, 92].map((x) => <path key={x} d={`M ${x} -298 l 6 -10 l 6 10`} fill="#FFFDF4" {...thin} strokeWidth={1.8} />)}
          </g>
          {jaw > 4 && <path d={`M 30 -300 L 108 -300 L 104 ${-300 + jaw * 1.4} L 32 ${-296 + jaw * 0.8} Z`} fill={W.gum} />}
          {/* 头 + 长吻 */}
          <path d="M -40 -318 C -44 -360 -10 -372 22 -366 C 48 -362 60 -346 70 -332 L 128 -318 Q 138 -306 124 -298 L 30 -296 C -10 -294 -38 -296 -40 -318 Z" fill={W.fur} {...ol} />
          <path d="M -34 -306 Q -10 -296 14 -304" fill="none" stroke={W.belly} strokeWidth={10} strokeLinecap="round" />
          <ellipse cx={130} cy={-312} rx={10} ry={8} fill={W.nose} {...thin} />
          {/* 上排牙（龇牙） */}
          {(ex === "grin" || chewing) &&
            [50, 66, 82, 98, 112].map((x) => <path key={x} d={`M ${x} -299 l 6 12 l 6 -12`} fill="#FFFDF4" {...thin} strokeWidth={1.8} />)}
          {ex === "serious" && <path d="M 40 -300 L 116 -300" {...dl} />}
          {/* 眼睛 + 眉毛 */}
          {ex === "howl" ? (
            <path d="M 10 -338 q 14 8 28 0" fill="none" {...dl} strokeWidth={4} />
          ) : (
            <>
              <Eye cx={24} cy={-338} rx={14} ry={13} white={W.eye} lid={ex === "serious" ? Math.max(0.5, b) : Math.max(0.2, b)} lidTilt={ex === "serious" ? -12 : -6} look={[0.5, 0]} pupil={0.32} lidColor={W.dark} />
              <path d={ex === "serious" ? "M 6 -356 L 44 -350" : "M 4 -360 Q 26 -370 46 -356"} fill="none" {...dl} strokeWidth={5} />
            </>
          )}
          {/* 牛仔帽 */}
          {hat && (
            <g transform="translate(6 -366) rotate(-8)">
              <path d="M -70 0 Q -40 -14 0 -12 Q 40 -14 76 2 Q 64 12 0 8 Q -60 12 -70 0 Z" fill={W.hat} {...ol} />
              <path d="M -36 -6 C -40 -50 -20 -64 0 -56 C 20 -66 40 -50 36 -6 Z" fill={W.hat} {...ol} />
              <path d="M -36 -14 Q 0 -4 36 -14 L 36 -6 Q 0 4 -36 -6 Z" fill={W.hatBand} />
              <path d="M 0 -56 L 0 -36" {...thin} />
            </g>
          )}
        </g>
        {/* 前面的胳膊 + 骨头 */}
        {bone && (
          <g transform={chewing ? "translate(84 -284) rotate(-6)" : "translate(48 -176) rotate(-60)"}>
            <Bone bites={bites} />
          </g>
        )}
        <Limb d={chewing ? "M 26 -258 Q 40 -228 70 -270" : bone ? "M 26 -258 Q 58 -220 52 -180" : "M 26 -258 Q 50 -210 42 -170"} color={W.fur} w={16} />
      </g>
    </g>
  );
};
