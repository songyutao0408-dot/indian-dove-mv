// 本地字体：public/fonts/ 下的 ZCOOL KuaiLe（歌词）和 Rye（西部风格标题）
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const LYRIC_FONT = "ZCOOL KuaiLe";
export const TITLE_FONT = "Rye";

export const fontsReady = Promise.all([
  loadFont({ family: LYRIC_FONT, url: staticFile("fonts/ZCOOLKuaiLe-Regular.ttf") }),
  loadFont({ family: TITLE_FONT, url: staticFile("fonts/Rye-Regular.ttf") }),
]);
