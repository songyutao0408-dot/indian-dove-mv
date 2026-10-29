// 带描边的「粗线条肢体」：先画一条深棕粗线，再在上面画一条细一点的颜色线，看起来就是有描边的胳膊/腿/尾巴
import React from "react";
import { INK } from "../style/palette";

export const Limb: React.FC<{ d: string; color: string; w: number; outline?: number }> = ({ d, color, w, outline = 7 }) => (
  <g>
    <path d={d} fill="none" stroke={INK} strokeWidth={w + outline} strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
