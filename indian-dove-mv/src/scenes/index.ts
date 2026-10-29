// 各段落的镜头组件：SCENES[段落][镜头序号]；没做的镜头用 Placeholder
import type { ShotComponent } from "./common";
import { S0 } from "./S0";
import { S1 } from "./S1";
import { S2 } from "./S2";

export const SCENES: Record<string, ShotComponent[]> = { S0, S1, S2 };
