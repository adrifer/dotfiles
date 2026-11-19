import { feature } from "@adrifer/winix";

/**
 * Windows Terminal Preview. settings.json is linked, so changes made in the
 * Settings UI (and profiles Terminal generates, e.g. from ~/.ssh/config) land
 * in the repository.
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
