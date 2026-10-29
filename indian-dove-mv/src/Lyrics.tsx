// 底部歌词字幕（brief 第六部分）
// - 每句在 LRC 开始时间出现；遇到下一句或空白时间戳时提前 0.2 秒淡出
// - 普通句：逐字从下往上弹出（每字延迟 2 帧，spring 回弹），奶油色字 + 3px 深棕描边 + 半透明木纹条
// - 说唱段（S9）：整句一起弹出，老电影插卡样式（黑底白字、装饰边框）
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LYRIC_FONT } from "./fonts";
import { CREAM, INK } from "./style/palette";
import { LYRICS, type LyricLine } from "./timeline";

const CHAR_DELAY = 2;
const FONT_SIZE = 66;

function activeLine(frame: number): LyricLine | undefined {
  return LYRICS.find((l) => frame >= l.startFrame && frame < l.endFrame);
}

const WoodStrip: React.FC<{ id: string }> = ({ id }) => (
  <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1000 100" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id={`grain-${id}`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.004 0.22" numOctaves="3" seed="7" />
        <feColorMatrix values="0 0 0 0 0.23  0 0 0 0 0.14  0 0 0 0 0.09  0 0 0 1.6 -0.55" />
        <feComposite in2="SourceGraphic" operator="in" />
      </filter>
    </defs>
    <rect x="3" y="3" width="994" height="94" rx="16" fill="#7A4A2A" fillOpacity="0.72" />
    <rect x="3" y="3" width="994" height="94" rx="16" fill="#7A4A2A" filter={`url(#grain-${id})`} opacity="0.75" />
    <rect x="3" y="3" width="994" height="94" rx="16" fill="none" stroke={INK} strokeOpacity="0.7" strokeWidth="4" />
  </svg>
);

const StrokedChar: React.FC<{ ch: string; color: string; stroke: string }> = ({ ch, color, stroke }) => (
  <span
    style={{
      color,
      WebkitTextStroke: `6px ${stroke}`, // 一半在字外 → 视觉 3px 描边
      paintOrder: "stroke fill",
    }}
  >
    {ch}
  </span>
);

const NormalLine: React.FC<{ line: LyricLine; frame: number }> = ({ line, frame }) => {
  const { fps } = useVideoConfig();
  const local = frame - line.startFrame;
  const strip = spring({ frame: local, fps, config: { damping: 14, stiffness: 180 } });
  const chars = [...line.text];
  return (
    <div style={{ position: "relative", padding: "14px 56px 20px", transform: `scaleX(${0.6 + 0.4 * strip})` }}>
      <WoodStrip id={String(line.index)} />
      <div style={{ position: "relative", display: "flex", fontFamily: LYRIC_FONT, fontSize: FONT_SIZE, lineHeight: 1.15, letterSpacing: 4 }}>
        {chars.map((ch, i) => {
          const s = spring({ frame: local - i * CHAR_DELAY, fps, config: { damping: 8, stiffness: 170, mass: 0.6 } });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - s) * 70}px) scale(${0.5 + 0.5 * s})`,
                opacity: Math.min(1, s * 2.5),
              }}
            >
              <StrokedChar ch={ch} color={CREAM} stroke={INK} />
            </span>
          );
        })}
      </div>
    </div>
  );
};

const IntertitleLine: React.FC<{ line: LyricLine; frame: number }> = ({ line, frame }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - line.startFrame, fps, config: { damping: 10, stiffness: 220, mass: 0.6 } });
  return (
    <div
      style={{
        transform: `translateY(${(1 - s) * 80}px) scale(${0.7 + 0.3 * s})`,
        opacity: Math.min(1, s * 2.5),
        background: "#0E0B09",
        padding: 10,
        border: "3px solid #EDE6DA",
        boxShadow: "0 0 0 6px #0E0B09, 0 0 0 8px #EDE6DA",
      }}
    >
      <div style={{ position: "relative", border: "1.5px solid #EDE6DA", padding: "14px 60px 18px" }}>
        {["0 0", "100% 0", "0 100%", "100% 100%"].map((pos, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: pos.split(" ")[0],
              top: pos.split(" ")[1],
              transform: "translate(-50%, -50%)",
              color: "#EDE6DA",
              fontSize: 26,
              lineHeight: 1,
            }}
          >
            ❖
          </span>
        ))}
        <div style={{ fontFamily: LYRIC_FONT, fontSize: 58, color: "#F4EFE6", letterSpacing: 6, whiteSpace: "nowrap" }}>
          {line.text}
        </div>
      </div>
    </div>
  );
};

export const Lyrics: React.FC = () => {
  const frame = useCurrentFrame();
  const line = activeLine(frame);
  if (!line) return null;
  const opacity = interpolate(frame, [line.fadeOutFrame, line.endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rap = line.section === "S9";
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 54, opacity }}>
      {rap ? <IntertitleLine line={line} frame={frame} /> : <NormalLine line={line} frame={frame} />}
    </AbsoluteFill>
  );
};
