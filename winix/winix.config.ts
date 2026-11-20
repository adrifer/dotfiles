import { defineInputs, input, workspace } from "@adrifer/winix";
import { adriferVision } from "./machines/adrifer-vision.ts";
import { macbookPro } from "./machines/macbook-pro.ts";
import { syncthing } from "./machines/syncthing-lxc.ts";
import { workDevbox } from "./machines/work-devbox.ts";

export default workspace({
  inputs: defineInputs({
    nixpkgs: "nixos-unstable",
    nixpkgsStable: input("github:NixOS/nixpkgs/nixos-26.05", {
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
    sonarctl: input("github:adrifer/sonarctl", {
      follows: { nixpkgs: "nixpkgs" },
    }),
  }),
  // One file per machine in machines/; each lists its roles (roles/) and extras.
  hosts: [
    ...adriferVision,
    ...workDevbox("work-devbox", "wsl-work"),
    ...workDevbox("work-devbox-2", "wsl-work-2"),
    macbookPro,
    syncthing,

  ],
});
