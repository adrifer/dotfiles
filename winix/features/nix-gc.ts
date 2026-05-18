import { feature } from "winix";

export const nixGc = feature("nix-gc", () => ({
  nixos: {
    systemd: {
      tmpfiles: {
        rules: ["L+ /usr/bin/bash - - - - ${pkgs.bash}/bin/bash"],
      },
    },
    nix: {
      gc: {
        automatic: true,
        dates: "weekly",
        options: "--delete-older-than 7d",
      },
    },
  },
}));
