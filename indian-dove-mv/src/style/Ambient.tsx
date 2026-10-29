// 环境光包裹：角色和道具放进 <Ambient theme={...}> 里，就会按当前时段压暗偏色（黄昏偏红、夜里偏紫变暗）
import React from "react";
import { useSvgId } from "../characters/parts";
import { ambientMatrix, type Theme } from "./theme";

export const Ambient: React.FC<{ theme: Theme; children: React.ReactNode }> = ({ theme, children }) => {
  const id = useSvgId("ambient");
  if (theme.tintAmount < 0.01 && theme.night < 0.01) return <>{children}</>;
  return (
    <g>
      <defs>
        <filter id={id} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={ambientMatrix(theme)} />
        </filter>
      </defs>
      <g filter={`url(#${id})`}>{children}</g>
    </g>
  );
};
