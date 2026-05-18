import { gitCredentialManager } from "../features/git-credential-manager.ts";
import { homebrew } from "../features/homebrew.ts";
import { macos } from "../features/macos.ts";
import { packagesMacos } from "../features/packages.ts";
import { homeUser } from "../features/user-adrifer.ts";
import { homeBase } from "./home-base.ts";

export const macosProfile = [
  homebrew(),
  macos(),
  homeUser("/Users/adrifer"),
  packagesMacos(),
  gitCredentialManager(),
  ...homeBase,
];
