// S1 主歌一·上：泥鳅钻沙 → 海鸥叼薯条飞过 → 峡谷大风 → 画外质疑
import React from "react";
import { AbsoluteFill } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { DryBush, Rock, SmallSaguaro, Tumbleweed } from "../backgrounds/props";
import { Loach, Seagull } from "../characters";
import { Bubble } from "../characters/parts";
import { DustCloud, SpeedLines, WindGusts } from "../fx";
import { LYRIC_FONT } from "../fonts";
import { CREAM, INK } from "../style/palette";
import { At, Cam, Layer, Shadow, Stage, beatHop, beatPulse, easeIn, easeInOut, easeOut, lerp, pop, shake, sinceBeat, useShot, type ShotComponent } from "./common";

/** 一根薯条 */
export const Fry: React.FC<{ len?: number }> = ({ len = 60 }) => (
  <rect x={-6} y={-len} width={12} height={len} rx={2} fill="#F4C95D" stroke={INK} strokeWidth={2.5} />
);

const S1_1: ShotComponent = () => {
  // 贴地近景：干沙鼓起，泥鳅钻出来，跟着节拍左右张望
  const { f, g, theme, T } = useShot();
  const out = pop(lerp(f, [2, 14], [0, 1]));
  const look = Math.floor((T - 35.5) / 0.627) % 2 ? 1 : -1;
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, 46], [1.0, 1.06])} oy={900}>
        <Desert theme={theme} frame={g} camX={2400} horizon={520} near={false} sun={{ x: 1600, y: 120, face: "smug" }} />
        <Stage>
          <At x={960} y={960} s={2.6}>
            <Loach frame={g} out={out} look={f < 14 ? 0 : look} sandColor={theme.sand} />
          </At>
        </Stage>
        <Layer>
          <DustCloud x={960} y={950} age={f - 2} size={1.4} color={theme.sand} />
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S1_2: ShotComponent = () => {
  // 海鸥叼着薯条从头顶飞过，泥鳅抬头看；一根薯条掉下插进沙里，泥鳅缩回去
  const { f, dur, g, theme, p } = useShot();
  const gx = lerp(p, [0, 0.75], [-300, 2250]);
  const gy = 250 + Math.sin(p * 6) * 20;
  const dropAt = 0.32;
  const fallK = lerp(p, [dropAt, dropAt + 0.2], [0, 1], easeIn);
  const fryX = lerp(fallK, [0, 1], [lerp(dropAt, [0, 0.75], [-300, 2250]) + 100, 1250]);
  const fryY = lerp(fallK, [0, 1], [gy - 10, 930]);
  const landed = p > dropAt + 0.2;
  const out = landed ? 1 - easeInOut(lerp(p, [0.72, 0.9], [0, 1])) : 1;
  // 泥鳅的视线跟着海鸥（然后跟着薯条）
  const lookX = !landed ? Math.max(-1, Math.min(1, (gx - 960) / 500)) : 0.8;
  return (
    <AbsoluteFill>
      <Desert theme={theme} frame={g} camX={2400 + f * 2} horizon={520} near={false} sun={{ x: 1600, y: 120, face: "smug" }} />
      <Stage>
        <At x={gx} y={gy} s={1.3}>
          <Seagull frame={g} />
        </At>
        {/* 掉下来的薯条 */}
        {p > dropAt && (
          <At x={fryX} y={fryY} r={landed ? 18 : f * 25}>
            <Fry len={70} />
          </At>
        )}
        <At x={960} y={960} s={2.6}>
          <Loach frame={g} out={out} look={lookX} lookUp={!landed} sandColor={theme.sand} />
        </At>
      </Stage>
      <Layer>{landed && <DustCloud x={1250} y={940} age={f - Math.round((dropAt + 0.2) * dur)} size={0.6} color={theme.sand} />}</Layer>
    </AbsoluteFill>
  );
};

const S1_3: ShotComponent = () => {
  // 峡谷大风：风滚草连翻带滚，仙人掌被吹弯，镜头剧烈晃动
  const { f, g, theme, T, p } = useShot();
  const [sx, sy, sr] = shake(g, 14 + beatPulse(T) * 12);
  const weeds = [0, 1, 2, 3].map((i) => {
    const k = (p * 1.4 + i * 0.27) % 1;
    const x = lerp(k, [0, 1], [2200, -300]);
    const y = 820 + i * 50 + beatHop(T + i * 0.2, 60);
    return (
      <At key={i} x={x} y={y - 40}>
        <Tumbleweed r={40 + i * 12} rot={-f * (20 + i * 4)} seed={i + 7} />
      </At>
    );
  });
  const bend = -24 - Math.sin(f / 3) * 6;
  return (
    <AbsoluteFill>
      <Cam x={sx} y={sy} rot={sr} zoom={1.05}>
        <Desert theme={theme} frame={g} camX={3200 + f * 30} wind={2.2} sun={{ x: 400, y: 160, face: "smug" }} />
        <Layer>
          <SpeedLines frame={g} y0={150} y1={950} dir={-1} opacity={0.55} />
          <WindGusts frame={g} y0={180} y1={900} dir={-1} />
        </Layer>
        <Stage>
          <At x={500} y={900} s={1.1}>
            <Shadow rx={80} />
            <SmallSaguaro h={300} color={theme.cactus} dark={theme.cactusDark} sway={bend} />
          </At>
          <At x={1400} y={940} s={1.2}>
            <DryBush s={1.4} sway={-60} color={theme.sandShadow} />
          </At>
          {weeds}
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

const S1_4: ShotComponent = () => {
  // 空镜大石头，画面外伸进来一个对话气泡（「真的假的？」），抖两下
  const { f, g, theme, T } = useShot();
  const k = pop(lerp(f, [3, 10], [0, 1]));
  const jitter = sinceBeat(T) < 0.15 ? Math.sin(f * 3) * 8 : 0;
  return (
    <AbsoluteFill>
      <Desert theme={theme} frame={g} camX={900} horizon={640} near={false} sun={{ x: 300, y: 150, face: "smug" }} />
      <Stage>
        <At x={760} y={1000} s={4.2}>
          <Shadow rx={90} />
          <Rock w={170} h={110} color={theme.mesa} shade={theme.mesaDark} seed={4} />
        </At>
        <g transform={`translate(${2050 - k * 520 + jitter} 300) scale(${0.4 + k * 0.6})`}>
          <Bubble x={-260} y={-120} w={520} h={220} tail={[300, 160]}>
            <text x={-180} y={60} fontSize={170} fontFamily={LYRIC_FONT} fill="#C0392B" stroke={INK} strokeWidth={6} paintOrder="stroke">
              ?
            </text>
            <text x={40} y={20} fontSize={64} fontFamily={LYRIC_FONT} fill={INK} textAnchor="middle">
              真的假的
            </text>
          </Bubble>
        </g>
      </Stage>
      <Layer>
        <text x={1500} y={760} fontSize={40} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={5} paintOrder="stroke" opacity={easeOut(lerp(f, [10, 16], [0, 1]))}>
          （画外音）
        </text>
      </Layer>
    </AbsoluteFill>
  );
};

export const S1: ShotComponent[] = [S1_1, S1_2, S1_3, S1_4];
