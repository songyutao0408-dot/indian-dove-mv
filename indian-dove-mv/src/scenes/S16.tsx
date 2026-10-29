// S16 副歌A·三（白天）：晨练深蹲 → 海市蜃楼大家扑空、老斑鸠淡定 → 缺词梗（卡住、问号、敲脑袋）→ 彩虹眼泪 + 秃鹰撑伞
import React from "react";
import { AbsoluteFill } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { Canteen, DeadBeetle } from "../backgrounds/props";
import { Bison, Dove, Lizard, Vulture, Wolf } from "../characters";
import { QuestionMark } from "../characters/parts";
import { LYRIC_FONT } from "../fonts";
import { DustPuff, HeatHaze } from "../fx";
import { CREAM, INK } from "../style/palette";
import { GAGS } from "../timeline";
import { At, Cam, Layer, Shadow, Stage, easeInOut, easeOut, lerp, pop, useShot, type ShotComponent } from "./common";

const Txt: React.FC<{ x: number; y: number; text: string; size?: number; r?: number; opacity?: number }> = ({ x, y, text, size = 56, r = 0, opacity = 1 }) => (
  <text x={x} y={y} fontSize={size} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={7} paintOrder="stroke" transform={`rotate(${r} ${x} ${y})`} opacity={opacity}>
    {text}
  </text>
);

const MISSING = GAGS.find((g) => g.id === "missing_word")!;

const S16_1: ShotComponent = () => {
  // 晨练：老斑鸠做深蹲，但腿太短，蹲没蹲看不出区别；草尖挂着露珠
  const { f, g, theme } = useShot();
  const rep = Math.floor(f / 12);
  const down = Math.sin(((f % 12) / 12) * Math.PI);
  return (
    <AbsoluteFill>
      <Cam zoom={1.5} oy={860}>
        <Desert theme={theme} frame={g} camX={48400} sun={{ x: 1600, y: 200, face: "wave" }} />
        <Stage>
          <At x={900} y={980 + down * 6} s={1.3}>
            <Shadow />
            <g transform={`scale(1 ${1 - down * 0.03})`}>
              <Dove frame={g} expression={down > 0.5 ? "angry" : "daze"} pose="stand" />
            </g>
          </At>
        </Stage>
        <Layer>
          <Txt x={1160} y={640} text={`${rep % 2 ? "二" : "一"}！`} size={60} opacity={down > 0.3 ? 1 : 0.4} />
          {[300, 1500, 1700].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy={1000 - i * 10} r={9} fill="#BFE6F2" stroke={INK} strokeWidth={2} />
              <circle cx={x - 3} cy={997 - i * 10} r={3} fill="#FFF" />
            </g>
          ))}
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S16_2: ShotComponent = () => {
  // 远处冒出绿洲幻影，其他动物狂奔过去扑了个空；老斑鸠抱着空水壶淡定坐着
  const { f, dur, g, theme } = useShot();
  const vanish = lerp(f, [dur - 18, dur - 8], [1, 0]);
  return (
    <AbsoluteFill>
      <Desert theme={theme} frame={g} camX={49000} horizon={600} sun={{ x: 1650, y: 160, face: "smug" }} />
      <Layer>
        <HeatHaze frame={g} strength={10}>
          <g opacity={0.85 * vanish} transform="translate(560 600)">
            <ellipse cx={0} cy={0} rx={260} ry={34} fill="#6FB3D2" stroke={INK} strokeWidth={3} />
            {[-120, 80].map((x, i) => (
              <g key={i} transform={`translate(${x} -6)`}>
                <path d="M 0 0 Q -10 -90 6 -170" fill="none" stroke="#8E5A34" strokeWidth={12} />
                {[0, 1, 2, 3, 4].map((k) => (
                  <path key={k} d={`M 6 -170 q ${-70 + k * 35} -30 ${-90 + k * 45} 20`} fill="none" stroke="#5E8C4A" strokeWidth={14} strokeLinecap="round" />
                ))}
              </g>
            ))}
          </g>
        </HeatHaze>
        {vanish < 1 && vanish > 0 && <Txt x={480} y={480} text="噗" size={60} opacity={1 - vanish} />}
      </Layer>
      <Stage>
        {/* 狂奔过去的大家（越跑越远越小） */}
        {(
          [
            ["wolf", 1500, 0],
            ["lizard", 1640, 6],
            ["bison", 1780, 12],
          ] as const
        ).map(([id, x0, d]) => {
          const k = lerp(f, [6 + d, dur - 14 + d], [0, 1], easeInOut);
          const x = lerp(k, [0, 1], [x0, 620]);
          const y = lerp(k, [0, 1], [920, 640]);
          const s = lerp(k, [0, 1], [0.8, 0.3]);
          return (
            <At key={id} x={x} y={y} s={s}>
              <DustPuff x={60} y={0} age={(f + d) % 12} color={theme.sand} />
              {id === "wolf" && <Wolf frame={g} expression="grin" facing={-1} />}
              {id === "lizard" && <Lizard frame={g} />}
              {id === "bison" && <Bison frame={g} pose="charge" facing={-1} />}
            </At>
          );
        })}
        <At x={1220} y={1000} s={1.25}>
          <Shadow />
          <Dove frame={g} pose="sit" expression="daze" look={[-0.8, -0.2]} facing={-1} />
        </At>
        <At x={1050} y={900} s={0.5} r={-20}>
          <Canteen />
        </At>
      </Stage>
    </AbsoluteFill>
  );
};

const S16_3: ShotComponent = () => {
  // 缺词梗：唱到「脑袋瓜」卡住，头上冒问号，用翅膀敲自己脑袋咚咚两下，然后接上
  const { g, T, f, theme } = useShot();
  const k = (T - MISSING.start) / (MISSING.end - MISSING.start); // 0–1 是卡壳窗口
  const stuck = k > 0.15 && k < 0.95;
  const knock = k > 0.45 && k < 0.85;
  const knockHit = knock && Math.floor(f / 5) % 2 === 0;
  return (
    <AbsoluteFill>
      <Cam zoom={2.1} oy={640} ox={980} y={-80}>
        <Desert theme={theme} frame={g} camX={49600} near={false} sun={{ x: 1650, y: 160 }} />
        <Stage>
          <At x={960} y={980} r={knockHit ? 6 : 0}>
            <Dove frame={g} expression={!stuck ? "talk" : knock ? "angry" : "confused"} text="" pose={knock ? "flap" : "stand"} />
          </At>
        </Stage>
        <Layer>
          {stuck && (
            <g transform={`translate(1110 480) scale(${pop(lerp(k, [0.15, 0.3], [0, 1])) * 1.4})`}>
              <QuestionMark x={0} y={0} frame={g} />
            </g>
          )}
          {knockHit && <Txt x={1100} y={560} text="咚！" size={48} r={-10} />}
          {stuck && !knock && <Txt x={760} y={560} text="脑袋瓜……呃……" size={34} opacity={easeOut(lerp(k, [0.2, 0.3], [0, 1]))} />}
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S16_4: ShotComponent = () => {
  // 又哭了：泪水喷泉在阳光下变成彩虹；秃鹰在旁边撑起一把伞
  const { f, g, theme } = useShot();
  const bow = lerp(f, [6, 24], [0, 1], easeOut);
  const colors = ["#E0485A", "#F0A15E", "#F2C14E", "#7FB05A", "#4FC2B5", "#6B7FD7", "#B57EDC"];
  return (
    <AbsoluteFill>
      <Cam zoom={1.3} oy={820}>
        <Desert theme={theme} frame={g} camX={50200} sun={{ x: 300, y: 180, face: "wave" }} />
        <Layer>
          {colors.map((c, i) => (
            <path key={c} d={`M ${520 - i * 12} 900 A ${420 + i * 12} ${380 + i * 12} 0 0 1 ${1360 + i * 12} 900`} fill="none" stroke={c} strokeWidth={14} opacity={0.75 * bow} strokeDasharray={`${bow * 1400} 2000`} />
          ))}
        </Layer>
        <Stage>
          <At x={1030} y={985} s={0.7}>
            <DeadBeetle frame={g} />
          </At>
          <At x={780} y={980} s={1.3}>
            <Shadow />
            <Dove frame={g} expression="sad" />
          </At>
          <At x={1450} y={990} s={1.1} flip>
            <Shadow rx={90} />
            <Vulture frame={g} expression="puzzled" look={[0.6, 0.4]} />
          </At>
          {/* 秃鹰撑的伞 */}
          <g transform="translate(1440 560) rotate(-12)">
            <path d="M 0 0 L 0 260" stroke={INK} strokeWidth={8} />
            <path d="M -170 0 Q -170 -140 0 -150 Q 170 -140 170 0 Q 128 -26 85 0 Q 42 -26 0 0 Q -42 -26 -85 0 Q -128 -26 -170 0 Z" fill="#C0392B" stroke={INK} strokeWidth={5} />
            <path d="M 0 -150 L -85 0 M 0 -150 L 85 0" stroke={INK} strokeWidth={3} />
          </g>
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

export const S16: ShotComponent[] = [S16_1, S16_2, S16_3, S16_4];
