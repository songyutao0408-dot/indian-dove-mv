// 蜥蜴：卡通式直立，身子正对镜头、侧着横着走（像螃蟹），表情很淡定
import React from "react";
import { INK } from "../style/palette";
import { Eye, autoBlink, dl, ol, onTwos, thin } from "./parts";

const L = { body: "#A9B56A", dark: "#7E8C48", belly: "#E2DCA6", spot: "#6F7C3E" };

export const Lizard: React.FC<{
  frame: number;
  pose?: "stand" | "walk";
  /** 提着灯笼（S13 夜里用） */
  lantern?: boolean;
  seed?: number;
}> = ({ frame, pose = "walk", lantern = false, seed = 4 }) => {
  const f = onTwos(frame);
  const walking = pose === "walk";
  const ph = walking ? (f % 12) / 12 : 0;
  const s = Math.sin(ph * Math.PI * 2);
  const b = autoBlink(frame, seed);
  // 横着走：两腿交替张开、并拢（螃蟹步），身体左右小幅晃
  const spread = walking ? 14 + s * 14 : 18;
  const liftL = walking ? Math.max(0, s) * 12 : 0;
  const liftR = walking ? Math.max(0, -s) * 12 : 0;
  const bob = walking ? -Math.abs(s) * 5 : 0;
  const tailWag = Math.sin(f / 5) * 6;

  const Leg: React.FC<{ side: 1 | -1; lift: number }> = ({ side, lift }) => {
    const hip = [side * 18, -70];
    const knee = [side * (34 + spread), -40 - lift];
    const foot = [side * (28 + spread), -4 - lift];
    const d = `M ${hip[0]} ${hip[1]} L ${knee[0]} ${knee[1]} L ${foot[0]} ${foot[1]}`;
    return (
      <g>
        <path d={d} fill="none" stroke={INK} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke={L.body} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
        {[-1, 0, 1].map((k) => (
          <path key={k} d={`M ${foot[0]} ${foot[1]} l ${side * 8 + k * 9} ${3 + Math.abs(k)}`} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        ))}
      </g>
    );
  };

  return (
    <g transform={`translate(0 ${bob})`}>
      {/* 长尾巴拖在地上，尾尖卷起 */}
      <path d={`M -6 -60 C -40 -30 -90 -6 -140 -8 C -170 -10 -178 ${-30 + tailWag} -160 ${-40 + tailWag}`} fill="none" stroke={INK} strokeWidth={24} strokeLinecap="round" />
      <path d={`M -6 -60 C -40 -30 -90 -6 -140 -8 C -170 -10 -178 ${-30 + tailWag} -160 ${-40 + tailWag}`} fill="none" stroke={L.body} strokeWidth={16} strokeLinecap="round" />
      <Leg side={-1} lift={liftL} />
      <Leg side={1} lift={liftR} />
      {/* 身体：细长、直立 */}
      <path d="M -30 -66 C -36 -120 -26 -160 0 -168 C 26 -160 36 -120 30 -66 C 20 -50 -20 -50 -30 -66 Z" fill={L.body} {...ol} />
      <path d="M -16 -70 C -18 -110 -12 -140 0 -146 C 12 -140 18 -110 16 -70 Z" fill={L.belly} />
      {[-58, -76, -94, -112, -130].map((y) => (
        <path key={y} d={`M -12 ${y} q 12 4 24 0`} fill="none" stroke={L.dark} strokeWidth={2} opacity={0.6} />
      ))}
      {[[-24, -120], [24, -100], [-22, -86]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4} fill={L.spot} />
      ))}
      {/* 小胳膊：跟着横走左右甩 */}
      <path d={`M -26 -140 Q -50 ${-120 + s * 10} -44 ${-100 + s * 12}`} fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" />
      <path d={`M -26 -140 Q -50 ${-120 + s * 10} -44 ${-100 + s * 12}`} fill="none" stroke={L.body} strokeWidth={8} strokeLinecap="round" />
      {!lantern && (
        <>
          <path d={`M 26 -140 Q 50 ${-120 - s * 10} 44 ${-100 - s * 12}`} fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" />
          <path d={`M 26 -140 Q 50 ${-120 - s * 10} 44 ${-100 - s * 12}`} fill="none" stroke={L.body} strokeWidth={8} strokeLinecap="round" />
        </>
      )}
      {/* 头：长吻，3/4 朝右，眼睛鼓在头顶 */}
      <g transform={`rotate(${s * 3} 0 -170)`}>
        <path d="M -30 -186 C -34 -222 -4 -238 22 -230 C 50 -224 84 -214 92 -198 C 94 -186 80 -178 60 -176 C 30 -172 -24 -168 -30 -186 Z" fill={L.body} {...ol} />
        <path d="M 30 -186 Q 62 -184 88 -194" fill="none" {...dl} />
        <circle cx={80} cy={-206} r={2.5} fill={INK} />
        <path d="M -20 -220 q 14 -6 30 -2" fill="none" stroke={L.dark} strokeWidth={3} strokeLinecap="round" />
        <circle cx={-2} cy={-226} r={17} fill={L.body} {...dl} />
        <circle cx={32} cy={-228} r={15} fill={L.body} {...dl} />
        <Eye cx={-2} cy={-228} rx={11} ry={12} lid={Math.max(0.55, b)} look={[0, 0.3]} lidColor={L.dark} />
        <Eye cx={32} cy={-230} rx={10} ry={11} lid={Math.max(0.55, b)} look={[0, 0.3]} lidColor={L.dark} />
      </g>
      {lantern && (
        <g transform={`translate(58 -96) rotate(${Math.sin(f / 4) * 10} 0 -40)`}>
          <path d="M -30 -46 Q -10 -60 0 -60 L 0 -40" fill="none" stroke={INK} strokeWidth={12} strokeLinecap="round" />
          <path d="M -30 -46 Q -10 -60 0 -60" fill="none" stroke={L.body} strokeWidth={7} strokeLinecap="round" />
          <circle cx={0} cy={-22} r={44} fill="#F7D58B" opacity={0.22} />
          <rect x={-14} y={-40} width={28} height={36} rx={6} fill="#F7D58B" {...dl} />
          <path d="M -14 -30 L 14 -30 M -14 -14 L 14 -14" {...thin} />
        </g>
      )}
    </g>
  );
};
