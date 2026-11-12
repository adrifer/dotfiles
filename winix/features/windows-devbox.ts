import { feature } from "@adrifer/winix";
import { windowsShell } from "./windows-shell.ts";

export const windowsDevbox = feature("windows-devbox", ({ windows }) => {
  const developerMode = windows.setting({ DeveloperMode: true });

  windows.package("Git.Git");
  windows.package("GitHub.cli");
  windows.package("Microsoft.VisualStudioCode.Insiders");
  windows.package("Microsoft.WSL");

  windows.wsl();
  windows.wsl.distro("NixOS", {
    source: "nixos-wsl",
    installLocation: windows.knownFolder.localAppData("Winix\\WSL\\NixOS"),
    default: true,
    setup: {
      repository: "https://github.com/adrifer/dotfiles.git",
      ref: "feat/windows-devbox-preview",
      configDirectory: "winix",
      host: "wsl-work-2",
      user: "adrifer",
      checkout: "/home/adrifer/dotfiles",
    },
  });

  return windowsShell(developerMode);
});
