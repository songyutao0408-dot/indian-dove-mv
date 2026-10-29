// 主角：印第安老斑鸠
// 局部坐标：原点 = 两脚之间的地面，朝右（facing=1）。身高约 300（含头顶毛），腿约占 1/6。
import React from "react";
import { INK } from "../style/palette";
import {
  Blush, Bubble, DETAIL, Eye, HeartEye, MotionLines, QuestionMark, Smoke, SoundWaves, SpiralEye, StarsOrbit,
  TearFountain, Zzz, autoBlink, dl, ol, onTwos, thin, useSvgId,
} from "./parts";

export type DoveExpression =
  | "daze" // 发呆（默认）
  | "hungry" // 饿昏：眼冒金星、肚子咕咕叫
  | "loopy" // 秀逗：螺旋眼 + 傻笑
  | "sad" // 伤心：大泪滴喷出
  | "angry" // 生气：冒烟、羽毛竖起
  | "love" // 心动：心形眼、脸红
  | "talk" // 学人说话：嘴巴开合 + 对话气泡
  | "confused" // 困惑：问号
  | "sleep" // 睡觉：Zzz
  | "shock" // 惊吓：眼睛弹出
  | "happy" // 开心：眯眼
  | "yawn"; // 打哈欠

export type DovePose = "stand" | "walk" | "doze" | "flap" | "lie" | "dance" | "sit";

export type DoveProps = {
  frame: number;
  expression?: DoveExpression;
  pose?: DovePose;
  facing?: 1 | -1;
  /** 0–1，覆盖自动眨眼 */
  blink?: number;
  look?: [number, number];
  /** 对话气泡文字（talk） */
  text?: string;
  /** 跳舞时跟拍的相位 0–1（不给就按时间自己跳） */
  beat?: number;
  /** 0–1，哈欠张嘴程度（yawn） */
  open?: number;
  seed?: number;
};

export const DOVE = {
  body: "#9C8A78",
  bodyShade: "#857360",
  chest: "#C9A9A0",
  wing: "#8B7967",
  lid: "#857360",
  skin: "#D9B3A0",
  beak: "#D9A441",
  leg: "#D27A5E",
  red: "#C8402E",
  yellow: "#F2C14E",
};

const HEAD = { cx: 30, cy: -215, r: 66 };
/** 头部整体放大倍数（以脖子 NECK 为中心），特效位置要用 headPt 换算 */
const HEAD_SCALE = 1.15;
const NECK = { x: 30, y: -160 };
const headPt = (x: number, y: number): [number, number] => [NECK.x + (x - NECK.x) * HEAD_SCALE, NECK.y + (y - NECK.y) * HEAD_SCALE];

export const Dove: React.FC<DoveProps> = ({
  frame, expression = "daze", pose = "stand", facing = 1, blink, look, text = "Howdy～", beat, open, seed = 0,
}) => {
  const f = onTwos(frame);
  const t = f / 24;
  const featherClip = useSvgId("dovefeather");

  // ---------- 姿态 ----------
  let bodyY = 0;
  let bodyRot = 0;
  let sx = 1;
  let sy = 1;
  let liftL = 0;
  let liftR = 0;
  let wingRot = 8;
  let farWing = false;
  let headRot = 0;
  let headDy = 0;
  let legsVisible = true;
  let featherSway = Math.sin(t * 2.2) * 4;

  switch (pose) {
    case "stand": {
      const b = Math.sin(t * Math.PI);
      sy = 1 + 0.015 * b;
      sx = 1 - 0.01 * b;
      break;
    }
    case "walk": {
      const ph = (f % 12) / 12; // 半秒一个循环，一颠一颠
      const s = Math.sin(ph * Math.PI * 2);
      bodyY = -Math.abs(s) * 16;
      bodyRot = s * 5;
      liftL = ph < 0.5 ? Math.sin(ph * 2 * Math.PI) * 14 : 0;
      liftR = ph >= 0.5 ? Math.sin((ph - 0.5) * 2 * Math.PI) * 14 : 0;
      const contact = Math.abs(s) < 0.3 ? 1 : 0;
      sy = 1 - contact * 0.05;
      sx = 1 + contact * 0.04;
      wingRot = 8 + s * 6;
      featherSway = -s * 10;
      break;
    }
    case "doze": {
      // 头慢慢往下点，点到底猛地抬一下
      const cyc = (t % 3) / 3;
      headRot = cyc < 0.85 ? cyc * 22 : (1 - (cyc - 0.85) / 0.15) * 22;
      headDy = headRot * 0.6;
      sy = 0.97;
      sx = 1.03;
      break;
    }
    case "flap": {
      wingRot = 40 + Math.sin(t * Math.PI * 2 * 4) * 70;
      farWing = true;
      bodyY = -Math.abs(Math.sin(t * Math.PI * 2.5)) * 26;
      sy = 1 + Math.sin(t * Math.PI * 5) * 0.05;
      featherSway = Math.sin(t * Math.PI * 8) * 12;
      break;
    }
    case "dance": {
      const ph = beat ?? (t * 1.6) % 1;
      const s = Math.sin(ph * Math.PI * 2);
      bodyRot = s * 10;
      bodyY = -Math.abs(Math.cos(ph * Math.PI)) * 22;
      wingRot = 30 + (s > 0 ? 70 : 10);
      farWing = true;
      liftL = s > 0.3 ? 12 : 0;
      liftR = s < -0.3 ? 12 : 0;
      featherSway = -s * 14;
      break;
    }
    case "sit": {
      legsVisible = false;
      bodyY = 34;
      sy = 0.94;
      sx = 1.06;
      break;
    }
    case "lie":
      legsVisible = false; // 躺倒时腿单独画在肚皮上方，朝天
      break;
  }

  // ---------- 表情 → 眼睛参数 ----------
  const ex = expression;
  const autoB = blink ?? autoBlink(frame, seed);
  let lidL = 0.55;
  let lidR = 0.55;
  let tiltL = 6;
  let tiltR = -6;
  let lookL: [number, number] = look ?? [0.15, 0.25];
  let lookR: [number, number] = look ?? [0.15, 0.25];
  let pupil = 0.4;
  let beakOpen = 0;
  let eyesClosed = false;
  let happyEyes = false;
  let eyeScale = 1;
  let eyeLift = 0;

  switch (ex) {
    case "hungry":
      lidL = lidR = 0.42;
      lookL = [0.6, 0.1];
      lookR = [-0.6, 0.1];
      beakOpen = 0.25;
      bodyRot += Math.sin(t * 3) * 6;
      break;
    case "loopy":
      beakOpen = 0.55;
      headRot += Math.sin(t * 4) * 9;
      break;
    case "sad":
      eyesClosed = true;
      tiltL = -18;
      tiltR = 18;
      beakOpen = 0.8;
      break;
    case "angry":
      lidL = lidR = 0.42;
      tiltL = -24;
      tiltR = 24;
      pupil = 0.3;
      lookL = lookR = [0.3, 0.2];
      beakOpen = 0.3;
      break;
    case "love":
      beakOpen = 0.1;
      break;
    case "talk":
      lidL = lidR = 0.35;
      beakOpen = Math.floor(f / 4) % 2 ? 0.55 : 0.1;
      break;
    case "confused":
      lidL = 0.25;
      lidR = 0.6;
      lookL = lookR = [0.35, -0.7];
      headRot += 9;
      break;
    case "sleep":
      eyesClosed = true;
      beakOpen = 0.12;
      break;
    case "shock":
      lidL = lidR = 0;
      pupil = 0.18;
      lookL = lookR = [0, 0];
      eyeScale = 1.55;
      eyeLift = -26;
      beakOpen = 0.7;
      break;
    case "happy":
      happyEyes = true;
      beakOpen = 0.3;
      break;
    case "yawn":
      eyesClosed = true;
      beakOpen = 1.6 * (open ?? 1);
      sy *= 1 + 0.06 * (open ?? 1);
      break;
  }
  if (!eyesClosed && !happyEyes && ex !== "shock" && ex !== "loopy" && ex !== "love") {
    lidL = Math.max(lidL, autoB);
    lidR = Math.max(lidR, autoB);
  }
  if (pose === "doze" && ex === "daze") {
    lidL = lidR = Math.max(0.8, autoB);
  }
  const bristle = ex === "angry" || ex === "shock";

  // ---------- 身体部件 ----------
  const Leg: React.FC<{ x: number; lift: number }> = ({ x, lift }) => (
    <g transform={`translate(${x} ${-lift})`}>
      <rect x={-7} y={-52} width={14} height={48} rx={6} fill={DOVE.leg} {...dl} />
      <path d={`M -6 -3 L 22 -4 M -4 -3 L 14 6 M -6 -3 L -16 3`} fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />
      <path d={`M -6 -3 L 22 -4 M -4 -3 L 14 6 M -6 -3 L -16 3`} fill="none" stroke={DOVE.leg} strokeWidth={5} strokeLinecap="round" />
    </g>
  );

  const wingPath = "M 0 0 C -34 8 -50 52 -40 92 L -30 82 L -24 98 L -13 84 L -4 94 C 12 62 16 24 0 0 Z";
  const Wing: React.FC<{ rot: number }> = ({ rot }) => (
    <g transform={`rotate(${rot})`}>
      <path d={wingPath} fill={DOVE.wing} {...ol} />
      <path d="M -14 22 Q -24 50 -26 78 M -4 30 Q -8 56 -12 78" fill="none" {...thin} />
    </g>
  );

  const bodyRx = 92;
  const bodyRy = 82;
  const bodyCy = -122;
  const spikes = bristle
    ? Array.from({ length: 11 }, (_, i) => {
        const a = Math.PI + (i / 10) * Math.PI;
        const x = Math.cos(a) * bodyRx;
        const y = bodyCy + Math.sin(a) * bodyRy;
        const nx = Math.cos(a);
        const ny = Math.sin(a);
        const len = 18 + (i % 2) * 8;
        return `M ${x - ny * 9} ${y + nx * 9} L ${x + nx * len} ${y + ny * len} L ${x + ny * 9} ${y - nx * 9}`;
      })
    : [];

  // 喙
  const beakAng = Math.min(ex === "yawn" ? 80 : 48, beakOpen * (ex === "yawn" ? 50 : 30));
  // 打哈欠：卡通式大嘴——喙下面张开一个大口腔，下喙挂在嘴底
  const yawnK = ex === "yawn" ? Math.max(0, Math.min(1, open ?? 1)) : 0;
  const bigMouth =
    yawnK > 0.05 ? (
      <g>
        <ellipse cx={74} cy={-178 + 18 * yawnK} rx={14 + 22 * yawnK} ry={8 + 34 * yawnK} fill="#6B2A2A" {...dl} />
        <ellipse cx={74} cy={-170 + 40 * yawnK} rx={8 + 14 * yawnK} ry={4 + 10 * yawnK} fill="#E58C8C" />
        <path d={`M ${60 - 10 * yawnK} ${-160 + 52 * yawnK} L ${88 + 6 * yawnK} ${-160 + 52 * yawnK} Q ${80} ${-150 + 60 * yawnK} ${64} ${-152 + 58 * yawnK} Z`} fill={DOVE.beak} {...dl} />
      </g>
    ) : null;
  const beak = (
    <g>
      {bigMouth}
      {yawnK <= 0.05 && beakOpen > 0.05 && (
        <path d={`M 84 -200 L 108 -199 L ${86 + 22 * Math.cos((beakAng * Math.PI) / 180)} ${-200 + 22 * Math.sin((beakAng * Math.PI) / 180)} Z`} fill="#6B2A2A" />
      )}
      <g transform={`rotate(${beakAng} 86 -200)`} display={yawnK > 0.05 ? "none" : undefined}>
        <path d="M 84 -200 L 106 -200 Q 103 -189 88 -188 Z" fill={DOVE.beak} {...dl} />
        {(ex === "loopy" || ex === "yawn") && <ellipse cx={95} cy={-196} rx={7} ry={4} fill="#E58C8C" />}
      </g>
      <path d="M 82 -216 Q 104 -217 117 -204 Q 120 -194 111 -189 Q 110 -197 102 -200 L 84 -200 Z" fill={DOVE.beak} {...dl} />
      <circle cx={95} cy={-208} r={2.2} fill={INK} />
    </g>
  );

  // 眼睛
  const eL = { cx: 10, cy: -222 + eyeLift, rx: 19 * eyeScale, ry: 23 * eyeScale };
  const eR = { cx: 58 + (eyeScale - 1) * 14, cy: -220 + eyeLift, rx: 16 * eyeScale, ry: 21 * eyeScale };
  let eyes: React.ReactNode;
  if (ex === "loopy") {
    eyes = (
      <>
        <SpiralEye cx={eL.cx} cy={eL.cy} r={20} frame={frame} />
        <SpiralEye cx={eR.cx} cy={eR.cy} r={17} frame={frame} dir={-1} />
      </>
    );
  } else if (ex === "love") {
    eyes = (
      <>
        <HeartEye cx={eL.cx} cy={eL.cy} s={24} frame={frame} />
        <HeartEye cx={eR.cx} cy={eR.cy} s={20} frame={frame + 3} />
      </>
    );
  } else if (happyEyes) {
    eyes = (
      <>
        <path d={`M ${eL.cx - 16} ${eL.cy + 6} Q ${eL.cx} ${eL.cy - 14} ${eL.cx + 16} ${eL.cy + 6}`} fill="none" {...dl} strokeWidth={4.5} />
        <path d={`M ${eR.cx - 13} ${eR.cy + 6} Q ${eR.cx} ${eR.cy - 12} ${eR.cx + 13} ${eR.cy + 6}`} fill="none" {...dl} strokeWidth={4.5} />
      </>
    );
  } else {
    eyes = (
      <>
        <Eye {...eL} lid={eyesClosed ? 1 : lidL} lidTilt={tiltL} look={lookL} pupil={pupil} lidColor={DOVE.lid} />
        <Eye {...eR} lid={eyesClosed ? 1 : lidR} lidTilt={tiltR} look={lookR} pupil={pupil} lidColor={DOVE.lid} />
        {ex === "sad" && (
          <>
            <path d={`M ${eL.cx - 18} ${eL.cy - 30} L ${eL.cx + 14} ${eL.cy - 22}`} {...dl} strokeWidth={4} />
            <path d={`M ${eR.cx - 12} ${eR.cy - 22} L ${eR.cx + 14} ${eR.cy - 30}`} {...dl} strokeWidth={4} />
          </>
        )}
      </>
    );
  }
  // 眼袋（没睡醒）
  const bags =
    ex === "daze" || ex === "hungry" || ex === "talk" || ex === "confused" ? (
      <g opacity={0.8}>
        <path d={`M ${eL.cx - 13} ${eL.cy + 27} q 13 7 26 0`} fill="none" {...thin} />
        <path d={`M ${eR.cx - 10} ${eR.cy + 25} q 10 6 21 0`} fill="none" {...thin} />
      </g>
    ) : null;

  // 头上的长羽毛（红黄相间）
  const featherPath = "M 0 0 C -16 -30 -18 -80 0 -122 C 18 -80 16 -30 0 0 Z";
  const feather = (
    <g transform={`translate(-14 -262) rotate(${-28 + featherSway})`}>
      <defs>
        <clipPath id={featherClip}>
          <path d={featherPath} />
        </clipPath>
      </defs>
      <path d={featherPath} fill={DOVE.red} />
      <g clipPath={`url(#${featherClip})`}>
        {[-26, -52, -78, -104].map((y, i) => (
          <rect key={i} x={-20} y={y - 11} width={40} height={11} fill={DOVE.yellow} />
        ))}
        <rect x={-20} y={-124} width={40} height={10} fill={INK} />
      </g>
      <path d={featherPath} fill="none" {...dl} />
      <path d="M 0 6 L 0 -112" {...thin} />
    </g>
  );

  // 头带
  const band = (
    <g>
      <path d="M -30 -246 Q 30 -268 90 -244 L 92 -230 Q 30 -253 -32 -232 Z" fill={DOVE.red} {...dl} />
      <path d="M -18 -244 l 10 -8 l 10 8 l 10 -8 l 10 8 l 10 -8 l 10 8 l 10 -8 l 10 8 l 10 -8 l 10 8" fill="none" stroke={DOVE.yellow} strokeWidth={3} transform="translate(0 4)" />
      {/* 脑后绳结 + 两条飘带 */}
      <circle cx={-34} cy={-239} r={7} fill={DOVE.red} {...dl} />
      <path d={`M -36 -236 q -16 14 -12 ${34 + featherSway} M -38 -238 q -26 4 -34 ${26 + featherSway * 0.6}`} fill="none" stroke={DOVE.red} strokeWidth={7} strokeLinecap="round" />
    </g>
  );

  const hairs = bristle ? (
    <g fill="none" {...dl} strokeWidth={3.5}>
      <path d="M 26 -279 L 18 -335" />
      <path d="M 38 -281 L 40 -342" />
      <path d="M 50 -279 L 64 -334" />
    </g>
  ) : (
    <g fill="none" {...dl} strokeWidth={3.5} transform={`rotate(${featherSway * 0.4} 38 -280)`}>
      <path d="M 26 -279 q -14 -26 2 -46 q 6 -6 10 2" />
      <path d="M 38 -281 q 0 -34 16 -50 q 6 -4 8 4" />
      <path d="M 50 -279 q 14 -22 34 -26 q 6 0 4 7" />
    </g>
  );

  const necklace = (() => {
    const beads = [];
    const n = 11;
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      const x = (1 - u) * (1 - u) * -26 + 2 * (1 - u) * u * 34 + u * u * 94;
      const y = (1 - u) * (1 - u) * -166 + 2 * (1 - u) * u * -116 + u * u * -168;
      beads.push(<circle key={i} cx={x} cy={y} r={i === 5 ? 9 : 7} fill={i === 5 ? "#3FA39A" : i % 2 ? "#B5683E" : "#E9C48F"} {...thin} />);
    }
    return <g>{beads}</g>;
  })();

  const body = (
    <g>
      {/* 远侧翅膀（扑腾时露出来） */}
      {farWing && (
        <g transform={`translate(52 -164) scale(-1 1)`}>
          <Wing rot={wingRot * 0.9} />
        </g>
      )}
      {/* 尾巴（躺倒时压在身子底下，不画） */}
      <g display={pose === "lie" ? "none" : undefined}>
        <path d="M -78 -112 L -142 -150 Q -150 -138 -138 -128 Z" fill={DOVE.wing} {...ol} />
        <path d="M -82 -104 L -152 -116 Q -152 -100 -138 -98 Z" fill={DOVE.wing} {...ol} />
        <path d="M -80 -94 L -140 -78 Q -134 -64 -122 -70 Z" fill={DOVE.wing} {...ol} />
      </g>
      {legsVisible && (
        <>
          <Leg x={-30} lift={liftL} />
          <Leg x={26} lift={liftR} />
        </>
      )}
      {spikes.length > 0 && <path d={spikes.join(" ")} fill={DOVE.body} {...dl} />}
      <ellipse cx={0} cy={bodyCy} rx={bodyRx} ry={bodyRy} fill={DOVE.body} {...ol} />
      {/* 体积阴影 */}
      <path d={`M -88 -100 Q -70 -40 0 -41 Q -60 -60 -88 -100 Z`} fill={DOVE.bodyShade} />
      {/* 胸口 */}
      <ellipse cx={32} cy={-112} rx={50} ry={56} fill={DOVE.chest} />
      <path d="M 12 -78 q 6 6 12 0 q 6 6 12 0 M 30 -60 q 6 6 12 0 q 6 6 12 0" fill="none" {...thin} opacity={0.7} />
      {/* 秃斑 */}
      {[
        [-52, -152, 15, 10],
        [-22, -70, 11, 8],
        [58, -150, 9, 7],
      ].map(([x, y, rx, ry], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={DOVE.skin} {...thin} strokeWidth={2} />
          <path d={`M ${x - rx * 0.5} ${y - 1} l -2 -4 M ${x} ${y + 1} l 0 -5 M ${x + rx * 0.5} ${y} l 2 -4`} {...thin} strokeWidth={1.6} />
        </g>
      ))}
      {/* 稀疏的羽毛线 */}
      <path d="M -60 -118 q 8 8 16 0 M -40 -98 q 8 8 16 0 M -66 -86 q 6 6 12 0" fill="none" {...thin} opacity={0.65} />
      <g transform="translate(-36 -152)">
        <Wing rot={wingRot} />
      </g>
      {necklace}
    </g>
  );

  const head = (
    <g transform={`translate(0 ${headDy}) rotate(${headRot} 30 -160) translate(${NECK.x} ${NECK.y}) scale(${HEAD_SCALE}) translate(${-NECK.x} ${-NECK.y})`}>
      {feather}
      <circle cx={HEAD.cx} cy={HEAD.cy} r={HEAD.r} fill={ex === "angry" ? "#B07C6A" : DOVE.body} {...ol} />
      <ellipse cx={4} cy={-266} rx={10} ry={6} fill={DOVE.skin} {...thin} strokeWidth={2} />
      {band}
      {hairs}
      {eyes}
      {bags}
      {beak}
      {(ex === "love" || ex === "happy") && (
        <>
          <Blush cx={-6} cy={-188} rx={14} />
          <Blush cx={74} cy={-186} rx={12} />
        </>
      )}
    </g>
  );

  // ---------- 特效 ----------
  const [eLx, eLy] = headPt(eL.cx, eL.cy);
  const [eRx, eRy] = headPt(eR.cx, eR.cy);
  const top = headPt(30, -281)[1]; // 头顶
  const fx = (
    <g transform={`rotate(${headRot} 30 -160)`}>
      {ex === "hungry" && (
        <>
          <StarsOrbit cx={34} cy={top + 8} rx={100} frame={frame} n={5} />
          <SoundWaves x={92} y={-98} dir={1} frame={frame} />
        </>
      )}
      {ex === "sad" && (
        <>
          <TearFountain x={eLx - 18} y={eLy + 4} dir={-1} frame={frame} />
          <TearFountain x={eRx + 16} y={eRy + 4} dir={1} frame={frame + 5} />
        </>
      )}
      {ex === "angry" && (
        <>
          <Smoke x={8} y={top - 20} frame={frame} />
          <Smoke x={62} y={top - 20} frame={frame + 9} />
        </>
      )}
      {ex === "talk" && <Bubble x={110} y={top - 150} w={250} h={100} tail={[112, top + 30]} text={text} fontSize={44} flip={facing === -1} />}
      {ex === "confused" && <QuestionMark x={140} y={top - 10} frame={frame} />}
      {(ex === "sleep" || (pose === "doze" && ex === "daze")) && <Zzz x={100} y={top} frame={frame} />}
      {ex === "shock" && (
        <>
          <MotionLines x={-70} y={eLy - 50} dir={-1} n={3} len={40} />
          <MotionLines x={132} y={eRy - 50} dir={1} n={3} len={40} />
        </>
      )}
      {pose === "flap" &&
        [0, 1, 2].map((i) => {
          const tt = (t * 0.7 + i / 3) % 1;
          return (
            <path
              key={i}
              d="M 0 0 C -6 -8 -6 -20 0 -28 C 6 -20 6 -8 0 0 Z"
              fill={DOVE.wing}
              {...thin}
              transform={`translate(${-60 + i * 60 + Math.sin(tt * 9 + i) * 20} ${-150 + tt * 140}) rotate(${tt * 240 + i * 50})`}
              opacity={1 - tt}
            />
          );
        })}
    </g>
  );

  let inner = (
    <g transform={`translate(0 ${bodyY}) rotate(${bodyRot} 0 -40)`}>
      <g transform={`scale(${sx} ${sy})`}>
        {body}
        {head}
      </g>
      {fx}
    </g>
  );
  if (pose === "lie") {
    // 仰面躺倒：背贴地、肚皮朝上、短腿朝天；特效按世界方向画，不跟着身体转
    inner = (
      <g>
        <g transform="translate(40 -2) rotate(-90 0 -95)">
          <g>
            {body}
            {head}
          </g>
        </g>
        {/* 小短腿朝天，偶尔蹬一下 */}
        <g transform={`translate(-6 ${-226 - (Math.floor(f / 10) % 3 === 0 ? 6 : 0)}) rotate(180)`}>
          <Leg x={0} lift={0} />
        </g>
        <g transform="translate(40 -222) rotate(172)">
          <Leg x={0} lift={0} />
        </g>
        {(ex === "sleep" || ex === "daze") && <Zzz x={-40} y={-250} frame={frame} />}
      </g>
    );
  }
  return <g transform={`scale(${facing} 1)`}>{inner}</g>;
};

/** 线宽常量导出给场景用（例如描边一致性检查） */
export const DOVE_LINE = DETAIL;
