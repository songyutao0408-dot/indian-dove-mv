// LRC 歌词解析。只处理文本，编码识别在 tools/prepare_data.ts 里做（先 UTF-8，乱码再 GBK）。

export type LrcEntry = {
  /** 秒 */
  t: number;
  /** 空字符串表示这里字幕清空 */
  text: string;
};

const TIME_TAG = /\[(\d{1,2}):(\d{1,2}(?:\.\d{1,3})?)\]/g;

export function parseLrc(source: string): LrcEntry[] {
  const out: LrcEntry[] = [];
  for (const raw of source.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const tags = [...line.matchAll(TIME_TAG)];
    if (tags.length === 0) continue; // [ti:] [ar:] 这类元信息
    const text = line.replace(TIME_TAG, "").trim();
    for (const m of tags) {
      // 四舍五入到毫秒，避免 3*60+19.08 = 199.0799… 这种浮点误差把句子分错段
      out.push({ t: Math.round((Number(m[1]) * 60 + Number(m[2])) * 1000) / 1000, text });
    }
  }
  return out.sort((a, b) => a.t - b.t);
}

/** 解码后的文本里出现替换字符（U+FFFD）就认为不是这个编码 */
export function looksGarbled(text: string): boolean {
  return text.includes("�");
}
