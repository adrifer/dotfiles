import { overlay, profile } from "@adrifer/winix";
import { homebrew } from "../features/desktop/homebrew.ts";
import { macos } from "../features/desktop/macos.ts";
import { gitCredentialManager } from "../features/system/git-credential-manager.ts";
import { adrifer } from "../features/system/user-adrifer.ts";

/** macOS basics: my account, stable packages, Homebrew, macOS settings and Git Credential Manager. */
export const macosSystem = profile("macos-system", [
  overlay.stable("nixpkgs-stable"),
  homebrew(),
  macos(),
  adrifer(),
  gitCredentialManager(),
]);
