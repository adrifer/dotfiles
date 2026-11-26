import { profile } from "@adrifer/winix";
import { personalApps } from "../features/apps/personal-apps.ts";
import { sonarctl } from "../features/apps/sonarctl.ts";
import { t3App } from "../features/apps/t3.ts";
import { komorebi } from "../features/desktop/komorebi.ts";
import { winget } from "../features/desktop/winget.ts";

/**
 * Personal machines: personal apps and games, T3 Code, the komorebi tiling
 * window manager, per-user WinGet installs, and sonarctl.
 */
export const personal = profile("personal", [
  personalApps(),
  t3App(),
  komorebi(),
  winget(),
  sonarctl(),
]);
