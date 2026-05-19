import { platform } from "winix";

export const darwin = platform("darwin", (system: string = "aarch64-darwin") => ({
  darwin: {
    imports: [
      "inputs.nix-homebrew.darwinModules.nix-homebrew",
      "inputs.home-manager.darwinModules.home-manager",
    ],
    nixpkgs: {
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
