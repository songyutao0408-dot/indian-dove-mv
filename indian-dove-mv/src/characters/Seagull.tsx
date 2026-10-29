// 海鸥：在沙漠里格格不入，飞过时嘴里叼着薯条
import React from "react";
import { Eye, autoBlink, dl, ol, onTwos, thin } from "./parts";

const G = { body: "#F7F4EC", shade: "#DCD8CE", wing: "#A9B2BA", tip: "#2E2A30", beak: "#F2C14E", spot: "#D2475A", leg: "#E8A060", fry: "#F4C95D" };

export const Seagull: React.FC<{
  frame: number;
  pose?: "fly" | "stand";
  facing?: 1 | -1;
  fries?: boolean;
  seed?: number;
}> = ({ frame, pose = "fly", facing = 1, fries = true, seed = 11 }) => {
  const f = onTwos(frame);
  const t = f / 24;
  const b = autoBlink(frame, seed);
  const flap = pose === "fly" ? Math.sin(t * Math.PI * 2 * 1.8) : 0;

  const wing = (far: boolean) => {
    const a = far ? -flap * 50 - 10 : flap * 55;
    return (
      <g transform={`translate(${far ? 10 : -6} ${pose === "fly" ? -96 : -84}) rotate(${pose === "fly" ? a : -10})`}>
        <path
          d={pose === "fly" ? "M 0 0 C -40 -20 -90 -20 -150 -6 L -170 4 L -150 8 L -120 10 C -80 14 -30 16 0 10 Z" : "M 0 0 C -30 4 -60 20 -80 36 L -64 36 C -40 30 -14 22 0 14 Z"}
          fill={far ? "#8E979F" : G.wing}
          {...ol}
          transform={pose === "fly" ? `scale(1 ${far ? 1 : -1})` : undefined}
        />
        {pose === "fly" && <path d={`M -150 ${far ? -6 : 6} L -170 ${far ? 4 : -4} L -150 ${far ? 8 : -8} Z`} fill={G.tip} />}
      </g>
    );
  };

  return (
    <g transform={`scale(${facing} 1) translate(0 ${pose === "fly" ? -flap * 6 : 0})`}>
      {pose === "fly" && wing(true)}
      {pose === "stand" &&
        [-14, 12].map((x) => <path key={x} d={`M ${x} -50 L ${x} -4 M ${x} -4 l 14 2 M ${x} -4 l -8 4`} stroke={G.leg} strokeWidth={6} strokeLinecap="round" />)}
      {/* 尾巴 */}
      <path d={`M -60 ${pose === "fly" ? -100 : -80} L -110 ${pose === "fly" ? -104 : -64} L -96 ${pose === "fly" ? -88 : -54} L -56 ${pose === "fly" ? -84 : -66} Z`} fill={G.wing} {...ol} />
      {/* 身体 */}
      <ellipse cx={0} cy={pose === "fly" ? -96 : -84} rx={70} ry={pose === "fly" ? 30 : 40} fill={G.body} {...ol} />
      <path d={pose === "fly" ? "M -40 -78 Q 0 -66 40 -76" : "M -36 -58 Q 0 -46 36 -56"} fill="none" stroke={G.shade} strokeWidth={6} strokeLinecap="round" />
      {/* 头 */}
      <circle cx={66} cy={pose === "fly" ? -116 : -128} r={30} fill={G.body} {...ol} />
      <g transform={`translate(0 ${pose === "fly" ? 0 : -12})`}>
        {/* 嘴 + 红点 */}
        <path d="M 88 -116 L 136 -112 Q 140 -104 132 -100 L 90 -102 Z" fill={G.beak} {...dl} />
        <circle cx={124} cy={-104} r={4} fill={G.spot} />
        {fries && (
          <g>
            {/* 薯条从嘴里往前斜着支出来 */}
            {[
              [112, -108, 62],
              [116, -106, 78],
              [110, -104, 96],
            ].map(([x, y, r], i) => (
              <rect key={i} x={x - 5} y={y - 50} width={10} height={50} rx={2} fill={G.fry} {...thin} transform={`rotate(${r} ${x} ${y})`} />
            ))}
          </g>
        )}
        <Eye cx={74} cy={-124} rx={9} ry={10} lid={Math.max(0.45, b)} look={[0.4, 0]} pupil={0.45} lidColor={G.shade} />
        <path d="M 62 -138 L 86 -132" {...dl} strokeWidth={4} />
      </g>
      {pose === "fly" && wing(false)}
      {pose === "stand" && wing(false)}
    </g>
  );
};
