// S13 Hook·二（夜晚）：「休息一下」念白梗（吊床、毯子、Zzz、全员定格）→ 闹钟炸响弹起来
// → 手电筒下的仙人掌 + 提灯笼的蜥蜴 → 四个夜间怪事 → 追激光点的狗撞石头、定格问号
import React from "react";
import { AbsoluteFill } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { AlarmClock, Hammock, Moon, Rock, SmallSaguaro, Tumbleweed, UFO } from "../backgrounds/props";
import { Cactus, CatDog, Dove, Lizard, Snake, Wolf } from "../characters";
import { QuestionMark, SoundWaves, Star, Zzz } from "../characters/parts";
import { LYRIC_FONT } from "../fonts";
import { ImpactStars } from "../fx";
import { CREAM, INK } from "../style/palette";
import { At, Cam, Layer, Shadow, Stage, beatHop, beatPulse, easeOut, lerp, pop, shake, useShot, type ShotComponent } from "./common";
import { GAGS } from "../timeline";

const Txt: React.FC<{ x: number; y: number; text: string; size?: number; r?: number; opacity?: number }> = ({ x, y, text, size = 56, r = 0, opacity = 1 }) => (
  <text x={x} y={y} fontSize={size} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={7} paintOrder="stroke" transform={`rotate(${r} ${x} ${y})`} opacity={opacity}>
    {text}
  </text>
);

const REST = GAGS.find((g) => g.id === "rest")!;

/** 吊床场景（S13-1、S13-2 共用） */
const HammockScene: React.FC<{ frozen: boolean; up: number; children?: React.ReactNode }> = ({ frozen, up, children }) => {
  const { g, theme } = useShot();
  const freezeAt = REST.startFrame + 10;
  const fg = frozen ? Math.min(g, freezeAt) : g;
  return (
    <>
      <Desert theme={theme} frame={g} camX={40600} near={false} moon={{ x: 1600, y: 200, r: 100 }} />
      <Stage>
        {/* 后面定格的其他角色 */}
        <g style={{ filter: frozen ? "grayscale(0.7) brightness(0.85)" : undefined }}>
          <At x={240} y={900} s={0.8}>
            <Shadow />
            <Wolf frame={fg} expression="grin" pose="dance" />
          </At>
          <At x={1680} y={900} s={0.75}>
            <Shadow rx={80} />
            <Cactus frame={fg} pose="dance" />
          </At>
          <At x={1420} y={960} s={0.7}>
            <Lizard frame={fg} />
          </At>
          <At x={480} y={980} s={0.7}>
            <Snake frame={fg} pose="coiled" expression="happy" />
          </At>
        </g>
        <At x={960} y={1000} s={1.15}>
          <Hammock w={560} sag={70} swing={frozen ? Math.sin(g / 20) * 2 : 0}>
            {/* 躺在吊床里的老斑鸠 + 小毯子 */}
            <g transform={`translate(-10 ${-190 - up * 220}) rotate(${up * 90})`}>
              {up < 0.5 ? (
                <g transform="scale(0.8)">
                  <Dove frame={g} pose="lie" expression="sleep" />
                </g>
              ) : (
                <g transform="rotate(-90) scale(0.8)">
                  <Dove frame={g} expression="shock" pose="flap" />
                </g>
              )}
            </g>
            {up < 0.3 && <path d="M -170 -168 Q -10 -140 160 -170 L 150 -110 Q -10 -90 -160 -110 Z" fill="#4FC2B5" stroke={INK} strokeWidth={4} />}
            {up < 0.3 && <path d="M -150 -150 l 290 -10 M -150 -130 l 290 -10" stroke="#E8D7B5" strokeWidth={5} strokeDasharray="14 10" />}
          </Hammock>
        </At>
        {up < 0.3 && <Zzz x={1060} y={640} frame={g} />}
      </Stage>
      {children}
    </>
  );
};

const S13_1: ShotComponent = () => {
  // 念白梗：老斑鸠真的躺进吊床，盖上小毯子，头顶冒 Zzz；其他角色全部定格
  const { f } = useShot();
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, 61], [1.0, 1.15])} oy={700}>
        <HammockScene frozen up={0} />
      </Cam>
      <Layer>
        <Txt x={1360} y={180} text="（暂停）" size={50} opacity={f > 10 ? 1 : 0} />
        {f > 10 && <rect x={1300} y={120} width={22} height={70} fill={CREAM} stroke={INK} strokeWidth={4} />}
        {f > 10 && <rect x={1330} y={120} width={22} height={70} fill={CREAM} stroke={INK} strokeWidth={4} />}
      </Layer>
    </AbsoluteFill>
  );
};

const S13_2: ShotComponent = () => {
  // 闹钟炸响 → 老斑鸠从吊床里弹起来，撞到杆子冒星星，大家解冻
  const { f, g } = useShot();
  if (f < 8) {
    const [sx, sy] = shake(g, 10);
    return (
      <AbsoluteFill style={{ background: "#F2C14E" }}>
        <Cam x={sx} y={sy}>
          <Layer>
            <At x={960} y={560} s={3.4}>
              <AlarmClock frame={g} />
              <SoundWaves x={90} y={-10} dir={1} frame={g} n={3} />
              <SoundWaves x={-90} y={-10} dir={-1} frame={g} n={3} />
            </At>
            <Txt x={1240} y={300} text="铃铃铃！" size={90} r={-8} />
          </Layer>
        </Cam>
      </AbsoluteFill>
    );
  }
  const up = pop(lerp(f, [8, 13], [0, 1]));
  return (
    <AbsoluteFill>
      <Cam oy={700}>
        <HammockScene frozen={false} up={up} />
        <Layer>{f > 12 && <ImpactStars x={960} y={460} age={f - 12} s={0.8} />}</Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S13_3: ShotComponent = () => {
  // 手电筒照到仙人掌，它捂脸；蜥蜴提着灯笼从前景横着走过
  const { f, dur, g, theme } = useShot();
  return (
    <AbsoluteFill style={{ background: "#120E1C" }}>
      <AbsoluteFill style={{ filter: "brightness(0.45)" }}>
        <Desert theme={theme} frame={g} camX={41400} near={false} moon={{ x: 300, y: 160, r: 60 }} />
      </AbsoluteFill>
      <Layer>
        {/* 手电筒光束 */}
        <path d="M -40 520 L 1500 140 L 1500 1020 Z" fill="#F7E36A" opacity={0.28} />
        <ellipse cx={1150} cy={600} rx={300} ry={420} fill="#F7E36A" opacity={0.16} />
      </Layer>
      <Stage>
        <At x={1150} y={980} s={1.25}>
          <Shadow rx={90} />
          <Cactus frame={g} pose={f < 5 ? "idle" : "shy"} />
        </At>
        <At x={lerp(f, [0, dur], [1700, 300])} y={1060} s={1.5}>
          <Lizard frame={g} lantern />
        </At>
      </Stage>
    </AbsoluteFill>
  );
};

/** 夜间怪事的外框 */
const NightFrame: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => {
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
    </AbsoluteFill>
  );
};

const S13_4: ShotComponent = () => {
  // 夜间怪事①：月亮对镜头眨眼
  const { g, theme } = useShot();
  return (
    <NightFrame color="#4FC2B5">
      <Desert theme={theme} frame={g} camX={42000} near={false} />
      <Layer>
        <At x={960} y={420} s={1}>
          <Moon r={300} frame={Math.floor(g / 12) % 3 === 1 ? g : g - (g % 12) + 12} face="wink" />
        </At>
      </Layer>
    </NightFrame>
  );
};

const S13_5: ShotComponent = () => {
  // 夜间怪事②：星星连成一只斑鸠的星座
  const { f, g, theme } = useShot();
  const pts: [number, number][] = [
    [700, 600], [760, 480], [880, 420], [1000, 440], [1080, 400], [1150, 430], [1120, 480], [1060, 520], [1100, 640], [980, 720], [840, 720], [720, 660],
  ];
  const k = lerp(f, [0, 16], [0, pts.length], easeOut);
  return (
    <NightFrame color="#B57EDC">
      <Desert theme={theme} frame={g} camX={42400} near={false} stars />
      <Layer>
        <polyline points={pts.slice(0, Math.max(1, Math.ceil(k))).map((p) => p.join(",")).join(" ")} fill="none" stroke={CREAM} strokeWidth={3} strokeDasharray="10 8" />
        {pts.map(([x, y], i) => (
          <Star key={i} x={x} y={y} r={i < k ? 16 : 9} fill={CREAM} rot={g * 3} />
        ))}
        {/* 头上的长羽毛 */}
        {k > pts.length - 1 && <polyline points="880,420 820,300 790,250" fill="none" stroke="#F2C14E" strokeWidth={4} strokeDasharray="8 8" />}
      </Layer>
    </NightFrame>
  );
};

const S13_6: ShotComponent = () => {
  // 夜间怪事③：一排仙人掌跳康加舞
  const { g, theme, T } = useShot();
  return (
    <NightFrame color="#F2C14E">
      <Desert theme={theme} frame={g} camX={42800} near={false} moon={{ x: 1600, y: 160, r: 80 }} />
      <Stage>
        {[0, 1, 2, 3, 4].map((i) => (
          <At key={i} x={360 + i * 300 + ((g * 3) % 300)} y={960 + beatHop(T + i * 0.15, 30)} s={0.6} r={Math.sin(g / 4 + i) * 8}>
            {i === 2 ? <Cactus frame={g + i * 4} pose="dance" /> : <SmallSaguaro h={320} color={theme.cactus} dark={theme.cactusDark} sway={Math.sin(g / 4 + i) * 10} />}
          </At>
        ))}
      </Stage>
    </NightFrame>
  );
};

const S13_7: ShotComponent = () => {
  // 夜间怪事④：飞碟把一团风滚草吸走
  const { f, g, theme } = useShot();
  const lift = lerp(f, [2, 16], [0, 1]);
  return (
    <NightFrame color="#E8738F">
      <Desert theme={theme} frame={g} camX={43200} near={false} />
      <Layer>
        <At x={960} y={260} s={1.2}>
          <UFO frame={g} beam={1} />
        </At>
        <At x={960} y={lerp(lift, [0, 1], [880, 360])} s={1 - lift * 0.5}>
          <Tumbleweed r={70} rot={f * 30} seed={30} />
        </At>
      </Layer>
    </NightFrame>
  );
};

const S13_8: ShotComponent = () => {
  // 像猫的狗追一个红色光点，扑空撞到石头上冒星星，定格加问号
  const { f, dur, g, theme } = useShot();
  const hitAt = Math.round(dur * 0.55);
  const dot: [number, number] = [lerp(f, [0, hitAt], [700, 1460]) + Math.sin(f / 2) * 40, 960 - Math.abs(Math.sin(f / 3)) * 30];
  const dogX = f < hitAt ? lerp(f, [0, hitAt], [300, 1180]) : 1180;
  const freeze = f >= hitAt + 6;
  const fg = freeze ? g - f + hitAt + 6 : g;
  return (
    <AbsoluteFill>
      <Cam zoom={1.2} oy={860}>
        <Desert theme={theme} frame={g} camX={43800} moon={{ x: 300, y: 180 }} />
        <Stage>
          <At x={1420} y={1000} s={1.6}>
            <Rock w={140} h={90} color={theme.mesa} shade={theme.mesaDark} seed={31} />
          </At>
          <At x={dogX} y={1000} s={1.25}>
            <Shadow rx={150} />
            <CatDog frame={fg} pose={f < hitAt ? "pounce" : "stand"} look={[0.8, 0.4]} />
          </At>
        </Stage>
        <Layer>
          {f < hitAt + 4 && (
            <g>
              <circle cx={dot[0]} cy={dot[1]} r={22} fill="#FF3B3B" opacity={0.35} />
              <circle cx={dot[0]} cy={dot[1]} r={9} fill="#FF4040" />
            </g>
          )}
          {f >= hitAt && <ImpactStars x={1330} y={820} age={f - hitAt} s={0.8} />}
        </Layer>
      </Cam>
      {freeze && (
        <>
          <AbsoluteFill style={{ background: "#F6E7C8", mixBlendMode: "color", opacity: 0.5 }} />
          <Layer>
            <g transform={`translate(1500 420) scale(${pop(lerp(f, [hitAt + 6, hitAt + 12], [0, 1])) * 3.2})`}>
              <QuestionMark x={0} y={0} frame={g} />
            </g>
          </Layer>
        </>
      )}
    </AbsoluteFill>
  );
};

export const S13: ShotComponent[] = [S13_1, S13_2, S13_3, S13_4, S13_5, S13_6, S13_7, S13_8];
