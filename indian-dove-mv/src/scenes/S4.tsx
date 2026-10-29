// S4 导歌一 + 小间奏：白蚁丘 → 老斑鸠饿昏登场 → 亮相定格 + 木牌名牌 → 大哈欠
import React from "react";
import { AbsoluteFill } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { Tumbleweed } from "../backgrounds/props";
import { MOUND_TOP, TermiteMound } from "../backgrounds/TermiteMound";
import { Dove } from "../characters";
import { LYRIC_FONT } from "../fonts";
import { WesternText, WoodBoard } from "../fx";
import { CREAM, INK } from "../style/palette";
import { At, Cam, Layer, Stage, beatHop, beatPulse, easeInOut, easeOut, lerp, pop, useShot, type ShotComponent } from "./common";

/** 白蚁丘场景（S4、S11 共用）：丘的位置固定，镜头靠 Cam 推拉 */
export const MoundScene: React.FC<{ camX?: number; children?: React.ReactNode; moon?: boolean }> = ({ camX = 9000, children, moon }) => {
  const { theme, g } = useShot();
  return (
    <>
      <Desert theme={theme} frame={g} camX={camX} seed={6} sun={moon ? undefined : { x: 300, y: 150, face: "none" }} moon={moon ? { x: 1500, y: 220, r: 120 } : undefined} />
      <Stage>
        <At x={980} y={1000} s={1.2}>
          <TermiteMound theme={theme} />
          {children}
        </At>
      </Stage>
    </>
  );
};

const S4_1: ShotComponent = () => {
  // 镜头推近一座废弃的白蚁丘，风滚草从前面经过
  const { f, dur, T } = useShot();
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, dur], [0.85, 1.25], easeInOut)} oy={500} ox={990}>
        <MoundScene />
        <Layer>
          <At x={lerp(f, [0, dur], [-100, 2000])} y={940 + beatHop(T, 50)}>
            <Tumbleweed r={50} rot={f * 12} seed={9} />
          </At>
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S4_2: ShotComponent = () => {
  // 老斑鸠从丘顶冒出来，饿到摇摇晃晃、眼冒金星，肚子咕咕叫
  const { f, g } = useShot();
  const rise = pop(lerp(f, [4, 20], [0, 1]));
  const sway = Math.sin(f / 7) * 7;
  return (
    <AbsoluteFill>
      <Cam zoom={1.75} oy={480} ox={990}>
        <MoundScene>
          <defs>
            <clipPath id="moundtop">
              <rect x={-400} y={-1400} width={800} height={1400 + MOUND_TOP[1] + 6} />
            </clipPath>
          </defs>
          <g clipPath="url(#moundtop)">
            <At x={MOUND_TOP[0]} y={MOUND_TOP[1] + (1 - rise) * 330} s={0.72} r={sway}>
              <Dove frame={g} expression="hungry" />
            </At>
          </g>
        </MoundScene>
        <Layer>
          {f > 30 && Math.floor(f / 10) % 2 === 0 && (
            <text x={1110} y={500} fontSize={46} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={6} paintOrder="stroke">
              咕～
            </text>
          )}
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S4_3: ShotComponent = () => {
  // 亮相定格：画面冻结，背景换成旋转的放射色块，木牌名牌弹出来晃两下（跟拍一闪一闪）
  const { f, T, g } = useShot();
  const freezeFrame = g - f - 2; // 定格在上一镜头末尾的姿态
  const sign = pop(lerp(f, [6, 20], [0, 1]));
  const swing = Math.sin(f / 5) * 6 * Math.max(0, 1 - f / 60) + Math.sin(f / 14) * 1.5;
  const flash = beatPulse(T, 0.15);
  return (
    <AbsoluteFill>
      <Layer>
        <rect width={1920} height={1080} fill="#C8402E" />
        <g transform={`translate(760 520) rotate(${f * 1.2})`}>
          {Array.from({ length: 16 }, (_, i) => (
            <path key={i} d="M 0 0 L -260 -1500 L 260 -1500 Z" fill={i % 2 ? "#F2C14E" : "#E07A4F"} transform={`rotate(${i * 22.5})`} />
          ))}
        </g>
        <circle cx={760} cy={520} r={330} fill="#F7D58B" opacity={0.35 + flash * 0.2} />
        {/* 定格的老斑鸠（白边剪影 + 原样） */}
        <At x={760} y={930} s={2.05}>
          <g style={{ filter: "drop-shadow(0 0 0 #fff)" }}>
            <Dove frame={freezeFrame} expression="hungry" blink={0} />
          </g>
        </At>
        {/* 闪光星 */}
        {[
          [380, 220],
          [1160, 260],
          [300, 760],
        ].map(([x, y], i) => (
          <path key={i} d={`M ${x} ${y - 30} L ${x + 8} ${y - 8} L ${x + 30} ${y} L ${x + 8} ${y + 8} L ${x} ${y + 30} L ${x - 8} ${y + 8} L ${x - 30} ${y} L ${x - 8} ${y - 8} Z`} fill={CREAM} stroke={INK} strokeWidth={3} transform={`rotate(${f * 6} ${x} ${y}) scale(${0.7 + flash * 0.5})`} style={{ transformOrigin: `${x}px ${y}px` }} />
        ))}
      </Layer>
      {/* 木牌名牌 */}
      <div
        style={{
          position: "absolute",
          left: 1100,
          top: 300,
          transformOrigin: "380px -100px",
          transform: `translateY(${(1 - sign) * -700}px) rotate(${swing}deg)`,
        }}
      >
        <svg width={760} height={120} style={{ position: "absolute", top: -110, left: 0 }}>
          <path d="M 180 0 L 200 110 M 580 0 L 560 110" stroke={INK} strokeWidth={7} />
        </svg>
        <WoodBoard w={760} h={330}>
          <WesternText size={66} color="#F7D58B">
            Indian Dove
          </WesternText>
          <div style={{ height: 8 }} />
          <WesternText size={92} font={LYRIC_FONT}>
            印第安老斑鸠
          </WesternText>
          <div style={{ height: 10 }} />
          <div style={{ fontFamily: LYRIC_FONT, fontSize: 32, color: CREAM, WebkitTextStroke: `4px ${INK}`, paintOrder: "stroke fill" }}>腿短 · 毛少 · 几天不喝水</div>
        </WoodBoard>
      </div>
      {/* 定格时的白色闪一下 */}
      <AbsoluteFill style={{ background: "#FFF8E8", opacity: lerp(f, [0, 4], [0.85, 0]) }} />
    </AbsoluteFill>
  );
};

const S4_4: ShotComponent = () => {
  // 解冻：老斑鸠打一个巨大的哈欠，嘴张到半个画面，眼皮又耷拉下去
  const { f, dur, g } = useShot();
  const open = lerp(f, [10, 36, 70, 86], [0, 1, 1, 0], easeInOut);
  const zoom = lerp(f, [0, 36, 80, dur], [1.6, 2.6, 2.6, 1.9], easeInOut);
  return (
    <AbsoluteFill>
      <Cam zoom={zoom} ox={1000} oy={330}>
        <MoundScene>
          <At x={MOUND_TOP[0]} y={MOUND_TOP[1]} s={0.72}>
            <Dove frame={g} expression={open > 0.05 ? "yawn" : f > 86 ? "daze" : "hungry"} open={open} />
          </At>
        </MoundScene>
        <Layer>
          {open > 0.6 && (
            <text x={1130} y={250} fontSize={52} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={6} paintOrder="stroke" opacity={easeOut(lerp(open, [0.6, 1], [0, 1]))}>
              哈～啊～
            </text>
          )}
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

export const S4: ShotComponent[] = [S4_1, S4_2, S4_3, S4_4];
