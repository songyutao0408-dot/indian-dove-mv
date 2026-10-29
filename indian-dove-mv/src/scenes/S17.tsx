// S17 Hook·三（白天）：内容同 S6，但前面出场过的所有角色开始往峡谷前聚集
import React from "react";
import { AbsoluteFill } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { Bison, Cactus, CatDog, Chief, Cowboy, Dove, Loach, Seagull, Shaman, Skull, Vulture } from "../characters";
import { Bubble } from "../characters/parts";
import { LYRIC_FONT } from "../fonts";
import { DustPuff } from "../fx";
import { CREAM, INK } from "../style/palette";
import { At, Cam, Layer, Shadow, Stage, beatHop, easeInOut, easeOut, lerp, pop, useShot, type ShotComponent } from "./common";
import { Fry } from "./S1";
import { CastMember } from "./cast";
import type { CharId } from "../shots";

const S17_1: ShotComponent = () => {
  // 老斑鸠学牛仔说话，牛仔愣住；背景里角色们开始陆续往峡谷前走
  const { f, g, theme, T } = useShot();
  const echo = f >= 24;
  const walkers: CharId[] = ["wolf", "snake", "lizard", "bison", "shaman"];
  return (
    <AbsoluteFill>
      <Cam zoom={1.25} oy={780}>
        <Desert theme={theme} frame={g} camX={51000} sun={{ x: 1650, y: 160, face: "wave" }} />
        <Stage>
          {walkers.map((id, i) => (
            <At key={id} x={-200 + ((f * 9 + i * 420) % 2400)} y={700} s={0.32}>
              <CastMember id={id} g={g} T={T} mode="run" seed={i} />
            </At>
          ))}
          <At x={560} y={1000} s={1.05}>
            <Shadow />
            <Cowboy frame={g} expression={echo ? "surprised" : "talk"} />
          </At>
          <At x={1240} y={1000} s={1.25}>
            <Shadow />
            <Dove frame={g} expression={echo ? "talk" : "daze"} text="" facing={-1} />
          </At>
          <g transform={`translate(600 360) scale(${pop(lerp(f, [2, 8], [0, 1])) * (echo ? lerp(f, [24, 28], [1, 0]) : 1)})`}>
            <Bubble x={0} y={-90} w={340} h={110} tail={[-30, 60]} text="Yee-haw!" fontSize={50} />
          </g>
          <g transform={`translate(1060 380) scale(${pop(lerp(f, [26, 32], [0, 1]))})`}>
            <Bubble x={-340} y={-90} w={360} h={110} tail={[60, 70]} text="Yee-haw～" fontSize={50} />
          </g>
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

const S17_2: ShotComponent = () => {
  // 仙人掌捂着脸，一小步一小步挪向峡谷
  const { f, g, theme, T } = useShot();
  return (
    <AbsoluteFill>
      <Cam zoom={1.2} oy={800}>
        <Desert theme={theme} frame={g} camX={51600 + f * 4} sun={{ x: 300, y: 160 }} />
        <Stage>
          <At x={lerp(f, [0, 30], [700, 1100])} y={1000 + beatHop(T, 24)} s={1.2}>
            <Shadow rx={90} />
            <Cactus frame={g} pose="shy" />
          </At>
        </Stage>
        <Layer>
          <text x={1340} y={560} fontSize={44} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={6} paintOrder="stroke">
            （小碎步）
          </text>
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S17_3: ShotComponent = () => {
  // 蜥蜴横着走在最前面，后面跟着一串排队的角色
  const { f, g, theme, T } = useShot();
  const line: CharId[] = ["lizard", "loach", "seagull", "bison", "snake"];
  return (
    <AbsoluteFill>
      <Desert theme={theme} frame={g} camX={52200 + f * 10} sun={{ x: 1600, y: 160 }} />
      <Stage>
        {line.map((id, i) => {
          const x = lerp(f, [0, 39], [1400, 1900]) - i * 300;
          return (
            <At key={id} x={x} y={1000 + beatHop(T + i * 0.12, 18)} s={id === "bison" ? 0.75 : 1.05}>
              <Shadow rx={80} />
              <CastMember id={id} g={g} T={T} mode="run" seed={i} />
              <DustPuff x={-60} y={0} age={(f + i * 3) % 12} color={theme.sand} />
            </At>
          );
        })}
      </Stage>
    </AbsoluteFill>
  );
};

/** 三格漫画分屏 */
const Panels: React.FC<{ children: React.ReactNode[] }> = ({ children }) => {
  const { f } = useShot();
  return (
    <AbsoluteFill style={{ background: INK }}>
      {children.map((c, i) => {
        const k = pop(lerp(f, [i * 4, i * 4 + 6], [0, 1]));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 20 + i * 633,
              top: 20,
              width: 613,
              height: 1040,
              overflow: "hidden",
              border: `6px solid ${CREAM}`,
              borderRadius: 10,
              transform: `translateY(${(1 - k) * 1100}px)`,
            }}
          >
            <div style={{ position: "absolute", left: -653, top: -20, width: 1920, height: 1080 }}>{c}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const S17_4: ShotComponent = () => {
  // 快切三格：泥鳅钻出来跟上 / 海鸥降落把薯条分给秃鹰 / 两头野牛肩并肩走来
  const { f, g, theme } = useShot();
  return (
    <Panels>
      {[
        <AbsoluteFill key="a">
          <Desert theme={theme} frame={g} camX={53000} near={false} />
          <Stage>
            <At x={960} y={980} s={2.4}>
              <Loach frame={g} out={pop(lerp(f, [0, 10], [0, 1]))} look={1} sandColor={theme.sand} />
            </At>
          </Stage>
        </AbsoluteFill>,
        <AbsoluteFill key="b">
          <Desert theme={theme} frame={g} camX={53400} near={false} />
          <Stage>
            <At x={900} y={980} s={1.2} flip>
              <Vulture frame={g} look={[0.6, 0.2]} />
            </At>
            <At x={1080} y={lerp(f, [4, 16], [600, 980], easeOut)} s={1.0} flip>
              <Seagull frame={g} pose={f < 16 ? "fly" : "stand"} />
            </At>
            {f > 18 && (
              <At x={990} y={760} r={-30}>
                <Fry len={50} />
              </At>
            )}
          </Stage>
        </AbsoluteFill>,
        <AbsoluteFill key="c">
          <Desert theme={theme} frame={g} camX={53800} near={false} />
          <Stage>
            <At x={lerp(f, [8, 32], [700, 1000])} y={960} s={0.62}>
              <Bison frame={g} pose="stand" />
            </At>
            <At x={lerp(f, [8, 32], [740, 1040])} y={1030} s={0.66}>
              <Bison frame={g + 6} pose="stand" tint="#86603E" />
            </At>
          </Stage>
        </AbsoluteFill>,
      ]}
    </Panels>
  );
};

const S17_5: ShotComponent = () => {
  // 巫师给酋长头上的乌云撑了把伞，两人和好，骷髅头在一旁点头
  const { f, g, theme } = useShot();
  return (
    <AbsoluteFill>
      <Cam zoom={1.15} oy={760}>
        <Desert theme={theme} frame={g} camX={54400} sun={{ x: 1650, y: 160, face: "wave" }} />
        <Stage>
          <At x={1080} y={1000} s={1.1}>
            <Shadow />
            <Chief frame={g} expression={f > 16 ? "happy" : "cursed"} cloud />
          </At>
          <At x={760} y={1000} s={1.05}>
            <Shadow />
            <Shaman frame={g} />
          </At>
          {/* 伞 */}
          <g transform={`translate(${lerp(f, [0, 12], [800, 1060], easeInOut)} 380) rotate(8)`}>
            <path d="M 0 0 L 0 200" stroke={INK} strokeWidth={8} />
            <path d="M -170 0 Q -170 -140 0 -150 Q 170 -140 170 0 Q 128 -26 85 0 Q 42 -26 0 0 Q -42 -26 -85 0 Q -128 -26 -170 0 Z" fill="#4FC2B5" stroke={INK} strokeWidth={5} />
          </g>
          <At x={1420} y={1000} s={0.9}>
            <Shadow rx={70} />
            <Skull frame={g} mode="nod" />
          </At>
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

const S17_6: ShotComponent = () => {
  // 像猫的狗最后一个到，跳进酋长怀里蜷成一团；镜头拉开，是聚齐的人群
  const { f, dur, g, theme, T } = useShot();
  const jump = lerp(f, [4, 18], [0, 1], easeInOut);
  const pull = lerp(f, [24, dur], [1.7, 1.0], easeInOut);
  const crowd: CharId[] = ["cowboy", "wolf", "cactus", "dove", "hen", "warrior", "shaman", "bison"];
  return (
    <AbsoluteFill>
      <Cam zoom={pull} ox={1100} oy={640}>
        <Desert theme={theme} frame={g} camX={55000} sun={{ x: 1650, y: 160, face: "wave" }} />
        <Stage>
          {crowd.map((id, i) => (
            <At key={id} x={180 + i * 230 - (i > 3 ? -60 : 0)} y={900 + (i % 2) * 40} s={0.72}>
              <Shadow rx={90} />
              <CastMember id={id} g={g} T={T} mode="idle" seed={i} facing={i < 4 ? 1 : -1} />
            </At>
          ))}
          <At x={1100} y={1000} s={0.95}>
            <Shadow />
            <Chief frame={g} expression="happy" holding />
          </At>
          <At x={lerp(jump, [0, 1], [1500, 1110])} y={lerp(jump, [0, 1], [1000, 790]) - Math.sin(jump * Math.PI) * 220} s={0.62} r={jump < 1 ? -20 : 0}>
            <CatDog frame={g} pose={jump < 1 ? "pounce" : "lick"} facing={-1} />
          </At>
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

export const S17: ShotComponent[] = [S17_1, S17_2, S17_3, S17_4, S17_5, S17_6];
