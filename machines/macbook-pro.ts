import { host, platforms } from "@adrifer/winix";
import { dev } from "../roles/dev.ts";
import { everywhere } from "../roles/everywhere.ts";
import { macosSystem } from "../roles/macos-system.ts";

/** MacBook Pro (nix-darwin with Homebrew). */
export const macbookPro = host("macbook-pro", platforms.darwin({ stateVersion: 6, homebrew: true }), [
  everywhere(),
  dev(),
  macosSystem(),
]);
