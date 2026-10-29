// 检查点 1 的分镜对位预览：每个镜头一张文字卡 + 正式歌词字幕 + 原曲，
// 用来在做画面之前核对段落、切点、歌词和音乐是否对得上。
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { LYRIC_FONT, TITLE_FONT } from "../fonts";
import { Lyrics } from "../Lyrics";
import { CHAR_NAMES } from "../shots";
import { CREAM, INK } from "../style/palette";
import { themeAt } from "../style/theme";
import { BEATS, FPS, GAGS, SHOTS, TITLE_CARDS, beatPhase, sectionAt, shotAt } from "../timeline";

const tc = (frame: number) => {
  const t = frame / FPS;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  const f = frame % FPS;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
};

// interpolateColors 返回 rgba(...)，按亮度判断背景深浅，决定用深字还是浅字
const luminance = (c: string) => {
  const m = c.match(/[\d.]+/g)?.map(Number) ?? [255, 255, 255];
  return (0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2]) / 255;
};

export const Animatic: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const theme = themeAt(frame);
  const sec = sectionAt(t);
  const shot = shotAt(frame);
  const local = frame - shot.startFrame;
  const { phase, index } = beatPhase(frame);
  const pulse = BEATS[index] <= t ? Math.max(0, 1 - phase * 3) : 0;
  const shotsInSec = SHOTS.filter((s) => s.section === sec.id);
  const cardIn = interpolate(local, [0, 4], [0.92, 1], { extrapolateRight: "clamp" });
  const gag = GAGS.find((g) => frame >= g.startFrame && frame < g.endFrame);
  const card = TITLE_CARDS.find((c) => frame >= c.startFrame && frame < c.endFrame);
  const dark = luminance(theme.sky[1]) < 0.45;

  return (
    <AbsoluteFill>
      <Audio src={staticFile("song.mp3")} />
      {/* 当前色调：4 条硬边天空色带 + 沙地 */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", filter: `sepia(${theme.sepia}) saturate(${1 - theme.sepia * 0.3})` }}>
        {theme.sky.map((c, i) => (
          <div key={i} style={{ flex: i === 3 ? 1.4 : 1, background: c }} />
        ))}
        <div style={{ flex: 2.2, background: theme.sand }} />
      </AbsoluteFill>

      {/* 顶部：段落信息 + 本段镜头进度 */}
      <div style={{ position: "absolute", left: 60, top: 40, right: 60, fontFamily: LYRIC_FONT, color: dark ? CREAM : INK }}>
        <div style={{ fontSize: 44 }}>
          {sec.id} {sec.name} <span style={{ fontSize: 28, opacity: 0.75 }}>· {sec.mode}</span>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
          {shotsInSec.map((s) => (
            <div
              key={s.id}
              style={{
                flex: s.durationInFrames,
                height: 16,
                borderRadius: 4,
                border: `2px solid ${dark ? CREAM : INK}`,
                background: s.id === shot.id ? (dark ? CREAM : INK) : "transparent",
              }}
            />
          ))}
        </div>
      </div>

      {/* 中间：镜头卡 */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 1280,
            transform: `scale(${cardIn})`,
            background: CREAM,
            border: `5px solid ${INK}`,
            borderRadius: 22,
            padding: "34px 48px",
            fontFamily: LYRIC_FONT,
            color: INK,
            boxShadow: `10px 12px 0 ${INK}`,
            marginTop: -60,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontSize: 64 }}>
              <span style={{ fontFamily: TITLE_FONT, fontSize: 48, marginRight: 22 }}>{shot.id}</span>
              {shot.title}
            </div>
            <div style={{ fontSize: 26, opacity: 0.7 }}>{((shot.end - shot.start)).toFixed(2)}s</div>
          </div>
          <div style={{ fontSize: 34, lineHeight: 1.45, marginTop: 16 }}>{shot.desc}</div>
          <div style={{ fontSize: 26, marginTop: 18, opacity: 0.75 }}>
            出场：{shot.cast.length ? shot.cast.map((c) => CHAR_NAMES[c]).join("、") : "（空镜 / 道具）"}
            {shot.doveCameo ? "（老斑鸠客串）" : ""}
          </div>
          {card && <div style={{ marginTop: 16, fontSize: 40, color: "#B5683E" }}>片头卡：{card.text}</div>}
          {gag && <div style={{ marginTop: 16, fontSize: 32, color: "#C0392B" }}>笑点「{gag.id}」：{gag.note}</div>}
        </div>
      </AbsoluteFill>

      {/* 右上：节拍灯 + 时码 */}
      <div style={{ position: "absolute", right: 60, top: 128, display: "flex", alignItems: "center", gap: 18, fontFamily: "monospace", fontSize: 30, color: dark ? CREAM : INK }}>
        <div style={{ width: 34, height: 34, borderRadius: 17, border: `3px solid ${dark ? CREAM : INK}`, background: `rgba(224,122,79,${pulse})`, transform: `scale(${1 + pulse * 0.35})` }} />
        {tc(frame)}
      </div>

      <Lyrics />
    </AbsoluteFill>
  );
};
