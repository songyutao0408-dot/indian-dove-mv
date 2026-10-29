// 检查点 3：场景静帧（各时段背景、小镇、篝火、白蚁丘、特效）
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Campfire } from "../backgrounds/Campfire";
import { Desert } from "../backgrounds/Desert";
import { Tumbleweed } from "../backgrounds/props";
import { MOUND_TOP, TermiteMound } from "../backgrounds/TermiteMound";
import { ClockTower, TownStreet, WelcomeSign } from "../backgrounds/Town";
import { Bison, Cactus, CatDog, Chief, Crow, Dove, Hen, Lizard, Loach, Seagull, Shaman, Snake, Vulture, Wolf } from "../characters";
import { LYRIC_FONT } from "../fonts";
import {
  DustCloud, Fireflies, FilmBurn, FlipCard, FocusLines, HeatHaze, HeatLines, ImpactStars, Iris, Petals, SpeedLines,
  WesternText, WoodBoard,
} from "../fx";
import { FilmLook } from "../overlay/FilmLook";
import { Ambient } from "../style/Ambient";
import { CREAM, INK } from "../style/palette";
import { staticTheme, type Theme } from "../style/theme";

export type SceneVariant = "day" | "dusk" | "night" | "dawn" | "town" | "campfire" | "mound" | "fx";

const Layer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);

const Shadow: React.FC<{ theme: Theme; rx?: number }> = ({ theme, rx = 110 }) => <ellipse cx={0} cy={4} rx={rx} ry={rx * 0.14} fill={theme.sandShadow} opacity={0.8} />;

const Caption: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", left: 30, top: 26, fontFamily: LYRIC_FONT, fontSize: 30, color: CREAM, WebkitTextStroke: `5px ${INK}`, paintOrder: "stroke fill" }}>{text}</div>
);

export const SceneStill: React.FC<{ variant: SceneVariant }> = ({ variant }) => {
  const frame = useCurrentFrame() + 30;

  if (variant === "day") {
    // 白天峡谷：S2 响尾蛇热昏 + 得意的太阳
    const theme = staticTheme("day");
    return (
      <FilmLook frame={frame}>
        <Desert theme={theme} frame={frame} camX={400} sun={{ x: 1480, y: 180, face: "smug" }} />
        <Layer>
          <Ambient theme={theme}>
            <HeatHaze frame={frame} strength={4}>
              <g transform="translate(980 880) scale(1.25)">
                <Shadow theme={theme} rx={200} />
                <Snake frame={frame} />
              </g>
            </HeatHaze>
            <HeatLines frame={frame} x={980} y={760} w={420} />
            <g transform="translate(420 900)">
              <Shadow theme={theme} />
              <Dove frame={frame} expression="hungry" />
            </g>
            <g transform={`translate(1560 850)`}>
              <Tumbleweed r={52} rot={frame * 9} />
            </g>
          </Ambient>
        </Layer>
        <Caption text="白天 · 峡谷（S2 热昏的响尾蛇 + 得意的太阳）" />
      </FilmLook>
    );
  }

  if (variant === "dusk") {
    const theme = staticTheme("dusk");
    return (
      <FilmLook frame={frame}>
        <Desert theme={theme} frame={frame} camX={1500} seed={2} sun={{ x: 760, y: 330, r: 120, face: "sleepy" }} />
        <Layer>
          <Ambient theme={theme}>
            <g transform="translate(1240 880) scale(1.1)">
              <Shadow theme={theme} rx={90} />
              <Loach frame={frame} lookUp sandColor={theme.sand} />
            </g>
          </Ambient>
          {/* 海鸥剪影横穿落日 */}
          <g transform="translate(700 330) scale(0.9)" style={{ filter: "brightness(0)" }} opacity={0.85}>
            <Seagull frame={frame} />
          </g>
        </Layer>
        <Caption text="黄昏（S10 海鸥剪影横穿落日、泥鳅抬头）" />
      </FilmLook>
    );
  }

  if (variant === "night") {
    const theme = staticTheme("night");
    return (
      <FilmLook frame={frame}>
        <Desert theme={theme} frame={frame} camX={2600} seed={3} moon={{ x: 1380, y: 230, r: 110 }} />
        <Layer>
          <Ambient theme={theme}>
            <g transform="translate(820 940) scale(1.05)">
              <TermiteMound theme={theme} />
              <g transform={`translate(${MOUND_TOP[0]} ${MOUND_TOP[1]}) scale(0.8)`}>
                <Dove frame={frame} pose="sit" expression="daze" look={[0.6, -0.6]} />
              </g>
            </g>
          </Ambient>
          <Fireflies frame={frame} count={16} y0={500} y1={980} />
        </Layer>
        <Caption text="夜晚（S11 月光下的白蚁丘，老斑鸠看月亮）" />
      </FilmLook>
    );
  }

  if (variant === "dawn") {
    const theme = staticTheme("dawn");
    return (
      <FilmLook frame={frame}>
        <Desert theme={theme} frame={frame} camX={800} seed={4} sun={{ x: 960, y: 400, r: 130, face: "yawn" }} />
        <Layer>
          <Ambient theme={theme}>
            <g transform="translate(700 920)">
              <Shadow theme={theme} />
              <Dove frame={frame} pose="flap" expression="happy" />
            </g>
            <g transform="translate(1180 920)">
              <Shadow theme={theme} />
              <Hen frame={frame} facing={-1} expression="happy" />
            </g>
          </Ambient>
        </Layer>
        <Caption text="黎明（S15 日出，太阳打着哈欠升起）" />
      </FilmLook>
    );
  }

  if (variant === "town") {
    // 正午的主街，做旧胶片
    const theme = staticTheme("day", 1);
    return (
      <FilmLook frame={frame} sepia={1}>
        <TownStreet theme={theme} frame={frame} shut={0.7} camZ={300} clock={{ hour: 11, minute: 59 }}>
          <Layer>
            <g transform="translate(1100 940)">
              <Tumbleweed r={70} rot={frame * 10} />
            </g>
          </Layer>
        </TownStreet>
        <Caption text="小镇主街 · 正午 · 做旧模式（S8 → S9）" />
      </FilmLook>
    );
  }

  if (variant === "campfire") {
    const theme = staticTheme("night");
    const ring: [React.ReactNode, number, number, number][] = [
      [<Wolf frame={frame} expression="grin" pose="dance" />, 480, 830, 0.72],
      [<Cactus frame={frame} pose="dance" />, 300, 820, 0.62],
      [<Shaman frame={frame} pose="dance" />, 1500, 830, 0.62],
      [<Chief frame={frame} expression="happy" />, 1700, 820, 0.6],
      [<Snake frame={frame} pose="coiled" expression="happy" />, 1180, 820, 0.6],
      [<Dove frame={frame} pose="dance" expression="happy" />, 660, 980, 0.95],
      [<Hen frame={frame + 6} pose="dance" expression="happy" facing={-1} />, 1260, 990, 0.92],
      [<CatDog frame={frame} pose="stand" facing={-1} />, 1480, 1010, 0.7],
      [<Lizard frame={frame} />, 280, 1020, 0.75],
    ];
    return (
      <FilmLook frame={frame}>
        <Desert theme={theme} frame={frame} camX={3000} seed={5} moon={{ x: 300, y: 160, r: 70 }} near={false} />
        <Layer>
          <g transform="translate(960 900) scale(1.35)">
            <Campfire frame={frame} />
          </g>
          <Ambient theme={{ ...theme, tintAmount: 0.18, night: 0.4, tint: "#E8A060" }}>
            {ring.map(([el, x, y, s], i) => (
              <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
                {el}
              </g>
            ))}
          </Ambient>
        </Layer>
        <Caption text="篝火派对（S15，角色被火光照暖）" />
      </FilmLook>
    );
  }

  if (variant === "mound") {
    // 白天的白蚁丘：S4 老斑鸠饿昏登场
    const theme = staticTheme("day");
    return (
      <FilmLook frame={frame}>
        <Desert theme={theme} frame={frame} camX={1200} seed={6} sun={{ x: 300, y: 150 }} />
        <Layer>
          <Ambient theme={theme}>
            <g transform="translate(1000 1000) scale(1.2)">
              <TermiteMound theme={theme} />
              <g transform={`translate(${MOUND_TOP[0]} ${MOUND_TOP[1]}) scale(0.75)`}>
                <Dove frame={frame} expression="hungry" />
              </g>
            </g>
            <g transform="translate(300 960) scale(0.8)">
              <Shadow theme={theme} rx={160} />
              <Vulture frame={frame} />
            </g>
          </Ambient>
          <g transform="translate(1500 300) scale(0.5)">
            <Vulture frame={frame} pose="fly" />
          </g>
        </Layer>
        <Caption text="白蚁丘 · 白天（S4 老斑鸠饿昏登场）" />
      </FilmLook>
    );
  }

  // 特效一览：3×3 九宫格，每格是一个缩小的 1920×1080 画面
  const day = staticTheme("day");
  const night = staticTheme("night");
  const panels: [string, React.ReactNode][] = [
    [
      "尘土 + 撞击星星",
      <>
        <Desert theme={day} frame={frame} camX={0} seed={7} near={false} />
        <Layer>
          <g transform="translate(700 900) scale(0.9)">
            <Bison frame={frame} pose="charge" />
          </g>
          <g transform="translate(1220 900) scale(0.9)">
            <Bison frame={frame} pose="charge" facing={-1} tint="#86603E" />
          </g>
          <DustCloud x={960} y={900} age={10} size={1.8} />
          <ImpactStars x={960} y={700} age={6} s={1.6} />
        </Layer>
      </>,
    ],
    [
      "速度线 + 跑动",
      <>
        <Desert theme={day} frame={frame} camX={frame * 40} seed={8} />
        <Layer>
          <SpeedLines frame={frame} y0={150} y1={950} dir={-1} />
          <g transform="translate(700 920) scale(1.3)">
            <Dove frame={frame} pose="walk" expression="angry" />
          </g>
          <g transform="translate(1300 900) scale(1.3)">
            <Crow frame={frame} pose="run" twig expression="scared" />
          </g>
        </Layer>
      </>,
    ],
    [
      "集中线（惊吓）",
      <>
        <AbsoluteFill style={{ background: "#F7D58B" }} />
        <Layer>
          <FocusLines frame={frame} inner={330} />
          <g transform="translate(960 1060) scale(2.4)">
            <Dove frame={frame} expression="shock" />
          </g>
        </Layer>
      </>,
    ],
    [
      "热浪扭曲 + 热气",
      <>
        <Desert theme={day} frame={frame} camX={400} seed={1} sun={{ x: 1500, y: 180, face: "smug" }} />
        <Layer>
          <HeatHaze frame={frame} strength={4}>
            <g transform="translate(960 900) scale(1.8)">
              <Snake frame={frame} />
            </g>
          </HeatHaze>
          <HeatLines frame={frame} x={960} y={720} w={600} n={6} />
        </Layer>
      </>,
    ],
    [
      "木牌翻转",
      <>
        <AbsoluteFill style={{ background: "#F0A15E" }} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <FlipCard
            progress={0.3}
            front={
              <WoodBoard w={1100} h={440}>
                <WesternText size={130}>Indian Dove</WesternText>
              </WoodBoard>
            }
            back={
              <WoodBoard w={1100} h={440}>
                <WesternText size={110} font={LYRIC_FONT}>
                  词：方文山
                </WesternText>
              </WoodBoard>
            }
          />
        </AbsoluteFill>
      </>,
    ],
    [
      "光圈收缩",
      <>
        <Desert theme={staticTheme("dusk")} frame={frame} camX={900} seed={2} />
        <Layer>
          <g transform="translate(900 1000) scale(1.8)">
            <Ambient theme={staticTheme("dusk")}>
              <Dove frame={frame} expression="daze" />
            </Ambient>
          </g>
        </Layer>
        <Iris open={0.22} cx={1000} cy={600} />
      </>,
    ],
    [
      "胶片烧穿",
      <>
        <AbsoluteFill style={{ filter: "sepia(0.9)" }}>
          <TownStreet theme={day} frame={frame} />
        </AbsoluteFill>
        <FilmBurn progress={0.5} frame={frame} />
      </>,
    ],
    [
      "心动：粉色背景 + 花瓣",
      <>
        <AbsoluteFill style={{ background: "#F4B6C2" }} />
        <Layer>
          <Petals frame={frame} count={30} />
          <g transform="translate(760 980) scale(1.5)">
            <Dove frame={frame} expression="love" />
          </g>
          <g transform="translate(1240 980) scale(1.5)">
            <Hen frame={frame} expression="shy" facing={-1} />
          </g>
        </Layer>
      </>,
    ],
    [
      "萤火虫 + 泪水喷泉",
      <>
        <Desert theme={night} frame={frame} camX={2000} seed={3} moon={{ x: 1500, y: 200 }} />
        <Layer>
          <Ambient theme={night}>
            <g transform="translate(960 980) scale(1.6)">
              <Dove frame={frame} expression="sad" />
            </g>
          </Ambient>
          <Fireflies frame={frame} count={24} />
        </Layer>
      </>,
    ],
  ];
  return (
    <FilmLook frame={frame}>
      <AbsoluteFill style={{ background: "#2A1A10" }} />
      {panels.map(([label, content], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: (i % 3) * 640 + 6,
            top: Math.floor(i / 3) * 360 + 6,
            width: 1920,
            height: 1080,
            transform: "scale(0.327)",
            transformOrigin: "0 0",
            overflow: "hidden",
          }}
        >
          {content}
          <div style={{ position: "absolute", left: 40, top: 30, fontFamily: LYRIC_FONT, fontSize: 84, color: CREAM, WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill" }}>{label}</div>
        </div>
      ))}
    </FilmLook>
  );
};

export { ClockTower, WelcomeSign, Seagull };
