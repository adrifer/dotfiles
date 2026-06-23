import { overlay, profile } from "@adrifer/winix";
import { gitCredentialManager } from "../features/git-credential-manager.ts";
import { homebrew } from "../features/homebrew.ts";
import { macos } from "../features/macos.ts";
import { packagesMacos } from "../features/packages.ts";
import { adrifer } from "../features/user-adrifer.ts";
import { homeBase } from "./home-base.ts";

export const macosProfile = profile("macos-profile", [
  overlay.stable("nixpkgs-stable"),
  homebrew(),
  macos(),
  adrifer(),
  packagesMacos(),
  gitCredentialManager(),
  homeBase(),
]);
