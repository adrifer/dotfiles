import { feature } from "@adrifer/winix";

/**
 * winget's own settings: prefer per-user installers. Personal machines only;
 * managed machines may block executables outside Program Files.
 *
 * Upgrades keep the scope a package was installed with, so a machine-wide
 * install moves to user scope only after uninstalling it once (elevated).
 */
export const winget = feature("winget", ({ windows }) => {
  windows.file.symlink(
    windows.knownFolder.localAppData(
      "Packages\\Microsoft.DesktopAppInstaller_8wekyb3d8bbwe\\LocalState\\settings.json",
    ),
    "./config/winget/settings.json",
  );
});
