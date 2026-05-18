import { platform } from "winix";
import { stableOverlay } from "./shared.ts";

export const darwin = platform("darwin", (system = "aarch64-darwin") => ({
  darwin: {
    imports: [
      "inputs.nix-homebrew.darwinModules.nix-homebrew",
      "inputs.home-manager.darwinModules.home-manager",
    ],
    nixpkgs: {
      overlays: [stableOverlay],
      config: { allowUnfree: true },
      hostPlatform: system,
    },
    nix: {
      enable: false,
      settings: { "experimental-features": ["nix-command", "flakes"] },
    },
    "home-manager": {
      useGlobalPkgs: true,
      useUserPackages: true,
    },
  },
}));
