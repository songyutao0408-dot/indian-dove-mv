#!/usr/bin/env python3
"""分析原曲，导出 beats.json 和 energy.json。

用法：python3 tools/analyze_audio.py
输出：
  src/data/beats.json        节拍时间点（秒）、估计 BPM、强拍（每小节第一拍）
  src/data/energy.json       每 0.5 秒的能量（RMS，归一化到 0–1），
                             以及人声频段能量
  src/data/calibration.json  音频实际时长、最后一句人声的结束时间（校准 S18/S19 分界）
"""
from __future__ import annotations

import glob
import json
import os
import sys

import librosa
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "assets")
OUT_DIR = os.path.join(ROOT, "src", "data")
LAST_LINE_START = 267.83  # LRC 最后一句的开始时间（timeline.json 的 S18 备注）
WINDOW = 0.5  # 能量统计窗口（秒）


def find_audio() -> str:
    files = sorted(glob.glob(os.path.join(ASSETS, "*.mp3")))
    if not files:
        sys.exit("assets/ 里没有找到 .mp3 文件")
    return files[0]


def normalize(x: np.ndarray) -> np.ndarray:
    lo, hi = float(np.percentile(x, 1)), float(np.percentile(x, 99.5))
    return np.clip((x - lo) / max(hi - lo, 1e-9), 0.0, 1.0)


def window_mean(values: np.ndarray, times: np.ndarray, duration: float) -> list[float]:
    n = int(np.ceil(duration / WINDOW))
    out = []
    for i in range(n):
        mask = (times >= i * WINDOW) & (times < (i + 1) * WINDOW)
        out.append(float(values[mask].mean()) if mask.any() else 0.0)
    return out


def find_vocal_end(y: np.ndarray, sr: int, start: float, search: float = 8.0) -> float:
    """在最后一句开始后，找到声音掉进静音（乐队停顿、拖音收尾）的位置。

    做法：0.05 秒一格算 RMS，以最后一句演唱时的中位音量为基准，
    第一个"之后连续 0.3 秒都低于基准 10%"的格子就是人声结束点。
    """
    hop = 256
    seg = y[int(start * sr): int((start + search) * sr)]
    rms = librosa.feature.rms(y=seg, hop_length=hop)[0]
    step = max(1, int(0.05 * sr / hop))
    cells = np.array([rms[i:i + step].mean() for i in range(0, len(rms) - step, step)])
    ref = float(np.median(cells[: int(1.5 / 0.05)]))
    need = int(0.3 / 0.05)
    for i in range(len(cells) - need):
        if (cells[i:i + need] < ref * 0.10).all():
            return start + i * 0.05
    return start + search


def main() -> None:
    path = find_audio()
    y, sr = librosa.load(path, sr=22050, mono=True)
    duration = len(y) / sr
    hop = 512

    # 节拍
    onset_env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
    tempo, beat_frames = librosa.beat.beat_track(
        onset_envelope=onset_env, sr=sr, hop_length=hop, trim=False
    )
    beats = librosa.frames_to_time(beat_frames, sr=sr, hop_length=hop)
    bpm = float(np.atleast_1d(tempo)[0])

    # 强拍：在 4 种相位里挑节拍处起音强度最大的那一组
    strengths = onset_env[beat_frames] if len(beat_frames) else np.array([])
    phase = int(np.argmax([strengths[p::4].mean() for p in range(4)])) if len(strengths) >= 4 else 0
    downbeats = beats[phase::4]

    # 能量（整体 RMS）
    rms = librosa.feature.rms(y=y, hop_length=hop)[0]
    t_rms = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=hop)
    energy = normalize(np.array(window_mean(rms, t_rms, duration)))

    # 人声频段能量：先做谐波/打击分离，取谐波部分 300–3400 Hz 的能量
    y_harm = librosa.effects.harmonic(y, margin=3.0)
    S = np.abs(librosa.stft(y_harm, hop_length=hop))
    freqs = librosa.fft_frequencies(sr=sr)
    band = (freqs >= 300) & (freqs <= 3400)
    vocal = np.sqrt((S[band] ** 2).mean(axis=0))
    t_voc = librosa.frames_to_time(np.arange(len(vocal)), sr=sr, hop_length=hop)
    vocal_energy = normalize(np.array(window_mean(vocal, t_voc, duration)))

    os.makedirs(OUT_DIR, exist_ok=True)
    with open(os.path.join(OUT_DIR, "beats.json"), "w", encoding="utf-8") as f:
        json.dump(
            {
                "source": os.path.basename(path),
                "duration": round(duration, 3),
                "bpm": round(bpm, 2),
                "beats": [round(float(b), 3) for b in beats],
                "downbeats": [round(float(b), 3) for b in downbeats],
            },
            f,
            ensure_ascii=False,
            indent=1,
        )
    with open(os.path.join(OUT_DIR, "energy.json"), "w", encoding="utf-8") as f:
        json.dump(
            {
                "source": os.path.basename(path),
                "window": WINDOW,
                "duration": round(duration, 3),
                "energy": [round(v, 4) for v in energy.tolist()],
                "vocal_band": [round(v, 4) for v in vocal_energy.tolist()],
            },
            f,
            ensure_ascii=False,
        )
    vocal_end = find_vocal_end(y, sr, LAST_LINE_START)
    with open(os.path.join(OUT_DIR, "calibration.json"), "w", encoding="utf-8") as f:
        json.dump(
            {
                "audio_duration": round(duration, 3),
                "last_line_start": LAST_LINE_START,
                "vocal_end": round(vocal_end, 2),
                "note": "S18 结束 / S19 开始 = vocal_end（最后一个字拖音收尾、乐队停顿的位置）",
            },
            f,
            ensure_ascii=False,
            indent=1,
        )
    print(f"人声结束：{vocal_end:.2f}s")
    print(f"音频：{os.path.basename(path)}  时长 {duration:.3f}s  BPM≈{bpm:.1f}  节拍 {len(beats)} 个")


if __name__ == "__main__":
    main()
