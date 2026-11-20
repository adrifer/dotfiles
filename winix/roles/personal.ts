import { profile } from "@adrifer/winix";
import { personalApps } from "../features/apps/personal-apps.ts";
import { sonarctl } from "../features/apps/sonarctl.ts";
import { komorebi } from "../features/desktop/komorebi.ts";
import { winget } from "../features/desktop/winget.ts";

/**
 * Personal machines: personal apps and games, the komorebi tiling window
 * manager, per-user WinGet installs, and sonarctl.
 */
export const personal = profile("personal", [
  personalApps(),
  komorebi(),
  winget(),
  sonarctl(),
]);
