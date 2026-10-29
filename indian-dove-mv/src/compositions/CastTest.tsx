// 开发用：把若干角色的几种状态并排画出来检查造型
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Chief } from "../characters/Chief";
import { Cowboy } from "../characters/Cowboy";
import { Shaman } from "../characters/Shaman";
import { Warrior } from "../characters/Warrior";
import { Bison } from "../characters/Bison";
import { Seagull } from "../characters/Seagull";

type Cell = { x: number; y: number; s: number; el: (f: number) => React.ReactNode };

const CELLS: Cell[] = [
  { x: 150, y: 520, s: 0.85, el: (f) => <Cowboy frame={f} /> },
  { x: 380, y: 520, s: 0.85, el: (f) => <Cowboy frame={f} pose="back" /> },
  { x: 600, y: 520, s: 0.85, el: (f) => <Cowboy frame={f} expression="surprised" pose="walk" /> },
  { x: 850, y: 520, s: 0.85, el: (f) => <Warrior frame={f} /> },
  { x: 1080, y: 520, s: 0.85, el: (f) => <Warrior frame={f} pose="back" /> },
  { x: 1340, y: 520, s: 0.85, el: (f) => <Shaman frame={f} /> },
  { x: 1680, y: 600, s: 0.8, el: (f) => <Shaman frame={f} pose="chant" magic /> },
  { x: 200, y: 1040, s: 0.8, el: (f) => <Chief frame={f} /> },
  { x: 470, y: 1040, s: 0.75, el: (f) => <Chief frame={f} expression="cursed" /> },
  { x: 800, y: 1040, s: 0.65, el: (f) => <Bison frame={f} pose="paw" /> },
  { x: 1180, y: 1040, s: 0.65, el: (f) => <Bison frame={f} pose="charge" facing={-1} tint="#86603E" /> },
  { x: 1500, y: 1000, s: 0.8, el: (f) => <Seagull frame={f} /> },
  { x: 1780, y: 1040, s: 0.8, el: (f) => <Seagull frame={f} pose="stand" /> },
];

export const CastTest: React.FC = () => {
  const frame = useCurrentFrame() + 10;
  return (
    <AbsoluteFill style={{ background: "#F3E2C0" }}>
      <svg width={1920} height={1080}>
        {CELLS.map((c, i) => (
          <g key={i} transform={`translate(${c.x} ${c.y}) scale(${c.s})`}>
            <ellipse cx={0} cy={4} rx={120} ry={12} fill="#D9BE94" />
            {c.el(frame + i * 5)}
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
