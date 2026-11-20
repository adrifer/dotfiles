import { feature } from "@adrifer/winix";

export const komorebi = feature("komorebi", ({ windows }) => {
  const komorebiPackage = windows.package("LGUG2Z.komorebi");
  const whkdPackage = windows.package("LGUG2Z.whkd");
  const link = (target: string, source: string) =>
    windows.file.symlink(windows.knownFolder.userProfile(target), `../windows/komorebi/${source}`);

  // Config handles used as startup arguments also order the startup apps after them.
  const komorebiConfig = link("komorebi.json", "komorebi.json");
  const komorebiConfigLinks = [
    link("komorebi.bar.json", "komorebi.bar.json"),
    link("applications.json", "applications.json"),
  ];
  const whkdConfig = link(".config/whkdrc", ".config/whkdrc");
  const startWhkd = link(".config/komorebi/start-whkd.ps1", "start-whkd.ps1");

  // Logon tasks: they start right after sign-in instead of after every other
  // startup entry, like the Startup folder.
  windows.startup.app("komorebi", {
    // A GUI-subsystem launcher: no window to style.
    executable: windows.knownFolder.programFiles("komorebi/bin/komorebic-no-console.exe"),
    arguments: ["start", "--bar", "--config", komorebiConfig],
    dependsOn: [komorebiPackage, ...komorebiConfigLinks],
  });
  windows.startup.app("whkd", {
    // "pwsh.exe" is ambiguous (Program Files and the WindowsApps alias); use the real path.
    executable: windows.knownFolder.programFiles("PowerShell/7/pwsh.exe"),
    arguments: [
      "-NoLogo", "-NoProfile", "-NonInteractive", "-File", startWhkd,
    ],
    // No console window at all (pwsh -WindowStyle Hidden still flashes one).
    windowStyle: "hidden",
    dependsOn: [whkdPackage, whkdConfig],
  });
});
