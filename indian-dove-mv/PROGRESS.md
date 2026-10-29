# PROGRESS — 《印第安老斑鸠》MV

> 新会话开始时先读这个文件，再读 MV_BRIEF.md。
> 工程根目录是仓库里的 `indian-dove-mv/` 子目录（MV_BRIEF.md 所在的位置）。

## 当前状态

**检查点 4 进行中：S0–S8 已完成**，预览 `previews/cp4_S0-S2_540p.mp4`、`cp4_S3-S5_540p.mp4`、`cp4_S6-S8_540p.mp4`。S3–S8 两批已发给用户，**等用户检查**。下一批是 S9–S10。

| 检查点 | 状态 | 成果 |
|---|---|---|
| 1. 工程 + 音频分析 + 段落时间表 | ✅ 已确认 | `checkpoints/CP1_段落时间表.md`、`checkpoints/cp1_timeline.png`、`previews/cp1_animatic_540p.mp4` |
| 2. 全部角色 + 角色设定图 | ✅ 已确认 | `checkpoints/cp2_cast_lineup.png`、`cp2_dove_expressions.png`、`cp2_cast_key_poses.png`、`previews/cp2_motion_test_540p.mp4` |
| 3. 背景 + 小镇 + 质感 overlay | ✅ 已确认 | `checkpoints/cp3_1_day.jpg` … `cp3_8_fx.jpg`、`previews/cp3_theme_parallax_540p.mp4` |
| 4. 逐段制作（每 2–3 段出 540p 预览） | 🔄 S0–S8 完成 | `previews/cp4_S0-S2_540p.mp4`、`cp4_S3-S5_540p.mp4`、`cp4_S6-S8_540p.mp4` |
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

## 检查点 2 的确认结果

造型全部通过（用户：「造型可以」）。

## 检查点 3 做了什么

- `src/style/`
  - `palette.ts`：四套色板加了 `night`（夜晚程度 0–1）。
  - `theme.ts`：`themeAt(frame)` 全局插值；`staticTheme()`、`mixTheme()`；`ambientMatrix()`。
  - `Ambient.tsx`：环境光包裹，角色/道具放进去就按时段压暗偏色（黄昏偏红、夜里偏紫变暗）。篝火场景可以传自定义的暖色主题。
- `src/backgrounds/`
  - `Desert.tsx`：硬边 4 色带天空 + 星空 + 太阳/月亮 + 4 层视差（远山 0.12、中景平顶山 0.35、地面 0.6、近景 1.0、前景草丛 1.5），`camX` 控制横移，内容按 3600px 循环。
  - `props.tsx`：风滚草、石头、小仙人掌、仙人掌果、枯灌木、枯树、牛头骨、带脸的太阳（smug/yawn/sleepy/wave）、月亮（可眨眼）、星空。
  - `TermiteMound.tsx`：废弃白蚁丘（`MOUND_TOP` 是站人的位置）。
  - `Campfire.tsx`：篝火（`intensity` 控制渐熄）。
  - `Town.tsx`：主街用 CSS 3D 透视做（`camZ` 推镜、`shut` 百叶窗、`clock` 钟面、`bell` 敲钟）；`ClockTower` 可单独做特写；`Facade` 六种楼面；`WelcomeSign` 小镇木牌（DOVE GULCH · POP. 17）。
- `src/overlay/FilmLook.tsx`：全片质感包裹——胶片颗粒（半分辨率 feTurbulence，每 2 帧换 seed）、gate weave ±1.5px、暗角、饱和度 90% + 轻微褪色；`sepia` 参数打开做旧（棕褐 + 竖向划痕 + 黑点 + 毛发 + 亮度闪烁）。
- `src/fx/index.tsx`：尘土云/小尘土、撞击星星、速度线、集中线、热浪扭曲 `HeatHaze` + 热气线、光圈 `Iris`、木牌 `WoodBoard` + 翻转 `FlipCard`、西部字体 `WesternText`、胶片烧穿 `FilmBurn`、花瓣、萤火虫、风线（泪水、汗珠从 characters/parts 再导出）。
- 合成：`Scene-day/dusk/night/dawn/town/campfire/mound/fx`（静帧）、`ThemePreview`（16 秒色调循环 + 小镇推镜预览）。

### 技术备忘

- 渲染速度：540p 下约 0.11 秒/帧（含颗粒和 3D 小镇），全片 540p 约 15 分钟。
- 带颗粒的静帧存 JPEG（PNG 一张 3MB+）。
- `FilmBurn` 里 `useSvgId` 要在提前 return 之前调用（hooks 规则）。
- 更新 PROGRESS.md 时别整段切片替换，容易把「卡在哪 / 下一步」误删（检查点 2 时发生过）。

## 检查点 3 的确认结果

背景、小镇、质感全部通过（用户：「可以」）。

## 检查点 4 的做法（逐段制作）

- `src/MV.tsx`：正片合成。`<Audio>` 原曲；每个镜头一个 `<Sequence>`，镜头组件从 `SCENES[段落][序号]` 取，没做的用 `scenes/Placeholder.tsx`（分镜文字卡）；整体包 `FilmLook`（sepia 读 `themeAt`）；`Lyrics` 在最上层、不受滤镜影响。
- `src/scenes/common.tsx`：`useShot()` 拿到镜头上下文（局部帧 f、全片帧 g、进度 p、秒数 t/T、当前主题 theme）；`Layer`、`Stage`（自动套环境光）、`At`（摆位）、`Cam`（平滑镜头运动）、`shake`、`beatPulse/beatHop/beatPhaseAt`（跟拍）、`lerp/pop/ease*`。
- 角色动作一拍二：直接把 `g`（全片帧）传给角色，角色内部 `onTwos`；镜头、视差用连续帧保持平滑。
- 跨镜头连续的画面（比如三张片头卡）用全片秒数 T 计算，切镜头时无缝。
- 预览渲染：`npx remotion render src/index.ts MV previews/cp4_XX_540p.mp4 --frames=起-止 --scale=0.5 --crf=24`（起止帧见 `node tools/.build/list_shots.cjs "S3|S4"`，先 `npx esbuild tools/list_shots.ts --bundle --platform=node --outfile=tools/.build/list_shots.cjs`）。

### 已完成的段落

- **S0**（`TitleCards.tsx` + `scenes/S0.tsx`）：放射状太阳光芒 + 挂绳木牌，开场掉下来回弹；8.95 / 17.91 木牌翻转；风滚草三次滚过卡前；老斑鸠 4.6–7.1 秒从木牌后探头（最后吓一跳缩回），18.6 秒掉到作曲卡顶上睡觉；24.6–25.8 光圈收到它身上 → S0-4 光圈打开、峡谷四层视差大横移、天上秃鹰小点盘旋 → S0-5 低机位大风、沙粒、风滚草一路滚到镜头前糊满画面。
- **S1**（`scenes/S1.tsx`）：泥鳅钻沙（尘土）跟拍左右张望 → 海鸥叼薯条飞过，泥鳅视线跟随，薯条掉下插进沙里，泥鳅缩回 → 峡谷大风（四团风滚草、仙人掌被吹弯、速度线、跟拍加强的镜头晃动）→ 大石头空镜 + 画外气泡「? 真的假的」。
- **S2**（`scenes/S2.tsx`，新增 `backgrounds/Riverbed.tsx`）：干河床上热昏的响尾蛇（热浪扭曲 + 热气 + 慢推）→ 太阳大特写往下呼热气，甩镜头到蛇尾巴「沙…沙…」→ 思维气泡长出来、镜头推进气泡到满屏沼泽（下雨、青蛙「呱」、蛇泡在泥水里）→ 「啪！」气泡破掉回到现实。`SwampDream` 留给 S10 复用（换演法）。

- **S3**（`scenes/S3.tsx`）：灰狼啃骨（每拍一口，缺口 1→4，碎屑）→ 秃鹰仰拍绕圈、急推进它的眼睛，翻成主观俯拍（圆形视野、慢慢旋转、地上灰狼瞪回来）→ 斜线分屏两头野牛刨地喷气、最后冲锋 → 远景对冲撞出尘土和星星、两头都晕。
- **S4**（`scenes/S4.tsx`）：推近白蚁丘（风滚草经过）→ 老斑鸠从丘顶冒出来、饿昏摇晃、「咕～」→ 亮相定格（白闪、红黄放射色块旋转、木牌名牌掉下来晃）→ 大哈欠（新加卡通大嘴 `yawn`）。`MoundScene` 给 S11 复用。
- **S5**（`scenes/S5.tsx`）：从小短腿摇到头顶三根毛「啵～」（贴字「腿短」「毛不多」）→ 大太阳下倒空水壶只掉一粒沙「……嗯，够了」→ 秀逗大特写 + 彩色漩涡 → 为死甲虫大哭（泪水积成水洼），秃鹰一脸问号。
- **S6**（`scenes/S6.tsx`）：牛仔说「Howdy!」老斑鸠原样学「Howdy～」，牛仔愣住 → 甩镜头到仙人掌，被看就捂脸 → 蜥蜴横穿 → 四个怪事闪切（彩色边框：鱼骨头游泳、石头咕嘟冒泡、日月同天打招呼、风滚草倒带）→ 像猫的狗舔爪 → 伸懒腰 → 弓背定格 + 大问号。
- **S7**（`scenes/S7.tsx`）：窝里发呆、苍蝇停在嘴上 → 乌鸦踮脚偷树枝、老斑鸠炸毛狂追（速度线、尘土）→ 急刹车，母斑鸠慢动作从灌木丛走出 → 粉色背景、旋转的心、花瓣，心形眼。
- **S8**（`scenes/S8.tsx`）：分仙人掌果（被扎「哎哟」）→ 岩石上的剪影背影看风滚草 → 跟着风滚草一路滚、经过 WELCOME 木牌 → 钟楼走到正午「铛——」→ 做旧主街：百叶窗关上、风滚草滚过、135.5 秒重拍急推。

### 小经验

- `Cam` 的换算：屏幕坐标 = 原点 + (世界坐标 − 原点) × zoom + 平移。做摇镜头前先按这个算好起止平移量。
- 老斑鸠 `talk` 表情传 `text=""` 可以不画它自带的气泡（场景自己画）。
- 用 `AbsoluteFill` 时别再传 `inset`，会被它默认的 top/left 覆盖，改用普通 div。

## 卡在哪

没有卡住。等用户看 S3–S8 两批预览（用户要求每做好 2 批发一次预览检查）。

## 下一步

S9（说唱 7 句快切 + 老电影插卡字幕 + 胶片烧穿）→ S10（主歌二，黄昏到夜晚，全部换机位）→ 预览 `cp4_S9-S10`；然后 S11–S13 → 预览，两批一起发给用户。

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
