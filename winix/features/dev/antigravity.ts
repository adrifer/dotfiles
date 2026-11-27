import { feature } from "@adrifer/winix";

/** Google Antigravity CLI (`agy`): WinGet on Windows, nixpkgs on Linux/macOS. */
export const antigravityCli = feature("antigravity-cli", ({ home, windows }) => {
  windows.package("Google.AntigravityCLI");
  home.packages("antigravity-cli");
});
