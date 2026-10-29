// 检查点 2：老斑鸠表情 + 姿态设定图
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Dove, type DoveExpression, type DovePose } from "../characters/Dove";
import { LYRIC_FONT, TITLE_FONT } from "../fonts";
import { CREAM, INK } from "../style/palette";

const EXPRESSIONS: [DoveExpression, string][] = [
  ["daze", "发呆"],
  ["hungry", "饿昏"],
  ["loopy", "秀逗"],
  ["sad", "伤心"],
  ["angry", "生气"],
  ["love", "心动"],
  ["talk", "学人说话"],
  ["confused", "困惑"],
  ["sleep", "睡觉"],
  ["shock", "惊吓"],
  ["happy", "开心"],
  ["yawn", "打哈欠"],
];

const POSES: [DovePose, string, DoveExpression][] = [
  ["stand", "站立", "daze"],
  ["walk", "短腿踱步", "daze"],
  ["doze", "打瞌睡", "daze"],
  ["flap", "扑腾飞不起来", "shock"],
  ["lie", "躺倒", "sleep"],
  ["dance", "跳舞", "happy"],
  ["sit", "坐着", "daze"],
];

const Label: React.FC<{ x: number; y: number; text: string; size?: number }> = ({ x, y, text, size = 30 }) => (
  <g>
    <rect x={x - (text.length * size) / 2 - 18} y={y - size} width={text.length * size + 36} height={size + 16} rx={8} fill="#B5683E" stroke={INK} strokeWidth={3} />
    <text x={x} y={y + 2} fontSize={size} fontFamily={LYRIC_FONT} fill={CREAM} textAnchor="middle">
      {text}
    </text>
  </g>
);

export const DoveSheet: React.FC<{ frameOffset?: number }> = ({ frameOffset = 14 }) => {
  const frame = useCurrentFrame() + frameOffset;
  return (
    <AbsoluteFill style={{ background: "#F3E2C0" }}>
      <svg width={1920} height={1080}>
        <text x={60} y={78} fontSize={56} fontFamily={TITLE_FONT} fill={INK}>
          Indian Dove
        </text>
        <text x={430} y={76} fontSize={46} fontFamily={LYRIC_FONT} fill={INK}>
          印第安老斑鸠 · 表情与姿态
        </text>
        <line x1={60} x2={1860} y1={100} y2={100} stroke={INK} strokeWidth={3} />
        {EXPRESSIONS.map(([ex, name], i) => {
          const col = i % 6;
          const row = Math.floor(i / 6);
          const x = 175 + col * 315;
          const y = 390 + row * 330;
          return (
            <g key={ex}>
              <g transform={`translate(${x} ${y}) scale(0.72)`}>
                <ellipse cx={0} cy={4} rx={110} ry={14} fill="#D9BE94" />
                <Dove frame={frame + i * 7} expression={ex} seed={i} blink={0} />
              </g>
              <Label x={x} y={y + 52} text={name} size={28} />
            </g>
          );
        })}
        <line x1={60} x2={1860} y1={790} y2={790} stroke={INK} strokeWidth={2} strokeDasharray="10 8" />
        {POSES.map(([pose, name, ex], i) => {
          const x = 160 + i * 265;
          const y = 1000;
          return (
            <g key={pose}>
              <g transform={`translate(${x} ${y}) scale(0.55)`}>
                <ellipse cx={0} cy={4} rx={110} ry={14} fill="#D9BE94" />
                <Dove frame={frame + 5 + i * 5} pose={pose} expression={ex} seed={i} blink={0} />
              </g>
              <Label x={x} y={y + 50} text={name} size={24} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
