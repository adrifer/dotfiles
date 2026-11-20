import { profile } from "@adrifer/winix";
import { windowsPreferences } from "../features/desktop/windows-preferences.ts";
import { windowsTerminal } from "../features/desktop/windows-terminal.ts";
import { windowsWsl } from "../features/system/windows-wsl.ts";

/** Every Windows PC: preferences (dark mode, Developer Mode), Windows Terminal and WSL. */
export const windowsDesktop = profile("windows-desktop", [
  windowsPreferences(),
  windowsTerminal(),
  windowsWsl(),
]);
