// S10 主歌二（黄昏 → 夜晚）：对应 S1–S3 的内容，全部换机位和时段。开头是胶片烧穿的白光褪去。
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { DeadTree, Moon, Rock, Tumbleweed } from "../backgrounds/props";
import { Riverbed } from "../backgrounds/Riverbed";
import { Bison, Dove, Loach, Seagull, Snake, Vulture, Wolf, Bone } from "../characters";
import { Bubble, Star } from "../characters/parts";
import { LYRIC_FONT } from "../fonts";
import { DustCloud, ImpactStars, WindGusts } from "../fx";
import { CREAM, INK } from "../style/palette";
import { At, Cam, Layer, Shadow, Stage, beatHop, beatPulse, easeIn, easeInOut, easeOut, lerp, pop, shake, useShot, type ShotComponent } from "./common";
import { SwampDream } from "./S2";
import { Fry } from "./S1";

const Caption: React.FC<{ x: number; y: number; text: string; size?: number; r?: number; opacity?: number }> = ({ x, y, text, size = 60, r = 0, opacity = 1 }) => (
  <text x={x} y={y} fontSize={size} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={7} paintOrder="stroke" transform={`rotate(${r} ${x} ${y})`} opacity={opacity}>
    {text}
  </text>
);

const S10_1: ShotComponent = () => {
  // 白光褪成黄昏；贴地超低机位：泥鳅钻出沙面，身后是刚升起的大月亮
  const { f, g, theme, T } = useShot();
  const out = pop(lerp(f, [10, 22], [0, 1]));
  const look = Math.floor((T - 148) / 0.627) % 2 ? 1 : -1;
  return (
    <AbsoluteFill>
      <Cam zoom={1.1} oy={900}>
        <Desert theme={theme} frame={g} camX={30000} horizon={820} near={false} moon={{ x: 1300, y: 720, r: 260 }} />
        <Stage>
          <At x={760} y={1080} s={3.2}>
            <Loach frame={g} out={out} look={f < 22 ? 0 : look} sandColor={theme.sand} />
          </At>
        </Stage>
      </Cam>
      <AbsoluteFill style={{ background: "#FFF8E8", opacity: lerp(f, [0, 14], [1, 0], easeOut) }} />
    </AbsoluteFill>
  );
};

const S10_2: ShotComponent = () => {
  // 海鸥变成剪影横穿落日；薯条剪影掉下来，砸中泥鳅的头
  const { f, dur, g, theme } = useShot();
  const gx = lerp(f, [0, dur * 0.7], [-200, 2200]);
  const dropAt = Math.round(dur * 0.25);
  const hitAt = Math.round(dur * 0.62);
  const fryX = lerp(f, [dropAt, hitAt], [lerp(dropAt, [0, dur * 0.7], [-200, 2200]) + 90, 1430]);
  const fryY = lerp(f, [dropAt, hitAt], [430, 860], easeIn);
  const hit = f >= hitAt;
  return (
    <AbsoluteFill>
      <Desert theme={theme} frame={g} camX={30400} horizon={760} near={false} sun={{ x: 960, y: 560, r: 260, face: "sleepy" }} />
      <Layer>
        <g style={{ filter: "brightness(0)" }} opacity={0.88}>
          <At x={gx} y={430 + Math.sin(f / 6) * 20} s={1.3}>
            <Seagull frame={g} />
          </At>
          {f >= dropAt && !hit && (
            <At x={fryX} y={fryY} r={f * 30}>
              <Fry len={60} />
            </At>
          )}
          <At x={1430} y={1000} s={1.4}>
            <Loach frame={g} bonked={hit} lookUp={!hit} mound />
          </At>
        </g>
        {hit && (
          <>
            <ImpactStars x={1430} y={790} age={f - hitAt} s={0.7} burst={false} />
            <Caption x={1500} y={720} text="咚！" size={70} r={-10} />
          </>
        )}
      </Layer>
    </AbsoluteFill>
  );
};

/** 俯瞰的峡谷：沙地 + 平顶山顶面 + 阴影 */
const Aerial: React.FC<{ scroll: number; children?: React.ReactNode }> = ({ scroll, children }) => {
  const { theme } = useShot();
  return (
    <AbsoluteFill style={{ background: theme.sand }}>
      <Layer>
        {Array.from({ length: 18 }, (_, i) => {
          const x = ((random(`ax${i}`) * 2600 - scroll) % 2600 + 2600) % 2600 - 340;
          return <ellipse key={i} cx={x} cy={random(`ay${i}`) * 1080} rx={140 + random(`ar${i}`) * 140} ry={40 + random(`ar2${i}`) * 50} fill={theme.sandShadow} opacity={0.55} />;
        })}
        {Array.from({ length: 6 }, (_, i) => {
          const x = ((random(`mx${i}`) * 2800 - scroll * 1.2) % 2800 + 2800) % 2800 - 400;
          const y = random(`my${i}`) * 1080;
          const w = 220 + random(`mw${i}`) * 200;
          const h = 140 + random(`mh${i}`) * 120;
          return (
            <g key={i}>
              <path d={`M ${x + 30} ${y + 40} l ${w} 0 l 60 ${h} l ${-w} 0 Z`} fill={theme.mesaDark} opacity={0.7} />
              <path d={`M ${x} ${y} l ${w} -10 l 20 ${h} l ${-w} 10 Z`} fill={theme.mesa} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
              <path d={`M ${x + 30} ${y + 30} l ${w * 0.6} -6`} stroke={theme.mesaDark} strokeWidth={4} />
            </g>
          );
        })}
      </Layer>
      {children}
    </AbsoluteFill>
  );
};

const S10_3: ShotComponent = () => {
  // 高空俯瞰：一群风滚草像羊群一样被风赶着跑，镜头倾斜
  const { f, g, T } = useShot();
  const herd = Array.from({ length: 11 }, (_, i) => {
    const x = ((i * 173 + f * 14) % 2400) - 240;
    const y = 300 + ((i * 97) % 520) + Math.sin(f / 6 + i) * 20;
    return (
      <At key={i} x={x} y={y + beatHop(T + i * 0.1, 18)} s={0.5 + (i % 3) * 0.12}>
        <ellipse cx={20} cy={50} rx={60} ry={20} fill={INK} opacity={0.2} />
        <Tumbleweed r={60} rot={f * 12 + i * 30} seed={20 + i} />
      </At>
    );
  });
  return (
    <AbsoluteFill>
      <Cam rot={-8} zoom={1.2}>
        <Aerial scroll={f * 6}>
          <Layer>
            {herd}
            <WindGusts frame={g} y0={150} y1={950} dir={1} />
          </Layer>
        </Aerial>
      </Cam>
    </AbsoluteFill>
  );
};

const S10_4: ShotComponent = () => {
  // 反打：原来画外的质疑是老斑鸠躲在岩石后面冒的气泡，一脸认真
  const { f, g, theme } = useShot();
  const k = pop(lerp(f, [4, 10], [0, 1]));
  return (
    <AbsoluteFill>
      <Cam zoom={1.25} oy={800}>
        <Desert theme={theme} frame={g} camX={31200} near={false} sun={{ x: 1650, y: 520, r: 120 }} />
        <Stage>
          <At x={1020} y={1000} s={1.35}>
            <Shadow />
            <Dove frame={g} expression="talk" text="" facing={-1} />
          </At>
          <At x={1340} y={1020} s={4.0}>
            <Rock w={170} h={110} color={theme.mesa} shade={theme.mesaDark} seed={4} />
          </At>
          <g transform={`translate(720 330) scale(${k})`}>
            <Bubble x={-280} y={-120} w={520} h={220} tail={[180, 200]}>
              <text x={-200} y={60} fontSize={170} fontFamily={LYRIC_FONT} fill="#C0392B" stroke={INK} strokeWidth={6} paintOrder="stroke">
                ?
              </text>
              <text x={20} y={20} fontSize={64} fontFamily={LYRIC_FONT} fill={INK} textAnchor="middle">
                真的假的
              </text>
            </Bubble>
          </g>
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

const S10_5: ShotComponent = () => {
  // 入夜，响尾蛇躺在月光下的河床上，汗干了，舒服地吐一口白气
  const { f, g, theme } = useShot();
  const puff = lerp(f, [26, 50], [0, 1]);
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, 61], [1.15, 1.25])} oy={860}>
        <Desert theme={theme} frame={g} camX={31800} moon={{ x: 1450, y: 240, r: 110 }} />
        <Layer>
          <Riverbed theme={theme} y0={880} w={260} camX={2300} seed={5} />
        </Layer>
        <Stage>
          <At x={860} y={900} s={1.6}>
            <Shadow rx={200} />
            <Snake frame={g} expression="cool" />
          </At>
          {puff > 0 && puff < 1 && (
            <g opacity={1 - puff}>
              <circle cx={1260 + puff * 140} cy={830 - puff * 60} r={20 + puff * 50} fill={CREAM} stroke={INK} strokeWidth={3} />
              <circle cx={1220 + puff * 80} cy={850 - puff * 30} r={14 + puff * 30} fill={CREAM} stroke={INK} strokeWidth={3} />
            </g>
          )}
        </Stage>
        <Layer>
          <Caption x={1300} y={620} text="呼～" size={56} opacity={easeOut(lerp(f, [26, 32], [0, 1]))} />
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

/** 俯拍的河道 + 摆成同样弯曲的蛇 */
const RiverSnake: React.FC<{ f: number }> = ({ f }) => {
  const { theme } = useShot();
  const pts: [number, number][] = [];
  for (let i = 0; i <= 60; i++) {
    const u = i / 60;
    pts.push([-100 + u * 2120, 540 + Math.sin(u * Math.PI * 3.2) * 220 + Math.sin(u * 9) * 30]);
  }
  const d = "M " + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ");
  const snakePts = pts.slice(14, 46);
  const sd = "M " + snakePts.map((p) => `${p[0].toFixed(1)} ${(p[1] + 6).toFixed(1)}`).join(" L ");
  const head = snakePts[snakePts.length - 1];
  return (
    <Layer>
      <path d={d} fill="none" stroke={INK} strokeWidth={250} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={theme.sandShadow} strokeWidth={240} strokeLinecap="round" strokeLinejoin="round" />
      {pts.filter((_, i) => i % 2 === 0).map((p, i) => (
        <path key={i} d={`M ${p[0] - 40} ${p[1] - 50} l 30 40 l -20 50 M ${p[0] + 20} ${p[1] - 70} l -10 50 l 40 30`} fill="none" stroke={INK} strokeWidth={3} opacity={0.6} />
      ))}
      <path d={sd} fill="none" stroke={INK} strokeWidth={60} strokeLinecap="round" strokeLinejoin="round" />
      <path d={sd} fill="none" stroke="#C9A15E" strokeWidth={50} strokeLinecap="round" strokeLinejoin="round" />
      {snakePts.filter((_, i) => i % 2 === 0).map((p, i) => (
        <path key={i} d={`M ${p[0] - 12} ${p[1] + 6} L ${p[0]} ${p[1] - 6} L ${p[0] + 12} ${p[1] + 6} L ${p[0]} ${p[1] + 18} Z`} fill="#8E6A3A" />
      ))}
      <ellipse cx={head[0] + 30} cy={head[1] + 6} rx={50} ry={36} fill="#C9A15E" stroke={INK} strokeWidth={5} />
      <circle cx={head[0] + 40} cy={head[1] - 8} r={8} fill={INK} />
      <circle cx={head[0] + 40} cy={head[1] + 20} r={8} fill={INK} />
      <path d={`M ${snakePts[0][0]} ${snakePts[0][1]} l -40 ${Math.sin(f / 3) * 6}`} stroke="#E6CF9A" strokeWidth={30} strokeLinecap="round" />
    </Layer>
  );
};

const S10_6: ShotComponent = () => {
  // 鸟瞰干河床，蛇的身体正好摆成河道的弯曲形状
  const { f, dur } = useShot();
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, dur], [1.35, 1.0], easeInOut)}>
        <Aerial scroll={0}>
          <RiverSnake f={f} />
        </Aerial>
      </Cam>
    </AbsoluteFill>
  );
};

const S10_7: ShotComponent = () => {
  // 蛇睡着了，梦泡泡里是大雨和青蛙合唱 → 泡泡破掉 → 一滴真雨点落在蛇鼻子上 → 睁开一只眼，再也没有第二滴
  const { f, dur, g, theme } = useShot();
  const popAt = Math.round(dur * 0.5);
  const dropEnd = Math.round(dur * 0.72);
  const grow = pop(lerp(f, [2, 20], [0, 1]));
  const awake = f >= dropEnd;
  return (
    <AbsoluteFill>
      <Cam zoom={1.3} oy={820}>
        <Desert theme={theme} frame={g} camX={32600} moon={{ x: 300, y: 200, r: 90 }} />
        <Layer>
          <Riverbed theme={theme} y0={880} w={260} camX={2900} seed={7} />
        </Layer>
        <Stage>
          <At x={820} y={900} s={1.6}>
            <Shadow rx={200} />
            <Snake frame={g} expression={awake ? "cool" : "sleep"} />
          </At>
          {/* 真的雨点 */}
          {f >= popAt + 6 && !awake && <ellipse cx={1150} cy={lerp(f, [popAt + 6, dropEnd], [0, 820], easeIn)} rx={9} ry={14} fill="#8FD3F4" stroke={INK} strokeWidth={2} />}
          {awake && f < dropEnd + 8 && <ellipse cx={1150} cy={830} rx={lerp(f, [dropEnd, dropEnd + 8], [10, 40])} ry={6} fill="none" stroke="#8FD3F4" strokeWidth={4} />}
        </Stage>
        <Layer>
          {awake && <Caption x={1260} y={640} text="……？" size={64} opacity={easeOut(lerp(f, [dropEnd + 6, dropEnd + 12], [0, 1]))} />}
        </Layer>
      </Cam>
      {f < popAt && (
        <Layer>
          <g transform={`translate(1320 300) scale(${grow})`}>
            <Bubble x={-300} y={-180} w={600} h={340} tail={[-200, 420]} thought>
              <defs>
                <clipPath id="dream10">
                  <ellipse cx={0} cy={-10} rx={285} ry={160} />
                </clipPath>
              </defs>
              <g clipPath="url(#dream10)">
                <g transform="translate(-300 -180) scale(0.3125 0.3148)">
                  <SwampDream g={g} />
                </g>
              </g>
            </Bubble>
          </g>
        </Layer>
      )}
      {f >= popAt && f < popAt + 6 && (
        <Layer>
          <Caption x={1260} y={320} text="啪" size={90} r={-8} />
        </Layer>
      )}
    </AbsoluteFill>
  );
};

const S10_8: ShotComponent = () => {
  // 灰狼在月下山崖上叼着骨头仰头嚎叫，骨头掉下山崖
  const { f, dur, g, theme } = useShot();
  const dropAt = Math.round(dur * 0.35);
  const boneY = lerp(f, [dropAt, dur], [0, 700], easeIn);
  return (
    <AbsoluteFill>
      <Layer>
        {theme.sky.map((c, i) => (
          <rect key={i} x={0} y={i * 270} width={1920} height={271} fill={c} />
        ))}
        <At x={1180} y={420}>
          <Moon r={330} frame={g} glow={1} />
        </At>
      </Layer>
      <Layer>
        <g style={{ filter: "brightness(0.18) saturate(0.5)" }}>
          <path d="M -20 1100 L -20 720 L 900 700 L 980 760 L 1040 1100 Z" fill={theme.mesaDark} stroke={INK} strokeWidth={4} />
          <At x={720} y={712} s={1.15}>
            <Wolf frame={g} expression="howl" bone={f < dropAt} bites={4} />
          </At>
          {f >= dropAt && (
            <At x={980 + (f - dropAt) * 3} y={560 + boneY} r={(f - dropAt) * 20} s={1.1}>
              <Bone bites={4} />
            </At>
          )}
        </g>
        <Caption x={1000} y={280} text="嗷呜——" size={80} r={-6} opacity={easeOut(lerp(f, [4, 10], [0, 1]))} />
      </Layer>
    </AbsoluteFill>
  );
};

const S10_9: ShotComponent = () => {
  // 秃鹰站在枯树上，背后是月亮，眼睛发光，脑袋 180° 转着盯人
  const { f, dur, g, theme } = useShot();
  const turned = f > dur * 0.5;
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, dur], [1.1, 1.3])} oy={500}>
        <Desert theme={theme} frame={g} camX={33400} near={false} moon={{ x: 960, y: 360, r: 260 }} />
        <Stage>
          <At x={760} y={1120} s={2.6}>
            <DeadTree s={1} color="#3A2A30" />
          </At>
          <At x={892} y={514} s={0.95} flip={turned}>
            <Vulture frame={g} expression="glow" look={turned ? [0.6, 0.3] : [0.2, 0.9]} />
          </At>
        </Stage>
        <Layer>{f > dur * 0.48 && f < dur * 0.58 && <Caption x={1100} y={300} text="咔" size={60} />}</Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S10_10: ShotComponent = () => {
  // 黑暗中两对发光的眼睛对视、鼻孔喷白气 → 急速拉远到月亮前的地平线：两头野牛剪影对冲，撞出尘土和星星
  const { f, dur, g, theme, T } = useShot();
  const pullAt = Math.round(dur * 0.42);
  if (f < pullAt) {
    const pulse = beatPulse(T);
    const eyes = (x: number, dir: 1 | -1) => (
      <g>
        {[0, 1].map((i) => (
          <g key={i}>
            <ellipse cx={x + i * 70 * dir} cy={520} rx={26} ry={14} fill="#F7E36A" transform={`rotate(${dir * 14} ${x + i * 70 * dir} 520)`} />
            <circle cx={x + i * 70 * dir + dir * 6} cy={522} r={7} fill={INK} />
          </g>
        ))}
        {/* 白气 */}
        {[0, 1].map((i) => {
          const tt = ((f / 12 + i * 0.5) % 1);
          return <circle key={`s${i}`} cx={x + dir * (160 + tt * 140)} cy={640 + tt * 20} r={20 + tt * 40} fill={CREAM} opacity={(1 - tt) * 0.8} />;
        })}
      </g>
    );
    return (
      <AbsoluteFill style={{ background: "#120E1C" }}>
        <Cam zoom={1 + pulse * 0.04 + f * 0.003}>
          <Layer>
            {eyes(560, 1)}
            {eyes(1360, -1)}
          </Layer>
        </Cam>
      </AbsoluteFill>
    );
  }
  const k = f - pullAt;
  const hitAt = 34;
  const ck = lerp(k, [6, hitAt], [0, 1], easeIn);
  const hit = k >= hitAt;
  const [sx, sy] = shake(g, hit ? lerp(k, [hitAt, hitAt + 16], [14, 0]) : 0);
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(k, [0, 8], [3, 1], easeOut)} x={sx} y={sy} oy={760}>
        <Desert theme={theme} frame={g} camX={34200} horizon={780} near={false} fg={false} moon={{ x: 960, y: 600, r: 300 }} />
        <Layer>
          <g style={{ filter: "brightness(0)" }} opacity={0.9}>
            <At x={lerp(ck, [0, 1], [380, 880])} y={790} s={0.55}>
              <Bison frame={g} pose={hit ? "dazed" : "charge"} snort={false} />
            </At>
            <At x={lerp(ck, [0, 1], [1540, 1040])} y={790} s={0.55}>
              <Bison frame={g + 4} pose={hit ? "dazed" : "charge"} facing={-1} snort={false} />
            </At>
          </g>
          {hit && <DustCloud x={960} y={780} age={k - hitAt} size={1.5} color={theme.sandShadow} life={34} />}
          {hit && <ImpactStars x={960} y={660} age={k - hitAt} s={0.9} />}
          {hit &&
            [0, 1, 2].map((i) => <Star key={i} x={900 + i * 60} y={600 - (k - hitAt) * 3} r={14} rot={k * 10} />)}
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

export const S10: ShotComponent[] = [S10_1, S10_2, S10_3, S10_4, S10_5, S10_6, S10_7, S10_8, S10_9, S10_10];

