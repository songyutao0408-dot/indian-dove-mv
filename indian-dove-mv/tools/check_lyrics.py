#!/usr/bin/env python3
"""验收自查：字幕与演唱对齐。

1. 字幕出现帧 = round(LRC 时间 × 24)，与 LRC 的误差最多半帧（≈0.021 秒）。
2. 用 librosa 在原曲的谐波部分（人声为主）做起音检测，找每句 LRC 开始时间附近（±0.4 秒）
   最近的起音点，统计 LRC 本身和实际演唱的偏差。

输出 checkpoints/CP5_字幕对齐自查.md
"""
from __future__ import annotations

import glob
import json
import os

import librosa
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 24
TOL = 0.15


def main() -> None:
    lyrics = json.load(open(os.path.join(ROOT, "src/data/lyrics.json"), encoding="utf-8"))["entries"][3:]
    lines = [e for e in lyrics if e["text"]]
    path = sorted(glob.glob(os.path.join(ROOT, "assets", "*.mp3")))[0]
    y, sr = librosa.load(path, sr=22050, mono=True)
    hop = 128
    yh = librosa.effects.harmonic(y, margin=3.0)
    # 只看人声频段的起音强度
    S = np.abs(librosa.stft(yh, hop_length=hop))
    freqs = librosa.fft_frequencies(sr=sr)
    band = (freqs >= 250) & (freqs <= 3500)
    env = librosa.onset.onset_strength(S=librosa.amplitude_to_db(S[band]), sr=sr, hop_length=hop)
    onsets = librosa.onset.onset_detect(onset_envelope=env, sr=sr, hop_length=hop, units="time", backtrack=True)

    rows = []
    for e in lines:
        t = e["t"]
        frame_err = abs(round(t * FPS) / FPS - t)
        near = onsets[(onsets > t - 0.4) & (onsets < t + 0.4)]
        d = float(near[np.argmin(np.abs(near - t))] - t) if len(near) else None
        rows.append((t, e["text"], frame_err, d))

    frame_max = max(r[2] for r in rows)
    ds = [r[3] for r in rows if r[3] is not None]
    within = sum(1 for d in ds if abs(d) <= TOL)
    out = []
    out.append("# 检查点 5：字幕对齐自查")
    out.append("")
    out.append(f"- 字幕共 {len(rows)} 句。字幕出现帧与 LRC 时间的最大误差：**{frame_max * 1000:.1f} 毫秒**（≤ 半帧，远小于 0.15 秒的要求）。")
    out.append(f"- 人声起音检测：{len(ds)} 句在 LRC 时间 ±0.4 秒内找到起音点，其中 **{within} 句偏差 ≤ 0.15 秒**；偏差中位数 {np.median(np.abs(ds)) * 1000:.0f} 毫秒。")
    out.append("- 起音检测是自动估计（伴奏、和声、拖音都会干扰），只作为 LRC 本身准确度的参考；字幕严格按 LRC 时间出现。")
    out.append("")
    out.append("| LRC 时间 | 歌词 | 字幕帧误差 (ms) | 最近人声起音偏差 (秒) |")
    out.append("|---|---|---|---|")
    for t, text, fe, d in rows:
        mark = "" if d is None or abs(d) <= TOL else " ⚠"
        out.append(f"| {t:.2f} | {text} | {fe * 1000:.1f} | {'—' if d is None else f'{d:+.2f}'}{mark} |")
    os.makedirs(os.path.join(ROOT, "checkpoints"), exist_ok=True)
    with open(os.path.join(ROOT, "checkpoints", "CP5_字幕对齐自查.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")
    print(f"帧误差最大 {frame_max * 1000:.1f}ms；起音 {within}/{len(ds)} 句 ≤{TOL}s，中位 {np.median(np.abs(ds)) * 1000:.0f}ms")


if __name__ == "__main__":
    main()
