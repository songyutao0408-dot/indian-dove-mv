// 主合成：原曲 + 按镜头表排列的镜头 + 全局质感 + 歌词字幕
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Lyrics } from "./Lyrics";
import { FilmLook } from "./overlay/FilmLook";
import { ShotContext, makeCtx } from "./scenes/common";
import { Placeholder } from "./scenes/Placeholder";
import { SCENES } from "./scenes";
import { themeAt } from "./style/theme";
import { SHOTS, type Shot } from "./timeline";

const ShotHost: React.FC<{ shot: Shot }> = ({ shot }) => {
  const f = useCurrentFrame();
  const ctx = makeCtx(shot, f);
  const Comp = SCENES[shot.section]?.[shot.indexInSection] ?? Placeholder;
  return (
    <ShotContext.Provider value={ctx}>
      <AbsoluteFill style={{ overflow: "hidden", background: ctx.theme.sky[1] }}>
        <Comp />
      </AbsoluteFill>
    </ShotContext.Provider>
  );
};

const Shots: React.FC = () => {
  const g = useCurrentFrame();
  const theme = themeAt(g);
  return (
    <FilmLook frame={g} sepia={theme.sepia}>
      {SHOTS.map((s) => (
        <Sequence key={s.id} from={s.startFrame} durationInFrames={s.durationInFrames} name={`${s.id} ${s.title}`}>
          <ShotHost shot={s} />
        </Sequence>
      ))}
    </FilmLook>
  );
};

export const MV: React.FC = () => (
  <AbsoluteFill style={{ background: "#120A05" }}>
    <Audio src={staticFile("song.mp3")} />
    <Shots />
    <Lyrics />
  </AbsoluteFill>
);
