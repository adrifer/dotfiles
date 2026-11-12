import { feature, type WindowsHelper } from "@adrifer/winix";
import { windowsKomorebiPackage, windowsWhkdPackage } from "./packages.ts";

export const windowsWindowManager = feature("windows-window-manager", ({ windows }, developerMode: ReturnType<WindowsHelper["setting"]>) => {
  const configLinks = [
    windows.file.symlink(
      windows.knownFolder.userProfile("komorebi.json"),
      "../windows/komorebi/komorebi.json",
      { backup: true, dependsOn: developerMode },
    ),
    windows.file.symlink(
      windows.knownFolder.userProfile("komorebi.bar.json"),
      "../windows/komorebi/komorebi.bar.json",
      { backup: true, dependsOn: developerMode },
    ),
    windows.file.symlink(
      windows.knownFolder.userProfile("applications.json"),
      "../windows/komorebi/applications.json",
      { backup: true, dependsOn: developerMode },
    ),
    windows.file.symlink(
      windows.knownFolder.userProfile(".config/whkdrc"),
      "../windows/komorebi/.config/whkdrc",
      { backup: true, dependsOn: developerMode },
    ),
    windows.file.symlink(
      windows.knownFolder.userProfile(".config/komorebi/start-whkd.ps1"),
      "../windows/komorebi/start-whkd.ps1",
      { backup: true, dependsOn: developerMode },
    ),
  ];

  windows.startup.command("komorebi", {
    executable: "%ProgramFiles%/komorebi/bin/komorebic-no-console.exe",
    arguments: ["start", "--bar", "--config", windows.knownFolder.userProfile("komorebi.json")],
    windowStyle: "minimized",
    backup: true,
    dependsOn: [windowsKomorebiPackage, ...configLinks],
  });
  windows.startup.command("whkd", {
    executable: "pwsh.exe",
    arguments: [
      "-NoLogo", "-NoProfile", "-NonInteractive", "-WindowStyle", "Hidden",
      "-File", windows.knownFolder.userProfile(".config/komorebi/start-whkd.ps1"),
    ],
    windowStyle: "minimized",
    backup: true,
    dependsOn: [windowsWhkdPackage, ...configLinks],
  });
});
