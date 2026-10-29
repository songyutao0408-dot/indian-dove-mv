import React from "react";
import { Composition, continueRender, delayRender, Still } from "remotion";
import { Animatic } from "./compositions/Animatic";
import { TimelineChart } from "./compositions/TimelineChart";
import { fontsReady } from "./fonts";
import { DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from "./timeline";

// 等字体加载完再渲染第一帧
const handle = delayRender("加载字体");
fontsReady.then(() => continueRender(handle));

export const RemotionRoot: React.FC = () => (
  <>
    {/* 检查点 1：分镜对位预览（文字卡 + 正式字幕 + 原曲） */}
    <Composition id="Animatic" component={Animatic} durationInFrames={DURATION_IN_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    {/* 检查点 1：段落时间表静态图 */}
    <Still id="TimelineChart" component={TimelineChart} width={1920} height={1080} />
  </>
);
