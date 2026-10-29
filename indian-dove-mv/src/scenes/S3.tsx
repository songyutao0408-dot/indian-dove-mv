// S3 主歌一·下：灰狼啃骨 → 秃鹰盘旋（转成它的主观俯拍）→ 野牛分屏对峙 → 远景对冲撞出尘土
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { Desert } from "../backgrounds/Desert";
import { CowSkull, Rock, SmallSaguaro } from "../backgrounds/props";
import { Bison, Vulture, Wolf } from "../characters";
import { DustCloud, ImpactStars, SpeedLines } from "../fx";
import { INK } from "../style/palette";
import { At, Cam, Layer, Shadow, Stage, beatPulse, easeIn, easeInOut, lerp, shake, useShot, type ShotComponent } from "./common";

const S3_1: ShotComponent = () => {
  // 灰狼龇牙啃骨头，每一拍咬一口，骨头上的缺口越来越多，碎屑乱飞
  const { f, dur, g, theme, T } = useShot();
  const bites = 1 + Math.min(3, Math.floor(f / 14));
  const crumbs = Array.from({ length: 8 }, (_, i) => {
    const age = (f + i * 5) % 16;
    const a = -Math.PI / 2 + (random(`cr${i}`) - 0.5) * 2;
    return <rect key={i} x={1180 + Math.cos(a) * age * 14} y={500 + Math.sin(a) * age * 10 + age * age * 1.2} width={10} height={7} fill="#EFE6D2" stroke={INK} strokeWidth={2} opacity={1 - age / 16} />;
  });
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(f, [0, dur], [1, 1.06]) + beatPulse(T) * 0.02} oy={500}>
        <Desert theme={theme} frame={g} camX={5200} horizon={640} sun={{ x: 300, y: 140, face: "smug" }} />
        <Stage>
          <At x={340} y={1000} s={1.2}>
            <CowSkull s={1.2} />
          </At>
          <At x={900} y={1260} s={2.1}>
            <Wolf frame={g} expression="chew" bone bites={bites} />
          </At>
          {crumbs}
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

/** 秃鹰主观视角：从上往下看的地面（圆形视野、慢慢旋转） */
const VultureView: React.FC<{ g: number; rot: number }> = ({ g, rot }) => {
  const { theme } = useShot();
  return (
    <AbsoluteFill style={{ background: theme.sand }}>
      <AbsoluteFill style={{ transform: `rotate(${rot}deg) scale(1.3)` }}>
        <Layer>
          {/* 俯看的沙地：沙丘阴影、石头、仙人掌顶 */}
          {Array.from({ length: 16 }, (_, i) => (
            <ellipse key={i} cx={random(`vx${i}`) * 1920} cy={random(`vy${i}`) * 1080} rx={120 + random(`vr${i}`) * 160} ry={50 + random(`vr2${i}`) * 50} fill={theme.sandShadow} opacity={0.5} />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <g key={i} transform={`translate(${random(`cx${i}`) * 1920} ${random(`cy${i}`) * 1080})`}>
              <circle r={26} fill={theme.cactus} stroke={INK} strokeWidth={4} />
              <circle r={10} fill={theme.cactusDark} />
            </g>
          ))}
          <At x={1300} y={300} s={0.6}>
            <CowSkull s={1.4} />
          </At>
          {/* 地上的灰狼抬头瞪回来 */}
          <At x={960} y={700} s={0.55}>
            <Shadow rx={160} />
            <Wolf frame={g} expression="serious" bone bites={4} />
          </At>
          {/* 秃鹰自己的影子 */}
          <ellipse cx={760} cy={720} rx={140} ry={30} fill={INK} opacity={0.25} />
        </Layer>
      </AbsoluteFill>
      {/* 圆形视野 */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 46%, rgba(20,10,4,0.92) 62%)" }} />
    </AbsoluteFill>
  );
};

const S3_2: ShotComponent = () => {
  // 前半：仰拍秃鹰在天上绕圈、眼珠往下死盯；后半：镜头翻成它的主观俯拍
  const { f, dur, g, theme, t } = useShot();
  const flipAt = Math.round(dur * 0.48);
  if (f < flipAt) {
    const a = t * 2.4;
    const zoomIn = lerp(f, [flipAt - 8, flipAt], [1, 2.4], easeIn);
    return (
      <AbsoluteFill>
        <Cam zoom={zoomIn} ox={960 + Math.cos(a) * 380} oy={480 + Math.sin(a) * 120}>
          <Layer>
            {theme.sky.map((c, i) => (
              <rect key={i} x={0} y={i * 270} width={1920} height={271} fill={c} />
            ))}
            {/* 仰拍：画面底部一圈平顶山的剪影 */}
            <path d="M 0 1080 L 0 940 L 160 920 L 180 860 L 420 850 L 440 900 L 700 930 L 1100 950 L 1300 880 L 1520 870 L 1540 930 L 1920 940 L 1920 1080 Z" fill={theme.mesaDark} />
          </Layer>
          <Stage>
            <At x={960 + Math.cos(a) * 380} y={480 + Math.sin(a) * 120} s={1.1} flip={Math.sin(a) > 0} r={Math.cos(a) * 10}>
              <Vulture frame={g} pose="fly" look={[0.2, 1]} />
            </At>
          </Stage>
        </Cam>
      </AbsoluteFill>
    );
  }
  const k = f - flipAt;
  return (
    <AbsoluteFill>
      <Cam zoom={lerp(k, [0, 8], [1.6, 1], easeInOut)}>
        <VultureView g={g} rot={k * 0.9} />
      </Cam>
    </AbsoluteFill>
  );
};

const S3_3: ShotComponent = () => {
  // 斜线分屏：两头野牛刨地喷气，眼神对上；跟着节拍一下一下往前拱
  const { f, dur, g, theme, T } = useShot();
  const pulse = beatPulse(T);
  const charge = lerp(f, [dur - 14, dur], [0, 1], easeIn);
  const half = (side: 1 | -1) => (
    <AbsoluteFill style={{ clipPath: side === 1 ? "polygon(0 0, 55% 0, 45% 100%, 0 100%)" : "polygon(55% 0, 100% 0, 100% 100%, 45% 100%)" }}>
      <Cam zoom={1.25 + pulse * 0.05} x={side * (-60 + charge * 160)} ox={side === 1 ? 400 : 1520} oy={700}>
        <Desert theme={theme} frame={g} camX={side === 1 ? 6000 : 7000} near={false} seed={side === 1 ? 3 : 4} sun={side === 1 ? { x: 200, y: 140, face: "smug" } : undefined} />
        <Stage>
          <At x={side === 1 ? 560 : 1360} y={980} s={1.05}>
            <Shadow rx={230} />
            <Bison frame={g + (side === 1 ? 0 : 6)} pose={charge > 0.2 ? "charge" : "paw"} facing={side} tint={side === 1 ? undefined : "#86603E"} />
          </At>
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ background: INK }}>
      {half(1)}
      {half(-1)}
      <Layer>
        <path d="M 1056 0 L 864 1080" stroke={INK} strokeWidth={14} />
        <path d="M 1056 0 L 864 1080" stroke="#F7D58B" strokeWidth={5} />
        {charge > 0 && <SpeedLines frame={g} y0={300} y1={1000} dir={1} opacity={charge * 0.7} />}
      </Layer>
    </AbsoluteFill>
  );
};

const S3_4: ShotComponent = () => {
  // 远景：两头野牛从两边对冲，撞出一大团尘土、冒星星，然后两头都晕了
  const { f, g, theme } = useShot();
  const hitAt = 18;
  const k = lerp(f, [0, hitAt], [0, 1], easeIn);
  const hit = f >= hitAt;
  const [sx, sy] = shake(g, hit ? lerp(f, [hitAt, hitAt + 16], [16, 0]) : 0);
  return (
    <AbsoluteFill>
      <Cam x={sx} y={sy}>
        <Desert theme={theme} frame={g} camX={8000} horizon={560} sun={{ x: 1650, y: 140, face: "smug" }} />
        <Stage>
          <At x={1500} y={700} s={0.4}>
            <SmallSaguaro h={260} color={theme.cactus} dark={theme.cactusDark} />
          </At>
          <At x={420} y={730} s={0.5}>
            <Rock w={160} h={80} color={theme.mesa} shade={theme.mesaDark} />
          </At>
          <At x={lerp(k, [0, 1], [180, 880])} y={720} s={0.38}>
            <Shadow rx={220} />
            <Bison frame={g} pose={hit ? "dazed" : "charge"} />
          </At>
          <At x={lerp(k, [0, 1], [1740, 1040])} y={720} s={0.38}>
            <Shadow rx={220} />
            <Bison frame={g + 4} pose={hit ? "dazed" : "charge"} facing={-1} tint="#86603E" />
          </At>
        </Stage>
        <Layer>
          {hit && <DustCloud x={960} y={720} age={f - hitAt} size={1.6} color={theme.sand} life={30} />}
          {hit && <ImpactStars x={960} y={620} age={f - hitAt} s={0.9} />}
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

export const S3: ShotComponent[] = [S3_1, S3_2, S3_3, S3_4];
