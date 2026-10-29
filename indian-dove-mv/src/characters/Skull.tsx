// 骷髅头：会动，下巴一张一合，像在抗议
import React from "react";
import { INK } from "../style/palette";
import { Smoke, dl, ol, onTwos, thin } from "./parts";

const B = { bone: "#EDE3CC", shade: "#CDBF9F", socket: "#3A2418" };

export const Skull: React.FC<{
  frame: number;
  /** 抗议：下巴快速开合 + 眉头皱起 + 冒烟 */
  mode?: "protest" | "idle" | "nod";
  /** 举着「还我！」小牌子 */
  sign?: boolean;
}> = ({ frame, mode = "protest", sign = false }) => {
  const f = onTwos(frame);
  const protest = mode === "protest";
  const jaw = protest ? (Math.floor(f / 4) % 2 ? 22 : 4) : mode === "nod" ? 6 : 2;
  const bounce = protest ? (Math.floor(f / 4) % 2 ? -8 : 0) : 0;
  const nod = mode === "nod" ? Math.sin(f / 4) * 10 : protest ? Math.sin(f / 3) * 4 : 0;
  return (
    <g transform={`translate(0 ${bounce}) rotate(${nod} 0 -60)`}>
      {sign && (
        <g transform="translate(96 -60) rotate(8)">
          <path d="M 0 60 L 0 -70" stroke={INK} strokeWidth={10} strokeLinecap="round" />
          <path d="M 0 60 L 0 -70" stroke="#B5683E" strokeWidth={6} strokeLinecap="round" />
          <rect x={-46} y={-130} width={92} height={60} rx={6} fill="#F6E7C8" {...dl} />
          <text x={0} y={-90} fontSize={30} textAnchor="middle" fill="#C0392B" fontFamily="ZCOOL KuaiLe">
            还我!
          </text>
        </g>
      )}
      {/* 下巴 */}
      <g transform={`rotate(${jaw} -40 -52)`}>
        <path d="M -48 -54 L -44 -14 Q 0 6 44 -14 L 48 -54 Z" fill={B.bone} {...ol} />
        <path d="M -34 -46 L 34 -46" {...thin} />
        {[-24, -8, 8, 24].map((x) => (
          <path key={x} d={`M ${x} -54 L ${x} -38`} {...thin} />
        ))}
      </g>
      {/* 头盖骨 */}
      <path d="M -72 -110 C -76 -190 76 -190 72 -110 C 72 -84 60 -70 50 -64 L 50 -50 L -50 -50 L -50 -64 C -60 -70 -72 -84 -72 -110 Z" fill={B.bone} {...ol} />
      <path d="M -40 -168 q 10 10 0 22 q 12 6 8 18" fill="none" {...thin} opacity={0.7} />
      <path d="M -60 -96 q 8 14 22 18" fill="none" stroke={B.shade} strokeWidth={6} strokeLinecap="round" />
      {/* 上排牙 */}
      {[-30, -10, 10, 30].map((x) => (
        <rect key={x} x={x - 9} y={-64} width={18} height={16} rx={3} fill="#FFFDF4" {...thin} />
      ))}
      {/* 眼窝：生气时眉头往下压 */}
      <path d={protest ? "M -54 -128 L -14 -116 Q -12 -92 -34 -88 Q -56 -92 -54 -128 Z" : "M -52 -118 Q -32 -136 -14 -116 Q -12 -92 -34 -88 Q -56 -92 -52 -118 Z"} fill={B.socket} />
      <path d={protest ? "M 54 -128 L 14 -116 Q 12 -92 34 -88 Q 56 -92 54 -128 Z" : "M 52 -118 Q 32 -136 14 -116 Q 12 -92 34 -88 Q 56 -92 52 -118 Z"} fill={B.socket} />
      {/* 眼窝里的小亮点 */}
      <circle cx={-30} cy={-104} r={protest ? 6 : 5} fill={protest ? "#F0A15E" : "#F6E7C8"} />
      <circle cx={30} cy={-104} r={protest ? 6 : 5} fill={protest ? "#F0A15E" : "#F6E7C8"} />
      {/* 鼻孔 */}
      <path d="M -8 -76 L 0 -90 L 8 -76 Z" fill={B.socket} />
      {protest && <Smoke x={0} y={-180} frame={frame} />}
    </g>
  );
};
