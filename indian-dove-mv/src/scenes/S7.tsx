// S7 副歌B·一：坐着发呆 → 乌鸦偷窝、暴怒追赶 → 灌木丛邂逅（慢动作）→ 心动（粉色背景、花瓣、心形眼）
import React from "react";
import { AbsoluteFill } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { DryBush, Nest } from "../backgrounds/props";
import { Crow, Dove, Hen } from "../characters";
import { Heart, onTwos } from "../characters/parts";
import { LYRIC_FONT } from "../fonts";
import { DustPuff, Petals, SpeedLines } from "../fx";
import { CREAM, INK } from "../style/palette";
import { At, Cam, Layer, Shadow, Stage, beatPulse, easeIn, easeInOut, easeOut, lerp, useShot, type ShotComponent } from "./common";

/** 一只嗡嗡飞的苍蝇；land = 停下的位置 */
export const Fly: React.FC<{ f: number; land: [number, number]; landAt: number }> = ({ f, land, landAt }) => {
  const k = Math.min(1, f / landAt);
  // 落下之后在嘴上来回爬、搓脚，翅膀时不时抖一下
  const crawl = f > landAt ? Math.sin((f - landAt) / 6) * 8 : 0;
  const x = land[0] + (1 - k) * (Math.sin(f / 3) * 160 + 220) + crawl;
  const y = land[1] + (1 - k) * (Math.cos(f / 2.3) * 90 - 120) - (f > landAt && Math.floor(f / 4) % 3 === 0 ? 2 : 0);
  const buzz = f <= landAt ? onTwos(f) % 4 < 2 : Math.floor(f / 8) % 3 === 0 && onTwos(f) % 4 < 2;
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={-6} cy={-8} rx={9} ry={5} fill="#DDEAF2" stroke={INK} strokeWidth={2} transform={`rotate(${buzz ? -30 : 10})`} />
      <ellipse cx={6} cy={-8} rx={9} ry={5} fill="#DDEAF2" stroke={INK} strokeWidth={2} transform={`rotate(${buzz ? 30 : -10})`} />
      <ellipse cx={0} cy={0} rx={9} ry={7} fill={INK} />
    </g>
  );
};

const S7_1: ShotComponent = () => {
  // 老斑鸠坐在窝里发呆，一只苍蝇停在嘴上也不动
  const { f, g, theme } = useShot();
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, 61], [1.42, 1.62])} oy={760}>
        <Desert theme={theme} frame={g} camX={17400} sun={{ x: 1600, y: 140, face: "none" }} wind={0.6} />
        <Stage>
          <At x={960} y={980} s={1.3}>
            <Shadow rx={140} />
            <Nest s={1.4} />
            <g transform="translate(0 -6)">
              {/* 苍蝇落下后，眼珠慢慢往中间斗过去盯着它 */}
              <Dove frame={g} pose="sit" expression="daze" look={f > 30 ? [lerp(f, [30, 50], [0.15, 0.9]), lerp(f, [30, 50], [0.25, 0.7])] : undefined} />
            </g>
            <Fly f={f} land={[100, -232]} landAt={30} />
          </At>
        </Stage>
        <Layer>
          {f > 38 && (
            <text x={1280} y={560} fontSize={44} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={6} paintOrder="stroke" opacity={easeOut(lerp(f, [38, 44], [0, 1]))}>
              ……
            </text>
          )}
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S7_2: ShotComponent = () => {
  // 蒙面乌鸦踮脚溜进来叼走窝里的树枝；老斑鸠瞬间冒烟炸毛，小短腿狂奔追出画面
  const { f, dur, g, theme } = useShot();
  const grabAt = 24;
  const angryAt = 34;
  const crowX = f < grabAt ? lerp(f, [0, grabAt], [-200, 820]) : f < grabAt + 8 ? 820 : lerp(f, [grabAt + 8, dur], [820, 2600], easeIn);
  const doveX = f < angryAt + 10 ? 1100 : lerp(f, [angryAt + 10, dur], [1100, 2500], easeIn);
  const running = f > angryAt + 10;
  return (
    <AbsoluteFill>
      <Cam zoom={1.3} oy={820}>
        <Desert theme={theme} frame={g} camX={17400 + (running ? (f - angryAt - 10) * 6 : 0)} sun={{ x: 1600, y: 140, face: "none" }} />
        {running && (
          <Layer>
            <SpeedLines frame={g} y0={300} y1={1000} dir={1} opacity={0.6} />
          </Layer>
        )}
        <Stage>
          <At x={1100} y={980} s={1.3}>
            <Shadow rx={140} />
            <Nest s={1.4} twigs={f < grabAt ? 14 : 9} />
          </At>
          <At x={doveX} y={running ? 980 : 974} s={1.3}>
            {!running && <Dove frame={g} pose="sit" expression={f < angryAt ? (f < grabAt + 4 ? "daze" : "shock") : "angry"} look={[-0.8, 0]} />}
            {running && (
              <>
                <Shadow rx={100} />
                <Dove frame={g * 2} pose="walk" expression="angry" />
              </>
            )}
          </At>
          {running && <DustPuff x={doveX - 120} y={985} age={(f * 2) % 14} color={theme.sand} />}
          <At x={crowX} y={980} s={1.15}>
            <Shadow rx={80} />
            <Crow frame={g} pose={f < grabAt ? "sneak" : f < grabAt + 8 ? "stand" : "run"} twig={f >= grabAt} expression={f >= grabAt + 8 ? "scared" : "sly"} />
          </At>
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

const S7_3: ShotComponent = () => {
  // 老斑鸠急刹车，母斑鸠扭着从灌木丛后走出来，画面变慢
  const { f, g, theme } = useShot();
  const brake = f < 10;
  const slow = Math.round(g / 3); // 慢动作：角色动作降到 1/3
  const doveX = lerp(f, [0, 10], [200, 640], easeOut);
  const henX = lerp(f, [8, 48], [1500, 1230], easeOut);
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [10, 50], [1.25, 1.4], easeInOut)} oy={820}>
        <Desert theme={theme} frame={brake ? g : slow} camX={18200} sun={{ x: 1600, y: 140, face: "none" }} />
        <Stage>
          <At x={doveX} y={980} s={1.3} r={brake ? -12 : 0}>
            <Shadow />
            <Dove frame={brake ? g * 2 : slow} pose={brake ? "walk" : "stand"} expression={brake ? "angry" : "shock"} />
          </At>
          {brake && <DustPuff x={doveX + 80} y={985} age={f} color={theme.sand} />}
          <At x={henX} y={980} s={1.25} flip>
            <Shadow rx={90} />
            <Hen frame={slow} pose="walk" expression="calm" />
          </At>
          <At x={1420} y={990} s={2.2}>
            <DryBush s={1.2} color="#7E8C48" sway={Math.sin(slow / 4) * 8} />
            <DryBush s={0.9} color="#9A7A4A" sway={Math.sin(slow / 5) * 6} />
          </At>
        </Stage>
      </Cam>
      {!brake && (
        <div style={{ position: "absolute", right: 60, top: 40, fontFamily: LYRIC_FONT, fontSize: 40, color: CREAM, WebkitTextStroke: `6px ${INK}`, paintOrder: "stroke fill", opacity: 0.85 }}>
          慢…动…作…
        </div>
      )}
    </AbsoluteFill>
  );
};

const S7_4: ShotComponent = () => {
  // 背景变成粉色，花瓣飘落；老斑鸠心形眼、脸红、飘起来一点；母斑鸠眨长睫毛
  const { f, g, T } = useShot();
  const pink = lerp(f, [0, 8], [0, 1]);
  const float = Math.sin(f / 10) * 8 - lerp(f, [0, 40], [0, 30], easeOut);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#F4B6C2" }} />
      <Layer>
        <g transform={`translate(960 600) scale(${1 + beatPulse(T) * 0.06})`} opacity={pink}>
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i} transform={`rotate(${i * 45 + f})`}>
              <Heart x={0} y={-430} s={40} fill="#F7CBD5" stroke={false} />
            </g>
          ))}
        </g>
        <Petals frame={g} count={30} />
      </Layer>
      <Layer>
        <At x={700} y={980 + float} s={1.9}>
          <Dove frame={g} expression="love" />
        </At>
        <At x={1260} y={990} s={1.85} flip>
          <Hen frame={g} expression={Math.floor(f / 18) % 2 ? "shy" : "love"} />
        </At>
        {Array.from({ length: 4 }, (_, i) => {
          const tt = ((f / 30 + i / 4) % 1);
          return <Heart key={i} x={960 + Math.sin(tt * 6 + i) * 60} y={560 - tt * 400} s={22 + tt * 10} />;
        })}
      </Layer>
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: lerp(f, [0, 5], [0.6, 0]) }} />
    </AbsoluteFill>
  );
};

export const S7: ShotComponent[] = [S7_1, S7_2, S7_3, S7_4];
