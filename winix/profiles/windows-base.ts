import { profile } from "@adrifer/winix";
import { lazygit } from "../features/lazygit.ts";
import { starship } from "../features/starship.ts";
import { windowsPreferences } from "../features/windows-preferences.ts";
import { windowsShell } from "../features/windows-shell.ts";
import { windowsWsl } from "../features/windows-wsl.ts";

export const windowsBase = profile("windows-base", [
  windowsPreferences(),
  windowsShell(),
  windowsWsl(),
  lazygit(),
  starship(),
]);
