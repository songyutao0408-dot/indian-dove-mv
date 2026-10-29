// 角色总表：组件 + 名字 + 群戏里的相对比例（全员同框时用 CAST_SCALE 保证大小关系统一）
export { Dove } from "./Dove";
export { Hen } from "./Hen";
export { Crow } from "./Crow";
export { Snake } from "./Snake";
export { Wolf, Bone } from "./Wolf";
export { Vulture } from "./Vulture";
export { Bison } from "./Bison";
export { Lizard } from "./Lizard";
export { Cactus } from "./Cactus";
export { CatDog } from "./CatDog";
export { Seagull } from "./Seagull";
export { Loach } from "./Loach";
export { Cowboy } from "./Cowboy";
export { Warrior } from "./Warrior";
export { Shaman, MagicSmoke } from "./Shaman";
export { Chief, RainCloud } from "./Chief";
export { Skull } from "./Skull";

import type { CharId } from "../shots";

/** 全员同框时的相对比例（以老斑鸠 = 1 为基准） */
export const CAST_SCALE: Record<CharId, number> = {
  dove: 1,
  hen: 0.95,
  crow: 0.8,
  snake: 0.75,
  wolf: 0.95,
  vulture: 0.85,
  bison: 0.9,
  lizard: 0.75,
  cactus: 1,
  catdog: 0.8,
  seagull: 0.7,
  loach: 0.75,
  cowboy: 1,
  warrior: 1,
  shaman: 1,
  chief: 1,
  skull: 0.7,
};
