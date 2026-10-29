// 还没做的镜头：沙漠背景 + 分镜文字卡（和检查点 1 的分镜对位预览一样的信息）
import React from "react";
import { Desert } from "../backgrounds/Desert";
import { LYRIC_FONT, TITLE_FONT } from "../fonts";
import { CHAR_NAMES } from "../shots";
import { CREAM, INK } from "../style/palette";
import { useShot } from "./common";

export const Placeholder: React.FC = () => {
  const { shot, theme, g } = useShot();
  return (
    <>
      <Desert theme={theme} frame={g} camX={g * 4} />
      <div
        style={{
          position: "absolute",
          left: 320,
          top: 200,
          width: 1280,
          background: CREAM,
          border: `5px solid ${INK}`,
          borderRadius: 22,
          padding: "30px 44px",
          fontFamily: LYRIC_FONT,
          color: INK,
          boxShadow: `10px 12px 0 ${INK}`,
          opacity: 0.92,
        }}
      >
        <div style={{ fontSize: 56 }}>
          <span style={{ fontFamily: TITLE_FONT, fontSize: 42, marginRight: 20 }}>{shot.id}</span>
          {shot.title}
          <span style={{ fontSize: 26, marginLeft: 20, opacity: 0.6 }}>（待制作）</span>
        </div>
        <div style={{ fontSize: 32, lineHeight: 1.45, marginTop: 12 }}>{shot.desc}</div>
        <div style={{ fontSize: 24, marginTop: 12, opacity: 0.75 }}>出场：{shot.cast.map((c) => CHAR_NAMES[c]).join("、") || "—"}</div>
      </div>
    </>
  );
};
