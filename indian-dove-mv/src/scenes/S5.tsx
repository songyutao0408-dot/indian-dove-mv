// S5 副歌A·一：老斑鸠特征介绍——腿短毛不多 → 空水壶也淡定 → 秀逗 → 猎物死了嚎啕大哭（秃鹰莫名其妙）
import React from "react";
import { AbsoluteFill } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { Canteen, DeadBeetle } from "../backgrounds/props";
import { Dove, Vulture } from "../characters";
import { MotionLines, onTwos } from "../characters/parts";
import { LYRIC_FONT } from "../fonts";
import { HeatLines } from "../fx";
import { CREAM, INK } from "../style/palette";
import { At, Cam, Layer, Shadow, Stage, beatPulse, easeInOut, easeOut, lerp, pop, useShot, type ShotComponent } from "./common";

const Label: React.FC<{ x: number; y: number; text: string; k: number; size?: number; r?: number }> = ({ x, y, text, k, size = 56, r = -6 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${k})`} opacity={k > 0.02 ? 1 : 0}>
    <text x={0} y={0} fontSize={size} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={7} paintOrder="stroke" textAnchor="middle">
      {text}
    </text>
  </g>
);

const S5_1: ShotComponent = () => {
  // 特写：从小短腿往上摇 → 稀疏羽毛和秃斑 → 头顶三根毛「啵」地弹一下
  const { f, dur, g, theme } = useShot();
  const tilt = lerp(f, [8, dur - 14], [0, 1], easeInOut);
  // 屏幕 y = 540 + (世界 y - 540) × 2.7 + camY：脚（760）居中要 camY = -594，头顶（约 450）居中要 +243
  const camY = lerp(tilt, [0, 1], [-594, 200]);
  const boing = f > dur - 14;
  return (
    <AbsoluteFill>
      <Cam zoom={2.7} y={camY} oy={540}>
        <Desert theme={theme} frame={g} camX={10200} horizon={520} near={false} fg={false} />
        <Stage>
          <At x={960} y={760}>
            <Shadow rx={120} />
            <Dove frame={g} expression={boing ? "shock" : "daze"} />
          </At>
          {boing && (
            <>
              <MotionLines x={900} y={360} dir={-1} n={3} len={24} gap={10} />
              <MotionLines x={1040} y={360} dir={1} n={3} len={24} gap={10} />
            </>
          )}
        </Stage>
        <Layer>
          <Label x={760} y={760} text="腿短" k={pop(lerp(f, [2, 10], [0, 1])) * (1 - lerp(f, [26, 32], [0, 1]))} size={40} />
          <Label x={1150} y={620} text="毛不多" k={pop(lerp(f, [22, 30], [0, 1])) * (1 - lerp(f, [46, 52], [0, 1]))} size={40} r={6} />
          <Label x={1100} y={330} text="啵～" k={boing ? pop(lerp(f, [dur - 14, dur - 8], [0, 1])) : 0} size={34} />
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S5_2: ShotComponent = () => {
  // 大太阳底下，水壶倒过来只掉出一粒沙；老斑鸠半睁眼，一脸淡定
  const { f, dur, g, theme } = useShot();
  const tip = lerp(f, [6, 18], [0, 160], easeInOut);
  const grainY = lerp(f, [22, 40], [0, 220], (x) => x * x);
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, dur], [1.15, 1.25])} oy={700}>
        <Desert theme={theme} frame={g} camX={10800} sun={{ x: 1480, y: 200, r: 150, face: "smug" }} />
        <Stage>
          <At x={820} y={930} s={1.25}>
            <Shadow />
            <Dove frame={g} pose="sit" expression="daze" />
          </At>
          {/* 翅膀举着的水壶 */}
          <At x={1080} y={600} s={0.9} r={tip}>
            <Canteen />
          </At>
          {f > 22 && (
            <circle cx={1080 + Math.sin((tip * Math.PI) / 180) * 80} cy={600 + 60 + grainY} r={6} fill={theme.sand} stroke={INK} strokeWidth={2} />
          )}
          <HeatLines frame={g} x={900} y={560} w={600} n={5} />
        </Stage>
        <Layer>
          {f > 44 && (
            <text x={1220} y={760} fontSize={44} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={6} paintOrder="stroke" opacity={easeOut(lerp(f, [44, 50], [0, 1]))}>
              ……嗯，够了
            </text>
          )}
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S5_3: ShotComponent = () => {
  // 秀逗：脸部大特写，螺旋眼转圈、傻笑，背景也跟着转成彩色漩涡
  const { f, g, T } = useShot();
  const rot = onTwos(f) * 6;
  return (
    <AbsoluteFill>
      <Layer>
        <rect width={1920} height={1080} fill="#B57EDC" />
        <g transform={`translate(960 540) rotate(${rot})`}>
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d="M 0 0 C 300 -100 600 100 1300 -200 L 1300 200 C 600 300 300 100 0 0 Z" fill={["#F2C14E", "#4FC2B5", "#E8738F"][i % 3]} transform={`rotate(${i * 30})`} opacity={0.85} />
          ))}
        </g>
      </Layer>
      <Cam zoom={2.8 + beatPulse(T) * 0.12} ox={990} oy={650} y={-110}>
        <Stage>
          <At x={960} y={900}>
            <Dove frame={g} expression="loopy" />
          </At>
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

const S5_4: ShotComponent = () => {
  // 看到一只死掉的甲虫，嚎啕大哭，泪如喷泉；旁边秃鹰一脸莫名其妙
  const { f, g, theme } = useShot();
  const cry = f > 8;
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, 10], [1.3, 1.15], easeOut)} oy={760}>
        <Desert theme={theme} frame={g} camX={11500} sun={{ x: 300, y: 160, face: "none" }} />
        <Stage>
          {/* 眼泪积成的小水洼 */}
          {cry && <ellipse cx={760} cy={935} rx={lerp(f, [8, 60], [20, 260])} ry={lerp(f, [8, 60], [6, 34])} fill="#8FD3F4" stroke={INK} strokeWidth={3} opacity={0.85} />}
          <At x={1010} y={930} s={0.9}>
            <DeadBeetle frame={g} />
          </At>
          <At x={720} y={920} s={1.25}>
            <Shadow />
            <Dove frame={g} expression={cry ? "sad" : "shock"} />
          </At>
          <At x={1460} y={940} s={1.15} flip>
            <Shadow rx={90} />
            <Vulture frame={g} expression="puzzled" look={[0.6, 0.4]} />
          </At>
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

export const S5: ShotComponent[] = [S5_1, S5_2, S5_3, S5_4];
