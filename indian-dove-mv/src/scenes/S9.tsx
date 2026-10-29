// S9 说唱（约 10 秒、7 句，全片最快）：每句一个镜头，做旧胶片色调；最后一句时胶片烧穿变白
import { AbsoluteFill } from "remotion";
import { Campfire } from "../backgrounds/Campfire";
import { Desert } from "../backgrounds/Desert";
import { Crate } from "../backgrounds/props";
import { TownStreet } from "../backgrounds/Town";
import { Chief, Cowboy, Dove, MagicSmoke, Shaman, Skull, Warrior, Wolf } from "../characters";
import { onTwos } from "../characters/parts";
import { LYRIC_FONT } from "../fonts";
import { FilmBurn, FocusLines } from "../fx";
import { CREAM, INK } from "../style/palette";
import { At, Cam, Layer, Shadow, Stage, beatPulse, easeIn, lerp, shake, sinceBeat, useShot, type ShotComponent } from "./common";

const S9_1: ShotComponent = () => {
  // 牛仔和印第安战士背对背，一拍一步地走开
  const { g, theme, T, f } = useShot();
  const steps = Math.floor((T - 137.69) / 0.627);
  const sub = Math.min(1, sinceBeat(T) / 0.3);
  const d = (Math.max(0, steps) + sub) * 70;
  return (
    <AbsoluteFill>
      <TownStreet theme={theme} frame={g} camZ={-200} shut={1} clock={{ hour: 12, minute: 1 }}>
        <Stage>
          <At x={900 - d} y={1040} s={1.25}>
            <Shadow rx={90} />
            <Cowboy frame={g} pose="walk" facing={-1} expression="squint" />
          </At>
          <At x={1020 + d} y={1040} s={1.25}>
            <Shadow rx={90} />
            <Warrior frame={g + 6} pose="walk" />
          </At>
        </Stage>
        <Layer>
          {f < 10 && <path d="M 960 700 L 960 1060" stroke={INK} strokeWidth={4} strokeDasharray="12 10" />}
        </Layer>
      </TownStreet>
    </AbsoluteFill>
  );
};

const S9_2: ShotComponent = () => {
  // 灰狼戴着牛仔帽凑到镜头前，鼻子快顶到镜头
  const { f, dur, g, theme } = useShot();
  const zoom = lerp(f, [0, dur], [1.1, 2.4], easeIn);
  return (
    <AbsoluteFill>
      <Cam zoom={zoom} ox={1140} oy={380}>
        <TownStreet theme={theme} frame={g} camZ={200} shut={1} clock={{ hour: 12, minute: 1 }}>
          <Stage>
            <At x={860} y={1250} s={2.0}>
              <Wolf frame={g} hat expression="serious" pose="lean" />
            </At>
          </Stage>
        </TownStreet>
      </Cam>
    </AbsoluteFill>
  );
};

const S9_3: ShotComponent = () => {
  // 巫师围着篝火摇骨头法器，身边冒彩色烟雾和符号
  const { f, g, theme } = useShot();
  return (
    <AbsoluteFill>
      <Cam zoom={1.25 + f * 0.004} oy={760}>
        <Desert theme={theme} frame={g} camX={26800} near={false} sun={{ x: 1600, y: 140 }} />
        <Stage>
          <At x={1240} y={1000} s={1.1}>
            <Campfire frame={g} />
          </At>
          <At x={720} y={1000} s={1.35}>
            <Shadow />
            <Shaman frame={g} pose="chant" magic />
          </At>
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

const S9_4: ShotComponent = () => {
  // 彩色烟雾冲向酋长，他头顶「噗」地冒出一朵乌云
  const { f, g, theme } = useShot();
  const rush = lerp(f, [0, 8], [0, 1], easeIn);
  const cursed = f >= 8;
  return (
    <AbsoluteFill>
      <Cam zoom={1.25} oy={700}>
        <Desert theme={theme} frame={g} camX={27400} near={false} sun={{ x: 300, y: 140 }} />
        <Stage>
          <At x={1180} y={1020} s={1.3}>
            <Shadow />
            <Chief frame={g} expression={cursed ? "cursed" : "stern"} />
          </At>
          <g transform={`translate(${lerp(rush, [0, 1], [-500, 900])} 280) scale(1.1)`} opacity={1 - lerp(f, [8, 14], [0, 1])}>
            <MagicSmoke frame={g} spread={0.7} />
          </g>
        </Stage>
        <Layer>
          {cursed && f < 14 && (
            <text x={1260} y={260} fontSize={80} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={8} paintOrder="stroke">
              噗！
            </text>
          )}
        </Layer>
      </Cam>
    </AbsoluteFill>
  );
};

const S9_5: ShotComponent = () => {
  // 骷髅头下巴一张一合地抗议（举着「还我！」牌子）
  const { f, g, theme, T } = useShot();
  return (
    <AbsoluteFill>
      <Cam zoom={1.9 + beatPulse(T) * 0.1} oy={700} ox={1000}>
        <Desert theme={theme} frame={g} camX={28000} near={false} />
        <Stage>
          <At x={960} y={900} s={1.6} r={Math.sin(f / 2) * 4}>
            <Shadow rx={80} />
            <Skull frame={g} sign />
          </At>
        </Stage>
      </Cam>
    </AbsoluteFill>
  );
};

const S9_6: ShotComponent = () => {
  // 老斑鸠像说书人一样坐在木箱上，一拍木箱「啪」
  const { g, theme, T } = useShot();
  const slap = beatPulse(T, 0.18);
  return (
    <AbsoluteFill>
      <Cam zoom={1.45 + slap * 0.04} oy={720}>
        <TownStreet theme={theme} frame={g} camZ={600} shut={1} clock={{ hour: 12, minute: 2 }}>
          <Stage>
            <At x={960} y={1060} s={1.4}>
              <Shadow rx={140} />
              <Crate s={1.3} />
              <g transform={`translate(0 ${-170 - slap * 10})`}>
                <Dove frame={g} pose="sit" expression="talk" text="" />
              </g>
            </At>
          </Stage>
          <Layer>
            {slap > 0.5 && (
              <text x={1150} y={790} fontSize={70} fontFamily={LYRIC_FONT} fill={CREAM} stroke={INK} strokeWidth={7} paintOrder="stroke" transform={`rotate(-12 1150 790)`}>
                啪！
              </text>
            )}
          </Layer>
        </TownStreet>
      </Cam>
    </AbsoluteFill>
  );
};

const S9_7: ShotComponent = () => {
  // 胶片卡住（画面上下跳）、中间烧出一个洞，迅速扩大变成全白
  const { f, dur, g, theme } = useShot();
  const jam = f < 10 ? (onTwos(f) % 4 < 2 ? -40 : 30) : 0;
  const [sx, sy] = shake(g, 6);
  return (
    <AbsoluteFill>
      <Cam y={jam + sy} x={sx} zoom={1.45} oy={720}>
        <TownStreet theme={theme} frame={g - f} camZ={600} shut={1} clock={{ hour: 12, minute: 2 }}>
          <Stage>
            <At x={960} y={1060} s={1.4}>
              <Crate s={1.3} />
              <g transform="translate(0 -170)">
                <Dove frame={g - f} pose="sit" expression="shock" />
              </g>
            </At>
          </Stage>
        </TownStreet>
      </Cam>
      {f < 10 && (
        <Layer>
          <rect x={0} y={jam > 0 ? 0 : 1040} width={1920} height={40} fill="#0E0906" />
          <FocusLines frame={g} inner={420} color="#0E0906" />
        </Layer>
      )}
      <FilmBurn progress={lerp(f, [6, dur], [0, 1], easeIn)} frame={g} cx={1010} cy={560} />
    </AbsoluteFill>
  );
};

export const S9: ShotComponent[] = [S9_1, S9_2, S9_3, S9_4, S9_5, S9_6, S9_7];
