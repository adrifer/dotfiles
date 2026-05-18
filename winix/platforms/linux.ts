import { platform } from "winix";

export const nixos = platform("nixos", (system: string = "x86_64-linux") => ({
  nixos: {
    imports: ["home-manager"],
    nixpkgs: {
      config: { allowUnfree: true },
      hostPlatform: system,
    },
    nix: { settings: { "experimental-features": ["nix-command", "flakes"] } },
    homeManager: {
      useGlobalPkgs: true,
      useUserPackages: true,
    },
  },
}));
