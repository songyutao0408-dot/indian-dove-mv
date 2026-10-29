// 酋长：戴大羽毛头冠，抱着胳膊，表情严肃；被诅咒后头顶冒出乌云
import React from "react";
import { INK } from "../style/palette";
import { Limb } from "./limb";
import { Eye, Sweat, autoBlink, dl, ol, onTwos, thin } from "./parts";

export type ChiefExpression = "stern" | "cursed" | "happy";

const H = {
  skin: "#B07050",
  skinDark: "#8E5438",
  hair: "#241C1C",
  robe: "#8E3B2A",
  robeBand: "#2E2420",
  robeLight: "#F6E7C8",
  feather: "#F6F1E6",
  featherTip: "#2A2222",
  featherRed: "#C8402E",
  bead: "#3FA39A",
  cloud: "#5C5868",
  rain: "#8FD3F4",
};

/** 头顶的小乌云（下雨、偶尔打个小闪电） */
export const RainCloud: React.FC<{ frame: number; x?: number; y?: number; s?: number }> = ({ frame, x = 0, y = 0, s = 1 }) => {
  const f = onTwos(frame);
  const bolt = Math.floor(f / 2) % 18 === 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {Array.from({ length: 7 }, (_, i) => {
        const tt = (f / 12 + i / 7) % 1;
        const rx = -60 + i * 20;
        return <path key={i} d={`M ${rx} ${20 + tt * 90} l -4 14`} stroke={H.rain} strokeWidth={4} strokeLinecap="round" opacity={1 - tt * 0.5} />;
      })}
      {bolt && <path d="M -6 18 L 10 44 L 0 46 L 12 76 L -12 40 L -2 38 Z" fill="#F7E36A" {...thin} />}
      <path
        d="M -80 16 C -100 16 -100 -16 -76 -16 C -76 -44 -36 -50 -24 -30 C -12 -60 34 -60 40 -28 C 60 -40 94 -24 84 0 C 100 4 98 22 80 22 Z"
        fill={H.cloud}
        {...ol}
      />
      <path d="M -50 -6 q 14 -10 28 0 M 10 -14 q 14 -10 28 0" fill="none" stroke="#7C788A" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

export const Chief: React.FC<{
  frame: number;
  expression?: ChiefExpression;
  facing?: 1 | -1;
  /** 乌云覆盖（cursed 时自动出现） */
  cloud?: boolean;
  /** 抱着像猫的狗时，胳膊改成托抱 */
  holding?: boolean;
  bob?: number;
  seed?: number;
}> = ({ frame, expression = "stern", facing = 1, cloud, holding = false, bob = 0, seed = 14 }) => {
  const f = onTwos(frame);
  const t = f / 24;
  const b = autoBlink(frame, seed);
  const cursed = expression === "cursed";
  const happy = expression === "happy";
  const showCloud = cloud ?? cursed;
  const breathe = Math.sin(t * Math.PI * 0.6) * 2;

  return (
    <g transform={`scale(${facing} 1) translate(0 ${bob})`}>
      {/* 背后垂下的羽毛长尾 */}
      <path d="M -30 -370 C -70 -300 -80 -180 -66 -60" fill="none" stroke={INK} strokeWidth={30} strokeLinecap="round" />
      <path d="M -30 -370 C -70 -300 -80 -180 -66 -60" fill="none" stroke={H.featherRed} strokeWidth={22} strokeLinecap="round" />
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i} transform={`translate(${-48 - i * 3} ${-320 + i * 40}) rotate(${-110 + Math.sin(t * 2 + i) * 3})`}>
          <path d="M 0 0 C -6 -18 -5 -40 0 -52 C 5 -40 6 -18 0 0 Z" fill={H.feather} {...thin} />
          <path d="M 0 -40 C -3 -44 -2 -50 0 -52 C 2 -50 3 -44 0 -40 Z" fill={H.featherTip} />
        </g>
      ))}
      {/* 腿 + 软鞋 */}
      {[-24, 24].map((x) => (
        <g key={x}>
          <Limb d={`M ${x} -120 L ${x} -12`} color="#9E7046" w={30} />
          <path d={`M ${x - 16} -14 Q ${x - 18} 4 ${x} 4 L ${x + 28} 4 Q ${x + 36} -4 ${x + 20} -14 Z`} fill="#CDA06A" {...dl} />
        </g>
      ))}
      {/* 毯子长袍（几何花纹） */}
      <g transform={`scale(1 ${1 + breathe * 0.004})`}>
        <path d="M -64 -110 C -74 -200 -66 -280 -36 -306 L 40 -306 C 70 -280 78 -200 68 -110 Z" fill={H.robe} {...ol} />
        <path d="M -68 -160 L 72 -160 L 72 -140 L -68 -140 Z" fill={H.robeBand} />
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M ${-60 + i * 20} -140 l 10 -20 l 10 20 Z`} fill={H.robeLight} />
        ))}
        <path d="M -66 -128 L 70 -128" stroke={H.robeLight} strokeWidth={4} strokeDasharray="10 6" />
      </g>
      {/* 抱着的胳膊 */}
      {holding ? (
        <>
          <Limb d="M -46 -280 Q -60 -200 0 -196 L 40 -200" color={H.robe} w={26} />
          <Limb d="M 50 -280 Q 70 -220 40 -210" color={H.robe} w={26} />
        </>
      ) : (
        <>
          <Limb d="M -46 -282 Q -64 -230 -30 -222 L 40 -232" color={H.robe} w={28} />
          <Limb d="M 50 -282 Q 70 -226 30 -214 L -36 -224" color={H.robe} w={28} />
          <circle cx={46} cy={-232} r={13} fill={H.skin} {...dl} />
          <circle cx={-40} cy={-224} r={13} fill={H.skin} {...dl} />
        </>
      )}
      {/* 头 */}
      <rect x={-14} y={-326} width={30} height={22} fill={H.skin} {...dl} />
      <path d="M -40 -356 C -48 -310 -44 -290 -36 -280 L -24 -290 L -26 -330 Z M 44 -356 C 52 -310 48 -290 40 -280 L 28 -290 L 30 -330 Z" fill={H.hair} {...dl} />
      <ellipse cx={2} cy={-358} rx={40} ry={46} fill={H.skin} {...ol} />
      {/* 严肃的法令纹 */}
      <path d="M 10 -336 q -8 12 -2 22 M 38 -336 q 6 12 0 22" fill="none" stroke={H.skinDark} strokeWidth={3} strokeLinecap="round" />
      {happy ? (
        <>
          <path d="M -12 -360 q 10 -10 20 0 M 18 -360 q 9 -9 18 0" fill="none" {...dl} strokeWidth={4.5} />
          <path d="M 4 -322 Q 20 -308 36 -322" fill="#FFFDF4" {...dl} />
        </>
      ) : (
        <>
          <Eye cx={-2} cy={-360} rx={9} ry={9} lid={cursed ? Math.max(0.55, b) : Math.max(0.42, b)} lidTilt={cursed ? 14 : -14} pupil={0.5} look={cursed ? [0.2, -0.6] : [0.3, 0]} lidColor={H.skinDark} />
          <Eye cx={26} cy={-360} rx={8} ry={9} lid={cursed ? Math.max(0.55, b) : Math.max(0.42, b)} lidTilt={cursed ? -14 : 14} pupil={0.5} look={cursed ? [0.2, -0.6] : [0.3, 0]} lidColor={H.skinDark} />
          <path d={cursed ? "M -14 -380 L 8 -372 M 16 -372 L 38 -380" : "M -14 -374 L 8 -368 M 16 -368 L 38 -374"} fill="none" {...dl} strokeWidth={6} />
          <path d={cursed ? "M 6 -318 Q 20 -326 34 -318" : "M 6 -320 L 34 -320"} fill="none" {...dl} />
        </>
      )}
      <path d="M 20 -358 Q 36 -344 24 -336" fill="none" {...dl} />
      {/* 大羽毛头冠：一圈扇形羽毛 */}
      {Array.from({ length: 13 }, (_, i) => {
        const a = -78 + i * 13;
        return (
          <g key={i} transform={`translate(2 -378) rotate(${a + Math.sin(t * 2 + i * 0.6) * 2})`}>
            <path d="M 0 -6 C -12 -40 -10 -86 0 -110 C 10 -86 12 -40 0 -6 Z" fill={H.feather} {...dl} />
            <path d="M 0 -84 C -7 -94 -5 -104 0 -110 C 5 -104 7 -94 0 -84 Z" fill={H.featherTip} />
            <circle cx={0} cy={-112} r={4} fill={H.featherRed} />
            <path d="M 0 -6 L 0 -100" {...thin} strokeWidth={1.5} />
          </g>
        );
      })}
      {/* 额前珠带 */}
      <path d="M -40 -384 Q 2 -400 44 -384 L 44 -370 Q 2 -386 -40 -370 Z" fill={H.robeLight} {...dl} />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={-34 + i * 10} y={-384 - Math.sin((i / 7) * Math.PI) * 6} width={7} height={9} fill={i % 2 ? H.bead : H.featherRed} />
      ))}
      {/* 两侧垂下的毛皮饰 */}
      {[-42, 46].map((x) => (
        <path key={x} d={`M ${x} -376 L ${x} -310`} stroke={INK} strokeWidth={12} strokeLinecap="round" />
      ))}
      {[-42, 46].map((x) => (
        <path key={`w${x}`} d={`M ${x} -376 L ${x} -310`} stroke="#F6F1E6" strokeWidth={7} strokeLinecap="round" />
      ))}
      {cursed && <Sweat x={44} y={-380} frame={frame} />}
      {showCloud && <RainCloud frame={frame} x={4} y={-540} />}
    </g>
  );
};
