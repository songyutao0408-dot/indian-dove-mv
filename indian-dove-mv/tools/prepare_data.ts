// 1. 把原曲从 assets/ 复制到 public/song.mp3（Remotion 只能读 public/ 里的静态文件；副本不进 git）
// 2. 读取 assets/ 里的 .lrc（先 UTF-8，乱码改 GBK），解析后写到 src/data/lyrics.json。
// 运行：npm run prepare-data
import fs from "node:fs";
import path from "node:path";
import { looksGarbled, parseLrc } from "../src/lib/lrc";

const root = process.cwd();
const assets = path.join(root, "assets");
const mp3 = fs.readdirSync(assets).find((f) => f.toLowerCase().endsWith(".mp3"));
if (!mp3) throw new Error("assets/ 里没有 .mp3 文件");
fs.mkdirSync(path.join(root, "public"), { recursive: true });
fs.copyFileSync(path.join(assets, mp3), path.join(root, "public/song.mp3"));

const lrcFile = fs.readdirSync(assets).find((f) => f.toLowerCase().endsWith(".lrc"));
if (!lrcFile) throw new Error("assets/ 里没有 .lrc 文件");

const bytes = fs.readFileSync(path.join(assets, lrcFile));
let encoding = "utf-8";
let text = new TextDecoder("utf-8").decode(bytes);
if (looksGarbled(text)) {
  encoding = "gbk";
  text = new TextDecoder("gbk").decode(bytes);
}
const entries = parseLrc(text);

const out = { source: lrcFile, encoding, entries };
fs.writeFileSync(path.join(root, "src/data/lyrics.json"), JSON.stringify(out, null, 1) + "\n");
console.log(`${lrcFile}: 编码 ${encoding}，${entries.length} 条时间戳`);
