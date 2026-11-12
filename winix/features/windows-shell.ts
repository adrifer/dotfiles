import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { feature, type WindowsHelper } from "@adrifer/winix";

export const windowsShell = feature("windows-shell", ({ windows }, developerMode: ReturnType<WindowsHelper["setting"]>) => {
  const module = windows.powershell.module("Terminal-Icons");
  windows.file.symlink(
    windows.knownFolder.documents("PowerShell/Microsoft.PowerShell_profile.ps1"),
    "../windows/powershell/Microsoft.PowerShell_profile.ps1",
    { backup: true, dependsOn: [module, developerMode] },
  );

  windows.env.set("WINIX_REPOS", dirname(resolve(fileURLToPath(new URL("../..", import.meta.url)))));
  windows.file.symlink(
    windows.knownFolder.userProfile(".config/starship.toml"),
    "../windows/starship/starship.toml",
    { backup: true, dependsOn: developerMode },
  );
  windows.file.symlink(
    windows.knownFolder.localAppData("Packages/Microsoft.WindowsTerminalPreview_8wekyb3d8bbwe/LocalState/settings.json"),
    "../windows/terminal-preview/settings.json",
    { backup: true, dependsOn: developerMode },
  );
});
