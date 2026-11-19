import { profile } from "@adrifer/winix";
import { lazygit } from "../features/lazygit.ts";
import { powershell } from "../features/powershell.ts";
import { starship } from "../features/starship.ts";
import { windowsPreferences } from "../features/windows-preferences.ts";
import { windowsShell } from "../features/windows-shell.ts";
import { windowsTerminal } from "../features/windows-terminal.ts";
import { windowsWsl } from "../features/windows-wsl.ts";
import { zoxide } from "../features/zoxide.ts";

export const windowsBase = profile("windows-base", [
  windowsPreferences(),
  powershell(),
  windowsTerminal(),
  windowsShell(),
  windowsWsl(),
  lazygit(),
  starship(),
  zoxide(),
]);
