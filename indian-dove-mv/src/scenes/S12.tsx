// S12 副歌A·二（夜晚）：内容同 S5，换动作和角度——夜风发抖 → 一滴露水 → 看月亮看到秀逗 → 甲虫葬礼
import React from "react";
import { AbsoluteFill } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { Candle, Canteen, DeadBeetle, PricklyPear, TinyCross } from "../backgrounds/props";
import { Dove, Vulture } from "../characters";
import { LYRIC_FONT } from "../fonts";
import { Fireflies, WindGusts } from "../fx";
import { CREAM, INK } from "../style/palette";
import { At, Cam, Layer, Shadow, Stage, easeIn, easeInOut, easeOut, lerp, pop, useShot, type ShotComponent } from "./common";

const Txt: React.FC<{ x: number; y: number; text: string; size?: number; r?: number; opacity?: number }> = ({ x, y, text, size = 56, r = 0, opacity = 1 }) => (
  <text x={x} y={y} fontSize={size} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={7} paintOrder="stroke" transform={`rotate(${r} ${x} ${y})`} opacity={opacity}>
    {text}
  </text>
);

const S12_1: ShotComponent = () => {
  // 侧面低角度：夜风吹过，老斑鸠缩成一团发抖，三根头毛被吹弯又弹回
  const { f, g, theme } = useShot();
  const shiver = (f % 2 ? 1 : -1) * 3;
  return (
    <AbsoluteFill>
      <Cam zoom={1.6} oy={900} ox={900}>
        <Desert theme={theme} frame={g} camX={38000} horizon={720} near={false} moon={{ x: 1500, y: 260 }} wind={1.6} />
        <Layer>
          <WindGusts frame={g} y0={500} y1={900} dir={-1} />
        </Layer>
        <Stage>
          <At x={900 + shiver} y={980} s={1.3}>
            <Shadow />
            <g transform="scale(1.06 0.92)">
              <Dove frame={g} pose="sit" expression="sad" />
            </g>
          </At>
        </Stage>
        <Layer>
          <Txt x={1120} y={640} text="呜呜好冷…" size={46} r={-4} opacity={easeOut(lerp(f, [10, 16], [0, 1]))} />
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S12_2: ShotComponent = () => {
  // 月光下倒拿空水壶，只滴出一滴露水，它满足地咂咂嘴
  const { f, g, theme } = useShot();
  const tip = lerp(f, [4, 16], [0, 170], easeInOut);
  const drop = lerp(f, [24, 40], [0, 1], easeIn);
  const caught = f >= 40;
  return (
    <AbsoluteFill>
      <Cam zoom={1.8} ox={1000} oy={1000}>
        <Desert theme={theme} frame={g} camX={38600} near={false} moon={{ x: 400, y: 240 }} />
        <Stage>
          <At x={920} y={960}>
            <Shadow />
            <Dove frame={g} pose="sit" expression={caught ? "happy" : "daze"} look={[0.5, -0.8]} />
          </At>
          <At x={1090} y={620} s={0.5} r={tip}>
            <Canteen />
          </At>
          {!caught && f >= 24 && <ellipse cx={1050} cy={lerp(drop, [0, 1], [660, 780])} rx={7} ry={10} fill="#BFE6F2" stroke={INK} strokeWidth={2} />}
        </Stage>
        <Layer>{caught && <Txt x={1080} y={700} text="吧唧～" size={30} opacity={easeOut(lerp(f, [40, 46], [0, 1]))} />}</Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S12_3: ShotComponent = () => {
  // 盯着月亮看太久，变成螺旋眼，萤火虫绕着脑袋转圈
  const { f, g, theme } = useShot();
  const loopy = f > 14;
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, 52], [2.2, 2.6])} ox={990} oy={730} y={-190}>
        <Desert theme={theme} frame={g} camX={39200} near={false} moon={{ x: 1400, y: 200, r: 120 }} />
        <Stage>
          <At x={960} y={960}>
            <Dove frame={g} expression={loopy ? "loopy" : "daze"} look={[0.6, -0.8]} />
          </At>
        </Stage>
        <Layer>
          {Array.from({ length: 6 }, (_, i) => {
            const a = f / 6 + (i / 6) * Math.PI * 2;
            const x = 990 + Math.cos(a) * 120;
            const y = 650 + Math.sin(a) * 34;
            return (
              <g key={i} opacity={loopy ? 1 : 0}>
                <circle cx={x} cy={y} r={14} fill="#F7E36A" opacity={0.3} />
                <circle cx={x} cy={y} r={5} fill="#FBF1A8" />
              </g>
            );
          })}
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S12_4: ShotComponent = () => {
  // 给死甲虫插小木十字架，泪水喷泉浇开了一朵仙人掌花；秃鹰在暗处举着蜡烛一脸问号
  const { f, g, theme } = useShot();
  const bloom = pop(lerp(f, [36, 50], [0, 1]));
  return (
    <AbsoluteFill>
      <Cam zoom={1.35} oy={820}>
        <Desert theme={theme} frame={g} camX={39800} near={false} moon={{ x: 300, y: 200 }} />
        <Stage>
          <At x={1080} y={960} s={1.1}>
            <TinyCross s={1.1} />
          </At>
          <At x={1000} y={980} s={0.7}>
            <DeadBeetle frame={g} />
          </At>
          <At x={480} y={980} s={1.2}>
            <PricklyPear color={theme.cactus} dark={theme.cactusDark} s={0.9} />
            {bloom > 0 && (
              <g transform={`translate(6 -170) scale(${bloom * 1.8})`}>
                {[0, 72, 144, 216, 288].map((a) => (
                  <ellipse key={a} cx={0} cy={-12} rx={9} ry={14} fill="#F2A0B4" stroke={INK} strokeWidth={2} transform={`rotate(${a})`} />
                ))}
                <circle r={7} fill="#F2C14E" stroke={INK} strokeWidth={2} />
              </g>
            )}
          </At>
          <At x={760} y={980} s={1.25}>
            <Shadow />
            <Dove frame={g} expression="sad" />
          </At>
          <At x={1560} y={990} s={1.05} flip>
            <Vulture frame={g} expression="puzzled" look={[0.6, 0.4]} />
          </At>
          <At x={1480} y={820} s={0.9}>
            <Candle frame={g} />
          </At>
        </Stage>
        <Layer>
          <Fireflies frame={g} count={8} y0={600} y1={900} seed={9} />
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

export const S12: ShotComponent[] = [S12_1, S12_2, S12_3, S12_4];
