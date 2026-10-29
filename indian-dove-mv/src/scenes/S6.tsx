// S6 Hook·一：学人说话 → 害羞仙人掌 → 横走蜥蜴 → 四个怪事闪切 → 像猫的狗定格加问号
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { Moon, Rock, Sun, Tumbleweed } from "../backgrounds/props";
import { Cactus, CatDog, Cowboy, Dove, Lizard } from "../characters";
import { Bubble, QuestionMark, onTwos } from "../characters/parts";
import { LYRIC_FONT } from "../fonts";
import { CREAM, INK } from "../style/palette";
import { At, Cam, Layer, Shadow, Stage, beatPulse, easeOut, lerp, pop, useShot, type ShotComponent } from "./common";

const S6_1: ShotComponent = () => {
  // 牛仔先说「Howdy!」，老斑鸠原样学一遍，牛仔愣住
  const { f, g, theme, T } = useShot();
  const echo = f >= 24;
  const k1 = pop(lerp(f, [2, 8], [0, 1])) * (echo ? lerp(f, [24, 28], [1, 0]) : 1);
  const k2 = pop(lerp(f, [26, 32], [0, 1]));
  return (
    <AbsoluteFill>
      <Cam zoom={1.35 + beatPulse(T) * 0.02} oy={760}>
        <Desert theme={theme} frame={g} camX={12400} sun={{ x: 1600, y: 140, face: "none" }} />
        <Stage>
          <At x={560} y={1000} s={1.05}>
            <Shadow />
            <Cowboy frame={g} expression={echo ? "surprised" : "talk"} />
          </At>
          <At x={1220} y={1000} s={1.25}>
            <Shadow />
            <Dove frame={g} expression={echo ? "talk" : "daze"} look={[-0.6, 0]} facing={-1} text="" />
          </At>
          <g transform={`translate(600 380) scale(${k1})`}>
            <Bubble x={0} y={-90} w={300} h={110} tail={[-30, 60]} text="Howdy!" fontSize={52} />
          </g>
          <g transform={`translate(1040 400) scale(${k2})`}>
            <Bubble x={-310} y={-90} w={320} h={110} tail={[60, 70]} text="Howdy～" fontSize={52} />
          </g>
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

const S6_2: ShotComponent = () => {
  // 甩镜头到仙人掌：它一被看到就脸红、捂脸、扭身躲开
  const { f, g, theme } = useShot();
  const whip = lerp(f, [0, 5], [-700, 0], easeOut);
  return (
    <AbsoluteFill>
      <Cam x={whip} zoom={1.2} oy={760}>
        <Desert theme={theme} frame={g} camX={12900} sun={{ x: 300, y: 140, face: "none" }} />
        <Stage>
          <At x={960} y={1000} s={1.2}>
            <Shadow rx={90} />
            <Cactus frame={g} pose={f < 7 ? "idle" : "shy"} />
          </At>
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

const S6_3: ShotComponent = () => {
  // 蜥蜴像螃蟹一样侧着身子横穿画面，表情淡定
  const { f, dur, g, theme } = useShot();
  return (
    <AbsoluteFill>
      <Desert theme={theme} frame={g} camX={13400} sun={{ x: 1600, y: 140, face: "none" }} />
      <Stage>
        <At x={lerp(f, [0, dur], [-120, 2040])} y={1000} s={1.6}>
          <Shadow rx={80} />
          <Lizard frame={g} />
        </At>
      </Stage>
    </AbsoluteFill>
  );
};

/** 怪事闪切的外框：彩色边 + 跟拍放大 */
const WeirdFrame: React.FC<{ color: string; label: string; children: React.ReactNode }> = ({ color, label, children }) => {
  const { f, T } = useShot();
  return (
    <AbsoluteFill style={{ background: color }}>
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 30,
          right: 30,
          bottom: 30,
          border: `10px solid ${INK}`,
          borderRadius: 30,
          overflow: "hidden",
          transform: `scale(${0.96 + beatPulse(T) * 0.025 + f * 0.0015}) rotate(${(f % 2) - 0.5}deg)`,
        }}
      >
        <div style={{ position: "absolute", left: -40, top: -40, width: 1920, height: 1080 }}>{children}</div>
      </div>
      <div style={{ position: "absolute", right: 60, top: 46, fontFamily: LYRIC_FONT, fontSize: 52, color: CREAM, WebkitTextStroke: `7px ${INK}`, paintOrder: "stroke fill" }}>{label}</div>
    </AbsoluteFill>
  );
};

const S6_4: ShotComponent = () => {
  // 怪事①：一副鱼骨头在沙里游泳
  const { f, g, theme } = useShot();
  return (
    <WeirdFrame color="#4FC2B5" label="？！">
      <Desert theme={theme} frame={g} camX={14000} horizon={420} near={false} />
      <Stage>
        <At x={700 + f * 30} y={760 + Math.sin(f / 2) * 14} s={1.6} r={Math.sin(f / 2) * 8}>
          <path d="M -150 0 L 120 0 M 120 0 L 170 -40 L 170 40 Z M -150 0 l -40 -30 l 0 60 Z" fill={CREAM} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          {[-110, -70, -30, 10, 50, 90].map((x) => (
            <path key={x} d={`M ${x} 0 q 10 -40 0 -60 M ${x} 0 q 10 40 0 60`} fill="none" stroke={INK} strokeWidth={6} />
          ))}
          <circle cx={-170} cy={-6} r={8} fill={INK} />
        </At>
        {Array.from({ length: 5 }, (_, i) => (
          <ellipse key={i} cx={600 + i * 60 + f * 20} cy={800} rx={30 + i * 6} ry={8} fill="none" stroke={theme.sandShadow} strokeWidth={5} opacity={1 - i * 0.18} />
        ))}
      </Stage>
    </WeirdFrame>
  );
};

const S6_5: ShotComponent = () => {
  // 怪事②：石头咕嘟咕嘟冒泡，像煮开的锅
  const { f, g, theme } = useShot();
  return (
    <WeirdFrame color="#E8738F" label="咕嘟咕嘟">
      <Desert theme={theme} frame={g} camX={14600} near={false} />
      <Stage>
        <At x={960} y={900} s={3.2}>
          <Rock w={160} h={90} color={theme.mesa} shade={theme.mesaDark} seed={11} />
        </At>
        {Array.from({ length: 9 }, (_, i) => {
          const tt = (onTwos(f) / 10 + random(`bb${i}`)) % 1;
          return <circle key={i} cx={760 + random(`bx${i}`) * 400} cy={620 - tt * 200} r={14 + tt * 22} fill="#F6E7C8" stroke={INK} strokeWidth={4} opacity={1 - tt * 0.7} />;
        })}
      </Stage>
    </WeirdFrame>
  );
};

const S6_6: ShotComponent = () => {
  // 怪事③：太阳和月亮同时挂在天上，互相招手
  const { f, g, theme } = useShot();
  return (
    <WeirdFrame color="#F2C14E" label="Hi～">
      <Desert theme={theme} frame={g} camX={15200} near={false} />
      <Stage>
        <At x={560} y={330} s={1.2} r={Math.sin(f / 2) * 8}>
          <Sun r={130} frame={g} color={theme.sun} face="wave" />
        </At>
        <At x={1360} y={330} s={1.2} r={-Math.sin(f / 2) * 8}>
          <Moon r={110} frame={g} face="calm" />
        </At>
        {/* 两只招手的小手 */}
        <path d={`M 740 300 q 40 ${-40 + Math.sin(f) * 20} 70 -30`} fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />
        <path d={`M 1200 300 q -40 ${-40 - Math.sin(f) * 20} -70 -30`} fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />
      </Stage>
    </WeirdFrame>
  );
};

const S6_7: ShotComponent = () => {
  // 怪事④：风滚草停下来，自己倒着滚回去（画面上出现「倒带」符号）
  const { f, g, theme } = useShot();
  const x = f < 6 ? 600 + f * 40 : 840 - (f - 6) * 60;
  return (
    <WeirdFrame color="#B57EDC" label="◀◀">
      <Desert theme={theme} frame={g} camX={15800} near={false} />
      <Stage>
        <At x={x} y={880} s={1.8}>
          <Shadow rx={80} />
          <g transform="translate(0 -70)">
            <Tumbleweed r={70} rot={f < 6 ? f * 20 : 120 - (f - 6) * 30} seed={12} />
          </g>
        </At>
      </Stage>
    </WeirdFrame>
  );
};

const S6_8: ShotComponent = () => {
  // 像猫的狗：舔爪子 → 伸懒腰 → 定格，旁边弹出一个大问号
  const { f, g, theme } = useShot();
  const freeze = f >= 32;
  const pose = f < 14 ? "lick" : f < 32 ? "stretch" : "arch";
  const fg = freeze ? g - f + 32 : g;
  return (
    <AbsoluteFill>
      <Cam zoom={1.3} oy={820}>
        <Desert theme={theme} frame={freeze ? fg : g} camX={16600} sun={{ x: 1600, y: 140, face: "none" }} />
        <Stage>
          <At x={900} y={1000} s={1.4}>
            <Shadow rx={160} />
            <CatDog frame={fg} pose={pose} />
          </At>
        </Stage>
      </Cam>
      {freeze && (
        <>
          <AbsoluteFill style={{ background: "#F6E7C8", mixBlendMode: "color", opacity: 0.55 }} />
          <Layer>
            <g transform={`translate(1380 520) scale(${pop(lerp(f, [32, 38], [0, 1])) * 3.4})`}>
              <QuestionMark x={0} y={0} frame={g} />
            </g>
          </Layer>
        </>
      )}
      <AbsoluteFill style={{ background: "#FFF", opacity: f >= 32 ? lerp(f, [32, 35], [0.7, 0]) : 0 }} />
    </AbsoluteFill>
  );
};

export const S6: ShotComponent[] = [S6_1, S6_2, S6_3, S6_4, S6_5, S6_6, S6_7, S6_8];
