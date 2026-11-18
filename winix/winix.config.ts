import {
  defineInputs,
  host,
  input,
  platforms,
  workspace,
} from "@adrifer/winix";
import { lxc } from "./features/lxc.ts";
import { syncthingLxc } from "./features/syncthing-lxc.ts";
import { adriferVision } from "./hosts/adrifer-vision.ts";
import { workDevbox } from "./hosts/work-devbox.ts";
import { macosProfile } from "./profiles/macos.ts";

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
  hosts: [
    ...adriferVision,
    ...workDevbox("work-devbox", "wsl-work"),
    ...workDevbox("work-devbox-2", "wsl-work-2"),
    host("macbook-pro", platforms.darwin({ stateVersion: 6, homebrew: true }), [
      macosProfile(),
    ]),
    host(
      "syncthing-lxc",
      platforms.nixos({ stateVersion: "25.05", homeManager: false }),
      [lxc(), syncthingLxc()],
    ),
  ],
});
