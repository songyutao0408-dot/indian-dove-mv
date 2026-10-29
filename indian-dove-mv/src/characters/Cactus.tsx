// 害羞的仙人掌：有脸、会脸红，被看时用两只「胳膊」捂住脸，扭身躲开
import React from "react";
import { INK } from "../style/palette";
import { Blush, Eye, autoBlink, dl, ol, onTwos, thin } from "./parts";

export type CactusPose = "idle" | "shy" | "peek" | "dance";

const K = { body: "#5E8C4A", dark: "#3F6634", light: "#7FA866", flower: "#E8738F", spine: "#F6E7C8" };

export const Cactus: React.FC<{
  frame: number;
  pose?: CactusPose;
  /** 0–1，脸红程度（shy 时自动拉满） */
  blush?: number;
  beat?: number;
  seed?: number;
  /** 夜晚/远景时可以只画剪影 */
  color?: string;
}> = ({ frame, pose = "idle", blush, beat, seed = 6, color }) => {
  const f = onTwos(frame);
  const t = f / 24;
  const b = autoBlink(frame, seed);
  const shy = pose === "shy";
  const peek = pose === "peek";
  const body = color ?? K.body;

  // 胳膊角度：idle 举着，shy 弯过来捂脸
  let armL = 0; // 0 = 举起，1 = 捂脸
  let armR = 0;
  let twist = Math.sin(t * 1.2) * 1.5;
  let squash = 1;
  if (shy) {
    armL = armR = 1;
    twist = -8 + Math.sin(t * 6) * 3; // 扭身躲开
    squash = 0.97;
  } else if (peek) {
    armL = 1;
    armR = 0.35;
    twist = -5;
  } else if (pose === "dance") {
    const ph = beat ?? (t * 1.6) % 1;
    const s = Math.sin(ph * Math.PI * 2);
    twist = s * 10;
    armL = 0;
    armR = 0;
  }
  const bl = blush ?? (shy ? 1 : peek ? 0.8 : 0);

  // 胳膊：从躯干两侧伸出的 L 形（举起）→ 弯到脸前（捂脸）
  const arm = (side: 1 | -1, k: number) => {
    const sx = side * 58;
    const sy = -190;
    // 举起时：先向外 50 再向上 80；捂脸时：向内弯到脸前
    const ex0 = side * 112;
    const ey0 = -290;
    const ex1 = side * 18;
    const ey1 = -282;
    const cx0 = side * 112;
    const cy0 = -190;
    const cx1 = side * 90;
    const cy1 = -230;
    const ex = ex0 + (ex1 - ex0) * k;
    const ey = ey0 + (ey1 - ey0) * k;
    const cx = cx0 + (cx1 - cx0) * k;
    const cy = cy0 + (cy1 - cy0) * k;
    const d = `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;
    const danceWave = pose === "dance" ? Math.sin(t * 8 + side) * 8 : 0;
    return (
      <g transform={`rotate(${danceWave} ${sx} ${sy})`}>
        <path d={d} fill="none" stroke={INK} strokeWidth={50} strokeLinecap="round" />
        <path d={d} fill="none" stroke={body} strokeWidth={40} strokeLinecap="round" />
        <path d={d} fill="none" stroke={K.dark} strokeWidth={3} strokeLinecap="round" transform={`translate(${side * 6} 0)`} opacity={0.6} />
        {/* 刺 */}
        {[0.3, 0.6, 0.9].map((u, i) => {
          const px = (1 - u) * (1 - u) * sx + 2 * (1 - u) * u * cx + u * u * ex;
          const py = (1 - u) * (1 - u) * sy + 2 * (1 - u) * u * cy + u * u * ey;
          return <path key={i} d={`M ${px + side * 18} ${py} l ${side * 9} -4`} stroke={K.spine} strokeWidth={2.5} strokeLinecap="round" />;
        })}
      </g>
    );
  };

  return (
    <g transform={`rotate(${twist} 0 0) scale(1 ${squash})`}>
      {/* 躯干 */}
      <path d="M -62 0 L -62 -300 C -62 -350 62 -350 62 -300 L 62 0 Z" fill={body} {...ol} />
      {/* 纵向棱 */}
      {[-34, 0, 34].map((x) => (
        <path key={x} d={`M ${x} -10 L ${x} ${-300 - (x === 0 ? 28 : 18)}`} stroke={K.dark} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      ))}
      <path d="M 40 -20 L 40 -300" stroke={K.light} strokeWidth={6} strokeLinecap="round" opacity={0.5} />
      {/* 刺 */}
      {Array.from({ length: 14 }, (_, i) => {
        const x = [-50, -17, 17, 50][i % 4];
        const y = -40 - Math.floor(i / 4) * 66 - (i % 2) * 22;
        return <path key={i} d={`M ${x} ${y} l -6 -6 M ${x} ${y} l 6 -6`} stroke={K.spine} strokeWidth={2.5} strokeLinecap="round" />;
      })}
      {/* 头顶小花 */}
      <g transform="translate(14 -332)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx={0} cy={-10} rx={7} ry={11} fill={K.flower} {...thin} transform={`rotate(${a})`} />
        ))}
        <circle r={6} fill="#F2C14E" {...thin} />
      </g>
      {/* 脸 */}
      <g>
        {shy ? (
          <>
            <path d="M -34 -262 q 12 8 24 0" fill="none" {...dl} strokeWidth={4} />
            <path d="M 10 -262 q 12 8 24 0" fill="none" {...dl} strokeWidth={4} />
          </>
        ) : (
          <>
            <Eye cx={-22} cy={-262} rx={14} ry={17} lid={peek ? Math.max(0.35, b) : b} look={peek ? [0.6, 0.2] : [0, 0.1]} lidColor={K.dark} lashes={2} lashSide={-1} />
            <Eye cx={22} cy={-262} rx={14} ry={17} lid={peek ? Math.max(0.35, b) : b} look={peek ? [0.6, 0.2] : [0, 0.1]} lidColor={K.dark} lashes={2} lashSide={1} />
          </>
        )}
        {bl > 0 && (
          <>
            <Blush cx={-38} cy={-232} rx={16} opacity={bl * 0.9} />
            <Blush cx={38} cy={-232} rx={16} opacity={bl * 0.9} />
          </>
        )}
        <path d={shy ? "M -10 -222 q 10 -6 20 0" : "M -12 -226 q 12 10 24 0"} fill="none" {...dl} />
      </g>
      {arm(-1, armL)}
      {arm(1, armR)}
      {/* 捂脸时的手掌（圆头） */}
      {shy && <path d="M -46 -300 q 20 -12 40 0 M 6 -300 q 20 -12 40 0" fill="none" stroke={K.dark} strokeWidth={3} opacity={0.6} />}
      {shy && [[-70, -330], [72, -334], [-80, -300]].map(([x, y], i) => (
        <path key={i} d={`M ${x} ${y} l ${x > 0 ? 10 : -10} -10`} stroke="#E9827A" strokeWidth={4} strokeLinecap="round" />
      ))}
    </g>
  );
};
