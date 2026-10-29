// 全片时间轴：读取 timeline.json + LRC（lyrics.json）+ beats.json + calibration.json，
// 生成每个段落、每句歌词、每个镜头的起止时间和帧号。纯数据，不依赖 Remotion，
// 渲染端和 tools/report.ts 共用。
import timelineJson from "../assets/timeline.json";
import beatsJson from "./data/beats.json";
import calibration from "./data/calibration.json";
import lyricsJson from "./data/lyrics.json";
import { SHOT_PLAN, type CharId, type ShotSpec } from "./shots";

export const FPS = timelineJson.fps; // 24
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const AUDIO_DURATION = calibration.audio_duration;
export const DURATION_IN_FRAMES = Math.ceil(AUDIO_DURATION * FPS);

/** S18 / S19 分界：按人声实际结束时间校准（原估计值 271.00） */
export const VOCAL_END = calibration.vocal_end;
export const S18_END_ESTIMATE = 271.0;

export const toFrame = (t: number) => Math.round(t * FPS);

// ---------- 节拍 ----------
export const BEATS: number[] = beatsJson.beats;
export const DOWNBEATS: number[] = beatsJson.downbeats;
export const BPM: number = beatsJson.bpm;
// 吸附范围：切点可以比计划早最多约半拍（画面抢在歌词前很自然），但最多只能晚 0.12 秒
const SNAP_EARLY = 0.33;
const SNAP_LATE = 0.12;

export function nearestBeat(t: number): number {
  let lo = 0;
  let hi = BEATS.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (BEATS[mid] < t) lo = mid + 1;
    else hi = mid;
  }
  const cands = [BEATS[lo - 1], BEATS[lo]].filter((b) => b !== undefined);
  return cands.reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a), cands[0]);
}

export function snapToBeat(t: number): number {
  const i = BEATS.findIndex((b) => b >= t - SNAP_EARLY);
  if (i < 0) return t;
  const cands = BEATS.slice(i, i + 3).filter((b) => b <= t + SNAP_LATE);
  if (cands.length === 0) return t;
  return cands.reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a));
}

/** 某帧所在的节拍相位（0 = 正好在拍上，接近 1 = 快到下一拍），用来做跟拍的蹦跳 */
export function beatPhase(frame: number): { index: number; phase: number } {
  const t = frame / FPS;
  let i = 0;
  while (i < BEATS.length - 1 && BEATS[i + 1] <= t) i++;
  const cur = BEATS[i] ?? 0;
  const next = BEATS[i + 1] ?? cur + 60 / BPM;
  return { index: i, phase: t < cur ? 0 : Math.min(1, (t - cur) / (next - cur)) };
}

// ---------- 段落 ----------
export type Mode = "day" | "dusk" | "night" | "dawn" | "sunset" | "sepia";

export type Section = {
  id: string;
  name: string;
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
  mode: string; // 原样保留，如 "day→sepia"
  note: string;
  calibrated?: boolean;
};

export const SECTIONS: Section[] = timelineJson.sections.map((s) => {
  let start = s.start;
  let end = s.end === "audio_end" ? AUDIO_DURATION : (s.end as number);
  let calibrated = false;
  if (s.id === "S18") {
    end = VOCAL_END;
    calibrated = true;
  }
  if (s.id === "S19") {
    start = VOCAL_END;
    calibrated = true;
  }
  return {
    id: s.id,
    name: s.name,
    start,
    end,
    startFrame: toFrame(start),
    endFrame: toFrame(end),
    mode: s.mode,
    note: s.note,
    calibrated,
  };
});

export function sectionAt(t: number): Section {
  return SECTIONS.find((s) => t >= s.start && t < s.end) ?? SECTIONS[SECTIONS.length - 1];
}

export const TITLE_CARDS = timelineJson.title_cards.map((c, i) => ({
  ...c,
  text: lyricsJson.entries[i]?.text ?? "",
  startFrame: toFrame(c.t),
  endFrame: toFrame(c.until),
}));

export const GAGS = timelineJson.gags.map((g) => ({
  ...g,
  startFrame: toFrame(g.start),
  endFrame: toFrame(g.end),
}));

// ---------- 歌词 ----------
export type LyricLine = {
  index: number; // 字幕序号（从 0 开始，不含片头三行）
  text: string;
  start: number;
  end: number; // 下一句或空白时间戳的时间
  fadeOutStart: number; // end - 0.2
  startFrame: number;
  endFrame: number;
  fadeOutFrame: number;
  section: string; // 按时间戳落在哪个段落判断
};

const FADE_EARLY = 0.2;
const timed = lyricsJson.entries.slice(TITLE_CARDS.length); // 前三行做片头卡

export const LYRICS: LyricLine[] = timed
  .map((e, i) => ({ e, next: timed[i + 1] }))
  .filter(({ e }) => e.text !== "")
  .map(({ e, next }, index) => {
    const end = next ? next.t : VOCAL_END;
    return {
      index,
      text: e.text,
      start: e.t,
      end,
      fadeOutStart: end - FADE_EARLY,
      startFrame: toFrame(e.t),
      endFrame: toFrame(end),
      fadeOutFrame: toFrame(end - FADE_EARLY),
      section: sectionAt(e.t).id,
    };
  });

/** 空白时间戳（字幕清空点） */
export const LYRIC_CLEARS: number[] = timed.filter((e) => e.text === "").map((e) => e.t);

// ---------- 镜头 ----------
export type Shot = ShotSpec & {
  id: string; // 如 "S5-3"
  section: string;
  indexInSection: number;
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
  durationInFrames: number;
  plannedAt: number;
};

function buildShots(): Shot[] {
  const flat: (ShotSpec & { section: string; indexInSection: number })[] = [];
  for (const sec of SECTIONS) {
    const plan = SHOT_PLAN[sec.id] ?? [];
    if (plan.length === 0) throw new Error(`${sec.id} 没有镜头计划`);
    if (Math.abs(plan[0].at - sec.start) > 1e-6) {
      throw new Error(`${sec.id} 第一个镜头 at=${plan[0].at} 不等于段落开始 ${sec.start}`);
    }
    plan.forEach((p, i) => flat.push({ ...p, section: sec.id, indexInSection: i }));
  }
  const starts = flat.map((p) => (p.snap === false ? p.at : snapToBeat(p.at)));
  starts[0] = 0;
  return flat.map((p, i) => {
    const start = starts[i];
    const end = i + 1 < flat.length ? starts[i + 1] : AUDIO_DURATION;
    const startFrame = toFrame(start);
    const endFrame = i + 1 < flat.length ? toFrame(starts[i + 1]) : DURATION_IN_FRAMES;
    if (endFrame - startFrame < 10) {
      throw new Error(`镜头 ${p.section}-${p.indexInSection + 1} 太短（${endFrame - startFrame} 帧）`);
    }
    return {
      ...p,
      id: `${p.section}-${p.indexInSection + 1}`,
      plannedAt: p.at,
      start,
      end,
      startFrame,
      endFrame,
      durationInFrames: endFrame - startFrame,
    };
  });
}

export const SHOTS: Shot[] = buildShots();

export function shotAt(frame: number): Shot {
  return SHOTS.find((s) => frame >= s.startFrame && frame < s.endFrame) ?? SHOTS[SHOTS.length - 1];
}

// ---------- 全局色调关键帧（主题插值在 style/theme.ts 里用） ----------
// palette 在相邻关键帧之间平滑插值；sepia 是做旧滤镜的强度 0–1。
export type ThemeKey = { t: number; palette: "day" | "dusk" | "night" | "dawn"; sepia: number; why: string };

export const THEME_KEYS: ThemeKey[] = [
  { t: 0, palette: "day", sepia: 0, why: "白天开场" },
  { t: 127.5, palette: "day", sepia: 0, why: "S8 钟楼镜头开始转做旧" },
  { t: 133.0, palette: "day", sepia: 1, why: "主街空镜完全做旧" },
  { t: 148.0, palette: "day", sepia: 1, why: "S9 说唱全段保持做旧（最后一句胶片烧穿成白）" },
  { t: 148.05, palette: "dusk", sepia: 0, why: "S10 开头胶片烧穿的白光褪去，直接进黄昏" },
  { t: 160.47, palette: "night", sepia: 0, why: "S10 中段（河道鸟瞰）完全入夜" },
  { t: 229.5, palette: "night", sepia: 0, why: "S15 篝火渐熄，开始转黎明" },
  { t: 235.5, palette: "dawn", sepia: 0, why: "S15 日出" },
  { t: 239.6, palette: "day", sepia: 0, why: "S16 开始前回到白天" },
  { t: 280.0, palette: "day", sepia: 0, why: "S19 大合跳开始，太阳西斜" },
  { t: 292.0, palette: "dusk", sepia: 0, why: "S19 拉远后太阳下山（黄昏色板）" },
];

// ---------- 统计 ----------
export function castSeconds(id: CharId, includeCameo = true): number {
  return SHOTS.filter((s) => s.cast.includes(id) && (includeCameo || !(id === "dove" && s.doveCameo))).reduce(
    (sum, s) => sum + (s.end - s.start),
    0,
  );
}
