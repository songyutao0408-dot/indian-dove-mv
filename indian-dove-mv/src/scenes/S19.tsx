// S19 尾奏（约 34 秒）：全员排成一排 → 沿队伍横移 → 跟着节拍大合跳 → 镜头拉远到整片沙漠、太阳下山
// → 光圈收缩只留下老斑鸠的脸，它眨一下眼 → 黑底木牌结束卡（词、曲、编曲 + 完）
import React from "react";
import { AbsoluteFill } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { Dove } from "../characters";
import { LYRIC_FONT } from "../fonts";
import { DustPuff, Iris, WesternText, WoodBoard } from "../fx";
import { OldFilmArtifacts } from "../overlay/FilmLook";
import { CREAM, INK } from "../style/palette";
import { At, Cam, Layer, Shadow, Stage, beatHop, beatPulse, easeInOut, easeOut, lerp, sinceBeat, useShot, type ShotComponent } from "./common";
import { CastMember, LINEUP, type CastMode } from "./cast";

/** 一排角色；s = 整体比例，spacing = 间距，cx = 队伍中心 */
const Row: React.FC<{ mode: CastMode; s: number; spacing: number; cx?: number; y: number; enter?: number }> = ({ mode, s, spacing, cx = 960, y, enter = 1 }) => {
  const { g, T, theme } = useShot();
  const n = LINEUP.length;
  return (
    <>
      {LINEUP.map((id, i) => {
        const target = cx + (i - (n - 1) / 2) * spacing;
        const from = i < n / 2 ? -300 : 2220;
        const x = from + (target - from) * enter;
        const dove = id === "dove" || id === "hen";
        // 排好队之后等拍子：跟着节拍轻轻左右摇摆、踮脚
        const idleSway = mode === "idle" && enter >= 1;
        const sway = idleSway ? Math.sin((T + i * 0.08) * Math.PI * 1.6) * 4 : 0;
        const tiptoe = idleSway ? beatHop(T + i * 0.05, 10) : 0;
        return (
          <At key={id} x={x} y={y + tiptoe} s={s * (dove ? 1.15 : 1)} r={sway}>
            <Shadow rx={90} />
            <CastMember id={id} g={g} T={T} mode={enter < 1 ? "run" : mode} seed={i} facing={enter < 1 ? (i < n / 2 ? 1 : -1) : i < n / 2 ? 1 : -1} />
            {mode === "dance" && sinceBeat(T) < 0.5 && <DustPuff x={0} y={0} age={Math.round(sinceBeat(T) * 24)} color={theme.sand} />}
          </At>
        );
      })}
    </>
  );
};

const S19_1: ShotComponent = () => {
  // 安静段：全员从两边走进来排成一排，太阳开始西斜，大家轻轻摇摆、等拍子
  const { f, dur, g, theme } = useShot();
  const enter = lerp(f, [0, dur * 0.55], [0, 1], easeInOut);
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, dur], [1.0, 1.12], easeInOut)} oy={900}>
        <Desert theme={theme} frame={g} camX={57000 + f * 1.5} sun={{ x: 1650, y: lerp(f, [0, dur], [260, 300]), face: "wave" }} />
        <Stage>
          <Row mode="idle" s={0.42} spacing={112} y={960} enter={enter} />
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

const S19_2: ShotComponent = () => {
  // 沿着队伍横移的中近景，每个角色跟着拍子跺脚
  const { f, dur, g, theme, T } = useShot();
  const spacing = 300;
  const n = LINEUP.length;
  const span = (n - 1) * spacing;
  const pan = lerp(f, [0, dur], [span / 2 - 420, -span / 2 + 420], easeInOut);
  return (
    <AbsoluteFill>
      <Cam zoom={1 + beatPulse(T) * 0.015}>
        <Desert theme={theme} frame={g} camX={57400 - pan * 0.8} horizon={560} sun={{ x: 1650, y: 300, face: "wave" }} />
        <Stage>
          <Row mode="cheer" s={0.95} spacing={spacing} cx={960 + pan} y={1060} />
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

const S19_3: ShotComponent = () => {
  // 鼓点回来：全员跟着节拍大合跳，尘土跟着节拍扬起，镜头跟拍一顿一顿
  const { f, g, theme, T } = useShot();
  const pulse = beatPulse(T);
  return (
    <AbsoluteFill>
      <Cam zoom={1.04 + pulse * 0.03} y={pulse * 6}>
        <Desert theme={theme} frame={g} camX={58000 + f * 3} sun={{ x: 1650, y: lerp(f, [0, 153], [300, 380]), face: "wave" }} />
        <Stage>
          <Row mode="dance" s={0.46} spacing={112} y={980} />
        </Stage>
        <Layer>
          <text x={960} y={300} fontSize={70} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={8} paintOrder="stroke" textAnchor="middle" opacity={pulse}>
            嘿！
          </text>
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S19_4: ShotComponent = () => {
  // 镜头慢慢拉远到整片沙漠，队伍越来越小，太阳下山
  const { f, dur, g, theme } = useShot();
  const k = lerp(f, [0, dur], [0, 1], easeInOut);
  const s = lerp(k, [0, 1], [0.46, 0.1]);
  const y = lerp(k, [0, 1], [980, 650]);
  return (
    <AbsoluteFill>
      <Desert theme={theme} frame={g} camX={58500 + f * 2} horizon={lerp(k, [0, 1], [600, 640])} sun={{ x: 1250, y: lerp(k, [0, 1], [380, 700]), r: lerp(k, [0, 1], [90, 130]), face: "sleepy" }} />
      <Stage>
        <Row mode="dance" s={s} spacing={112 * (s / 0.46)} y={y} />
      </Stage>
    </AbsoluteFill>
  );
};

const S19_5: ShotComponent = () => {
  // 光圈收缩，只剩下老斑鸠的脸；它慢慢眨一下眼；光圈合上
  const { f, dur, g, theme } = useShot();
  const open = f < dur * 0.45 ? lerp(f, [0, dur * 0.45], [1, 0.17], easeInOut) : lerp(f, [dur * 0.85, dur], [0.17, 0], easeInOut);
  const blinkK = lerp(f, [dur * 0.62, dur * 0.68, dur * 0.74], [0, 1, 0]);
  return (
    <AbsoluteFill>
      {/* 头部中心在世界坐标 (990, 777)：以它为缩放中心，再整体上移到画面正中 */}
      <Cam zoom={lerp(f, [0, dur * 0.45], [1.8, 2.6], easeInOut)} ox={990} oy={777} y={-237}>
        <Desert theme={theme} frame={g} camX={59000} near={false} sun={{ x: 400, y: 640, r: 140 }} />
        <Stage>
          <At x={960} y={1000}>
            <Shadow />
            <Dove frame={g} expression="daze" blink={blinkK} look={[0, 0]} />
          </At>
        </Stage>
      </Cam>
      <Iris open={open} cx={990} cy={540} />
    </AbsoluteFill>
  );
};

const S19_6: ShotComponent = () => {
  // 黑底木牌结束卡：词、曲、编曲的署名和一个「完」字；木牌轻轻晃，偶尔闪烁胶片黑点
  const { f, dur, g } = useShot();
  const inK = easeOut(lerp(f, [4, 22], [0, 1]));
  const swing = Math.sin(f / 18) * 1.4;
  const wan = easeOut(lerp(f, [40, 52], [0, 1]));
  return (
    <AbsoluteFill style={{ background: "#0E0906" }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `translateY(${(1 - inK) * -80}px) rotate(${swing}deg)`, opacity: inK, transformOrigin: "50% -300px" }}>
          <WoodBoard w={1000} h={600} dark>
            <div style={{ fontFamily: LYRIC_FONT, fontSize: 56, color: CREAM, lineHeight: 1.6, textAlign: "center", WebkitTextStroke: `5px ${INK}`, paintOrder: "stroke fill" }}>
              <div>词：方文山</div>
              <div>曲：周杰伦</div>
              <div>编曲：洪敬尧</div>
            </div>
            <div style={{ height: 16, transform: `scale(${0.6 + wan * 0.4})`, opacity: wan }}>
              <WesternText size={130} font={LYRIC_FONT} color="#F7D58B">
                完
              </WesternText>
            </div>
          </WoodBoard>
        </div>
      </AbsoluteFill>
      <OldFilmArtifacts frame={g} amount={0.7} />
      {/* 最后半秒淡出到全黑 */}
      <AbsoluteFill style={{ background: "#000", opacity: lerp(f, [dur - 12, dur], [0, 1]) }} />
    </AbsoluteFill>
  );
};

export const S19: ShotComponent[] = [S19_1, S19_2, S19_3, S19_4, S19_5, S19_6];
