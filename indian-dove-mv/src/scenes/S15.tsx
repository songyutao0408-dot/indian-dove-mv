// S15 间奏二（约 20 秒纯音乐，夜晚 → 黎明）：篝火派对 → 绕着篝火 → 篝火渐熄、天边泛白 → 日出，白天回归
import React from "react";
import { AbsoluteFill } from "remotion";
import { Campfire } from "../backgrounds/Campfire";
import { Desert } from "../backgrounds/Desert";
import { CatDog, Dove, Hen, Snake, Wolf } from "../characters";
import { Zzz } from "../characters/parts";
import { mixTheme, staticTheme } from "../style/theme";
import type { CharId } from "../shots";
import { At, Cam, Layer, Shadow, Stage, beatPhaseAt, beatPulse, easeInOut, easeOut, lerp, useShot, type ShotComponent } from "./common";
import { CastMember, type CastMode } from "./cast";

// 第一个和最后一个站在火前方空位的两侧（最靠前、最大）
const PARTY: CharId[] = ["dove", "wolf", "cactus", "cowboy", "shaman", "chief", "snake", "lizard", "catdog", "bison", "seagull", "warrior", "vulture", "hen"];

/** 篝火光：把夜晚主题往暖色偏 */
const fireLit = (night: ReturnType<typeof staticTheme>, k: number) => mixTheme(night, { ...night, tint: "#E8A060", tintAmount: 0.2, night: 0.35 }, k);

/** 围着篝火的一圈角色（按角度摆在椭圆上，后面的小、前面的大）。
 * part：只画火后面（back）或火前面（front）的那一半，好把篝火夹在中间。
 * gap：正前方留出的空位（弧度），静止镜头里别让人挡住火。 */
const Ring: React.FC<{ rot: number; mode: CastMode; part: "back" | "front"; gap?: number; cx?: number; cy?: number; rx?: number; ry?: number; s?: number }> = ({
  rot, mode, part, gap = 0, cx = 960, cy = 820, rx = 760, ry = 170, s = 0.62,
}) => {
  const { g, T } = useShot();
  const n = PARTY.length;
  const items = PARTY.map((id, i) => {
    const a = gap > 0 ? Math.PI / 2 + gap / 2 + ((i + 0.5) / n) * (Math.PI * 2 - gap) : rot + (i / n) * Math.PI * 2;
    const depth = (Math.sin(a) + 1) / 2; // 0 = 后，1 = 前
    return { id, i, a, x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry, sc: s * (0.75 + depth * 0.5), facing: (Math.cos(a) > 0 ? -1 : 1) as 1 | -1 };
  })
    .filter((it) => (part === "back" ? Math.sin(it.a) < 0 : Math.sin(it.a) >= 0))
    .sort((a, b) => a.y - b.y);
  return (
    <>
      {items.map((it) => (
        <At key={it.id} x={it.x} y={it.y} s={it.sc}>
          <Shadow rx={90} />
          <CastMember id={it.id} g={g} T={T} mode={mode} facing={it.facing} seed={it.i} />
        </At>
      ))}
    </>
  );
};

const S15_1: ShotComponent = () => {
  // 全景：所有动物围着篝火，跟着节拍左右摇摆
  const { f, dur, g, theme, T } = useShot();
  const lit = fireLit(theme, 1);
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, dur], [1.0, 1.1]) + beatPulse(T) * 0.01} oy={760}>
        <Desert theme={theme} frame={g} camX={46400} near={false} moon={{ x: 300, y: 150, r: 70 }} />
        <Stage theme={lit}>
          <Ring rot={0} mode="dance" part="back" gap={0.9} />
        </Stage>
        <Layer>
          <At x={960} y={850} s={1.2}>
            <Campfire frame={g} />
          </At>
        </Layer>
        <Stage theme={lit}>
          <Ring rot={0} mode="dance" part="front" gap={0.9} />
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

const S15_2: ShotComponent = () => {
  // 镜头绕着篝火转：灰狼和响尾蛇对跳，像猫的狗追火星，大家转着圈摇摆
  const { f, dur, g, theme, T } = useShot();
  const lit = fireLit(theme, 1);
  const rot = lerp(f, [0, dur], [0.6, 2.4]);
  const spark = (k: number) => ({ x: 1100 + Math.sin(f / 5 + k) * 120, y: 520 - ((f * 6 + k * 90) % 300) });
  const sp = spark(0);
  return (
    <AbsoluteFill>
      <Cam zoom={1.45} oy={820}>
        <Desert theme={theme} frame={g} camX={46400 + f * 18} near={false} moon={{ x: 1600, y: 140, r: 60 }} />
        <Stage theme={lit}>
          <Ring rot={rot} mode="dance" part="back" rx={820} ry={200} cy={860} s={0.66} />
        </Stage>
        <Layer>
          <At x={960} y={870} s={1.3}>
            <Campfire frame={g} />
          </At>
        </Layer>
        <Stage theme={lit}>
          <Ring rot={rot} mode="dance" part="front" rx={820} ry={200} cy={860} s={0.66} />
          {/* 前景主角：狼和蛇对跳、狗追火星 */}
          <At x={560} y={1050} s={0.95}>
            <Wolf frame={g} pose="dance" expression="grin" beat={beatPhaseAt(T)} />
          </At>
          <At x={840} y={1060} s={0.9} r={Math.sin(f / 4) * 10}>
            <Snake frame={g} pose="coiled" expression="happy" facing={-1} />
          </At>
          <At x={1340} y={1060} s={0.85}>
            <CatDog frame={g} pose="pounce" look={[-0.3, -0.9]} facing={-1} />
          </At>
          <circle cx={sp.x} cy={sp.y} r={8} fill="#F7D58B" />
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

const S15_3: ShotComponent = () => {
  // 火光变小成余烬，动物们东倒西歪睡着，天边泛白
  const { f, dur, g, theme } = useShot();
  const k = lerp(f, [0, dur * 0.7], [1, 0.08], easeInOut);
  const lit = fireLit(theme, k);
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, dur], [1.15, 1.0], easeOut)} oy={760}>
        <Desert theme={theme} frame={g} camX={47000} near={false} />
        <Stage theme={lit}>
          <Ring rot={0} mode={f > dur * 0.35 ? "sleep" : "idle"} part="back" gap={0.9} />
        </Stage>
        <Layer>
          <At x={960} y={850} s={1.2}>
            <Campfire frame={g} intensity={k} />
          </At>
        </Layer>
        <Stage theme={lit}>
          <Ring rot={0} mode={f > dur * 0.35 ? "sleep" : "idle"} part="front" gap={0.9} />
        </Stage>
        <Layer>
          {f > dur * 0.4 &&
            [400, 1500, 900].map((x, i) => (
              <g key={i} transform={`translate(${x} ${640 + i * 30})`}>
                <Zzz x={0} y={0} frame={g + i * 9} />
              </g>
            ))}
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S15_4: ShotComponent = () => {
  // 日出：太阳打着哈欠升起，白天回归；老斑鸠伸个懒腰（扑腾翅膀），母斑鸠揉眼睛
  const { f, dur, g, theme } = useShot();
  const sunY = lerp(f, [0, dur], [760, 300], easeOut);
  const awake = f > dur * 0.45;
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, dur], [1.15, 1.0])} oy={700}>
        <Desert theme={theme} frame={g} camX={47600} sun={{ x: 960, y: sunY, r: 150, face: f < dur * 0.6 ? "yawn" : "wave" }} />
        <Layer>
          {/* 朝阳的光芒 */}
          {Array.from({ length: 10 }, (_, i) => (
            <path key={i} d={`M 960 ${sunY} L ${960 + Math.cos((i / 10) * Math.PI + Math.PI) * 1600} ${sunY + Math.sin((i / 10) * Math.PI + Math.PI) * 1600 * 0.6}`} stroke="#FBE7A1" strokeWidth={30} opacity={0.12 * lerp(f, [0, 40], [0, 1])} />
          ))}
        </Layer>
        <Stage>
          <At x={720} y={1000} s={1.3}>
            <Shadow />
            <Dove frame={g} pose={awake ? "flap" : "sit"} expression={awake ? "happy" : "sleep"} />
          </At>
          <At x={1220} y={1000} s={1.25} flip>
            <Shadow rx={90} />
            <Hen frame={g} pose={awake ? "stand" : "sit"} expression={awake ? "happy" : "calm"} blink={awake ? undefined : 1} />
          </At>
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

export const S15: ShotComponent[] = [S15_1, S15_2, S15_3, S15_4];
