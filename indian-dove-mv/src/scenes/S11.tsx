// S11 导歌二（夜晚）：月光下的白蚁丘 → 蹲在丘顶看月亮，月亮变成大饼 → 安静远景（眨眼、流星）
import { AbsoluteFill } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { Flatbread, Moon } from "../backgrounds/props";
import { MOUND_TOP, TermiteMound } from "../backgrounds/TermiteMound";
import { Dove } from "../characters";
import { Sweat } from "../characters/parts";
import { LYRIC_FONT } from "../fonts";
import { Fireflies } from "../fx";
import { CREAM, INK } from "../style/palette";
import { At, Cam, Layer, Stage, easeInOut, easeOut, lerp, useShot, type ShotComponent } from "./common";
import { MoundScene } from "./S4";

const S11_1: ShotComponent = () => {
  // 月光下的白蚁丘全景，萤火虫飘，慢推；丘顶一个小小的老斑鸠
  const { f, dur, g } = useShot();
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, dur], [1.0, 1.12], easeInOut)} ox={990} oy={520}>
        <MoundScene camX={36000} moon>
          <At x={MOUND_TOP[0]} y={MOUND_TOP[1]} s={0.6}>
            <Dove frame={g} pose="sit" expression="daze" look={[0.5, -0.7]} />
          </At>
        </MoundScene>
        <Layer>
          <Fireflies frame={g} count={22} y0={500} y1={1050} />
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S11_2: ShotComponent = () => {
  // 老斑鸠蹲在丘顶看月亮，肚子咕咕叫；月亮在它眼里慢慢变成一张大饼，口水都流下来了
  const { f, g, theme } = useShot();
  const morph = lerp(f, [26, 46], [0, 1], easeInOut);
  return (
    <AbsoluteFill>
      <Desert theme={theme} frame={g} camX={36400} horizon={860} near={false} fg={false} />
      <Layer>
        <At x={560} y={330}>
          <g opacity={1 - morph}>
            <Moon r={190} frame={g} glow={1} />
          </g>
          <g opacity={morph} transform={`scale(${0.9 + morph * 0.1})`}>
            <Flatbread r={190} />
          </g>
        </At>
      </Layer>
      <Stage>
        <At x={1390} y={1300} s={1.6}>
          <TermiteMound theme={theme} s={0.9} />
        </At>
        <At x={1390 + MOUND_TOP[0] * 1.44} y={1300 + MOUND_TOP[1] * 1.44} s={1.3} r={-6}>
          <Dove frame={g} pose="sit" expression={morph > 0.6 ? "love" : "hungry"} facing={-1} look={[0.6, -0.8]} />
          {morph > 0.6 && <Sweat x={-110} y={-170} frame={g} s={1.2} seed={3} />}
        </At>
      </Stage>
      <Layer>
        {f > 10 && Math.floor(f / 12) % 2 === 0 && (
          <text x={1500} y={760} fontSize={50} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={6} paintOrder="stroke">
            咕～
          </text>
        )}
        {morph > 0.9 && (
          <text x={760} y={600} fontSize={60} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={7} paintOrder="stroke" opacity={easeOut(lerp(f, [46, 52], [0, 1]))}>
            好大一张饼……
          </text>
        )}
      </Layer>
    </AbsoluteFill>
  );
};

const S11_3: ShotComponent = () => {
  // 安静远景：巨大的月亮前，白蚁丘和老斑鸠的剪影；它慢慢眨一下眼，一颗流星划过
  const { f, g, theme } = useShot();
  const star = lerp(f, [36, 58], [0, 1]);
  const blink = f > 66 && f < 76 ? 1 : 0;
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, 93], [1.0, 1.05])}>
        <Desert theme={theme} frame={g} camX={37000} near={false} moon={{ x: 1000, y: 520, r: 360 }} />
        <Layer>
          {star > 0 && star < 1 && (
            <g opacity={Math.sin(star * Math.PI)}>
              <path d={`M ${300 + star * 900} ${120 + star * 260} l -220 -70`} stroke={CREAM} strokeWidth={5} strokeLinecap="round" />
              <circle cx={300 + star * 900} cy={120 + star * 260} r={8} fill={CREAM} />
            </g>
          )}
          <g style={{ filter: "brightness(0.18) saturate(0.4)" }}>
            <At x={1000} y={1060} s={1.3}>
              <TermiteMound theme={theme} />
            </At>
          </g>
        </Layer>
        <Stage>
          <At x={1000 + MOUND_TOP[0] * 1.3} y={1060 + MOUND_TOP[1] * 1.3} s={0.98}>
            <Dove frame={g} pose="sit" expression="daze" blink={blink} look={[0.2, -0.6]} />
          </At>
        </Stage>
        <Layer>
          <Fireflies frame={g} count={14} y0={700} y1={1050} seed={4} />
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

export const S11: ShotComponent[] = [S11_1, S11_2, S11_3];
