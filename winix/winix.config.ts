import {
  defineInputs,
  host,
  input,
  platforms,
  workspace,
} from "@adrifer/winix";
import { syncthingLxc } from "./features/syncthing-lxc.ts";
import { linuxProfile } from "./profiles/linux.ts";
import { lxc } from "./features/lxc.ts";
import { macosProfile } from "./profiles/macos.ts";
import { wsl } from "./features/wsl.ts";
import { dotnet } from "./features/dotnet.ts";
import { rust } from "./features/rust.ts";
import { sonarctl } from "./features/sonarctl.ts";
import { docker } from "./features/docker.ts";
import { adrifer } from "./features/user-adrifer.ts";
import { windowsNixosWsl } from "./features/windows-nixos-wsl.ts";
import { windowsPersonal } from "./profiles/windows-personal.ts";
import { windowsWork } from "./profiles/windows-work.ts";
import { wslWork } from "./profiles/wsl-work.ts";

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
    trackagents: input("https://ai.adrifer.com/install/latest.tar.gz", {
      follows: { nixpkgs: "nixpkgs" },
    }),
  }),
  hosts: [
    host("ADRIFER-VISION", platforms.windows(), [
      windowsPersonal(),
      windowsNixosWsl("wsl"),
    ]),
    host("work-devbox", platforms.windows(), [
      windowsWork(),
      windowsNixosWsl("wsl-work"),
    ]),
    host("work-devbox-2", platforms.windows(), [
      windowsWork(),
      windowsNixosWsl("wsl-work-2"),
    ]),
    host("wsl", platforms.nixos({ stateVersion: "25.05" }), ({ home }) => {
      home.packages("ffmpeg-full");

      return [
        linuxProfile(),
        wsl(),
        dotnet(),
        rust(),
        sonarctl(),
        docker(adrifer),
      ];
    }),
    host(
      "wsl-work",
      platforms.nixos({ stateVersion: "25.05" }),
      [wslWork()],
    ),
    host(
      "wsl-work-2",
      platforms.nixos({ stateVersion: "25.05" }),
      [wslWork()],
    ),
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
