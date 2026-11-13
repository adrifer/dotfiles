import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { feature } from "@adrifer/winix";

export const windowsShell = feature("windows-shell", ({ windows }) => {
  windows.package("Microsoft.PowerShell");
  windows.package("Microsoft.DSC");
  windows.package("Git.Git");
  windows.package("GitHub.cli");
  windows.package("Microsoft.VisualStudioCode.Insiders");

  const starship = windows.package("Starship.Starship");
  const zoxide = windows.package("ajeetdsouza.zoxide");
  windows.package("JesseDuffield.lazygit");
  const font = windows.package("DEVCOM.JetBrainsMonoNerdFont");
  const terminal = windows.package("Microsoft.WindowsTerminal.Preview");
  const module = windows.powershell.module("Terminal-Icons");

  const starshipConfig = windows.file.symlink(
    windows.knownFolder.userProfile(".config/starship.toml"),
    "../windows/starship/starship.toml",
    { backup: true },
  );
  windows.file.symlink(
    windows.knownFolder.documents("PowerShell/Microsoft.PowerShell_profile.ps1"),
    "../windows/powershell/Microsoft.PowerShell_profile.ps1",
    { backup: true, dependsOn: [module, starship, zoxide, starshipConfig] },
  );

  windows.env.set("WINIX_REPOS", dirname(resolve(fileURLToPath(new URL("../..", import.meta.url)))));
  const nixosIcon = windows.file.copy(
    windows.knownFolder.localAppData("Winix\\Terminal\\nixos.ico"),
    "../windows/terminal-preview/nixos.ico",
    { backup: true },
  );
  windows.file.symlink(
    windows.knownFolder.localAppData("Packages/Microsoft.WindowsTerminalPreview_8wekyb3d8bbwe/LocalState/settings.json"),
    "../windows/terminal-preview/settings.json",
    { backup: true, dependsOn: [terminal, font, nixosIcon] },
  );
});
