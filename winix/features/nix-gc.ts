import { feature, nixos } from "winix";

export const nixGc = feature("nix-gc", () => [
  nixos.systemd.tmpfiles(["L+ /usr/bin/bash - - - - ${pkgs.bash}/bin/bash"]),
  nixos.nix({
    gc: {
      automatic: true,
      dates: "weekly",
      options: "--delete-older-than 7d",
    },
  }),
]);
