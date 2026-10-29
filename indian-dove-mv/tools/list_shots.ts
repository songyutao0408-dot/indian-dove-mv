// 打印镜头表（开发用）：npx esbuild tools/list_shots.ts --bundle --platform=node --outfile=tools/.build/list_shots.cjs && node tools/.build/list_shots.cjs
import { SHOTS } from "../src/timeline";
const only = process.argv[2];
for (const s of SHOTS) {
  if (only && !s.section.match(new RegExp(`^(${only})$`))) continue;
  console.log(s.id.padEnd(7), s.start.toFixed(2).padStart(7), s.end.toFixed(2).padStart(7), String(s.startFrame).padStart(5), String(s.durationInFrames).padStart(4), s.title);
}
