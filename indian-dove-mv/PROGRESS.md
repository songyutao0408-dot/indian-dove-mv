# PROGRESS — 《印第安老斑鸠》MV

> 新会话开始时先读这个文件，再读 MV_BRIEF.md。
> 工程根目录是仓库里的 `indian-dove-mv/` 子目录（MV_BRIEF.md 所在的位置）。

## 当前状态

**检查点 1 已完成，等待确认。** 下一步是检查点 2（全部角色 + 角色设定图）。

| 检查点 | 状态 | 成果 |
|---|---|---|
| 1. 工程 + 音频分析 + 段落时间表 | ✅ 完成，待确认 | `checkpoints/CP1_段落时间表.md`、`checkpoints/cp1_timeline.png`、`previews/cp1_animatic_540p.mp4` |
| 2. 全部角色 + 角色设定图 | ⏳ 未开始 | |
| 3. 背景 + 小镇 + 质感 overlay | ⏳ 未开始 | |
| 4. 逐段制作（每 2–3 段出 540p 预览） | ⏳ 未开始 | |
| 5. 540p 完整预览 → 1080p 正式版 | ⏳ 未开始 | |

## 检查点 1 做了什么

- 搭好 Remotion 工程（Remotion 4.0.539 + React 19 + TypeScript），目录按 brief 第七部分建好。
- `tools/analyze_audio.py`（librosa）：导出 `src/data/beats.json`（95.7 BPM，474 拍）、`src/data/energy.json`（每 0.5 秒能量 + 人声频段能量）、`src/data/calibration.json`（音频时长、人声结束点）。
- `tools/prepare_data.ts`：读 LRC（先 UTF-8，乱码改 GBK；实际是 UTF-8），写 `src/data/lyrics.json`。
- `src/timeline.ts`：合并 timeline.json + LRC + 节拍 + 校准值，算出每段、每句、每个镜头的起止帧和全局色调关键帧。
- `src/shots.ts`：101 个镜头的分镜计划（每段第一个镜头 = 段落开始）。
- `src/Lyrics.tsx`：正式的歌词字幕组件已经做好（逐字弹出 + 木纹条；说唱段整句弹出 + 老电影插卡）。
- `src/style/palette.ts`、`src/style/theme.ts`：四套色板 + 可插值的全局主题（含做旧强度）。

### 关键数据

- 音频实际长度 **304.509 秒**，7309 帧 @ 24fps。
- **S18/S19 分界校准为 270.33 秒**（原估计 271.00）：最后一句「一只令它心仪的母斑鸠」的拖音在约 270.2 秒收尾，之后几乎静音，280 秒才重新进鼓。
- 音乐实际在约 301.2 秒结束，最后 3 秒静音（结束卡继续微动）。
- 101 个镜头，平均 3.01 秒/镜头；老斑鸠主要出场约 50.9%（不算片头客串）。
- 剪辑点卡拍规则：最多比计划提前 0.33 秒、推后 0.12 秒吸附到节拍；片头卡翻转和说唱段不吸附。字幕严格按 LRC 时间。
- LRC 有一个浮点坑：`3*60+19.08 = 199.0799…`，已在解析时四舍五入到毫秒，避免句子分错段。

## 待用户确认的问题

1. 段落时间表和 101 个镜头的分镜计划是否 OK（见 `checkpoints/CP1_段落时间表.md`）。
2. S18/S19 分界用 270.33 秒是否 OK。
3. 结束卡的编曲署名我写的是「钟兴民」，请确认。
4. 色调过渡的时间点（见时间表第四部分），尤其是：S10 开头胶片白光直接褪成黄昏、160 秒左右完全入夜；S19 在 280–292 秒之间从白天转黄昏。

## 卡在哪

没有卡住。等确认检查点 1。

## 下一步（检查点 2）

1. `src/characters/`：先做老斑鸠（全部表情 + 姿态 props），再做其余 16 个角色。
2. 写一个 `CharacterSheet` 合成，渲染 `checkpoints/cp2_character_sheet.png`（全员排在一起）和 `checkpoints/cp2_dove_expressions.png`（老斑鸠全部表情）。

## 环境备忘（新容器需要重新装）

- Python：`pip install --break-system-packages librosa`，然后 `npm run analyze`（约 50 秒）。
- Node：`npm install`，然后 `npm run prepare-data`（把原曲复制到 `public/song.mp3`，这个副本不进 git；同时重新解析 LRC）。
- 字体：已提交在 `public/fonts/`。GitHub 原始文件下载会被拦，要从 Google Fonts 的 CSS API 拿 gstatic 链接下载。
- 渲染用容器预装的 headless Chromium（`remotion.config.ts` 里自动检测路径）。
- 常用命令：
  - `npm run report` → 重新生成段落时间表
  - `npx remotion still src/index.ts TimelineChart checkpoints/cp1_timeline.png`
  - `npx remotion render src/index.ts Animatic previews/cp1_animatic_540p.mp4 --scale=0.5 --crf=28`
- 成片约定：brief 要求的 `out/indian-dove-mv-1080p.mp4` 渲染在 `out/`（不进 git），再复制一份到 `final/` 提交。
