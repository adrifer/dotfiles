import { overlay } from "winix";
import { nixGc } from "../features/nix-gc.ts";
import { packagesLinux } from "../features/packages.ts";
import { homeUser, userAdrifer } from "../features/user-adrifer.ts";
import { homeBase } from "./home-base.ts";

export const linuxProfile = [
  overlay.stable("nixpkgs-stable"),
  userAdrifer(),
  nixGc(),
  homeUser("/home/adrifer"),
  packagesLinux(),
  ...homeBase,
];
