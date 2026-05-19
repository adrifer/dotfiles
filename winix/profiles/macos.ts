import { account, overlay, profile } from "winix";
import { gitCredentialManager } from "../features/git-credential-manager.ts";
import { homebrew } from "../features/homebrew.ts";
import { macos } from "../features/macos.ts";
import { packagesMacos } from "../features/packages.ts";
import { homeBase } from "./home-base.ts";

export const macosProfile = profile("macos-profile", [
  overlay.stable("nixpkgs-stable"),
  homebrew(),
  macos(),
  account("adrifer", { shell: "zsh", stateVersion: "25.05" }),
  packagesMacos(),
  gitCredentialManager(),
  homeBase(),
]);
