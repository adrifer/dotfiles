import { feature } from "@adrifer/winix";

export const windowsDevbox = feature("windows-devbox", ({ windows }) => {
  windows.package("Git.Git");
  windows.package("GitHub.cli");
  windows.package("Microsoft.VisualStudioCode.Insiders");
  windows.package("Microsoft.WindowsTerminal.Preview");
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
});
