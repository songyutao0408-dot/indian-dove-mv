// 检查点 2：角色动作测试（一拍二的循环动作），10 秒
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bison, Cactus, CatDog, Chief, Cowboy, Crow, Dove, Hen, Lizard, Loach, Seagull, Shaman, Skull, Snake, Vulture, Wolf } from "../characters";
import { LYRIC_FONT } from "../fonts";
import { INK } from "../style/palette";

type Cell = { x: number; y: number; s: number; label: string; el: (f: number) => React.ReactNode };

const CELLS: Cell[] = [
  { x: 140, y: 330, s: 0.7, label: "老斑鸠·踱步", el: (f) => <Dove frame={f} pose="walk" /> },
  { x: 380, y: 330, s: 0.7, label: "老斑鸠·扑腾", el: (f) => <Dove frame={f} pose="flap" expression="shock" /> },
  { x: 620, y: 330, s: 0.7, label: "老斑鸠·跳舞", el: (f) => <Dove frame={f} pose="dance" expression="happy" /> },
  { x: 860, y: 330, s: 0.7, label: "老斑鸠·打瞌睡", el: (f) => <Dove frame={f} pose="doze" /> },
  { x: 1100, y: 330, s: 0.7, label: "老斑鸠·饿昏", el: (f) => <Dove frame={f} expression="hungry" /> },
  { x: 1340, y: 330, s: 0.7, label: "老斑鸠·学人说话", el: (f) => <Dove frame={f} expression="talk" text="Howdy～" /> },
  { x: 1620, y: 330, s: 0.7, label: "老斑鸠·大哭", el: (f) => <Dove frame={f} expression="sad" /> },
  { x: 120, y: 650, s: 0.62, label: "母斑鸠·扭着走", el: (f) => <Hen frame={f} pose="walk" /> },
  { x: 340, y: 650, s: 0.62, label: "乌鸦·踮脚溜", el: (f) => <Crow frame={f} pose="sneak" twig /> },
  { x: 560, y: 650, s: 0.62, label: "蜥蜴·横着走", el: (f) => <Lizard frame={f} /> },
  { x: 770, y: 650, s: 0.55, label: "仙人掌·扭身", el: (f) => <Cactus frame={f} pose="shy" /> },
  { x: 990, y: 650, s: 0.6, label: "灰狼·啃骨", el: (f) => <Wolf frame={f} bone expression="chew" bites={2} /> },
  { x: 1240, y: 650, s: 0.5, label: "野牛·刨地", el: (f) => <Bison frame={f} pose="paw" /> },
  { x: 1520, y: 650, s: 0.5, label: "野牛·冲锋", el: (f) => <Bison frame={f} pose="charge" facing={-1} tint="#86603E" /> },
  { x: 1760, y: 650, s: 0.62, label: "骷髅头·抗议", el: (f) => <Skull frame={f} sign /> },
  { x: 150, y: 1000, s: 0.55, label: "响尾蛇·热昏", el: (f) => <Snake frame={f} /> },
  { x: 420, y: 1000, s: 0.6, label: "狗·扑激光", el: (f) => <CatDog frame={f} pose="pounce" /> },
  { x: 620, y: 1000, s: 0.62, label: "泥鳅·张望", el: (f) => <Loach frame={f} out={Math.min(1, Math.max(0, Math.sin(f / 30) * 1.4))} /> },
  { x: 830, y: 960, s: 0.55, label: "海鸥·飞过", el: (f) => <Seagull frame={f} /> },
  { x: 1060, y: 1000, s: 0.48, label: "巫师·念咒", el: (f) => <Shaman frame={f} pose="chant" magic /> },
  { x: 1270, y: 1000, s: 0.46, label: "牛仔·一拍一步", el: (f) => <Cowboy frame={f} pose="back" /> },
  { x: 1460, y: 1000, s: 0.46, label: "酋长·被诅咒", el: (f) => <Chief frame={f} expression="cursed" /> },
  { x: 1720, y: 960, s: 0.55, label: "秃鹰·一脸问号", el: (f) => <Vulture frame={f} expression="puzzled" /> },
];

export const MotionTest: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#F3E2C0" }}>
      <svg width={1920} height={1080}>
        <text x={40} y={50} fontSize={34} fontFamily={LYRIC_FONT} fill={INK}>
          角色动作测试 · 一拍二（每 2 帧换一次姿态）· 帧 {frame}
        </text>
        {CELLS.map((c, i) => (
          <g key={i}>
            <ellipse cx={c.x} cy={c.y + 2} rx={80} ry={9} fill="#DCC39A" />
            <g transform={`translate(${c.x} ${c.y}) scale(${c.s})`}>{c.el(frame + i * 3)}</g>
            <text x={c.x} y={c.y + 34} fontSize={22} fontFamily={LYRIC_FONT} fill={INK} textAnchor="middle">
              {c.label}
            </text>
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
