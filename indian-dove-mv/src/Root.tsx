import React from "react";
import { Composition, continueRender, delayRender, Still } from "remotion";
import { Animatic } from "./compositions/Animatic";
import { CastLineup, CastVariants } from "./compositions/CastSheet";
import { CastTest } from "./compositions/CastTest";
import { DoveSheet } from "./compositions/DoveSheet";
import { MotionTest } from "./compositions/MotionTest";
import { SceneStill, type SceneVariant } from "./compositions/SceneStills";
import { THEME_PREVIEW_FRAMES, ThemePreview } from "./compositions/ThemePreview";
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
    {/* 检查点 2：老斑鸠表情与姿态 */}
    <Still id="DoveSheet" component={DoveSheet} width={1920} height={1080} />
    <Still id="CastLineup" component={CastLineup} width={1920} height={1080} />
    <Still id="CastVariants" component={CastVariants} width={1920} height={1080} />
    <Still id="CastTest" component={CastTest} width={1920} height={1080} />
    {/* 检查点 3：场景静帧 */}
    {(["day", "dusk", "night", "dawn", "town", "campfire", "mound", "fx"] as SceneVariant[]).map((v) => (
      <Still key={v} id={`Scene-${v}`} component={SceneStill} defaultProps={{ variant: v }} width={WIDTH} height={HEIGHT} />
    ))}
    <Composition id="ThemePreview" component={ThemePreview} durationInFrames={THEME_PREVIEW_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    {/* 检查点 2：角色动作测试 */}
    <Composition id="MotionTest" component={MotionTest} durationInFrames={240} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
