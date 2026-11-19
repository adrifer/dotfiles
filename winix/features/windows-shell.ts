import { feature } from "@adrifer/winix";

/** Everyday Windows developer tools that have no feature of their own yet. */
export const windowsShell = feature("windows-shell", ({ windows }) => {
  windows.package("Git.Git");
  windows.package("GitHub.cli");
  // Insiders updates itself daily; only make sure it is installed.
  windows.package("Microsoft.VisualStudioCode.Insiders", { version: "any" });
});
