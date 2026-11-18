import { profile, windows } from "@adrifer/winix";
import { windowsShell } from "../features/windows-shell.ts";
import { windowsWsl } from "../features/windows-wsl.ts";

export const windowsBase = profile("windows-base", [
  windows.setting({
    DeveloperMode: true,
    AppColorMode: "Dark",
    SystemColorMode: "Dark",
  }),
  windowsShell(),
  windowsWsl(),
]);
