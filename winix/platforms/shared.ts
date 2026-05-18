import { escape } from "winix";

export const stableOverlay = escape(`(final: prev: {
  stable = import inputs.nixpkgs-stable {
    inherit (final.stdenv.hostPlatform) system;
    config = final.config.nixpkgs.config or {};
  };
})`);
