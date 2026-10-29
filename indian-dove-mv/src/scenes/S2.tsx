// S2 主歌一·中：热昏的响尾蛇 → 得意的太阳 → 思维气泡里的沼泽幻想
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { Sun } from "../backgrounds/props";
import { Riverbed } from "../backgrounds/Riverbed";
import { Snake } from "../characters";
import { Bubble, SoundWaves, onTwos } from "../characters/parts";
import { LYRIC_FONT } from "../fonts";
import { HeatHaze, HeatLines } from "../fx";
import { CREAM, INK } from "../style/palette";
import { At, Cam, Layer, Shadow, Stage, easeIn, easeInOut, lerp, pop, useShot, type ShotComponent } from "./common";

const S2_1: ShotComponent = () => {
  // 干涸河床，响尾蛇瘫成一滩，舌头耷拉、满身汗珠，热浪扭曲；镜头慢慢推近
  const { f, dur, g, theme } = useShot();
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, dur], [1, 1.12])} oy={850}>
        <Desert theme={theme} frame={g} camX={4200} sun={{ x: 1500, y: 170, face: "smug" }} wind={0.1} />
        <Layer>
          <Riverbed theme={theme} y0={880} w={260} camX={300} />
        </Layer>
        <Stage>
          <HeatHaze frame={g} strength={5}>
            <At x={940} y={900} s={1.6}>
              <Shadow rx={200} />
              <Snake frame={g} expression="hot" />
            </At>
          </HeatHaze>
          <HeatLines frame={g} x={940} y={760} w={700} n={6} />
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

/** 太阳冲下面呼出来的热气团 */
const HotBreath: React.FC<{ f: number; x: number; y: number }> = ({ f, x, y }) => (
  <g>
    {Array.from({ length: 5 }, (_, i) => {
      const tt = ((onTwos(f) / 20 + i / 5) % 1);
      return (
        <g key={i} opacity={1 - tt}>
          <path
            d={`M ${x - 30 + i * 12} ${y + tt * 420} q 18 -16 0 -32 q -18 -16 0 -32`}
            fill="none"
            stroke="#E07A4F"
            strokeWidth={7}
            strokeLinecap="round"
          />
          <circle cx={x + (i - 2) * 30 + Math.sin(tt * 6) * 10} cy={y + 40 + tt * 380} r={16 + tt * 30} fill="#F7D58B" opacity={0.55} />
        </g>
      );
    })}
  </g>
);

const S2_2: ShotComponent = () => {
  // 先是太阳的大特写（得意脸、往下呼热气），然后镜头往下一甩，落到蛇尾巴——有气无力地摇响
  const { f, g, theme, p } = useShot();
  const pan = lerp(p, [0.56, 0.66], [0, 1], easeInOut);
  const camY = lerp(pan, [0, 1], [1080, 0]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateY(${camY}px)` }}>
        {/* 上半：天空和太阳 */}
        <AbsoluteFill style={{ top: -1080, height: 1080 }}>
          <Layer>
            {theme.sky.map((c, i) => (
              <rect key={i} x={0} y={i * 270} width={1920} height={271} fill={c} />
            ))}
            <At x={960} y={430} s={1}>
              <Sun r={280} frame={g} color={theme.sun} face="smug" />
            </At>
            <HotBreath f={f} x={960} y={700} />
          </Layer>
        </AbsoluteFill>
        {/* 下半：河床上的蛇尾巴特写 */}
        <AbsoluteFill>
          <Desert theme={theme} frame={g} camX={4600} horizon={360} near={false} fg={false} />
          <Layer>
            <Riverbed theme={theme} y0={760} w={520} camX={900} seed={3} />
          </Layer>
          <Stage>
            <At x={1300} y={820} s={3.2} r={-4}>
              <Snake frame={g} expression="hot" />
            </At>
            {/* 有气无力的「沙沙」声 */}
            {pan > 0.9 && (
              <text x={380} y={560} fontSize={54} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={6} paintOrder="stroke" opacity={0.5 + 0.5 * Math.sin(f / 2)}>
                沙…沙…
              </text>
            )}
          </Stage>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* 甩镜头时的竖向速度线 */}
      {pan > 0.02 && pan < 0.98 && (
        <Layer>
          {Array.from({ length: 22 }, (_, i) => (
            <path key={i} d={`M ${random(`v${i}`) * 1920} ${random(`vy${i}`) * 1080} l 0 ${300 + random(`vl${i}`) * 400}`} stroke={CREAM} strokeWidth={4} opacity={0.7} />
          ))}
        </Layer>
      )}
    </AbsoluteFill>
  );
};

/** 沼泽幻想：阴天、下雨、泥水、荷叶、青蛙合唱，蛇泡在泥水里享受 */
export const SwampDream: React.FC<{ g: number; snakeFrame?: number }> = ({ g }) => {
  const f = onTwos(g);
  const frog = (x: number, y: number, s: number, k: number) => (
    <At x={x} y={y} s={s}>
      <ellipse cx={0} cy={0} rx={70} ry={20} fill="#6E9A4A" stroke={INK} strokeWidth={4} />
      <ellipse cx={0} cy={-26} rx={46} ry={30} fill="#7FB05A" stroke={INK} strokeWidth={4} />
      <circle cx={-22} cy={-56} r={16} fill="#7FB05A" stroke={INK} strokeWidth={4} />
      <circle cx={22} cy={-56} r={16} fill="#7FB05A" stroke={INK} strokeWidth={4} />
      <circle cx={-22} cy={-56} r={7} fill={INK} />
      <circle cx={22} cy={-56} r={7} fill={INK} />
      {/* 鼓起来的声囊 */}
      <ellipse cx={0} cy={-12} rx={22 + (Math.floor(f / 6 + k) % 2) * 12} ry={14 + (Math.floor(f / 6 + k) % 2) * 8} fill="#E9D8A0" stroke={INK} strokeWidth={3} />
      {Math.floor(f / 6 + k) % 2 === 1 && (
        <>
          <SoundWaves x={40} y={-30} dir={1} frame={g} />
          <text x={60} y={-80} fontSize={40} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={5} paintOrder="stroke">
            呱
          </text>
        </>
      )}
    </At>
  );
  return (
    <>
      <Layer>
        {["#7C8EA8", "#8D9DB2", "#9FAFC0", "#B4C2CC"].map((c, i) => (
          <rect key={i} x={0} y={i * 150} width={1920} height={151} fill={c} />
        ))}
        {/* 乌云 */}
        {[300, 900, 1500].map((x, i) => (
          <path
            key={i}
            transform={`translate(${x + Math.sin(g / 30 + i) * 20} ${140 + i * 20}) scale(2.4)`}
            d="M -80 16 C -100 16 -100 -16 -76 -16 C -76 -44 -36 -50 -24 -30 C -12 -60 34 -60 40 -28 C 60 -40 94 -24 84 0 C 100 4 98 22 80 22 Z"
            fill="#5C6478"
            stroke={INK}
            strokeWidth={2.5}
          />
        ))}
        {/* 泥水 */}
        <rect x={0} y={600} width={1920} height={480} fill="#6A7A4E" />
        <rect x={0} y={600} width={1920} height={14} fill="#55643E" />
        {/* 涟漪 */}
        {Array.from({ length: 14 }, (_, i) => {
          const tt = (f / 20 + random(`rp${i}`)) % 1;
          return <ellipse key={i} cx={random(`rx${i}`) * 1920} cy={640 + random(`ry${i}`) * 420} rx={10 + tt * 60} ry={4 + tt * 16} fill="none" stroke="#A9B88A" strokeWidth={3} opacity={1 - tt} />;
        })}
        {/* 荷叶、香蒲 */}
        {[
          [260, 760],
          [1640, 700],
          [1500, 940],
          [380, 980],
        ].map(([x, y], i) => (
          <path key={i} d={`M ${x} ${y} m -70 0 a 70 26 0 1 0 140 0 a 70 26 0 1 0 -140 0 Z M ${x} ${y} L ${x + 60} ${y - 12}`} fill="#5E8C4A" stroke={INK} strokeWidth={4} />
        ))}
        {[120, 160, 1800, 1840].map((x, i) => (
          <g key={i}>
            <path d={`M ${x} 640 L ${x + Math.sin(g / 20 + i) * 8} 420`} stroke={INK} strokeWidth={7} />
            <rect x={x - 10 + Math.sin(g / 20 + i) * 8} y={400} width={20} height={70} rx={10} fill="#7A4A2A" stroke={INK} strokeWidth={3} />
          </g>
        ))}
        {/* 雨 */}
        {Array.from({ length: 60 }, (_, i) => {
          const x = (random(`rain${i}`) * 2100 + f * 6) % 2100 - 90;
          const y = ((random(`rainy${i}`) * 1100 + f * 60) % 1200) - 100;
          return <path key={i} d={`M ${x} ${y} l -8 36`} stroke="#DDEAF2" strokeWidth={4} strokeLinecap="round" opacity={0.85} />;
        })}
      </Layer>
      <Layer>
        {frog(330, 760, 1, 0)}
        {frog(1560, 690, 0.8, 1)}
        {/* 泡在泥水里的蛇（下半身没在水里） */}
        <defs>
          <clipPath id="swampclip">
            <rect x={-2000} y={-2000} width={4000} height={2000 + 10} />
          </clipPath>
        </defs>
        <At x={960} y={860} s={1.9}>
          <g clipPath="url(#swampclip)">
            <Snake frame={g} expression="happy" pose="limp" />
          </g>
          <ellipse cx={0} cy={10} rx={260} ry={16} fill="none" stroke="#A9B88A" strokeWidth={4} />
        </At>
      </Layer>
    </>
  );
};

const S2_3: ShotComponent = () => {
  // 蛇头顶冒出思维气泡 → 镜头推进气泡 → 沼泽幻想 → 气泡「啪」地破掉，回到现实
  const { f, dur, g, theme } = useShot();
  const grow = pop(lerp(f, [4, 26], [0, 1]));
  const dive = lerp(f, [36, 58], [0, 1], easeIn); // 推进气泡
  const popAt = dur - 12;
  const popped = f >= popAt;
  // 气泡在画面上的位置（蛇头上方），推进时放大到满屏
  const bx = 1250;
  const by = 330;
  const bubbleScale = lerp(dive, [0, 1], [1, 9]);
  return (
    <AbsoluteFill>
      {/* 现实：河床上的蛇 */}
      <Cam zoom={lerp(f, [0, 30], [1, 1.05])} oy={800}>
        <Desert theme={theme} frame={g} camX={4300} sun={{ x: 300, y: 150, face: "smug" }} />
        <Layer>
          <Riverbed theme={theme} y0={880} w={260} camX={340} />
        </Layer>
        <Stage>
          <At x={900} y={900} s={1.6}>
            <Shadow rx={200} />
            <Snake frame={g} expression={popped ? "hot" : "sleep"} />
          </At>
          {popped && (
            <text x={1100} y={420} fontSize={110} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={8} paintOrder="stroke" transform={`rotate(-8 1100 420)`}>
              啪！
            </text>
          )}
        </Stage>
      </Cam>
      {/* 思维气泡 */}
      {!popped && (
        <AbsoluteFill style={{ transformOrigin: `${bx}px ${by}px`, transform: `scale(${bubbleScale})` }}>
          <Layer>
            <g transform={`translate(${bx} ${by}) scale(${grow})`}>
              <Bubble x={-250} y={-170} w={500} h={300} tail={[-120, 380]} thought>
                <g>
                  <defs>
                    <clipPath id="thoughtclip">
                      <ellipse cx={0} cy={-20} rx={235} ry={140} />
                    </clipPath>
                  </defs>
                  <g clipPath="url(#thoughtclip)">
                    <g transform="translate(-250 -170) scale(0.2604 0.2778)">
                      <SwampDream g={g} />
                    </g>
                  </g>
                </g>
              </Bubble>
            </g>
          </Layer>
        </AbsoluteFill>
      )}
      {/* 推进完成后直接是满屏的沼泽 */}
      {!popped && dive >= 1 && (
        <AbsoluteFill>
          <SwampDream g={g} />
        </AbsoluteFill>
      )}
      {/* 破掉的闪白 */}
      <AbsoluteFill style={{ background: "#FFF8E8", opacity: lerp(f, [popAt, popAt + 1, popAt + 5], [0, 0.9, 0]) }} />
      {f >= popAt && f < popAt + 6 && (
        <Layer>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const r0 = 120 + (f - popAt) * 40;
            return <path key={i} d={`M ${bx + Math.cos(a) * r0} ${by + Math.sin(a) * r0} l ${Math.cos(a) * 60} ${Math.sin(a) * 60}`} stroke={INK} strokeWidth={8} strokeLinecap="round" />;
          })}
        </Layer>
      )}
    </AbsoluteFill>
  );
};

export const S2: ShotComponent[] = [S2_1, S2_2, S2_3];
