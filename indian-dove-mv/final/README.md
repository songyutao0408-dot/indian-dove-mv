# 成片

1080p 正式版没有放进仓库：带胶片颗粒的 1080p 文件 437MB，远超 GitHub 单文件 100MB 上限。
成片已直接在对话里发给用户（为了满足对话附件 400MB 上限，发送的是两遍编码压到约 7.2Mbps 的版本，273MB）。

## 规格

- 1920×1080，24fps，H.264 + AAC（原曲音轨），时长 304.54 秒
- 渲染母版：`out/indian-dove-mv-1080p.mp4`（CRF 21，约 11Mbps，437MB，不进 git）
- 分享版：`out/indian-dove-mv-1080p-share.mp4`（两遍编码 7.2Mbps，273MB）
- 仓库里的完整预览：`previews/cp5_full_540p.mp4`（由 1080p 母版缩小，和成片内容一致）

## 重新生成

```bash
npm install
pip install --break-system-packages librosa   # 只有重跑音频分析时需要
npm run prepare-data                          # 复制原曲到 public/ 并解析 LRC
npx remotion render src/index.ts MV out/indian-dove-mv-1080p.mp4 --crf=21
```

在 4 核容器里渲染约 40 分钟。
