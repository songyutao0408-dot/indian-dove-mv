// 响尾蛇：热到瘫软、舌头耷拉、满身汗珠，尾巴有气无力地摇响
import React from "react";
import { INK } from "../style/palette";
import { Eye, Sweat, Zzz, autoBlink, dl, ol, onTwos, thin } from "./parts";

export type SnakeExpression = "hot" | "cool" | "sleep" | "happy";
export type SnakePose = "limp" | "coiled";

const S = { body: "#C9A15E", belly: "#EAD3A0", diamond: "#8E6A3A", diamondIn: "#B48A4C", rattle: "#E6CF9A", tongue: "#D2475A" };

export const Snake: React.FC<{
  frame: number;
  expression?: SnakeExpression;
  pose?: SnakePose;
  facing?: 1 | -1;
  seed?: number;
}> = ({ frame, expression = "hot", pose = "limp", facing = 1, seed = 3 }) => {
  const f = onTwos(frame);
  const t = f / 24;
  const hot = expression === "hot";

  // 身体中线
  const pts: [number, number][] = [];
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    if (pose === "limp") {
      const x = -190 + u * 360;
      const amp = hot ? 10 : 22;
      const y = -20 - Math.sin(u * Math.PI * 2.2 + t * (hot ? 0.6 : 1.5)) * amp * (0.4 + u * 0.6);
      pts.push([x, y]);
    } else {
      // 盘起来，前半身抬起
      const a = u * Math.PI * 2.6;
      const r = 90 - u * 40;
      if (u < 0.7) pts.push([Math.cos(a) * r, -24 - Math.sin(a) * r * 0.28]);
      else {
        const v = (u - 0.7) / 0.3;
        pts.push([Math.cos(Math.PI * 2.6 * 0.7) * 62 + v * 50 + Math.sin(t * 2) * 6 * v, -40 - v * 150]);
      }
    }
  }
  const path = "M " + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ");
  const head = pts[pts.length - 1];
  const prev = pts[pts.length - 3];
  const ang = (Math.atan2(head[1] - prev[1], head[0] - prev[0]) * 180) / Math.PI;
  const tail = pts[0];
  const rattleShake = Math.sin(f * (hot ? 0.5 : 2)) * (hot ? 4 : 12);
  const b = autoBlink(frame, seed);

  return (
    <g transform={`scale(${facing} 1)`}>
      {/* 尾巴的响环 */}
      <g transform={`translate(${tail[0]} ${tail[1]}) rotate(${180 + rattleShake})`}>
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={i} cx={10 + i * 14} cy={0} rx={10 - i} ry={13 - i * 1.5} fill={S.rattle} {...dl} />
        ))}
        {!hot && <path d="M 70 -18 l 10 -8 M 74 0 l 14 0 M 70 18 l 10 8" {...dl} />}
      </g>
      <path d={path} fill="none" stroke={INK} strokeWidth={44} strokeLinecap="round" strokeLinejoin="round" />
      <path d={path} fill="none" stroke={S.body} strokeWidth={36} strokeLinecap="round" strokeLinejoin="round" />
      <path d={path} fill="none" stroke={S.belly} strokeWidth={10} strokeLinecap="round" transform="translate(0 10)" opacity={pose === "limp" ? 0.9 : 0} />
      {/* 菱形花纹 */}
      {pts.filter((_, i) => i % 3 === 1 && i < N - 3).map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y - 4})`}>
          <path d="M -10 0 L 0 -10 L 10 0 L 0 10 Z" fill={S.diamond} {...thin} strokeWidth={1.5} />
          <path d="M -4 0 L 0 -4 L 4 0 L 0 4 Z" fill={S.diamondIn} />
        </g>
      ))}
      {/* 头 */}
      <g transform={`translate(${head[0]} ${head[1]}) rotate(${pose === "limp" ? (hot ? 8 : ang * 0.3) : -6 + Math.sin(t * 2) * 4}) scale(1.3)`}>
        <g transform={pose === "coiled" ? "translate(-8 4)" : undefined}>
          <path d="M -14 -24 C 30 -40 72 -26 78 -2 C 74 18 30 28 -14 22 Z" fill={S.body} {...ol} />
          <path d="M 30 -26 l 6 8 l 6 -9 l 6 8" fill="none" {...thin} />
          {expression === "sleep" ? (
            <>
              <path d="M 22 -14 q 10 6 20 0" fill="none" {...dl} strokeWidth={4} />
              <path d="M 46 -12 q 9 5 18 0" fill="none" {...dl} strokeWidth={4} />
            </>
          ) : expression === "happy" ? (
            <>
              <path d="M 22 -10 q 10 -12 20 0" fill="none" {...dl} strokeWidth={4} />
              <path d="M 46 -8 q 9 -10 18 0" fill="none" {...dl} strokeWidth={4} />
            </>
          ) : (
            <>
              <Eye cx={32} cy={-12} rx={12} ry={13} lid={hot ? Math.max(0.62, b) : Math.max(0.3, b)} look={hot ? [0.2, 0.6] : [0.4, 0]} lidColor="#B48A4C" />
              <Eye cx={56} cy={-10} rx={10} ry={12} lid={hot ? Math.max(0.62, b) : Math.max(0.3, b)} look={hot ? [0.2, 0.6] : [0.4, 0]} lidColor="#B48A4C" />
            </>
          )}
          <circle cx={74} cy={-4} r={2} fill={INK} />
          {/* 嘴 / 耷拉的舌头 */}
          {hot ? (
            <g>
              <path d="M 50 12 Q 64 10 76 6" fill="none" {...dl} />
              <path d={`M 66 10 Q 70 ${40 + Math.sin(t * 2) * 4} 62 ${54 + Math.sin(t * 2) * 4} M 66 10 Q 76 ${40 + Math.sin(t * 2) * 4} 80 ${52 + Math.sin(t * 2) * 4}`} fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
              <path d={`M 66 10 Q 70 ${40 + Math.sin(t * 2) * 4} 62 ${54 + Math.sin(t * 2) * 4} M 66 10 Q 76 ${40 + Math.sin(t * 2) * 4} 80 ${52 + Math.sin(t * 2) * 4}`} fill="none" stroke={S.tongue} strokeWidth={4} strokeLinecap="round" />
            </g>
          ) : (
            <path d="M 46 12 Q 62 18 76 6" fill="none" {...dl} />
          )}
        </g>
      </g>
      {/* 汗珠 + 热气线 */}
      {hot && (
        <g>
          {[-140, -60, 30, 110].map((x, i) => (
            <Sweat key={i} x={x} y={-56} frame={frame + i * 7} seed={i} s={0.9} />
          ))}
          <Sweat x={head[0] + 20} y={head[1] - 40} frame={frame + 4} seed={9} />
          {[-120, -20, 80].map((x, i) => (
            <path
              key={i}
              d={`M ${x} -70 q 10 -12 0 -24 q -10 -12 0 -24 q 10 -12 0 -24`}
              fill="none"
              stroke="#F6E7C8"
              strokeWidth={4}
              strokeLinecap="round"
              opacity={0.85}
              transform={`translate(${Math.sin(t * 3 + i) * 5} ${-((t * 30 + i * 20) % 30)})`}
            />
          ))}
        </g>
      )}
      {expression === "cool" && (
        <path d={`M ${head[0] + 70} ${head[1] - 10} q 16 -4 26 4 q 10 -10 22 -4`} fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.9} />
      )}
      {expression === "sleep" && <Zzz x={head[0] + 40} y={head[1] - 40} frame={frame} />}
    </g>
  );
};
