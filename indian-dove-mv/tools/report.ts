// 生成检查点 1 的段落时间表：checkpoints/CP1_段落时间表.md
// 运行：npm run report
import fs from "node:fs";
import path from "node:path";
import { CHAR_NAMES } from "../src/shots";
import {
  AUDIO_DURATION, BEATS, BPM, DURATION_IN_FRAMES, FPS, GAGS, LYRICS, LYRIC_CLEARS, S18_END_ESTIMATE,
  SECTIONS, SHOTS, THEME_KEYS, TITLE_CARDS, VOCAL_END, castSeconds,
} from "../src/timeline";

const f2 = (n: number) => n.toFixed(2);
const mmss = (t: number) => {
  const m = Math.floor(t / 60);
  const s = t - m * 60;
  return `${String(m).padStart(2, "0")}:${s.toFixed(2).padStart(5, "0")}`;
};

const out: string[] = [];
const p = (s = "") => out.push(s);

const doveAll = castSeconds("dove", true);
const doveMain = castSeconds("dove", false);
const durations = SHOTS.map((s) => s.end - s.start);
const avg = durations.reduce((a, b) => a + b, 0) / durations.length;

p("# 检查点 1：段落时间表");
p();
p("> 由 `npm run report` 从 `src/timeline.ts` + `src/shots.ts` 自动生成，改镜头计划后重新生成即可。");
p();
p("## 一、基础数据");
p();
p(`| 项目 | 数值 |`);
p(`|---|---|`);
p(`| 音频实际长度 | ${f2(AUDIO_DURATION)} 秒（${mmss(AUDIO_DURATION)}），${DURATION_IN_FRAMES} 帧 @ ${FPS}fps |`);
p(`| 节拍 | librosa 估计 ${BPM} BPM（每拍约 ${f2(60 / BPM)} 秒），共 ${BEATS.length} 拍 |`);
p(`| 字幕 | ${LYRICS.length} 句（不含片头三行），${LYRIC_CLEARS.length} 个清屏点 |`);
p(`| 镜头 | 共 ${SHOTS.length} 个，平均 ${f2(avg)} 秒/镜头（最短 ${f2(Math.min(...durations))}，最长 ${f2(Math.max(...durations))}） |`);
p(`| 老斑鸠出场 | 主要出场 ${f2(doveMain)} 秒 = **${((doveMain / AUDIO_DURATION) * 100).toFixed(1)}%**；含片头客串 ${f2(doveAll)} 秒 = ${((doveAll / AUDIO_DURATION) * 100).toFixed(1)}%（目标 ≥ 40%） |`);
p();
p("### S18 / S19 分界校准");
p();
p(`timeline.json 里 S18 结束是估计值 ${f2(S18_END_ESTIMATE)}。用 0.05 秒精度的音量曲线看最后一句（267.83 起）：乐队在 269.5 秒左右收住，`);
p(`最后一个字「鸠」的拖音延续到约 270.2 秒，之后掉进近乎静音（270.3 秒处音量只有演唱时的 1–2%），280 秒才重新进鼓。`);
p(`自动检测结果为 **${f2(VOCAL_END)} 秒**，所以 **S18 结束 = S19 开始 = ${f2(VOCAL_END)}**（比估计值早 ${f2(S18_END_ESTIMATE - VOCAL_END)} 秒）。`);
p(`S19 结束 = 音频结束 ${f2(AUDIO_DURATION)}；音乐实际在约 301.2 秒停止，最后 3 秒是静音，结束卡在这里继续保持微动。`);
p();
p("### 剪辑点卡拍规则");
p();
p("- 歌词起点相对最近节拍的偏差在 ±0.35 秒以内（歌手经常抢拍或拖拍）。");
p("- 镜头切点吸附到附近的节拍：最多比计划提前 0.33 秒（画面抢在歌词前），最多推后 0.12 秒；附近没有合适的拍就按计划时间切。");
p("- **字幕始终严格按 LRC 时间出现**，不受吸附影响。");
p("- 不吸附的例外：三张片头卡的翻转时间（8.95 / 17.91，brief 规定）；说唱段 S9 一句一个镜头、每句只有 1–2 秒，直接按歌词时间切。");
p();
p("## 二、段落总表");
p();
p("| 段落 | 名称 | 开始 | 结束 | 时长 | 帧 | 模式 | 歌词句数 | 镜头数 |");
p("|---|---|---|---|---|---|---|---|---|");
for (const s of SECTIONS) {
  const lines = LYRICS.filter((l) => l.section === s.id).length;
  const shots = SHOTS.filter((x) => x.section === s.id).length;
  const cal = s.calibrated ? " ✱" : "";
  p(`| ${s.id} | ${s.name} | ${f2(s.start)}${s.id === "S19" ? " ✱" : ""} | ${f2(s.end)}${s.id === "S18" ? cal : ""} | ${f2(s.end - s.start)} | ${s.startFrame}–${s.endFrame} | ${s.mode} | ${lines} | ${shots} |`);
}
p();
p("✱ = 按人声结束时间校准过。");
p();
p("## 三、片头卡与笑点");
p();
for (const c of TITLE_CARDS) p(`- ${c.card}：${f2(c.t)} – ${f2(c.until)}，内容「${c.text}」`);
for (const g of GAGS) p(`- 笑点 ${g.id}：${f2(g.start)} – ${f2(g.end)}，${g.note}`);
p();
p("## 四、全局色调关键帧");
p();
p("相邻关键帧之间平滑插值（色板 + 做旧强度）。");
p();
p("| 时间 | 色板 | 做旧 | 说明 |");
p("|---|---|---|---|");
for (const k of THEME_KEYS) p(`| ${f2(k.t)} | ${k.palette} | ${k.sepia} | ${k.why} |`);
p();
p("## 五、逐段明细（歌词 + 镜头）");
for (const s of SECTIONS) {
  p();
  p(`### ${s.id} ${s.name}（${f2(s.start)} – ${f2(s.end)}，${f2(s.end - s.start)} 秒，${s.mode}）`);
  p();
  p(`> ${s.note}`);
  p();
  const lines = LYRICS.filter((l) => l.section === s.id);
  if (lines.length) {
    p("歌词：");
    p();
    for (const l of lines) p(`- \`${mmss(l.start)}\` ${l.text}　（显示到 ${f2(l.end)}，${f2(l.fadeOutStart)} 起淡出）`);
  } else {
    p("歌词：无（纯音乐 / 片头卡）");
  }
  p();
  p("| 镜头 | 开始 | 时长 | 内容 | 出场 |");
  p("|---|---|---|---|---|");
  for (const sh of SHOTS.filter((x) => x.section === s.id)) {
    const snapped = Math.abs(sh.start - sh.plannedAt) > 0.005 ? `（计划 ${f2(sh.plannedAt)}，卡拍）` : "";
    const cast = sh.cast.length ? sh.cast.map((c) => CHAR_NAMES[c]).join("、") : "—";
    p(`| ${sh.id} ${sh.title} | ${f2(sh.start)}${snapped} | ${f2(sh.end - sh.start)} | ${sh.desc} | ${cast}${sh.doveCameo ? "（老斑鸠客串）" : ""} |`);
  }
}
p();
p("## 六、角色出场时长");
p();
p("| 角色 | 出场秒数 | 占全片 |");
p("|---|---|---|");
for (const id of Object.keys(CHAR_NAMES) as (keyof typeof CHAR_NAMES)[]) {
  const sec = castSeconds(id, true);
  p(`| ${CHAR_NAMES[id]} | ${f2(sec)} | ${((sec / AUDIO_DURATION) * 100).toFixed(1)}% |`);
}
p();

const file = path.join(process.cwd(), "checkpoints", "CP1_段落时间表.md");
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, out.join("\n"));
console.log(`写入 ${path.relative(process.cwd(), file)}：${SECTIONS.length} 段，${SHOTS.length} 个镜头，老斑鸠主要出场 ${((doveMain / AUDIO_DURATION) * 100).toFixed(1)}%`);
