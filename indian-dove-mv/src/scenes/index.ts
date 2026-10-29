// 各段落的镜头组件：SCENES[段落][镜头序号]；没做的镜头用 Placeholder
import type { ShotComponent } from "./common";
import { S0 } from "./S0";
import { S1 } from "./S1";
import { S2 } from "./S2";
import { S3 } from "./S3";
import { S4 } from "./S4";
import { S5 } from "./S5";
import { S6 } from "./S6";
import { S7 } from "./S7";
import { S8 } from "./S8";

export const SCENES: Record<string, ShotComponent[]> = { S0, S1, S2, S3, S4, S5, S6, S7, S8 };
