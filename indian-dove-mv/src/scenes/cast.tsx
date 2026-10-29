// 群戏工具：按统一比例（CAST_SCALE）渲染任意角色的几种通用状态
import React from "react";
import {
  Bison, CAST_SCALE, Cactus, CatDog, Chief, Cowboy, Crow, Dove, Hen, Lizard, Loach, Seagull, Shaman, Skull, Snake,
  Vulture, Warrior, Wolf,
} from "../characters";
import type { CharId } from "../shots";
import { beatHop, beatPhaseAt } from "./common";

export type CastMode = "idle" | "dance" | "run" | "cheer" | "sleep";

export const CastMember: React.FC<{ id: CharId; g: number; T: number; mode?: CastMode; facing?: 1 | -1; seed?: number }> = ({
  id, g, T, mode = "idle", facing = 1, seed = 0,
}) => {
  const fr = g + seed * 3;
  const dance = mode === "dance";
  const beat = beatPhaseAt(T + seed * 0.07);
  const hop = dance || mode === "cheer" ? beatHop(T + seed * 0.05, mode === "cheer" ? 26 : 14) : 0;
  const run = mode === "run";
  const sleep = mode === "sleep";
  let el: React.ReactNode;
  switch (id) {
    case "dove":
      el = <Dove frame={run ? fr * 2 : fr} pose={sleep ? "lie" : dance ? "dance" : run ? "walk" : "stand"} expression={sleep ? "sleep" : mode === "cheer" ? "love" : dance ? "happy" : run ? "angry" : "daze"} beat={beat} facing={facing} seed={seed} />;
      break;
    case "hen":
      el = <Hen frame={fr} pose={sleep ? "sit" : dance ? "dance" : run ? "walk" : "stand"} expression={sleep ? "calm" : dance || mode === "cheer" ? "happy" : "calm"} beat={beat} facing={facing} blink={sleep ? 1 : undefined} />;
      break;
    case "crow":
      el = <Crow frame={fr} pose={run ? "run" : "stand"} expression={run ? "scared" : "sheepish"} facing={facing} />;
      break;
    case "snake":
      el = <Snake frame={fr} pose={sleep ? "limp" : "coiled"} expression={sleep ? "sleep" : "happy"} facing={facing} />;
      break;
    case "wolf":
      el = <Wolf frame={fr} pose={dance ? "dance" : "stand"} expression={sleep ? "serious" : dance || mode === "cheer" ? "grin" : "grin"} beat={beat} facing={facing} hat={dance} />;
      break;
    case "vulture":
      el = <Vulture frame={fr} expression={mode === "cheer" ? "stare" : "stare"} look={[0.4, 0.1]} facing={facing} />;
      break;
    case "bison":
      el = <Bison frame={fr} pose={run ? "charge" : dance ? "paw" : "stand"} facing={facing} snort={!sleep} tint={seed % 2 ? "#86603E" : undefined} />;
      break;
    case "lizard":
      el = <Lizard frame={fr} pose={dance || run ? "walk" : "stand"} />;
      break;
    case "cactus":
      el = <Cactus frame={fr} pose={dance ? "dance" : sleep ? "shy" : "idle"} beat={beat} />;
      break;
    case "catdog":
      el = <CatDog frame={fr} pose={sleep ? "lick" : dance ? "arch" : run ? "pounce" : "stand"} facing={facing} />;
      break;
    case "seagull":
      el = <Seagull frame={fr} pose="stand" facing={facing} fries={!dance} />;
      break;
    case "loach":
      el = <Loach frame={fr} out={1} mound />;
      break;
    case "cowboy":
      el = <Cowboy frame={fr} pose={dance ? "dance" : run ? "walk" : "stand"} expression={dance || mode === "cheer" ? "grin" : "squint"} beat={beat} facing={facing} />;
      break;
    case "warrior":
      el = <Warrior frame={fr} pose={dance ? "dance" : run ? "walk" : "stand"} beat={beat} facing={facing} />;
      break;
    case "shaman":
      el = <Shaman frame={fr} pose={dance ? "dance" : "stand"} beat={beat} facing={facing} />;
      break;
    case "chief":
      el = <Chief frame={fr} expression={dance || mode === "cheer" ? "happy" : "stern"} facing={facing} bob={dance ? hop * 0.6 : 0} />;
      break;
    case "skull":
      el = <Skull frame={fr} mode={dance || mode === "cheer" ? "nod" : "idle"} />;
      break;
  }
  return (
    <g transform={`translate(0 ${id === "chief" ? 0 : hop}) scale(${CAST_SCALE[id]})`}>
      {el}
    </g>
  );
};

/** 一排角色的默认顺序（老斑鸠和母斑鸠在中间） */
export const LINEUP: CharId[] = [
  "cactus", "cowboy", "wolf", "lizard", "bison", "skull", "snake", "hen", "dove", "crow", "catdog", "loach", "seagull", "vulture", "shaman", "chief", "warrior",
];
