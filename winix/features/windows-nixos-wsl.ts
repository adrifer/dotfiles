import { feature } from "@adrifer/winix";

export const windowsNixosWsl = feature("windows-nixos-wsl", ({ windows }, linuxHost: string) => {
  windows.wsl.distro("NixOS", {
    source: "nixos-wsl",
    installLocation: windows.knownFolder.localAppData("Winix\\WSL\\NixOS"),
    default: true,
    setup: {
      repository: "https://github.com/adrifer/dotfiles.git",
      ref: "feat/windows-devbox-preview",
      configDirectory: "winix",
      host: linuxHost,
      user: "adrifer",
      checkout: "/home/adrifer/dotfiles",
    },
  });
});
