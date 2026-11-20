import { feature } from "@adrifer/winix";

/**
 * VS Code Insiders on Windows and macOS. In WSL, `code-insiders` runs the
 * Windows one (see system/wsl.ts).
 */
export const vscode = feature("vscode", ({ windows, darwin }) => {
  // Insiders updates itself daily; only make sure it is installed.
  windows.package("Microsoft.VisualStudioCode.Insiders", { version: "any" });
  darwin.homebrew({ casks: ["visual-studio-code@insiders"] });
});
