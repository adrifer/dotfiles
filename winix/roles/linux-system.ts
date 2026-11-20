import { overlay, profile } from "@adrifer/winix";
import { linuxTools } from "../features/system/linux-tools.ts";
import { nixGc } from "../features/system/nix-gc.ts";
import { adrifer } from "../features/system/user-adrifer.ts";

/** NixOS basics (including NixOS-WSL): my account, stable packages, weekly Nix GC. */
export const linuxSystem = profile("linux-system", [
  overlay.stable("nixpkgs-stable"),
  adrifer(),
  nixGc(),
  linuxTools(),
]);
