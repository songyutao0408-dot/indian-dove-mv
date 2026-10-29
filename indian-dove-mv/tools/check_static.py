#!/usr/bin/env python3
"""验收自查：有没有静止超过 2 秒的画面。

做法：用 ffmpeg 把视频缩到 48×27 灰度，再做 4 帧时间平均（把胶片颗粒、画面抖动平均掉），
和 4 帧前比平均绝对差；连续超过 2 秒都低于阈值的片段就算「静止」。
用法：python3 tools/check_static.py 视频.mp4
建议检测「去掉质感后期和字幕」的版本（MV 的 raw 参数），因为画面抖动和做旧闪烁本身就会让每一帧都不同，
而 brief 要求的是画面内容要有微动：
  npx remotion render src/index.ts MV out/raw_check.mp4 --props='{"raw":true}' --scale=0.25 --muted
"""
from __future__ import annotations

import os
import subprocess
import sys

import numpy as np

W, H, FPS = 48, 27, 24
THRESH = 0.25  # 0–255 灰度下的平均差（4 帧时间平均之后）


def main() -> None:
    path = sys.argv[1]
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-vf", f"scale={W}:{H}:flags=area,format=gray", "-f", "rawvideo", "-"],
        capture_output=True,
        check=True,
    ).stdout
    frames = np.frombuffer(raw, dtype=np.uint8).reshape(-1, H, W).astype(np.float32)
    diff = np.abs(np.diff(frames, axis=0)).mean(axis=(1, 2))
    # 4 帧时间平均抵消颗粒（颗粒每 2 帧换一次），再和 4 帧前比
    k = 4
    smooth = np.stack([frames[i : i + k].mean(axis=0) for i in range(len(frames) - k + 1)])
    diff2 = np.abs(smooth[k:] - smooth[:-k]).mean(axis=(1, 2))
    still = diff2 < THRESH
    runs = []
    start = None
    for i, s in enumerate(still):
        if s and start is None:
            start = i
        if (not s or i == len(still) - 1) and start is not None:
            end = i if not s else i + 1
            if end - start > 2 * FPS:
                runs.append((start / FPS, end / FPS))
            start = None
    print(f"共 {len(frames)} 帧；逐帧差中位数 {np.median(diff):.2f}；静止超过 2 秒的片段：{len(runs)} 处")
    for a, b in runs:
        print(f"  {a:7.2f} – {b:7.2f} 秒（{b - a:.2f} 秒）")
    out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "checkpoints", "CP5_静止画面自查.txt")
    with open(out, "w", encoding="utf-8") as f:
        f.write(f"视频：{path}\n阈值：48×27 灰度、4 帧平均后与 4 帧前的平均差 < {THRESH}\n")
        f.write(f"静止超过 2 秒的片段：{len(runs)} 处\n")
        for a, b in runs:
            f.write(f"  {a:.2f} – {b:.2f} 秒（{b - a:.2f} 秒）\n")


if __name__ == "__main__":
    main()
