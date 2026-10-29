// 泥鳅：从干沙里钻出来，左右张望，再缩回去
import React from "react";
import { INK } from "../style/palette";
import { Eye, autoBlink, dl, ol, onTwos, thin, useSvgId } from "./parts";

const P = { body: "#8C7B4E", belly: "#C8B987", spot: "#5E5232", sand: "#E9C48F", sandShadow: "#C99A62" };

export const Loach: React.FC<{
  frame: number;
  /** 钻出来的程度 0（全在沙里）– 1（钻出来） */
  out?: number;
  /** 视线：-1 左看，1 右看，0 正面；不给就自动左右张望 */
  look?: number;
  /** 抬头往上看 */
  lookUp?: boolean;
  /** 被薯条砸中，眼冒金星 */
  bonked?: boolean;
  /** 是否画出沙堆（场景里自己画地面时可关掉） */
  mound?: boolean;
  sandColor?: string;
  seed?: number;
}> = ({ frame, out = 1, look, lookUp = false, bonked = false, mound = true, sandColor, seed = 5 }) => {
  const f = onTwos(frame);
  const autoLook = Math.floor(f / 18) % 2 ? 1 : -1;
  const lk = look ?? autoLook;
  const h = 150 * out;
  const sway = Math.sin(f / 6) * 4;
  const b = autoBlink(frame, seed);
  const ly: number = lookUp ? -0.8 : 0.1;
  const clip = useSvgId("loachclip");
  return (
    <g>
      {/* 后半个沙堆 */}
      {mound && <path d="M -90 0 Q -60 -32 0 -34 Q 60 -32 90 0 Z" fill={sandColor ?? P.sand} {...ol} />}
      <g transform={`translate(0 ${-20}) rotate(${sway} 0 0)`}>
        <clipPath id={clip}>
          <rect x={-120} y={-400} width={240} height={400} />
        </clipPath>
        <g clipPath={`url(#${clip})`}>
          <g transform={`translate(0 ${150 - h})`}>
            {/* 侧鳍 */}
            <path d="M -30 -40 Q -58 -50 -56 -24 Q -44 -30 -30 -24 Z" fill={P.belly} {...dl} />
            <path d="M 30 -40 Q 58 -50 56 -24 Q 44 -30 30 -24 Z" fill={P.belly} {...dl} />
            {/* 身体：下细上圆，圆脑袋 */}
            <path d="M -28 0 C -30 -50 -40 -96 -38 -118 C -36 -150 36 -150 38 -118 C 40 -96 30 -50 28 0 Z" fill={P.body} {...ol} />
            <path d="M -14 -6 C -16 -40 -18 -70 -16 -88 L 16 -88 C 18 -70 16 -40 14 -6 Z" fill={P.belly} opacity={0.75} />
            {/* 背上的深色纹 + 斑点 */}
            <path d="M 0 -146 L 0 -96" stroke={P.spot} strokeWidth={5} strokeLinecap="round" opacity={0.5} />
            {[[-22, -40], [20, -58], [-20, -70], [22, -26], [-24, -98], [26, -100]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={3.5} fill={P.spot} />
            ))}
            {/* 鳃线 */}
            <path d="M -30 -92 q 8 -6 14 2 M 30 -92 q -8 -6 -14 2" fill="none" {...thin} />
            {/* 胡须（四根，跟着晃） */}
            <path d={`M -14 -102 q -30 ${4 + sway} -46 ${22 + sway} M -10 -98 q -16 14 -20 32 M 14 -102 q 30 ${4 - sway} 46 ${22 - sway} M 10 -98 q 16 14 20 32`} fill="none" {...dl} strokeWidth={2.5} />
            {bonked ? (
              <>
                <path d="M -26 -132 l 12 8 m -12 0 l 12 -8 M 14 -132 l 12 8 m -12 0 l 12 -8" {...dl} />
              </>
            ) : (
              <>
                <Eye cx={-18} cy={-126} rx={12} ry={14} look={[lk * 0.7, ly]} lid={b} pupil={0.45} lidColor={P.body} />
                <Eye cx={18} cy={-126} rx={12} ry={14} look={[lk * 0.7, ly]} lid={b} pupil={0.45} lidColor={P.body} />
              </>
            )}
            {/* 宽嘴 */}
            <path d="M -16 -104 Q 0 -94 16 -104" fill="none" {...dl} />
          </g>
        </g>
      </g>
      {/* 前面的沙沿 + 溅起的沙粒 */}
      {mound && (
        <>
          <path d="M -70 0 Q -36 -22 0 -16 Q 36 -22 70 0 Z" fill={sandColor ?? P.sand} {...dl} />
          <path d="M -40 -6 q 10 -6 20 0 M 18 -8 q 10 -5 18 0" fill="none" stroke={P.sandShadow} strokeWidth={3} strokeLinecap="round" />
          {out > 0.05 && out < 0.95 && [-40, -10, 20, 46].map((x, i) => (
            <circle key={i} cx={x + Math.sin(f + i) * 6} cy={-30 - ((f * 3 + i * 9) % 30)} r={4} fill={sandColor ?? P.sand} stroke={INK} strokeWidth={1.5} />
          ))}
        </>
      )}
    </g>
  );
};
