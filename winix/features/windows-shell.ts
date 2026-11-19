import { feature } from "@adrifer/winix";

export const windowsShell = feature("windows-shell", ({ windows }) => {
  windows.package("Microsoft.PowerShell");
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
  );
  windows.powershell.profile("../windows/powershell/Microsoft.PowerShell_profile.ps1", {
    dependsOn: [module, starship, zoxide, starshipConfig],
  });

  // The directory that holds this dotfiles checkout.
  windows.env.set("WINIX_REPOS", windows.configPath("../.."));
  const nixosIcon = windows.file.copy(
    windows.knownFolder.localAppData("Winix\\Terminal\\nixos.ico"),
    "../windows/terminal-preview/nixos.ico",
  );
  windows.terminal.settings("../windows/terminal-preview/settings.json", {
    channel: "preview",
    dependsOn: [terminal, font, nixosIcon],
  });
});
