import { feature, type HostDef } from "@adrifer/winix";
import { adrifer } from "./user-adrifer.ts";

export const windowsNixosWsl = feature("windows-nixos-wsl", ({ windows }, linuxHost: HostDef) => {
  windows.wsl.distro("NixOS", {
    source: "nixos-wsl",
    installLocation: windows.knownFolder.localAppData("Winix\\WSL\\NixOS"),
    default: true,
    setup: {
      // Clone this checkout's remote; configDirectory ("winix") is inferred.
      repository: "self",
      // Kept explicit (with checkout) so distros already provisioned from this
      // branch keep their completion fingerprint. Drop both for new machines to
      // follow the current branch and the default <home>/dotfiles checkout.
      ref: "feat/windows-devbox-preview",
      checkout: "/home/adrifer/dotfiles",
      host: linuxHost,
      user: adrifer,
    },
  });
});
