import { account, overlay, profile } from "winix";
import { nixGc } from "../features/nix-gc.ts";
import { packagesLinux } from "../features/packages.ts";
import { homeBase } from "./home-base.ts";

export const linuxProfile = profile("linux-profile", [
  overlay.stable("nixpkgs-stable"),
  account("adrifer", { admin: true, shell: "zsh", stateVersion: "25.05", wslDefault: true }),
  nixGc(),
  packagesLinux(),
  homeBase(),
]);
