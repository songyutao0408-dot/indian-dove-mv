// S14 副歌B·二（夜晚）：星空发呆（流星划过也不动）→ 岩壁上的影子小偷和影子追逐 → 萤火虫里重逢 → 萤火虫排成爱心
import { AbsoluteFill } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { DryBush, SmallSaguaro } from "../backgrounds/props";
import { MOUND_TOP, TermiteMound } from "../backgrounds/TermiteMound";
import { Crow, Dove, Hen } from "../characters";
import { Heart, Smoke } from "../characters/parts";
import { LYRIC_FONT } from "../fonts";
import { Fireflies } from "../fx";
import { CREAM, INK } from "../style/palette";
import { At, Cam, Layer, Shadow, Stage, easeInOut, easeOut, lerp, useShot, type ShotComponent } from "./common";

const S14_1: ShotComponent = () => {
  // 低机位仰拍：老斑鸠坐在丘顶，一颗流星划过，它一动不动
  const { f, g, theme } = useShot();
  const star = lerp(f, [14, 40], [0, 1]);
  return (
    <AbsoluteFill>
      <Cam zoom={1.15}>
        <Desert theme={theme} frame={g} camX={44600} horizon={1000} near={false} fg={false} moon={{ x: 300, y: 220, r: 90 }} />
        <Layer>
          {star > 0 && star < 1 && (
            <g opacity={Math.sin(star * Math.PI)}>
              <path d={`M ${1700 - star * 1200} ${100 + star * 300} l 260 -90`} stroke={CREAM} strokeWidth={6} strokeLinecap="round" />
              <circle cx={1700 - star * 1200} cy={100 + star * 300} r={10} fill={CREAM} />
            </g>
          )}
        </Layer>
        <Stage>
          <At x={1100} y={1500} s={1.5}>
            <TermiteMound theme={theme} />
            <At x={MOUND_TOP[0]} y={MOUND_TOP[1]} s={0.75}>
              <Dove frame={g} pose="sit" expression="daze" look={[0.1, -0.3]} />
            </At>
          </At>
        </Stage>
        <Layer>
          {star > 0.5 && (
            <text x={1300} y={560} fontSize={50} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={6} paintOrder="stroke" opacity={easeOut(lerp(f, [30, 36], [0, 1]))}>
              ……
            </text>
          )}
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S14_2: ShotComponent = () => {
  // 月光把影子投在岩壁上：乌鸦的影子叼走了窝；老斑鸠的影子头顶冒烟带火星追上去，两个剪影绕着仙人掌跑
  const { f, dur, g, theme } = useShot();
  const grabAt = 18;
  const chaseAt = 26;
  const k = lerp(f, [chaseAt, dur], [0, 1]);
  const a = k * Math.PI * 2.2;
  const crowX = f < chaseAt ? lerp(f, [0, grabAt], [200, 820]) : 960 + Math.cos(a) * 520;
  const doveX = f < chaseAt ? 1160 : 960 + Math.cos(a - 0.9) * 520;
  const shadowStyle = { filter: "brightness(0)", opacity: 0.62 } as const;
  return (
    <AbsoluteFill>
      {/* 岩壁 */}
      <Layer>
        <rect width={1920} height={1080} fill={theme.mesa} />
        {[160, 360, 600, 820].map((y) => (
          <path key={y} d={`M 0 ${y} L 1920 ${y + 20}`} stroke={theme.mesaDark} strokeWidth={6} opacity={0.6} />
        ))}
        <path d="M 400 0 l 30 300 l -20 200 M 1500 1080 l -20 -300 l 30 -240" stroke={theme.mesaDark} strokeWidth={5} fill="none" />
        <rect y={940} width={1920} height={140} fill={theme.sand} />
        <rect y={940} width={1920} height={8} fill={theme.sandShadow} />
        {/* 月光照出来的亮斑 */}
        <ellipse cx={960} cy={600} rx={900} ry={420} fill={CREAM} opacity={0.12} />
      </Layer>
      <Layer>
        <g style={shadowStyle}>
          <At x={960} y={960} s={1.6}>
            <SmallSaguaro h={340} color="#000" dark="#000" />
          </At>
          <At x={1160} y={960} s={1.3}>
            <path d="M -90 -24 Q -84 16 0 18 Q 84 16 90 -24 Z" fill="#000" />
          </At>
          <At x={crowX} y={960} s={1.3} flip={f >= chaseAt && Math.sin(a) > 0}>
            <Crow frame={g} pose={f < grabAt ? "sneak" : "run"} twig={f >= grabAt} />
          </At>
          {f >= chaseAt && (
            <At x={doveX} y={960} s={1.3} flip={Math.sin(a - 0.9) > 0}>
              <Dove frame={g * 2} pose="walk" expression="angry" />
            </At>
          )}
          {f < chaseAt && (
            <At x={doveX} y={960} s={1.3}>
              <Dove frame={g} pose="sit" expression={f > grabAt ? "angry" : "daze"} facing={-1} />
            </At>
          )}
        </g>
        {/* 火星是亮的 */}
        {f >= chaseAt && <Smoke x={doveX} y={600} frame={g} color="#F0A15E" />}
      </Layer>
    </AbsoluteFill>
  );
};

const S14_3: ShotComponent = () => {
  // 灌木丛里亮起萤火虫，母斑鸠在光里走出来
  const { f, g, theme } = useShot();
  const henX = lerp(f, [6, 40], [1500, 1220], easeOut);
  return (
    <AbsoluteFill>
      <Cam zoom={1.3} oy={820}>
        <Desert theme={theme} frame={g} camX={45200} near={false} moon={{ x: 1500, y: 200 }} />
        <Layer>
          <ellipse cx={henX} cy={760} rx={260} ry={300} fill="#F7E36A" opacity={0.12} />
        </Layer>
        <Stage>
          <At x={640} y={990} s={1.3}>
            <Shadow />
            <Dove frame={g} expression="shock" />
          </At>
          <At x={henX} y={990} s={1.25} flip>
            <Shadow rx={90} />
            <Hen frame={g} pose={f < 40 ? "walk" : "stand"} expression="calm" />
          </At>
          <At x={1480} y={1000} s={2.2}>
            <DryBush s={1.2} color="#3E5A5A" sway={Math.sin(g / 6) * 6} />
          </At>
        </Stage>
        <Layer>
          <Fireflies frame={g} count={22} x0={1100} x1={1700} y0={600} y1={1000} seed={5} />
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S14_4: ShotComponent = () => {
  // 萤火虫排成一颗心，夜空泛粉，两只斑鸠对望
  const { f, g, theme } = useShot();
  const form = lerp(f, [0, 30], [0, 1], easeInOut);
  const n = 26;
  const flies = Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    const hx = 960 + 16 * Math.pow(Math.sin(t), 3) * 14;
    const hy = 380 - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 14;
    const sx = 960 + Math.sin(i * 7.3) * 700;
    const sy = 500 + Math.cos(i * 3.1) * 300;
    const x = sx + (hx - sx) * form + Math.sin(g / 8 + i) * 6;
    const y = sy + (hy - sy) * form + Math.cos(g / 7 + i) * 6;
    const glow = 0.6 + 0.4 * Math.sin(g / 5 + i);
    return (
      <g key={i} opacity={glow}>
        <circle cx={x} cy={y} r={18} fill="#F7E36A" opacity={0.3} />
        <circle cx={x} cy={y} r={6} fill="#FBF1A8" />
      </g>
    );
  });
  return (
    <AbsoluteFill>
      <Desert theme={theme} frame={g} camX={45800} near={false} />
      <AbsoluteFill style={{ background: "#E8738F", mixBlendMode: "soft-light", opacity: form * 0.8 }} />
      <Layer>{flies}</Layer>
      <Stage>
        <At x={760} y={1000} s={1.45}>
          <Shadow />
          <Dove frame={g} expression="love" />
        </At>
        <At x={1180} y={1000} s={1.4} flip>
          <Shadow rx={90} />
          <Hen frame={g} expression="love" />
        </At>
      </Stage>
      <Layer>{form >= 1 && <Heart x={960} y={760 - (f - 30) * 2} s={22} />}</Layer>
    </AbsoluteFill>
  );
};

export const S14: ShotComponent[] = [S14_1, S14_2, S14_3, S14_4];
