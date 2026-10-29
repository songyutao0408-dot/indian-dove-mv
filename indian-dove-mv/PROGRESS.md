# PROGRESS — 《印第安老斑鸠》MV

> 新会话开始时先读这个文件，再读 MV_BRIEF.md。
> 工程根目录是仓库里的 `indian-dove-mv/` 子目录（MV_BRIEF.md 所在的位置）。

## 当前状态

**检查点 2 已完成，等待确认造型。** 检查点 1 已确认。下一步是检查点 3（背景 + 小镇 + 质感 overlay）。

| 检查点 | 状态 | 成果 |
|---|---|---|
| 1. 工程 + 音频分析 + 段落时间表 | ✅ 已确认 | `checkpoints/CP1_段落时间表.md`、`checkpoints/cp1_timeline.png`、`previews/cp1_animatic_540p.mp4` |
| 2. 全部角色 + 角色设定图 | ✅ 完成，待确认 | `checkpoints/cp2_cast_lineup.png`、`cp2_dove_expressions.png`、`cp2_cast_key_poses.png`、`previews/cp2_motion_test_540p.mp4` |
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
- 色调关键帧要成对写「保持」点：S9 一开始漏了 148.0 的做旧保持帧，导致 133–148 秒做旧强度一直在衰减，已修。
- LRC 有一个浮点坑：`3*60+19.08 = 199.0799…`，已在解析时四舍五入到毫秒，避免句子分错段。

## 检查点 1 的确认结果（用户已回复）

1. 段落时间表和分镜计划：按现方案。
2. S18/S19 分界 270.33 秒：OK。
3. 编曲署名是 **洪敬尧**（已改进 shots.ts 的结束卡描述）。
4. 色调过渡时间点：可以。

## 检查点 2 做了什么

- `src/characters/`：17 个角色，每个一个独立组件，统一约定：原点 = 脚下地面中心、默认朝右、`facing=-1` 镜像，`frame` 传局部帧，组件内部用 `onTwos()` 实现「一拍二」。
  - `parts.tsx`：共用的眼睛（半闭眼皮、眨眼、睫毛）和表情特效（金星、螺旋眼、心形眼、腮红、泪水喷泉、冒烟、问号、Zzz、对话/思维气泡、声波线、汗珠、速度线）。
  - `Dove.tsx`：12 种表情（发呆、饿昏、秀逗、伤心、生气、心动、学人说话、困惑、睡觉、惊吓、开心、打哈欠）× 7 种姿态（站、踱步、打瞌睡、扑腾、躺倒、跳舞、坐）。
  - 其他角色各有 brief 里点名的状态（见 `cp2_cast_key_poses.png`）。
  - `index.ts`：统一导出 + `CAST_SCALE`（全员同框时的相对比例，以老斑鸠 = 1）。
- 合成：`CastLineup`、`DoveSheet`、`CastVariants`（静帧），`MotionTest`（10 秒动作测试）。`CastTest` 是开发时检查造型用的草稿板。
- 印第安角色（战士、巫师、酋长）按经典西部片造型，但保持庄重：自然肤色、正常五官，不做丑化。

## 待用户确认的问题（检查点 2）

1. 老斑鸠的造型和表情是否 OK（这一步定了后面不再大改）。
2. 其他 16 个角色的造型是否 OK，有没有要改的。

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
