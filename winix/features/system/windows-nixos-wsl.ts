import { feature, type HostDef } from "@adrifer/winix";
import { adrifer } from "./user-adrifer.ts";

export const windowsNixosWsl = feature("windows-nixos-wsl", ({ windows }, linuxHost: HostDef) => {
  windows.wsl.distro("NixOS", {
    source: "nixos-wsl",
    installLocation: windows.knownFolder.localAppData("Winix\\WSL\\NixOS"),
    default: true,
    setup: {
      // Clone this checkout's remote and branch into ~/dotfiles; configDirectory
      // ("winix") is inferred. Setup runs once per distro; afterwards it is
      // managed from inside WSL (`winix switch` there).
      repository: "self",
      host: linuxHost,
      user: adrifer,
    },
  });
});
