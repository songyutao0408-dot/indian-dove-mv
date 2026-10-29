// 西部小镇：主街（CSS 3D 透视）、钟楼、楼面、欢迎木牌
// 主街的两侧楼面和街道放在 CSS 3D 平面上，镜头前推用 camZ 即可（brief：主街空镜、急推到街尽头）。
import React from "react";
import { AbsoluteFill } from "remotion";
import { dl, ol, thin } from "../characters/parts";
import { TITLE_FONT } from "../fonts";
import { CREAM, INK } from "../style/palette";
import type { Theme } from "../style/theme";
import { Desert } from "./Desert";

// ---------- 钟楼 ----------
export const ClockTower: React.FC<{
  /** 钟面时间（小时可带小数） */
  hour: number;
  minute: number;
  /** 钟摆动（正午敲钟时） */
  bell?: number;
  s?: number;
}> = ({ hour, minute, bell = 0, s = 1 }) => {
  const ha = ((hour % 12) + minute / 60) * 30;
  const ma = minute * 6;
  return (
    <g transform={`scale(${s})`}>
      {/* 塔身 */}
      <path d="M -110 0 L -100 -520 L 100 -520 L 110 0 Z" fill="#E6D3AE" {...ol} />
      <path d="M 40 -520 L 100 -520 L 110 0 L 50 0 Z" fill="#CDB68C" />
      {[-440, -360, -280, -200, -120].map((y) => (
        <path key={y} d={`M -104 ${y} L 104 ${y}`} stroke="#CDB68C" strokeWidth={4} />
      ))}
      {/* 门 */}
      <path d="M -40 0 L -40 -110 Q 0 -150 40 -110 L 40 0 Z" fill="#6B4226" {...dl} />
      <path d="M 0 -138 L 0 0" {...thin} />
      {/* 钟面 */}
      <circle cx={0} cy={-400} r={78} fill={CREAM} {...ol} />
      <circle cx={0} cy={-400} r={64} fill="none" {...thin} />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M 0 -470 L 0 ${i % 3 === 0 ? -456 : -462}`} {...dl} strokeWidth={i % 3 === 0 ? 5 : 3} transform={`rotate(${i * 30} 0 -400)`} />
      ))}
      <path d="M 0 -400 L 0 -440" {...dl} strokeWidth={8} transform={`rotate(${ha} 0 -400)`} />
      <path d="M 0 -400 L 0 -458" {...dl} strokeWidth={5} transform={`rotate(${ma} 0 -400)`} />
      <circle cx={0} cy={-400} r={7} fill={INK} />
      {/* 钟楼顶：拱形钟洞 + 尖顶 */}
      <path d="M -100 -520 L -90 -640 L 90 -640 L 100 -520 Z" fill="#E6D3AE" {...ol} />
      <path d="M -50 -530 L -50 -600 Q 0 -640 50 -600 L 50 -530 Z" fill="#3A2418" />
      <g transform={`rotate(${bell * 22} 0 -606)`}>
        <path d="M -26 -548 Q -24 -600 0 -604 Q 24 -600 26 -548 Z" fill="#D9A441" {...dl} />
        <circle cx={0} cy={-546} r={6} fill="#B08030" {...thin} />
      </g>
      <path d="M -116 -640 L 0 -760 L 116 -640 Z" fill="#8E3B2A" {...ol} />
      <path d="M 0 -760 L 0 -800 M -14 -786 L 14 -786" {...dl} strokeWidth={5} />
    </g>
  );
};

// ---------- 楼面 ----------
export type FacadeKind = "saloon" | "sheriff" | "store" | "bank" | "hotel" | "barber";
const FACADE_COLORS: Record<FacadeKind, [string, string]> = {
  saloon: ["#B5683E", "#8E4A28"],
  sheriff: ["#C99A62", "#A07444"],
  store: ["#9C6A44", "#7A4E30"],
  bank: ["#D2B48A", "#B0915F"],
  hotel: ["#A85A3C", "#844228"],
  barber: ["#C4A06A", "#A07C4C"],
};
const FACADE_SIGN: Record<FacadeKind, string> = {
  saloon: "SALOON",
  sheriff: "SHERIFF",
  store: "GENERAL STORE",
  bank: "BANK",
  hotel: "HOTEL",
  barber: "BARBER",
};

/** 一栋楼的正面（600×560，底边 = 地面）；shut 0–1 百叶窗关上的程度 */
export const Facade: React.FC<{ kind: FacadeKind; shut?: number; swing?: number }> = ({ kind, shut = 0, swing = 0 }) => {
  const [wall, dark] = FACADE_COLORS[kind];
  const topY = kind === "bank" ? 90 : kind === "hotel" ? 40 : kind === "store" ? 110 : 70;
  const stepped = kind === "saloon" || kind === "hotel";
  const front = stepped
    ? `M 20 560 L 20 ${topY + 60} L 90 ${topY + 60} L 90 ${topY + 20} L 170 ${topY + 20} L 170 ${topY} L 430 ${topY} L 430 ${topY + 20} L 510 ${topY + 20} L 510 ${topY + 60} L 580 ${topY + 60} L 580 560 Z`
    : `M 20 560 L 20 ${topY} L 580 ${topY} L 580 560 Z`;
  const win = (x: number, y: number) => {
    const w = 90;
    const h = 110;
    const panel = (w / 2) * (0.15 + 0.85 * shut);
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} fill="#2E1C12" {...dl} />
        <path d={`M ${x + w / 2} ${y} L ${x + w / 2} ${y + h} M ${x} ${y + h / 2} L ${x + w} ${y + h / 2}`} stroke="#5A3A22" strokeWidth={4} />
        {/* 百叶窗：两扇往中间合 */}
        <rect x={x - (1 - shut) * 30} y={y - 4} width={panel} height={h + 8} fill={dark} {...dl} />
        <rect x={x + w - panel + (1 - shut) * 30} y={y - 4} width={panel} height={h + 8} fill={dark} {...dl} />
        {[1, 2, 3, 4].map((k) => (
          <g key={k}>
            <path d={`M ${x - (1 - shut) * 30 + 4} ${y + k * 22} l ${panel - 8} 0`} {...thin} />
            <path d={`M ${x + w - panel + (1 - shut) * 30 + 4} ${y + k * 22} l ${panel - 8} 0`} {...thin} />
          </g>
        ))}
      </g>
    );
  };
  return (
    <svg width={600} height={560} viewBox="0 0 600 560" style={{ display: "block", flex: "none" }}>
      <path d={front} fill={wall} {...ol} />
      {/* 横向木板纹 */}
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M 24 ${topY + 70 + i * 36} L 576 ${topY + 70 + i * 36}`} stroke={dark} strokeWidth={3} opacity={0.6} />
      ))}
      {/* 招牌 */}
      <rect x={130} y={topY + 24} width={340} height={60} rx={6} fill={CREAM} {...dl} />
      <text x={300} y={topY + 68} fontSize={FACADE_SIGN[kind].length > 8 ? 30 : 40} fontFamily={TITLE_FONT} fill={INK} textAnchor="middle">
        {FACADE_SIGN[kind]}
      </text>
      {/* 门廊顶 */}
      <path d="M 0 300 L 600 300 L 600 330 L 0 330 Z" fill={dark} {...dl} />
      {[40, 300, 560].map((x) => (
        <rect key={x} x={x - 8} y={330} width={16} height={200} fill={dark} {...dl} />
      ))}
      {win(90, 360)}
      {win(420, 360)}
      {/* 门：酒馆是两扇弹簧门 */}
      {kind === "saloon" ? (
        <g>
          <rect x={250} y={350} width={100} height={180} fill="#2E1C12" {...dl} />
          <g transform={`translate(250 390) scale(${1 - Math.abs(swing) * 0.5} 1)`}>
            <path d="M 0 0 L 50 0 L 50 90 L 0 90 Z" fill={dark} {...dl} />
          </g>
          <g transform={`translate(350 390) scale(${-(1 - Math.abs(swing) * 0.5)} 1)`}>
            <path d="M 0 0 L 50 0 L 50 90 L 0 90 Z" fill={dark} {...dl} />
          </g>
        </g>
      ) : (
        <g>
          <rect x={255} y={360} width={90} height={170} fill={dark} {...dl} />
          <circle cx={330} cy={450} r={5} fill="#D9A441" />
          {kind === "sheriff" && <path d="M 300 390 l 6 13 l 14 1 l -11 9 l 4 14 l -13 -8 l -13 8 l 4 -14 l -11 -9 l 14 -1 Z" fill="#D9A441" {...thin} />}
          {kind === "barber" && (
            <g>
              <rect x={190} y={360} width={22} height={110} rx={10} fill={CREAM} {...dl} />
              {[0, 1, 2, 3].map((k) => (
                <path key={k} d={`M 192 ${370 + k * 26} l 18 14`} stroke="#C0392B" strokeWidth={6} />
              ))}
            </g>
          )}
        </g>
      )}
      {/* 木板人行道 */}
      <rect x={0} y={530} width={600} height={30} fill="#8E6440" {...dl} />
      {Array.from({ length: 15 }, (_, i) => (
        <path key={i} d={`M ${i * 40 + 20} 532 L ${i * 40 + 20} 558`} stroke={INK} strokeWidth={2} opacity={0.6} />
      ))}
    </svg>
  );
};

// ---------- 主街 ----------
const PERSPECTIVE = 900;
const EYE_Y = 540;
const GROUND_Y = 860;
const STREET_HALF = 520;
const DEPTH = 3600;
const WALL_H = 560;

export const TownStreet: React.FC<{
  theme: Theme;
  frame: number;
  /** 镜头往街里推的距离（像素） */
  camZ?: number;
  shut?: number;
  clock?: { hour: number; minute: number; bell?: number };
  children?: React.ReactNode;
}> = ({ theme, frame, camZ = 0, shut = 0, clock = { hour: 11, minute: 50 }, children }) => {
  const leftKinds: FacadeKind[] = ["saloon", "store", "barber", "hotel", "bank", "store"];
  const rightKinds: FacadeKind[] = ["bank", "hotel", "sheriff", "store", "saloon", "barber"];
  // 远端街口的投影：scale = P / (P + DEPTH - camZ)
  const farScale = PERSPECTIVE / (PERSPECTIVE + DEPTH + 500 - camZ);
  const towerY = EYE_Y + (GROUND_Y - EYE_Y) * farScale;
  return (
    <AbsoluteFill>
      {/* 天空 + 远山（不画近景） */}
      <Desert theme={theme} frame={frame} horizon={EYE_Y + 20} near={false} fg={false} />
      {/* 街尽头的钟楼 */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(960 ${towerY}) scale(${farScale * 3.2})`}>
          <ClockTower hour={clock.hour} minute={clock.minute} bell={clock.bell} />
        </g>
      </svg>
      <AbsoluteFill style={{ perspective: `${PERSPECTIVE}px`, perspectiveOrigin: `960px ${EYE_Y}px` }}>
        <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `translateZ(${camZ}px)` }}>
          {/* 街道 */}
          <div
            style={{
              position: "absolute",
              left: 960 - STREET_HALF,
              top: GROUND_Y,
              width: STREET_HALF * 2,
              height: DEPTH,
              transformOrigin: "0 0",
              transform: "rotateX(-90deg)",
              background: theme.sand,
            }}
          >
            <svg width={STREET_HALF * 2} height={DEPTH} style={{ position: "absolute", inset: 0 }}>
              {/* 车辙 */}
              {[360, 420, 620, 680].map((x) => (
                <path key={x} d={`M ${x} 0 L ${x + Math.sin(x) * 10} ${DEPTH}`} stroke={theme.sandShadow} strokeWidth={10} opacity={0.7} />
              ))}
              {/* 马蹄印 */}
              {Array.from({ length: 40 }, (_, i) => (
                <path key={i} d={`M ${500 + (i % 2) * 30} ${i * 90 + 30} a 8 8 0 1 1 12 0`} fill="none" stroke={theme.sandShadow} strokeWidth={4} />
              ))}
              {/* 两侧的阴影带 */}
              <rect x={0} y={0} width={70} height={DEPTH} fill={theme.sandShadow} opacity={0.8} />
              <rect x={STREET_HALF * 2 - 70} y={0} width={70} height={DEPTH} fill={theme.sandShadow} opacity={0.8} />
            </svg>
          </div>
          {/* 左侧楼面 */}
          <div
            style={{
              position: "absolute",
              left: 960 - STREET_HALF,
              top: GROUND_Y - WALL_H,
              width: DEPTH,
              height: WALL_H,
              display: "flex",
              transformOrigin: "0 0",
              transform: "rotateY(90deg)",
            }}
          >
            {leftKinds.map((k, i) => (
              <Facade key={i} kind={k} shut={shut} swing={k === "saloon" ? Math.sin(frame / 5) * 0.4 : 0} />
            ))}
          </div>
          {/* 右侧楼面 */}
          <div
            style={{
              position: "absolute",
              left: 960 + STREET_HALF - DEPTH,
              top: GROUND_Y - WALL_H,
              width: DEPTH,
              height: WALL_H,
              display: "flex",
              transformOrigin: "100% 0",
              transform: "rotateY(-90deg)",
            }}
          >
            {rightKinds.map((k, i) => (
              <Facade key={i} kind={k} shut={shut} />
            ))}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      {children}
    </AbsoluteFill>
  );
};

// ---------- 欢迎木牌 ----------
export const WelcomeSign: React.FC<{ s?: number; sway?: number }> = ({ s = 1, sway = 0 }) => (
  <g transform={`scale(${s})`}>
    {[-150, 150].map((x) => (
      <g key={x}>
        <rect x={x - 12} y={-300} width={24} height={300} fill="#7A4A2A" {...dl} />
      </g>
    ))}
    <g transform={`rotate(${sway} 0 -260)`}>
      <path d="M -200 -290 L 200 -296 L 196 -180 L -196 -176 Z" fill="#B5783E" {...ol} />
      {[-262, -232, -204].map((y) => (
        <path key={y} d={`M -194 ${y} L 194 ${y - 2}`} stroke="#8E5A34" strokeWidth={3} />
      ))}
      <text x={0} y={-232} fontSize={56} fontFamily={TITLE_FONT} fill={CREAM} stroke={INK} strokeWidth={4} paintOrder="stroke" textAnchor="middle">
        WELCOME
      </text>
      <text x={0} y={-192} fontSize={26} fontFamily={TITLE_FONT} fill={INK} textAnchor="middle">
        DOVE GULCH · POP. 17
      </text>
      <circle cx={-182} cy={-280} r={4} fill={INK} />
      <circle cx={182} cy={-284} r={4} fill={INK} />
    </g>
  </g>
);
