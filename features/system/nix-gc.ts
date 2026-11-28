import { feature } from "@adrifer/winix";

export const nixGc = feature("nix-gc", ({ nixos }) => {
  nixos.nix({
    gc: {
      automatic: true,
      dates: "weekly",
      options: "--delete-older-than 7d",
    },
  });
});
