import { feature, nix } from "winix";

export const nixGc = feature("nix-gc", () => [
  {
    nixos: {
      systemd: {
        tmpfiles: {
          rules: ["L+ /usr/bin/bash - - - - ${pkgs.bash}/bin/bash"],
        },
      },
    },
  },
  nix.gc({ olderThan: "7d" }),
]);
