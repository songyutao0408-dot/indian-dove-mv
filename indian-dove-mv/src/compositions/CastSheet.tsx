// 检查点 2：全员角色设定图（合影） + 各角色关键状态图
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  Bison, CAST_SCALE, Cactus, CatDog, Chief, Cowboy, Crow, Dove, Hen, Lizard, Loach, Seagull, Shaman, Skull, Snake,
  Vulture, Warrior, Wolf,
} from "../characters";
import { LYRIC_FONT, TITLE_FONT } from "../fonts";
import { CHAR_NAMES, type CharId } from "../shots";
import { CREAM, INK } from "../style/palette";

const Plaque: React.FC<{ x: number; y: number; text: string; size?: number }> = ({ x, y, text, size = 26 }) => {
  const w = [...text].length * size + 30;
  return (
    <g>
      <rect x={x - w / 2} y={y - size} width={w} height={size + 14} rx={7} fill="#B5683E" stroke={INK} strokeWidth={3} />
      <circle cx={x - w / 2 + 8} cy={y - size / 2 + 4} r={2.5} fill={INK} />
      <circle cx={x + w / 2 - 8} cy={y - size / 2 + 4} r={2.5} fill={INK} />
      <text x={x} y={y + 2} fontSize={size} fontFamily={LYRIC_FONT} fill={CREAM} textAnchor="middle">
        {text}
      </text>
    </g>
  );
};

const Header: React.FC<{ en: string; zh: string }> = ({ en, zh }) => (
  <g>
    <text x={60} y={74} fontSize={52} fontFamily={TITLE_FONT} fill={INK}>
      {en}
    </text>
    <text x={60 + en.length * 30 + 30} y={72} fontSize={42} fontFamily={LYRIC_FONT} fill={INK}>
      {zh}
    </text>
    <line x1={60} x2={1860} y1={96} y2={96} stroke={INK} strokeWidth={3} />
  </g>
);

type Slot = { id: CharId; x: number; el: (f: number) => React.ReactNode };

// 后排（高个子）和前排（矮个子）
const BACK: Slot[] = [
  { id: "cactus", x: 110, el: (f) => <Cactus frame={f} /> },
  { id: "cowboy", x: 330, el: (f) => <Cowboy frame={f} /> },
  { id: "warrior", x: 540, el: (f) => <Warrior frame={f} /> },
  { id: "chief", x: 790, el: (f) => <Chief frame={f} /> },
  { id: "shaman", x: 1040, el: (f) => <Shaman frame={f} /> },
  { id: "wolf", x: 1260, el: (f) => <Wolf frame={f} bone /> },
  { id: "vulture", x: 1470, el: (f) => <Vulture frame={f} look={[0.3, 0.2]} /> },
  { id: "bison", x: 1720, el: (f) => <Bison frame={f} facing={-1} /> },
];
const FRONT: Slot[] = [
  { id: "skull", x: 90, el: (f) => <Skull frame={f} mode="idle" /> },
  { id: "loach", x: 250, el: (f) => <Loach frame={f} look={1} /> },
  { id: "snake", x: 440, el: (f) => <Snake frame={f} pose="coiled" expression="cool" /> },
  { id: "hen", x: 730, el: (f) => <Hen frame={f} facing={1} /> },
  { id: "dove", x: 950, el: (f) => <Dove frame={f} facing={-1} /> },
  { id: "crow", x: 1170, el: (f) => <Crow frame={f} facing={-1} twig /> },
  { id: "catdog", x: 1400, el: (f) => <CatDog frame={f} facing={-1} /> },
  { id: "lizard", x: 1600, el: (f) => <Lizard frame={f} pose="stand" /> },
  { id: "seagull", x: 1800, el: (f) => <Seagull frame={f} pose="stand" facing={-1} /> },
];

export const CastLineup: React.FC = () => {
  const frame = useCurrentFrame() + 12;
  const backY = 560;
  const frontY = 1000;
  const backS = 0.74;
  const frontS = 0.92;
  return (
    <AbsoluteFill style={{ background: "#F3E2C0" }}>
      <svg width={1920} height={1080}>
        <Header en="The Cast" zh="《印第安老斑鸠》全员角色设定" />
        {/* 地面带 */}
        <rect x={0} y={backY - 10} width={1920} height={30} fill="#E6CFA4" />
        <rect x={0} y={frontY - 14} width={1920} height={90} fill="#E9C48F" />
        {BACK.map((c, i) => (
          <g key={c.id}>
            <g transform={`translate(${c.x} ${backY}) scale(${backS * CAST_SCALE[c.id]})`}>{c.el(frame + i * 7)}</g>
            <Plaque x={c.x} y={backY + 50} text={CHAR_NAMES[c.id]} size={24} />
          </g>
        ))}
        {FRONT.map((c, i) => (
          <g key={c.id}>
            <g transform={`translate(${c.x} ${frontY}) scale(${frontS * CAST_SCALE[c.id] * (c.id === "dove" ? 1.05 : 1)})`}>{c.el(frame + i * 5)}</g>
            <Plaque x={c.x} y={frontY + 54} text={CHAR_NAMES[c.id]} size={c.id === "dove" ? 30 : 24} />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

type Variant = { x: number; y: number; s: number; label: string; el: (f: number) => React.ReactNode };

const VARIANTS: Variant[] = [
  // 第一行
  { x: 90, y: 330, s: 0.62, label: "母斑鸠·扭着走", el: (f) => <Hen frame={f} pose="walk" /> },
  { x: 270, y: 330, s: 0.62, label: "母斑鸠·心动", el: (f) => <Hen frame={f} expression="love" /> },
  { x: 450, y: 330, s: 0.62, label: "母斑鸠·害羞", el: (f) => <Hen frame={f} expression="shy" /> },
  { x: 650, y: 330, s: 0.62, label: "乌鸦·叼枝溜走", el: (f) => <Crow frame={f} pose="sneak" twig /> },
  { x: 880, y: 330, s: 0.62, label: "乌鸦·逃跑", el: (f) => <Crow frame={f} pose="run" twig expression="scared" /> },
  { x: 1110, y: 330, s: 0.6, label: "灰狼·啃骨头", el: (f) => <Wolf frame={f} bone expression="chew" bites={2} /> },
  { x: 1320, y: 330, s: 0.6, label: "灰狼·正经脸+牛仔帽", el: (f) => <Wolf frame={f} hat expression="serious" pose="lean" /> },
  { x: 1520, y: 330, s: 0.6, label: "灰狼·对月嚎", el: (f) => <Wolf frame={f} bone expression="howl" /> },
  { x: 1740, y: 300, s: 0.5, label: "秃鹰·盘旋", el: (f) => <Vulture frame={f} pose="fly" /> },
  // 第二行
  { x: 120, y: 640, s: 0.5, label: "响尾蛇·热昏", el: (f) => <Snake frame={f} /> },
  { x: 360, y: 640, s: 0.5, label: "响尾蛇·凉快", el: (f) => <Snake frame={f} expression="cool" /> },
  { x: 580, y: 640, s: 0.46, label: "野牛·刨地喷气", el: (f) => <Bison frame={f} pose="paw" /> },
  { x: 830, y: 640, s: 0.46, label: "野牛·冲锋", el: (f) => <Bison frame={f} pose="charge" facing={-1} tint="#86603E" /> },
  { x: 1080, y: 640, s: 0.46, label: "野牛·撞晕", el: (f) => <Bison frame={f} pose="dazed" /> },
  { x: 1310, y: 640, s: 0.5, label: "仙人掌·捂脸", el: (f) => <Cactus frame={f} pose="shy" /> },
  { x: 1520, y: 640, s: 0.5, label: "仙人掌·偷看", el: (f) => <Cactus frame={f} pose="peek" /> },
  { x: 1750, y: 640, s: 0.58, label: "秃鹰·一脸问号", el: (f) => <Vulture frame={f} expression="puzzled" /> },
  // 第三行
  { x: 110, y: 950, s: 0.55, label: "狗·舔爪子", el: (f) => <CatDog frame={f} pose="lick" /> },
  { x: 310, y: 950, s: 0.55, label: "狗·弓背", el: (f) => <CatDog frame={f} pose="arch" question /> },
  { x: 520, y: 950, s: 0.55, label: "狗·伸懒腰", el: (f) => <CatDog frame={f} pose="stretch" /> },
  { x: 730, y: 950, s: 0.55, label: "狗·扑激光点", el: (f) => <CatDog frame={f} pose="pounce" /> },
  { x: 900, y: 950, s: 0.6, label: "蜥蜴·横着走", el: (f) => <Lizard frame={f} /> },
  { x: 1050, y: 950, s: 0.6, label: "泥鳅·抬头看", el: (f) => <Loach frame={f} lookUp /> },
  { x: 1200, y: 950, s: 0.5, label: "牛仔·背影", el: (f) => <Cowboy frame={f} pose="back" /> },
  { x: 1340, y: 950, s: 0.5, label: "战士·背影", el: (f) => <Warrior frame={f} pose="back" /> },
  { x: 1500, y: 950, s: 0.48, label: "巫师·念咒", el: (f) => <Shaman frame={f} pose="chant" magic /> },
  { x: 1660, y: 950, s: 0.45, label: "酋长·被诅咒", el: (f) => <Chief frame={f} expression="cursed" /> },
  { x: 1820, y: 950, s: 0.6, label: "骷髅头·抗议", el: (f) => <Skull frame={f} sign /> },
];

export const CastVariants: React.FC = () => {
  const frame = useCurrentFrame() + 12;
  return (
    <AbsoluteFill style={{ background: "#F3E2C0" }}>
      <svg width={1920} height={1080}>
        <Header en="Key Poses" zh="各角色关键状态（按分镜需要）" />
        {VARIANTS.map((v, i) => (
          <g key={i}>
            <ellipse cx={v.x} cy={v.y + 2} rx={80} ry={9} fill="#DCC39A" />
            <g transform={`translate(${v.x} ${v.y}) scale(${v.s})`}>{v.el(frame + i * 6)}</g>
            <text x={v.x} y={v.y + 36} fontSize={21} fontFamily={LYRIC_FONT} fill={INK} textAnchor="middle">
              {v.label}
            </text>
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
