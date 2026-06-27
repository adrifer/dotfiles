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
import { azureDevCli } from "./features/azure-dev-cli.ts";

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
    homeManagerStable: input(
      "github:nix-community/home-manager/release-26.05",
      {
        nixName: "home-manager-stable",
        follows: { nixpkgs: "nixpkgs-stable" },
      },
    ),
    hunk: input("github:modem-dev/hunk", {
      follows: { nixpkgs: "nixpkgs" },
    }),
  }),
  hosts: [
    host("ADRIFER-VISION", platforms.windows(), ({ windows }) => {
      windows.package("Neovim.Neovim");
      windows.env.set("EDITOR", "nvim");
    }),
    host("wsl", platforms.nixos({ stateVersion: "25.05" }), [
      linuxProfile(),
      wsl(),
      dotnet(),
    ]),
    host("wsl-work", platforms.nixos({ stateVersion: "25.05" }), ({ home, nixos }) => {
      nixos.sysctl({
        "net.ipv4.ip_unprivileged_port_start": 443,
        "fs.inotify.max_user_watches": 1048576,
        "fs.inotify.max_user_instances": 1024,
        "fs.inotify.max_queued_events": 65536,
      });
      home.packages("socat", "bubblewrap");

      return [linuxProfile(), wsl(), azureDevCli()];
    }),
    host("macbook-pro", platforms.darwin({ stateVersion: 6, homebrew: true }), [
      macosProfile(),
    ]),
    host("syncthing-lxc", platforms.nixos({ stateVersion: "25.05", homeManager: false }),
      [lxc(), syncthingLxc()],
    ),
  ],
});
