// 母斑鸠：身形纤细、羽毛蓬松柔顺、长睫毛、头上插一朵沙漠小花，走路扭来扭去
import React from "react";
import { Blush, Eye, HeartEye, autoBlink, dl, ol, onTwos, thin } from "./parts";

export type HenExpression = "calm" | "love" | "shy" | "happy" | "surprised";
export type HenPose = "stand" | "walk" | "sit" | "dance";

export const HEN = {
  body: "#B9A491",
  shade: "#A08A76",
  chest: "#E6CBC0",
  wing: "#A8927E",
  beak: "#E4AE62",
  leg: "#DC8670",
  petal: "#E8738F",
  petalDark: "#C9506F",
  flowerCenter: "#F2C14E",
};

const fluffy = (cx: number, cy: number, rx: number, ry: number, n: number, bump: number) => {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + rx * Math.cos(a);
    const y = cy + ry * Math.sin(a);
    if (i === 0) d += `M ${x} ${y} `;
    else {
      const am = ((i - 0.5) / n) * Math.PI * 2 - Math.PI / 2;
      d += `Q ${cx + (rx + bump) * Math.cos(am)} ${cy + (ry + bump) * Math.sin(am)} ${x} ${y} `;
    }
  }
  return d + "Z";
};

export const Hen: React.FC<{
  frame: number;
  expression?: HenExpression;
  pose?: HenPose;
  facing?: 1 | -1;
  blink?: number;
  look?: [number, number];
  beat?: number;
  seed?: number;
}> = ({ frame, expression = "calm", pose = "stand", facing = 1, blink, look, beat, seed = 1 }) => {
  const f = onTwos(frame);
  const t = f / 24;
  let sway = Math.sin(t * Math.PI * 0.8) * 2;
  let bodyY = 0;
  let liftL = 0;
  let liftR = 0;
  let hip = 0;
  let wing = 6;
  let legs = true;
  if (pose === "walk") {
    const ph = (f % 16) / 16;
    const s = Math.sin(ph * Math.PI * 2);
    hip = s * 10; // 扭来扭去
    sway = s * 7;
    bodyY = -Math.abs(Math.sin(ph * Math.PI * 2)) * 6;
    liftL = ph < 0.5 ? Math.sin(ph * 2 * Math.PI) * 12 : 0;
    liftR = ph >= 0.5 ? Math.sin((ph - 0.5) * 2 * Math.PI) * 12 : 0;
  } else if (pose === "dance") {
    const ph = beat ?? (t * 1.6) % 1;
    const s = Math.sin(ph * Math.PI * 2);
    hip = s * 12;
    sway = s * 9;
    bodyY = -Math.abs(Math.cos(ph * Math.PI)) * 16;
    wing = 30 + (s > 0 ? 50 : 0);
  } else if (pose === "sit") {
    legs = false;
    bodyY = 40;
  }

  const ex = expression;
  const b = blink ?? autoBlink(frame, seed);
  let lid = Math.max(0.28, b);
  let lk: [number, number] = look ?? [0.2, 0];
  if (ex === "shy") {
    lid = Math.max(0.6, b);
    lk = [0.1, 0.8];
  }
  if (ex === "surprised") lid = b * 0.5;
  const happy = ex === "happy";

  const Leg: React.FC<{ x: number; lift: number }> = ({ x, lift }) => (
    <g transform={`translate(${x} ${-lift})`}>
      <path d="M 0 -64 L 0 -4" stroke="#3A2418" strokeWidth={11} strokeLinecap="round" />
      <path d="M 0 -64 L 0 -4" stroke={HEN.leg} strokeWidth={6} strokeLinecap="round" />
      <path d="M 0 -3 L 18 -3 M 0 -3 L 11 5 M 0 -3 L -10 2" fill="none" stroke="#3A2418" strokeWidth={8} strokeLinecap="round" />
      <path d="M 0 -3 L 18 -3 M 0 -3 L 11 5 M 0 -3 L -10 2" fill="none" stroke={HEN.leg} strokeWidth={4} strokeLinecap="round" />
    </g>
  );

  const head = (
    <g transform={`rotate(${sway * 0.6} 20 -190)`}>
      {/* 沙漠小花 */}
      <g transform="translate(-14 -282) rotate(-18)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx={0} cy={-15} rx={10} ry={17} fill={HEN.petal} {...thin} transform={`rotate(${a})`} />
        ))}
        {[36, 108, 180, 252, 324].map((a) => (
          <ellipse key={a} cx={0} cy={-11} rx={6} ry={10} fill={HEN.petalDark} transform={`rotate(${a})`} />
        ))}
        <circle cx={0} cy={0} r={8} fill={HEN.flowerCenter} {...thin} />
        <path d="M 6 10 q 14 14 30 12" fill="none" stroke="#5E8C4A" strokeWidth={5} strokeLinecap="round" />
      </g>
      <path d={fluffy(20, -232, 54, 52, 12, 6)} fill={HEN.body} {...ol} />
      {/* 蓬松的头顶毛 */}
      <path d="M 6 -282 q -4 -16 8 -22 M 16 -284 q 4 -18 18 -18" fill="none" {...dl} />
      {ex === "love" ? (
        <>
          <HeartEye cx={6} cy={-236} s={18} frame={frame} />
          <HeartEye cx={46} cy={-234} s={15} frame={frame + 3} />
        </>
      ) : happy ? (
        <>
          <path d="M -8 -232 Q 6 -246 20 -232" fill="none" {...dl} strokeWidth={4.5} />
          <path d="M 34 -230 Q 46 -242 58 -230" fill="none" {...dl} strokeWidth={4.5} />
          <path d="M -8 -232 l -8 -8 M -2 -238 l -5 -10" {...thin} strokeWidth={3} />
        </>
      ) : (
        <>
          <Eye cx={6} cy={-236} rx={17} ry={21} lid={lid} look={lk} lidColor={HEN.shade} lashes={3} lashSide={-1} pupil={0.45} />
          <Eye cx={46} cy={-234} rx={14} ry={19} lid={lid} look={lk} lidColor={HEN.shade} lashes={3} lashSide={1} pupil={0.45} />
        </>
      )}
      <path d="M 66 -228 Q 86 -224 90 -214 Q 80 -208 66 -212 Z" fill={HEN.beak} {...dl} />
      {ex === "surprised" && <ellipse cx={74} cy={-206} rx={5} ry={6} fill="#6B2A2A" {...thin} />}
      {(ex === "love" || ex === "shy" || happy) && (
        <>
          <Blush cx={-6} cy={-210} rx={13} opacity={ex === "shy" ? 0.95 : 0.75} />
          <Blush cx={58} cy={-208} rx={11} opacity={ex === "shy" ? 0.95 : 0.75} />
        </>
      )}
    </g>
  );

  const body = (
    <g transform={`rotate(${hip} 0 -70)`}>
      {/* 长尾羽 */}
      <path d="M -40 -118 Q -110 -150 -150 -126 Q -112 -122 -92 -100 Q -128 -96 -146 -74 Q -96 -78 -48 -88 Z" fill={HEN.wing} {...ol} />
      {legs && (
        <>
          <Leg x={-20} lift={liftL} />
          <Leg x={18} lift={liftR} />
        </>
      )}
      <path d={fluffy(4, -128, 62, 76, 14, 7)} fill={HEN.body} {...ol} />
      <ellipse cx={22} cy={-120} rx={36} ry={52} fill={HEN.chest} />
      <path d="M 10 -100 q 5 5 10 0 q 5 5 10 0 M 18 -84 q 5 5 10 0" fill="none" {...thin} opacity={0.6} />
      <g transform={`translate(-22 -160) rotate(${wing})`}>
        <path d="M 0 0 C -28 10 -38 48 -28 82 L -20 72 L -14 86 L -6 74 C 10 50 12 20 0 0 Z" fill={HEN.wing} {...ol} />
      </g>
    </g>
  );

  return (
    <g transform={`scale(${facing} 1) translate(0 ${bodyY})`}>
      {body}
      {head}
    </g>
  );
};
