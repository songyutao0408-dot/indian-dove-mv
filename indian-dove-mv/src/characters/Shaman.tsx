// 巫师：披兽皮斗篷，戴羽毛面具，手摇骨头法器；念咒时身边冒出彩色烟雾和符号
import React from "react";
import { INK } from "../style/palette";
import { Limb } from "./limb";
import { dl, ol, onTwos, thin } from "./parts";

export type ShamanPose = "stand" | "chant" | "dance";

const M = {
  skin: "#B9744E",
  fur: "#6B4A30",
  furLight: "#8C6542",
  horn: "#EFE3C8",
  mask: "#E9C48F",
  maskRed: "#C8402E",
  maskTeal: "#3FA39A",
  bone: "#EFE6D2",
  smoke: ["#B57EDC", "#4FC2B5", "#F0A15E", "#E8738F"],
};

/** 骨头法器：木棍 + 葫芦 + 挂着的小骨头 */
const Rattle: React.FC<{ shake: number }> = ({ shake }) => (
  <g transform={`rotate(${shake})`}>
    <path d="M 0 0 L 0 -70" stroke={INK} strokeWidth={10} strokeLinecap="round" />
    <path d="M 0 0 L 0 -70" stroke="#8E5A34" strokeWidth={6} strokeLinecap="round" />
    <ellipse cx={0} cy={-90} rx={18} ry={24} fill={M.bone} {...dl} />
    <path d="M -10 -98 L 10 -98 M -12 -86 L 12 -86" stroke={M.maskRed} strokeWidth={3} />
    {[-14, 0, 14].map((x, i) => (
      <g key={i} transform={`translate(${x} -64) rotate(${shake * 1.5 + (i - 1) * 15})`}>
        <path d="M 0 0 L 0 22" stroke={INK} strokeWidth={1.5} />
        <rect x={-3} y={20} width={6} height={14} rx={3} fill={M.bone} {...thin} strokeWidth={1.5} />
      </g>
    ))}
  </g>
);

/** 念咒的彩色烟雾 + 符号（螺旋、闪电、太阳、眼睛） */
export const MagicSmoke: React.FC<{ frame: number; spread?: number }> = ({ frame, spread = 1 }) => {
  const f = onTwos(frame);
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => {
        const tt = (f / 40 + i / 8) % 1;
        const a = i * 1.7 + tt * 3;
        const x = Math.cos(a) * (60 + tt * 140) * spread;
        const y = -260 - tt * 220 + Math.sin(a) * 30;
        return <circle key={i} cx={x} cy={y} r={20 + tt * 40} fill={M.smoke[i % 4]} opacity={0.75 * (1 - tt)} {...thin} strokeOpacity={0.6 * (1 - tt)} />;
      })}
      {["spiral", "bolt", "sun", "eye"].map((k, i) => {
        const tt = (f / 56 + i / 4) % 1;
        const x = (i % 2 ? 1 : -1) * (90 + tt * 60) * spread;
        const y = -300 - tt * 200;
        const op = tt < 0.2 ? tt / 0.2 : 1 - (tt - 0.2) / 0.8;
        return (
          <g key={k} transform={`translate(${x} ${y}) rotate(${f * 4 * (i % 2 ? 1 : -1)}) scale(${0.8 + tt * 0.6})`} opacity={op}>
            {k === "spiral" && <path d="M 0 0 q 6 -6 10 0 q 2 12 -12 12 q -18 -2 -14 -20 q 6 -18 26 -12" fill="none" stroke={M.smoke[0]} strokeWidth={5} strokeLinecap="round" />}
            {k === "bolt" && <path d="M -6 -20 L 8 -4 L -2 0 L 10 20 L -10 2 L 0 -2 Z" fill={M.smoke[2]} {...thin} />}
            {k === "sun" && (
              <g>
                <circle r={9} fill={M.smoke[2]} {...thin} />
                {Array.from({ length: 8 }, (_, j) => (
                  <path key={j} d="M 0 -13 L 0 -20" stroke={M.smoke[2]} strokeWidth={4} strokeLinecap="round" transform={`rotate(${j * 45})`} />
                ))}
              </g>
            )}
            {k === "eye" && (
              <g>
                <path d="M -18 0 Q 0 -14 18 0 Q 0 14 -18 0 Z" fill="#FFFDF4" stroke={M.smoke[1]} strokeWidth={4} />
                <circle r={5} fill={M.smoke[1]} />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

export const Shaman: React.FC<{
  frame: number;
  pose?: ShamanPose;
  facing?: 1 | -1;
  magic?: boolean;
  beat?: number;
}> = ({ frame, pose = "stand", facing = 1, magic = false, beat }) => {
  const f = onTwos(frame);
  const t = f / 24;
  const chant = pose === "chant";
  let sway = Math.sin(t * Math.PI) * 2;
  let armL = "M -40 -270 Q -70 -230 -62 -190";
  let armR = "M 44 -270 Q 74 -230 66 -190";
  let rattleAt: [number, number] = [70, -186];
  let shake = Math.sin(f * 0.8) * 8;
  let bob = 0;
  if (chant) {
    const up = Math.floor(f / 6) % 2;
    sway = Math.sin(t * 5) * 8;
    armL = up ? "M -40 -270 Q -90 -300 -96 -360" : "M -40 -270 Q -90 -280 -110 -320";
    armR = up ? "M 44 -270 Q 96 -280 116 -320" : "M 44 -270 Q 96 -300 100 -360";
    rattleAt = up ? [116, -326] : [100, -366];
    shake = Math.sin(f * 1.6) * 24;
    bob = -Math.abs(Math.sin(t * 5)) * 10;
  } else if (pose === "dance") {
    const ph = beat ?? (t * 1.6) % 1;
    sway = Math.sin(ph * Math.PI * 2) * 10;
    bob = -Math.abs(Math.cos(ph * Math.PI)) * 14;
    shake = Math.sin(f * 1.2) * 20;
  }
  return (
    <g transform={`scale(${facing} 1)`}>
      {magic && <MagicSmoke frame={frame} />}
      <g transform={`translate(0 ${bob}) rotate(${sway} 0 0)`}>
        {/* 光腿 + 脚踝上的小铃 */}
        {[-20, 22].map((x) => (
          <g key={x}>
            <Limb d={`M ${x} -120 L ${x} -10`} color={M.skin} w={26} />
            <path d={`M ${x - 12} -6 Q ${x - 14} 4 ${x} 4 L ${x + 24} 4 Q ${x + 30} -4 ${x + 14} -10 Z`} fill={M.furLight} {...dl} />
            <path d={`M ${x - 14} -36 L ${x + 14} -36`} stroke="#E8B93C" strokeWidth={6} strokeDasharray="4 3" />
          </g>
        ))}
        {/* 胳膊（在斗篷下伸出） */}
        <Limb d={armL} color={M.skin} w={20} />
        <circle cx={Number(armL.split(" ").slice(-2)[0])} cy={Number(armL.split(" ").slice(-1)[0])} r={12} fill={M.skin} {...dl} />
        {/* 兽皮斗篷：参差不齐的下摆 */}
        <path
          d="M -40 -290 C -80 -260 -96 -180 -90 -110 L -76 -120 L -70 -98 L -56 -116 L -44 -94 L -30 -114 L -16 -92 L 0 -112 L 14 -92 L 28 -114 L 42 -94 L 56 -116 L 70 -98 L 78 -120 L 92 -110 C 98 -180 82 -260 44 -290 Z"
          fill={M.fur}
          {...ol}
        />
        {Array.from({ length: 10 }, (_, i) => (
          <path key={i} d={`M ${-60 + (i % 5) * 28} ${-250 + Math.floor(i / 5) * 70} q 6 -8 12 0`} fill="none" stroke={M.furLight} strokeWidth={4} strokeLinecap="round" />
        ))}
        {/* 骨头项链 */}
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={-34 + i * 11} y={-276 + Math.abs(i - 3) * -3} width={7} height={18} rx={3} fill={M.bone} {...thin} strokeWidth={1.5} />
        ))}
        <Limb d={armR} color={M.skin} w={20} />
        <g transform={`translate(${rattleAt[0]} ${rattleAt[1]})`}>
          <Rattle shake={shake} />
          <circle r={12} fill={M.skin} {...dl} />
        </g>
        {/* 兜帽 + 野牛角 */}
        <path d="M -44 -300 C -60 -370 -30 -404 4 -404 C 40 -404 66 -370 50 -300 Z" fill={M.fur} {...ol} />
        <path d="M -36 -380 C -70 -390 -86 -420 -76 -448 C -66 -424 -52 -412 -28 -404 Z" fill={M.horn} {...dl} />
        <path d="M 42 -380 C 76 -390 92 -420 82 -448 C 72 -424 58 -412 34 -404 Z" fill={M.horn} {...dl} />
        {/* 羽毛面具：一圈彩色羽毛 + 彩绘木面具 */}
        {Array.from({ length: 9 }, (_, i) => {
          const a = -150 + i * 15;
          const col = [M.maskRed, M.maskTeal, "#F2C14E"][i % 3];
          return (
            <g key={i} transform={`translate(4 -340) rotate(${a + 90 + Math.sin(t * 3 + i) * 3})`}>
              <path d="M 0 -30 C -9 -44 -7 -66 0 -78 C 7 -66 9 -44 0 -30 Z" fill={col} {...thin} />
            </g>
          );
        })}
        <path d="M -30 -370 C -30 -390 38 -390 38 -370 L 36 -326 C 30 -306 -22 -306 -28 -326 Z" fill={M.mask} {...ol} />
        <path d="M -24 -350 L -2 -346 L -6 -336 L -22 -340 Z M 32 -350 L 10 -346 L 14 -336 L 30 -340 Z" fill={INK} />
        <circle cx={-12} cy={-343} r={3} fill={chant ? "#F7E36A" : "#F6E7C8"} />
        <circle cx={20} cy={-343} r={3} fill={chant ? "#F7E36A" : "#F6E7C8"} />
        <path d="M -20 -366 L 28 -366" stroke={M.maskRed} strokeWidth={5} />
        <path d="M -12 -320 L 4 -314 L 20 -320" fill="none" stroke={M.maskTeal} strokeWidth={4} />
        <path d="M 4 -340 L 4 -326" {...thin} />
        {chant && <path d={`M -6 -310 q 10 ${Math.floor(f / 4) % 2 ? 10 : 4} 20 0`} fill="#6B2A2A" {...thin} />}
      </g>
    </g>
  );
};
