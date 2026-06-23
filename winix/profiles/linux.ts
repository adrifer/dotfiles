import { overlay, profile } from "@adrifer/winix";
import { nixGc } from "../features/nix-gc.ts";
import { packagesLinux } from "../features/packages.ts";
import { adrifer } from "../features/user-adrifer.ts";
import { homeBase } from "./home-base.ts";

export const linuxProfile = profile("linux-profile", [
  overlay.stable("nixpkgs-stable"),
  adrifer(),
  nixGc(),
  packagesLinux(),
  homeBase(),
]);
