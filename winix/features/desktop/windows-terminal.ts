import { feature } from "@adrifer/winix";

/**
 * Windows Terminal Preview. settings.json is linked, so changes made in the
 * Settings UI land in the repository; it is kept in Terminal's own formatting
 * (Terminal rewrites the whole file and drops comments on every save).
 *
 * Profiles Terminal generates (SSH hosts from ~/.ssh/config, Visual Studio
 * prompts) need an entry in settings.json: Terminal treats a generated profile
 * missing from the file as deleted and does not bring it back. Hide unwanted
 * ones with "hidden": true rather than removing them.
 */
export const windowsTerminal = feature("windows-terminal", ({ windows }) => {
  const terminal = windows.package("Microsoft.WindowsTerminal.Preview");
  const font = windows.package("DEVCOM.JetBrainsMonoNerdFont");
  const nixosIcon = windows.file.copy(
    windows.knownFolder.localAppData("Winix\\Terminal\\nixos.ico"),
    "../windows/terminal-preview/nixos.ico",
  );
  windows.terminal.settings("../windows/terminal-preview/settings.json", {
    channel: "preview",
    dependsOn: [terminal, font, nixosIcon],
  });
});
