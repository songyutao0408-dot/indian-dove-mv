import { Config } from "@remotion/cli/config";
import fs from "node:fs";

// 容器里预装了 headless Chromium，直接用，不再下载
const localShell =
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (fs.existsSync(localShell)) {
  Config.setBrowserExecutable(localShell);
}
Config.setVideoImageFormat("jpeg");
Config.setConcurrency(4);
