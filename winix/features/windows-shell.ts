import { feature } from "@adrifer/winix";

/** Everyday Windows developer tools that have no feature of their own yet. */
export const windowsShell = feature("windows-shell", ({ windows }) => {
  windows.package("Git.Git");
  windows.package("GitHub.cli");
  windows.package("Microsoft.VisualStudioCode.Insiders");
});
