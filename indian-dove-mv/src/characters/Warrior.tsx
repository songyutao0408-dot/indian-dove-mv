// 印第安战士（决斗对手）：经典西部片造型——头带羽毛、脸上画油彩、流苏皮衣、手持弓箭
import React from "react";
import { INK } from "../style/palette";
import { Limb } from "./limb";
import { Eye, autoBlink, dl, ol, onTwos, thin } from "./parts";

export type WarriorPose = "stand" | "walk" | "back" | "dance";

const R = {
  skin: "#B9744E",
  skinDark: "#97593A",
  hair: "#241C1C",
  hide: "#CDA06A",
  hideDark: "#A87A48",
  legging: "#9E7046",
  bead1: "#3FA39A",
  bead2: "#C8402E",
  bead3: "#F6E7C8",
  feather: "#F6F1E6",
  featherTip: "#2A2222",
  bow: "#8E5A34",
  paintRed: "#C8402E",
};

export const Warrior: React.FC<{
  frame: number;
  pose?: WarriorPose;
  facing?: 1 | -1;
  beat?: number;
  seed?: number;
}> = ({ frame, pose = "stand", facing = 1, beat, seed = 13 }) => {
  const f = onTwos(frame);
  const t = f / 24;
  const b = autoBlink(frame, seed);
  const back = pose === "back";
  let stepL = 0;
  let stepR = 0;
  let bob = 0;
  if (pose === "walk" || pose === "back") {
    const s = Math.sin(((f % 24) / 24) * Math.PI * 2);
    stepL = s * 18;
    stepR = -s * 18;
    bob = -Math.abs(s) * 6;
  } else if (pose === "dance") {
    const ph = beat ?? (t * 1.6) % 1;
    const s = Math.sin(ph * Math.PI * 2);
    stepL = s > 0 ? 28 : 0;
    stepR = s < 0 ? -28 : 0;
    bob = -Math.abs(Math.cos(ph * Math.PI)) * 14;
  }
  const featherSway = Math.sin(t * 2) * 5;

  const leg = (x: number, step: number) => (
    <g transform={`rotate(${step} ${x} -190)`}>
      <Limb d={`M ${x} -190 L ${x} -16`} color={R.legging} w={34} />
      {Array.from({ length: 5 }, (_, i) => (
        <path key={i} d={`M ${x + (x < 0 ? -18 : 18)} ${-170 + i * 26} l ${x < 0 ? -12 : 12} 6`} stroke={R.hideDark} strokeWidth={5} strokeLinecap="round" />
      ))}
      {/* 鹿皮软鞋 */}
      <path d={`M ${x - 20} -22 Q ${x - 22} 2 ${x} 2 L ${x + 30} 2 Q ${x + 40} -6 ${x + 24} -14 L ${x + 18} -24 Z`} fill={R.hide} {...dl} />
      <path d={`M ${x - 6} -10 l 6 -4 l 6 4 l 6 -4`} fill="none" stroke={R.bead1} strokeWidth={3} />
    </g>
  );

  return (
    <g transform={`scale(${facing} 1) translate(0 ${bob})`}>
      {/* 背上的箭筒 */}
      <g transform="translate(-40 -300) rotate(-24)">
        <rect x={-14} y={0} width={28} height={110} rx={8} fill={R.hideDark} {...dl} />
        {[-6, 2, 10].map((x, i) => (
          <g key={i}>
            <path d={`M ${x} 4 L ${x} -30`} {...thin} />
            <path d={`M ${x} -30 l -6 -12 l 6 4 l 6 -4 Z`} fill={R.feather} {...thin} strokeWidth={1.5} />
          </g>
        ))}
      </g>
      {!back && <path d="M -46 -360 C -54 -300 -50 -270 -40 -250 L 40 -250 C 50 -280 52 -320 46 -360 Z" fill={R.hair} {...dl} />}
      {leg(-22, stepL)}
      {leg(24, stepR)}
      {/* 流苏皮衣 */}
      <path d="M -52 -170 C -60 -240 -54 -292 -30 -306 L 34 -306 C 58 -292 64 -240 56 -170 Z" fill={R.hide} {...ol} />
      {Array.from({ length: 11 }, (_, i) => (
        <path key={i} d={`M ${-48 + i * 10} -172 l ${(i % 2) * 2 - 1} 18`} stroke={R.hideDark} strokeWidth={5} strokeLinecap="round" />
      ))}
      {!back && (
        <>
          {/* 胸前的串珠带 */}
          <path d="M -40 -268 Q 2 -250 44 -268 L 44 -256 Q 2 -238 -40 -256 Z" fill={R.bead3} {...dl} />
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={-36 + i * 10} y={-262 + Math.abs(i - 3.5) * -1.6} width={8} height={7} fill={i % 2 ? R.bead1 : R.bead2} />
          ))}
        </>
      )}
      {/* 腰带 */}
      <rect x={-54} y={-206} width={112} height={14} fill={R.bead2} {...dl} />
      {/* 胳膊：左手握弓 */}
      <Limb d="M -44 -290 Q -70 -250 -64 -206" color={R.hide} w={24} />
      <circle cx={-64} cy={-200} r={13} fill={R.skin} {...dl} />
      <Limb d="M 46 -290 Q 70 -250 62 -206" color={R.hide} w={24} />
      <circle cx={62} cy={-200} r={13} fill={R.skin} {...dl} />
      {/* 弓 */}
      <g transform="translate(-66 -200)">
        <path d="M -6 -120 Q 46 0 -6 120" fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" />
        <path d="M -6 -120 Q 46 0 -6 120" fill="none" stroke={R.bow} strokeWidth={6} strokeLinecap="round" />
        <path d="M -6 -120 L -6 120" stroke={INK} strokeWidth={1.5} />
        <rect x={10} y={-12} width={10} height={24} fill={R.bead2} {...thin} />
      </g>
      {back && <path d="M -46 -360 C -54 -290 -50 -250 -40 -226 L 40 -226 C 50 -260 52 -320 46 -360 Z" fill={R.hair} {...dl} />}
      {/* 头 */}
      <rect x={-14} y={-324} width={30} height={22} fill={R.skin} {...dl} />
      <ellipse cx={2} cy={-356} rx={40} ry={46} fill={R.skin} {...ol} />
      {!back ? (
        <>
          {/* 刘海 / 中分 */}
          <path d="M -40 -362 C -40 -400 40 -408 44 -362 C 30 -384 12 -390 2 -380 C -10 -390 -30 -384 -40 -362 Z" fill={R.hair} {...dl} />
          {/* 两条辫子 */}
          {[-36, 40].map((x, i) => (
            <g key={x}>
              <path d={`M ${x} -340 L ${x + (i ? 4 : -4)} -250`} stroke={INK} strokeWidth={18} strokeLinecap="round" />
              <path d={`M ${x} -340 L ${x + (i ? 4 : -4)} -250`} stroke={R.hair} strokeWidth={12} strokeLinecap="round" strokeDasharray="10 4" />
              <rect x={x + (i ? 4 : -4) - 8} y={-290} width={16} height={12} fill={R.bead2} {...thin} />
            </g>
          ))}
          {/* 油彩：两道横纹 */}
          <path d="M -26 -340 L 0 -340 M 24 -340 L 40 -340" stroke={R.paintRed} strokeWidth={6} strokeLinecap="round" />
          <path d="M -26 -330 L 0 -330 M 24 -330 L 40 -330" stroke={R.bead3} strokeWidth={5} strokeLinecap="round" />
          <Eye cx={-6} cy={-358} rx={9} ry={9} lid={Math.max(0.4, b)} lidTilt={-10} pupil={0.5} look={[0.3, 0]} lidColor={R.skinDark} />
          <Eye cx={24} cy={-358} rx={8} ry={9} lid={Math.max(0.4, b)} lidTilt={-10} pupil={0.5} look={[0.3, 0]} lidColor={R.skinDark} />
          <path d="M -18 -374 L 4 -368 M 14 -368 L 36 -374" fill="none" {...dl} strokeWidth={5} />
          <path d="M 18 -356 Q 32 -344 22 -336" fill="none" {...dl} />
          <path d="M 2 -318 L 28 -318" {...dl} />
        </>
      ) : (
        <path d="M -40 -362 C -44 -410 46 -414 44 -362 C 46 -330 40 -300 30 -290 L -26 -290 C -38 -300 -42 -330 -40 -362 Z" fill={R.hair} {...dl} />
      )}
      {/* 头带 + 羽毛 */}
      <path d="M -42 -376 Q 2 -392 46 -376 L 46 -364 Q 2 -380 -42 -364 Z" fill={R.bead1} {...dl} />
      {[-4, 8, 20].map((r, i) => (
        <g key={i} transform={`translate(${-26 + i * 8} -380) rotate(${-30 + r + featherSway})`}>
          <path d="M 0 0 C -10 -30 -8 -66 0 -86 C 8 -66 10 -30 0 0 Z" fill={R.feather} {...dl} />
          <path d="M 0 -64 C -6 -72 -4 -80 0 -86 C 4 -80 6 -72 0 -64 Z" fill={R.featherTip} />
          <path d="M 0 0 L 0 -78" {...thin} strokeWidth={1.5} />
        </g>
      ))}
    </g>
  );
};
