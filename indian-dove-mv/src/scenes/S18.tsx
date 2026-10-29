// S18 副歌B·三：全员到齐，母斑鸠和老斑鸠站在中间
import React from "react";
import { AbsoluteFill } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { DryBush, Nest } from "../backgrounds/props";
import { Crow, Dove, Hen } from "../characters";
import { Bubble, Heart } from "../characters/parts";
import { LYRIC_FONT } from "../fonts";
import { DustPuff, Petals } from "../fx";
import { CREAM, INK } from "../style/palette";
import type { CharId } from "../shots";
import { At, Cam, Layer, Shadow, Stage, easeIn, easeInOut, easeOut, lerp, pop, useShot, type ShotComponent } from "./common";
import { CastMember, type CastMode } from "./cast";

// 合影站位：后排高个子，前排矮个子，正中间留给两只斑鸠
const BACK: [CharId, number][] = [
  ["cactus", 160], ["cowboy", 380], ["warrior", 600], ["chief", 1320], ["shaman", 1540], ["wolf", 1760],
];
const FRONT: [CharId, number][] = [
  ["bison", 230], ["vulture", 520], ["snake", 700], ["skull", 1240], ["catdog", 1420], ["lizard", 1620], ["seagull", 1800],
];
const SMALL: [CharId, number][] = [["loach", 860], ["crow", 1100]];

/** 全员合影；spread = 人群向两边让开的程度 0–1 */
export const Crowd: React.FC<{ mode: CastMode; spread?: number; skip?: CharId[]; s?: number }> = ({ mode, spread = 0, skip = [], s = 1 }) => {
  const { g, T } = useShot();
  const push = (x: number) => x + (x < 960 ? -1 : 1) * spread * 260;
  return (
    <>
      {BACK.filter(([id]) => !skip.includes(id)).map(([id, x], i) => (
        <At key={id} x={push(x)} y={860} s={0.62 * s}>
          <Shadow rx={90} />
          <CastMember id={id} g={g} T={T} mode={mode} seed={i} facing={x < 960 ? 1 : -1} />
        </At>
      ))}
      {[...FRONT, ...SMALL].filter(([id]) => !skip.includes(id)).map(([id, x], i) => (
        <At key={id} x={push(x)} y={980} s={0.72 * s}>
          <Shadow rx={90} />
          <CastMember id={id} g={g} T={T} mode={mode} seed={i + 6} facing={x < 960 ? 1 : -1} />
        </At>
      ))}
    </>
  );
};

const S18_1: ShotComponent = () => {
  // 大合影机位：大家叽叽喳喳冒气泡，中间的老斑鸠安安静静站着
  const { f, g, theme } = useShot();
  const chatter: [number, number, string][] = [
    [380, 420, "叽叽"],
    [1540, 430, "喳喳"],
    [700, 600, "哈哈"],
    [1420, 640, "Howdy"],
    [240, 640, "嘿！"],
  ];
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, 53], [1.05, 1.12])} oy={760}>
        <Desert theme={theme} frame={g} camX={56000} sun={{ x: 1650, y: 150, face: "wave" }} />
        <Stage>
          <Crowd mode="idle" />
          <At x={960} y={990} s={1.0}>
            <Shadow />
            <Dove frame={g} expression="daze" />
          </At>
        </Stage>
        <Layer>
          {chatter.map(([x, y, t], i) => {
            const on = Math.floor((f + i * 7) / 10) % 3 !== 2;
            return on ? (
              <g key={i} transform={`translate(${x} ${y}) scale(${pop(((f + i * 7) % 10) / 4)})`}>
                <Bubble x={-80} y={-46} w={160} h={70} tail={[0, 70]} text={t} fontSize={34} />
              </g>
            ) : null;
          })}
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S18_2: ShotComponent = () => {
  // 乌鸦又来偷窝，这次全体角色一起追；乌鸦乖乖把窝送回来
  const { f, dur, g, theme } = useShot();
  const stealEnd = 14;
  const chaseEnd = Math.round(dur * 0.62);
  const back = f >= chaseEnd;
  const crowX = f < stealEnd ? lerp(f, [0, stealEnd], [300, 960]) : !back ? lerp(f, [stealEnd, chaseEnd], [960, 2400], easeIn) : lerp(f, [chaseEnd, dur], [2100, 1060], easeOut);
  const crowdX = !back ? lerp(f, [stealEnd + 4, chaseEnd], [0, 2200], easeIn) : 0;
  return (
    <AbsoluteFill>
      <Cam zoom={1.1} oy={760}>
        <Desert theme={theme} frame={g} camX={56000 + crowdX * 0.3} sun={{ x: 1650, y: 150, face: "wave" }} />
        <Stage>
          {!back && f >= stealEnd + 4 && (
            <g transform={`translate(${crowdX} 0)`}>
              <Crowd mode="run" skip={["crow", "loach", "skull"]} />
              {Array.from({ length: 6 }, (_, i) => (
                <DustPuff key={i} x={100 + i * 300} y={990} age={(f + i * 2) % 12} color={theme.sand} />
              ))}
            </g>
          )}
          {(f < stealEnd + 4 || back) && (
            <>
              {back && <Crowd mode="idle" skip={["crow"]} />}
              <At x={960} y={990} s={1.0}>
                <Shadow />
                <Dove frame={g} expression={back ? "happy" : f > 6 ? "angry" : "daze"} />
              </At>
              {!back && (
                <At x={960} y={1000} s={0.9}>
                  <Nest s={1.2} />
                </At>
              )}
            </>
          )}
          <At x={crowX} y={1000} s={0.85} flip={back}>
            <Shadow rx={70} />
            <Crow frame={g} pose={back ? "stand" : f < stealEnd ? "sneak" : "run"} expression={back ? "sheepish" : f < stealEnd ? "sly" : "scared"} twig={!back} />
            {back && (
              <g transform="translate(70 -120)">
                <Nest s={0.8} />
              </g>
            )}
          </At>
        </Stage>
        <Layer>
          {back && (
            <text x={1120} y={700} fontSize={44} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={6} paintOrder="stroke" opacity={easeOut(lerp(f, [chaseEnd + 6, chaseEnd + 12], [0, 1]))}>
              对、对不起…
            </text>
          )}
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S18_3: ShotComponent = () => {
  // 母斑鸠从灌木丛走出来，人群向两边让开一条路
  const { f, g, theme } = useShot();
  const spread = lerp(f, [0, 22], [0, 1], easeInOut);
  const henY = lerp(f, [8, 52], [820, 1000], easeOut);
  return (
    <AbsoluteFill>
      <Cam zoom={1.08} oy={760}>
        <Desert theme={theme} frame={g} camX={56000} sun={{ x: 1650, y: 150, face: "wave" }} />
        <Stage>
          <At x={1060} y={800} s={1.6}>
            <DryBush s={1.1} color="#7E8C48" sway={Math.sin(g / 6) * 8} />
          </At>
          <Crowd mode="idle" spread={spread} skip={["crow", "loach"]} />
          <At x={1020} y={henY} s={lerp(f, [8, 52], [0.8, 1.0])} flip>
            <Shadow rx={90} />
            <Hen frame={g} pose="walk" expression="calm" />
          </At>
          <At x={760} y={1000} s={1.0}>
            <Shadow />
            <Dove frame={g} expression="shock" />
          </At>
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

const S18_4: ShotComponent = () => {
  // 两只斑鸠站在正中间，冒出爱心，全员「哇」，跟着拖音定格
  const { f, dur, g, theme } = useShot();
  const freezeAt = dur - 18;
  const fg = f < freezeAt ? g : g - f + freezeAt;
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, freezeAt], [1.0, 1.15], easeInOut)} oy={820}>
        <Desert theme={theme} frame={fg} camX={56000} sun={{ x: 1650, y: 150, face: "wave" }} />
        <Stage>
          <Crowd mode="cheer" spread={0.6} skip={["crow", "loach"]} />
          <At x={850} y={1000} s={1.15}>
            <Shadow />
            <Dove frame={fg} expression="love" />
          </At>
          <At x={1080} y={1000} s={1.1} flip>
            <Shadow rx={90} />
            <Hen frame={fg} expression="love" />
          </At>
        </Stage>
        <Layer>
          <Petals frame={g} count={18} />
          {Array.from({ length: 5 }, (_, i) => {
            const tt = ((f / 30 + i / 5) % 1);
            return <Heart key={i} x={965 + Math.sin(tt * 6 + i) * 70} y={640 - tt * 380} s={20 + tt * 14} />;
          })}
          <text x={300} y={420} fontSize={64} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={7} paintOrder="stroke" opacity={easeOut(lerp(f, [6, 12], [0, 1]))}>
            哇～
          </text>
          <text x={1460} y={400} fontSize={64} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={7} paintOrder="stroke" opacity={easeOut(lerp(f, [10, 16], [0, 1]))}>
            哇～
          </text>
        </Layer>
      </Cam>
      {f >= freezeAt && <AbsoluteFill style={{ background: "#FFF8E8", opacity: lerp(f, [freezeAt, freezeAt + 4], [0.6, 0]) }} />}
    </AbsoluteFill>
  );
};

export const S18: ShotComponent[] = [S18_1, S18_2, S18_3, S18_4];
