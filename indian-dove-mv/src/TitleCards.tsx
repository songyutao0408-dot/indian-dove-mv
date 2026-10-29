// 片头卡（S0 前三个镜头共用）：放射状太阳光芒 + 挂着的木牌，三张卡用木牌翻转衔接。
// 全部按「全片秒数」计算，所以跨镜头切换时画面是连续的。
import React from "react";
import { AbsoluteFill } from "remotion";
import { Tumbleweed } from "./backgrounds/props";
import { Dove } from "./characters";
import { onTwos } from "./characters/parts";
import { LYRIC_FONT } from "./fonts";
import { DustPuff, FlipCard, Iris, WesternText, WoodBoard } from "./fx";
import { At, Layer, beatHop, easeInOut, lerp, pop, useShot } from "./scenes/common";
import { INK } from "./style/palette";
import { TITLE_CARDS } from "./timeline";

const BOARD_W = 1180;
const BOARD_H = 500;
const CX = 960;
const TOP = 300;
const FLIP = 0.36; // 翻转用时的一半（秒）

const Card: React.FC<{ i: number }> = ({ i }) => {
  if (i === 0) {
    return (
      <WoodBoard w={BOARD_W} h={BOARD_H}>
        <WesternText size={150}>Indian Dove</WesternText>
        <div style={{ height: 18 }} />
        <WesternText size={96} font={LYRIC_FONT} color="#F7D58B">
          《印第安老斑鸠》
        </WesternText>
      </WoodBoard>
    );
  }
  const [en, zh] = i === 1 ? ["Lyrics", "词：方文山"] : ["Music", "曲：周杰伦"];
  return (
    <WoodBoard w={BOARD_W} h={BOARD_H}>
      <WesternText size={80} color="#F7D58B">
        {en}
      </WesternText>
      <div style={{ height: 20 }} />
      <WesternText size={140} font={LYRIC_FONT}>
        {zh}
      </WesternText>
    </WoodBoard>
  );
};

const Sunburst: React.FC<{ T: number }> = ({ T }) => {
  const rot = T * 4;
  return (
    <Layer>
      <rect width={1920} height={1080} fill="#F0A15E" />
      <g transform={`translate(960 470) rotate(${rot})`}>
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d="M 0 0 L -170 -1500 L 170 -1500 Z" fill={i % 2 ? "#F7D58B" : "#F4BB75"} transform={`rotate(${i * 15})`} />
        ))}
      </g>
      <circle cx={960} cy={470} r={300} fill="#FBE7A1" opacity={0.5} />
      {/* 地面 */}
      <rect x={0} y={900} width={1920} height={180} fill="#E9C48F" />
      <rect x={0} y={900} width={1920} height={10} fill="#C99A62" />
      <ellipse cx={960} cy={980} rx={700} ry={26} fill="#C99A62" opacity={0.6} />
    </Layer>
  );
};

/** 风滚草从卡前滚过：t0 开始、dur 秒滚完，dir 方向 */
const RollingWeed: React.FC<{ T: number; t0: number; dur: number; dir: 1 | -1; r?: number; seed?: number }> = ({ T, t0, dur, dir, r = 70, seed = 1 }) => {
  const k = (T - t0) / dur;
  if (k < 0 || k > 1) return null;
  const x = dir === 1 ? lerp(k, [0, 1], [-200, 2120]) : lerp(k, [0, 1], [2120, -200]);
  const y = 900 - r + beatHop(T, 70);
  const g = Math.round(T * 24);
  return (
    <>
      <DustPuff x={x - dir * 20} y={905} age={g % 12} />
      <At x={x} y={y}>
        <Tumbleweed r={r} rot={dir * T * 260} seed={seed} />
      </At>
    </>
  );
};

export const TitleCards: React.FC = () => {
  const { T, g } = useShot();
  const t1 = TITLE_CARDS[1].t; // 8.95
  const t2 = TITLE_CARDS[2].t; // 17.91
  // 木牌：开场从上面掉下来，挂在两根绳子上轻轻晃
  const drop = pop(lerp(T, [0.1, 1.0], [0, 1]));
  const boardY = TOP - (1 - drop) * 900;
  const swing = Math.sin(T * 1.6) * 1.4 + (T < 1.6 ? Math.sin(T * 9) * (1.6 - T) * 3 : 0);
  // 当前是哪张卡、在不在翻转中
  let front = 0;
  let back = 1;
  let flip = 0;
  if (T < t1 - FLIP) {
    front = 0;
  } else if (T < t1 + FLIP) {
    front = 0;
    back = 1;
    flip = easeInOut(lerp(T, [t1 - FLIP, t1 + FLIP], [0, 1]));
  } else if (T < t2 - FLIP) {
    front = 1;
  } else if (T < t2 + FLIP) {
    front = 1;
    back = 2;
    flip = easeInOut(lerp(T, [t2 - FLIP, t2 + FLIP], [0, 1]));
  } else {
    front = 2;
  }
  // 老斑鸠客串 ①：从木牌右边探头又缩回（4.6–7.2 秒）
  const peek = lerp(T, [4.6, 5.1, 6.6, 7.1], [0, 1, 1, 0], easeInOut);
  // 客串 ②：翻到作曲卡后掉到木牌顶上睡觉（18.6 秒起）
  const land = T - 18.6;
  const doveY = land < 0 ? -400 : lerp(land, [0, 0.35], [-420, 0], (x) => x * x);
  const squash = land > 0.35 && land < 0.6 ? 1 - Math.sin(((land - 0.35) / 0.25) * Math.PI) * 0.18 : 1;
  // 结尾光圈收到睡着的老斑鸠身上
  const irisOpen = lerp(T, [24.6, 25.8], [1, 0], easeInOut);

  return (
    <AbsoluteFill>
      <Sunburst T={T} />
      {/* 探头的老斑鸠（在木牌后面） */}
      {peek > 0.01 && (
        <Layer>
          <At x={CX + BOARD_W / 2 - 60 + peek * 150} y={TOP + 330} s={1.25} r={-12 * peek}>
            <Dove frame={g} expression={peek > 0.9 && T > 6.0 ? "shock" : "daze"} look={[-0.8, 0]} facing={-1} />
          </At>
        </Layer>
      )}
      {/* 绳子 */}
      <Layer>
        {[-1, 1].map((s) => (
          <path key={s} d={`M ${CX + s * 420} -10 L ${CX + s * 420 + swing * 2} ${boardY + 20}`} stroke={INK} strokeWidth={9} />
        ))}
        {[-1, 1].map((s) => (
          <path key={`r${s}`} d={`M ${CX + s * 420} -10 L ${CX + s * 420 + swing * 2} ${boardY + 20}`} stroke="#C99A62" strokeWidth={5} strokeDasharray="10 6" />
        ))}
      </Layer>
      {/* 木牌 */}
      <div
        style={{
          position: "absolute",
          left: CX - BOARD_W / 2,
          top: boardY,
          width: BOARD_W,
          height: BOARD_H,
          transformOrigin: `${BOARD_W / 2}px -200px`,
          transform: `rotate(${swing}deg)`,
        }}
      >
        <FlipCard progress={flip} front={<Card i={front} />} back={<Card i={back} />} />
      </div>
      {/* 睡在木牌顶上的老斑鸠 */}
      {land > 0 && (
        <Layer>
          <g transform={`rotate(${swing} ${CX} -200)`}>
            <At x={CX + 300} y={boardY + 14 + doveY} s={0.8}>
              <g transform={`scale(${1 + (1 - squash) * 0.6} ${squash})`}>
                <Dove frame={onTwos(g)} pose="sit" expression={land < 0.6 ? "shock" : "sleep"} />
              </g>
            </At>
          </g>
        </Layer>
      )}
      {/* 风滚草 */}
      <Layer>
        <RollingWeed T={T} t0={2.4} dur={3.4} dir={1} seed={1} />
        <RollingWeed T={T} t0={11.6} dur={3.6} dir={-1} r={80} seed={2} />
        <RollingWeed T={T} t0={20.2} dur={3.0} dir={1} r={50} seed={3} />
      </Layer>
      <Iris open={irisOpen} cx={CX + 310} cy={TOP - 110} />
      {T < 0.5 && <AbsoluteFill style={{ background: "#0E0906", opacity: 1 - T / 0.5 }} />}
    </AbsoluteFill>
  );
};
