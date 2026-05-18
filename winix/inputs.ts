import { defineInputs, input } from "winix";

export const inputs = defineInputs({
  nixpkgs: "nixos-unstable",
  nixpkgsStable: input("github:NixOS/nixpkgs/nixos-25.11", {
    nixName: "nixpkgs-stable",
  }),
  nixosWsl: input("github:nix-community/NixOS-WSL", {
    follows: { nixpkgs: "nixpkgs" },
  }),
  nixDarwin: input("github:nix-darwin/nix-darwin", {
    nixName: "nix-darwin",
    follows: { nixpkgs: "nixpkgs" },
  }),
  homeManager: input("github:nix-community/home-manager", {
    follows: { nixpkgs: "nixpkgs" },
  }),
  nixHomebrew: input("github:zhaofengli/nix-homebrew", {
    nixName: "nix-homebrew",
  }),
  homeManagerStable: input("github:nix-community/home-manager/release-25.11", {
    nixName: "home-manager-stable",
    follows: { nixpkgs: "nixpkgs-stable" },
  }),
});
