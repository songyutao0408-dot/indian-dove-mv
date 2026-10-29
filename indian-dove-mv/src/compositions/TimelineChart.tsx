// 检查点 1 用的静态图：全片段落 / 色调 / 镜头 / 歌词 / 能量 / 节拍一览
import React from "react";
import { AbsoluteFill } from "remotion";
import energyJson from "../data/energy.json";
import { LYRIC_FONT } from "../fonts";
import { CREAM, INK } from "../style/palette";
import { themeAt } from "../style/theme";
import { AUDIO_DURATION, BEATS, FPS, GAGS, LYRICS, SECTIONS, SHOTS, TITLE_CARDS, VOCAL_END } from "../timeline";

const W = 1920;
const LEFT = 70;
const RIGHT = 30;
const ROWS = 3;
const ROW_SPAN = Math.ceil(AUDIO_DURATION / ROWS); // 每行约 102 秒
const PX = (W - LEFT - RIGHT) / ROW_SPAN;
const ROW_H = 300;
const TOP = 108;

const BG = "#F3E6CC";
const DOVE = "#9C8A78";

const Row: React.FC<{ r: number }> = ({ r }) => {
  const t0 = r * ROW_SPAN;
  const t1 = Math.min(AUDIO_DURATION, t0 + ROW_SPAN);
  const x = (t: number) => LEFT + (t - t0) * PX;
  const y0 = TOP + r * ROW_H;
  const inRow = (a: number, b: number) => b > t0 && a < t1;
  const clipA = (a: number) => Math.max(a, t0);
  const clipB = (b: number) => Math.min(b, t1);

  const yTheme = y0;
  const ySec = y0 + 16;
  const yShot = y0 + 50;
  const yLyr = y0 + 88;
  const yEn = y0 + 222;
  const enH = 46;

  const energy: number[] = energyJson.energy;
  const enPts = energy
    .map((v, i) => ({ t: i * energyJson.window, v }))
    .filter((p) => p.t >= t0 && p.t <= t1)
    .map((p) => `${x(p.t).toFixed(1)},${(yEn + enH - p.v * enH).toFixed(1)}`);

  const themeStrips = [];
  for (let t = t0; t < t1; t += 0.5) {
    const th = themeAt(Math.round(t * FPS));
    const sep = th.sepia;
    themeStrips.push(
      <rect key={t} x={x(t)} y={yTheme} width={PX * 0.5 + 0.6} height={12} fill={sep > 0.5 ? "#9C7A55" : th.sky[2]} />,
    );
  }

  return (
    <g>
      {/* 时间刻度 */}
      {Array.from({ length: Math.floor((t1 - t0) / 10) + 1 }, (_, i) => t0 + i * 10).map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={yTheme} y2={yEn + enH + 6} stroke={INK} strokeOpacity={0.12} />
          <text x={x(t)} y={yEn + enH + 22} fontSize={13} fill={INK} textAnchor="middle" fontFamily="monospace">
            {`${Math.floor(t / 60)}:${String(Math.round(t % 60)).padStart(2, "0")}`}
          </text>
        </g>
      ))}
      {themeStrips}
      {/* 段落 */}
      {SECTIONS.filter((s) => inRow(s.start, s.end)).map((s, i) => (
        <g key={s.id}>
          <rect x={x(clipA(s.start))} y={ySec} width={(clipB(s.end) - clipA(s.start)) * PX} height={28} fill={i % 2 ? "#E2C9A0" : "#D8B98A"} stroke={INK} strokeWidth={1.5} />
          <text x={x(clipA(s.start)) + 5} y={ySec + 20} fontSize={15} fill={INK} fontFamily={LYRIC_FONT}>
            {(clipB(s.end) - clipA(s.start)) * PX > 120 ? `${s.id} ${s.name}` : s.id}
          </text>
        </g>
      ))}
      {/* 镜头 */}
      {SHOTS.filter((s) => inRow(s.start, s.end)).map((s) => {
        const w = (clipB(s.end) - clipA(s.start)) * PX;
        const dove = s.cast.includes("dove") && !s.doveCameo;
        return (
          <g key={s.id}>
            <rect x={x(clipA(s.start))} y={yShot} width={w} height={30} fill={dove ? DOVE : s.doveCameo ? "#CDBFAF" : CREAM} stroke={INK} strokeWidth={1.2} />
            {w > 14 && (
              <text x={x(clipA(s.start)) + w / 2} y={yShot + 20} fontSize={w > 26 ? 13 : 10} textAnchor="middle" fill={dove ? CREAM : INK} fontFamily="monospace">
                {s.indexInSection + 1}
              </text>
            )}
          </g>
        );
      })}
      {/* 笑点 */}
      {GAGS.filter((g) => inRow(g.start, g.end)).map((g) => (
        <rect key={g.id} x={x(clipA(g.start))} y={yShot - 3} width={(clipB(g.end) - clipA(g.start)) * PX} height={36} fill="none" stroke="#C0392B" strokeWidth={3} strokeDasharray="5 3" />
      ))}
      {/* 片头卡 */}
      {TITLE_CARDS.filter((c) => inRow(c.t, c.until)).map((c, i) => (
        <g key={c.card}>
          <rect x={x(c.t)} y={yLyr} width={(c.until - c.t) * PX - 2} height={6} fill="#8E3B2A" />
          <text x={x(c.t) + 4} y={yLyr + 26 + i * 24} fontSize={16} fill={INK} fontFamily={LYRIC_FONT}>
            【{c.card}】{c.text}
          </text>
        </g>
      ))}
      {/* 歌词（竖排） */}
      {LYRICS.filter((l) => inRow(l.start, l.start + 0.01)).map((l) => (
        <g key={l.index}>
          <rect x={x(l.start)} y={yLyr} width={Math.max(1, (clipB(l.end) - l.start) * PX)} height={6} fill={l.section === "S9" ? "#222" : "#B5683E"} />
          <text x={x(l.start) + 3} y={yLyr + 12} fontSize={l.section === "S9" ? 10.5 : 12} fill={INK} fontFamily={LYRIC_FONT} style={{ writingMode: "vertical-rl" }}>
            {l.text}
          </text>
        </g>
      ))}
      {/* 能量 + 节拍 */}
      <polyline points={enPts.join(" ")} fill="none" stroke="#B5683E" strokeWidth={1.6} />
      {BEATS.filter((b) => b >= t0 && b < t1).map((b) => (
        <line key={b} x1={x(b)} x2={x(b)} y1={yEn + enH + 1} y2={yEn + enH + 6} stroke={INK} strokeOpacity={0.55} />
      ))}
      {VOCAL_END >= t0 && VOCAL_END < t1 && (
        <g>
          <line x1={x(VOCAL_END)} x2={x(VOCAL_END)} y1={ySec - 4} y2={yEn + enH + 6} stroke="#C0392B" strokeWidth={2} />
          <text x={x(VOCAL_END) + 4} y={yEn + 10} fontSize={13} fill="#C0392B" fontFamily={LYRIC_FONT}>
            人声结束 {VOCAL_END.toFixed(2)}s（S18/S19 校准）
          </text>
        </g>
      )}
    </g>
  );
};

export const TimelineChart: React.FC = () => {
  const doveShots = SHOTS.filter((s) => s.cast.includes("dove") && !s.doveCameo);
  const doveSec = doveShots.reduce((a, s) => a + s.end - s.start, 0);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <svg width={W} height={1080}>
        <text x={LEFT} y={52} fontSize={38} fill={INK} fontFamily={LYRIC_FONT}>
          《印第安老斑鸠》MV · 段落时间表
        </text>
        <text x={LEFT} y={84} fontSize={18} fill={INK} fontFamily={LYRIC_FONT} opacity={0.8}>
          {`音频 ${AUDIO_DURATION.toFixed(2)}s · ${SECTIONS.length} 段 · ${SHOTS.length} 个镜头 · ${LYRICS.length} 句字幕 · 老斑鸠主要出场 ${((doveSec / AUDIO_DURATION) * 100).toFixed(1)}%`}
        </text>
        {/* 图例 */}
        <g transform="translate(1180, 40)" fontFamily={LYRIC_FONT} fontSize={15} fill={INK}>
          <rect x={0} y={0} width={60} height={10} fill="#F0A15E" />
          <text x={68} y={10}>顶条=全局色调</text>
          <rect x={190} y={-2} width={22} height={14} fill={DOVE} stroke={INK} />
          <text x={218} y={10}>老斑鸠镜头</text>
          <rect x={320} y={-2} width={22} height={14} fill={CREAM} stroke={INK} />
          <text x={348} y={10}>其他镜头</text>
          <rect x={440} y={-2} width={22} height={14} fill="none" stroke="#C0392B" strokeWidth={2} strokeDasharray="4 2" />
          <text x={468} y={10}>笑点</text>
          <text x={0} y={36}>棕条=歌词时长（黑=说唱插卡）· 曲线=能量 · 刻度=节拍</text>
        </g>
        {Array.from({ length: ROWS }, (_, r) => (
          <Row key={r} r={r} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
