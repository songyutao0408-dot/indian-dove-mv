// S8 间奏一（约 25 秒纯音乐）：约会片段 → 风滚草一路滚进小镇 → 钟楼走到正午 → 主街空镜，色调转做旧，「要出大事了」
import React from "react";
import { AbsoluteFill } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { Rock, Tumbleweed } from "../backgrounds/props";
import { ClockTower, TownStreet, WelcomeSign } from "../backgrounds/Town";
import { Dove, Hen } from "../characters";
import { Heart, Star } from "../characters/parts";
import { LYRIC_FONT } from "../fonts";
import { DustPuff, FocusLines, WindGusts } from "../fx";
import { CREAM, INK } from "../style/palette";
import { At, Cam, Layer, Shadow, Stage, beatHop, beatPulse, easeIn, easeInOut, easeOut, lerp, pop, useShot, type ShotComponent } from "./common";

/** 仙人掌果（一切两半时 half = 1） */
const PearFruit: React.FC<{ half?: 0 | 1 | 2; s?: number }> = ({ half = 0, s = 1 }) => (
  <g transform={`scale(${s})`}>
    {half === 0 ? (
      <g>
        <ellipse cx={0} cy={0} rx={34} ry={44} fill="#B8335A" stroke={INK} strokeWidth={4} />
        {[-14, 10, -4, 16].map((x, i) => (
          <circle key={i} cx={x} cy={-20 + i * 12} r={2.5} fill="#F2C14E" />
        ))}
      </g>
    ) : (
      <g transform={half === 1 ? "" : "scale(-1 1)"}>
        <path d="M 0 -44 A 34 44 0 0 0 0 44 Z" fill="#B8335A" stroke={INK} strokeWidth={4} />
        <path d="M 0 -36 A 26 36 0 0 0 0 36 Z" fill="#E8738F" />
        {[-10, 0, 10, -20, 20].map((y, i) => (
          <circle key={i} cx={-10 - (i % 2) * 6} cy={y} r={2.5} fill={INK} />
        ))}
      </g>
    )}
  </g>
);

const S8_1: ShotComponent = () => {
  // 约会①：两只斑鸠分一颗仙人掌果，老斑鸠被刺扎了嘴还在笑
  const { f, g, theme, T } = useShot();
  const split = f >= 30;
  const ouch = f >= 62 && f < 82;
  const toDove = lerp(f, [36, 56], [0, 1], easeInOut);
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, 120], [1.35, 1.5])} oy={820}>
        <Desert theme={theme} frame={g} camX={19400} sun={{ x: 1600, y: 160, face: "wave" }} />
        <Stage>
          <At x={640} y={990} s={1.35}>
            <Shadow />
            <Dove frame={g} pose="sit" expression={ouch ? "shock" : f > 82 ? "happy" : "love"} />
          </At>
          <At x={1280} y={990} s={1.3} flip>
            <Shadow rx={90} />
            <Hen frame={g} pose="sit" expression="happy" />
          </At>
          {!split ? (
            <At x={960} y={860 + beatHop(T, 10)}>
              <PearFruit s={1.6} />
            </At>
          ) : (
            <>
              <At x={lerp(toDove, [0, 1], [940, 770])} y={lerp(toDove, [0, 1], [860, 760])}>
                <PearFruit half={1} s={1.4} />
              </At>
              <At x={1000} y={860}>
                <PearFruit half={2} s={1.4} />
              </At>
            </>
          )}
          {ouch && (
            <>
              <Star x={800} y={700} r={26} rot={f * 12} />
              <text x={830} y={640} fontSize={44} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={6} paintOrder="stroke">
                哎哟
              </text>
            </>
          )}
          {f > 84 &&
            [0, 1, 2].map((i) => {
              const tt = ((f - 84) / 30 + i / 3) % 1;
              return <Heart key={i} x={960 + Math.sin(tt * 5 + i) * 40} y={720 - tt * 300} s={20} />;
            })}
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

const S8_2: ShotComponent = () => {
  // 约会②：两只斑鸠坐在岩石上的背影（剪影），一团风滚草跳着滚过地平线
  const { f, g, theme, T, dur } = useShot();
  const weedX = lerp(f, [0, dur], [-100, 2050]);
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, dur], [1.0, 1.08])} oy={900}>
        <Desert theme={theme} frame={g} camX={20200} horizon={640} near={false} sun={{ x: 960, y: 330, r: 120, face: "none" }} />
        <Stage>
          <At x={weedX} y={600 + beatHop(T, 40)} s={0.5}>
            <Tumbleweed r={50} rot={f * 10} seed={14} />
          </At>
          <At x={weedX - 30} y={640} s={0.5}>
            <DustPuff x={0} y={0} age={f % 12} color={theme.sand} />
          </At>
        </Stage>
        <Layer>
          {/* 前景大石头 + 两只斑鸠的剪影 */}
          <g style={{ filter: "brightness(0.25) saturate(0.4)" }}>
            <At x={960} y={1120} s={3.2}>
              <Rock w={260} h={90} color={theme.mesaDark} shade={theme.mesaDark} seed={21} />
            </At>
            <At x={860} y={860} s={1.2} flip>
              <Dove frame={g} pose="sit" expression="daze" />
            </At>
            <At x={1060} y={866} s={1.15}>
              <Hen frame={g} pose="sit" />
            </At>
          </g>
          {f > 40 && <Heart x={960} y={560 - Math.sin(f / 12) * 10} s={26 * pop(lerp(f, [40, 50], [0, 1]))} />}
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S8_3: ShotComponent = () => {
  // 风把风滚草吹远，镜头跟着它一路滚过沙漠，越过「WELCOME」小镇木牌
  const { f, dur, g, theme, T } = useShot();
  const camX = 21000 + lerp(f, [0, dur], [0, 4200], (x) => x * (0.7 + 0.3 * x));
  const signX = lerp(f, [Math.round(dur * 0.45), dur], [2300, -600]);
  return (
    <AbsoluteFill>
      <Desert theme={theme} frame={g} camX={camX} wind={1} sun={{ x: 1500, y: 160, face: "none" }} />
      <Layer>
        <WindGusts frame={g} y0={500} y1={900} dir={1} />
      </Layer>
      <Stage>
        <At x={signX} y={1000} s={1.2}>
          <Shadow rx={260} />
          <WelcomeSign sway={Math.sin(f / 6) * 3} />
        </At>
        <At x={760} y={930 + beatHop(T, 90)} s={1}>
          <Tumbleweed r={70} rot={f * 16} seed={15} />
        </At>
        <DustPuff x={700} y={1000} age={f % 12} color={theme.sand} />
      </Stage>
    </AbsoluteFill>
  );
};

const S8_4: ShotComponent = () => {
  // 钟楼特写：指针一格一格走到正午，铛——；色调开始转做旧
  const { f, dur, g, theme } = useShot();
  const noonAt = dur - 28;
  const minute = f < noonAt ? 56 + Math.floor(lerp(f, [0, noonAt], [0, 4])) : 60;
  const bell = f > noonAt ? Math.sin((f - noonAt) / 2.5) * Math.max(0, 1 - (f - noonAt) / 30) : 0;
  const zoom = lerp(f, [0, noonAt], [1.0, 1.35], easeInOut) + (f > noonAt ? lerp(f, [noonAt, noonAt + 4], [0.12, 0]) : 0);
  return (
    <AbsoluteFill>
      <Cam zoom={zoom} oy={380}>
        <Desert theme={theme} frame={g} camX={26000} horizon={900} near={false} fg={false} sun={{ x: 1650, y: 200, face: "none" }} />
        <Stage>
          <At x={960} y={1500} s={1.75}>
            <ClockTower hour={minute >= 60 ? 12 : 11} minute={minute % 60} bell={bell} />
          </At>
        </Stage>
        <Layer>
          {f > noonAt && (
            <>
              <FocusLines frame={g} cx={960} cy={300} inner={360} color={INK} />
              <text x={1340} y={260} fontSize={90} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={8} paintOrder="stroke" transform={`rotate(-10 1340 260)`} opacity={easeOut(lerp(f, [noonAt, noonAt + 4], [0, 1]))}>
                铛——
              </text>
            </>
          )}
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S8_5: ShotComponent = () => {
  // 做旧胶片的主街：百叶窗一扇扇啪地关上，风滚草滚过；135.5 秒重鼓点时急推到街尽头
  const { f, dur, g, theme, T } = useShot();
  const hitAt = Math.round((135.5 - 131.9) * 24);
  const camZ = f < hitAt ? lerp(f, [0, hitAt], [0, 260]) : lerp(f, [hitAt, hitAt + 10, dur], [260, 1500, 1900], easeOut);
  const shut = lerp(f, [6, 50], [0, 1], easeIn);
  const weedX = lerp(f, [10, 80], [-150, 2100]);
  return (
    <AbsoluteFill>
      <TownStreet theme={theme} frame={g} camZ={camZ} shut={shut} clock={{ hour: 12, minute: 0 }}>
        <Layer>
          {f < 84 && (
            <At x={weedX} y={960 + beatHop(T, 60)}>
              <Tumbleweed r={60} rot={f * 14} seed={16} />
            </At>
          )}
          {f > hitAt && f < hitAt + 12 && <FocusLines frame={g} cx={960} cy={560} inner={260} color={INK} />}
        </Layer>
      </TownStreet>
      <AbsoluteFill style={{ background: "#000", opacity: beatPulse(T, 0.12) * 0.12 }} />
    </AbsoluteFill>
  );
};

export const S8: ShotComponent[] = [S8_1, S8_2, S8_3, S8_4, S8_5];
