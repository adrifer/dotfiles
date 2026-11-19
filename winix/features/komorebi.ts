import { feature } from "@adrifer/winix";

export const komorebi = feature("komorebi", ({ windows }) => {
  const komorebiPackage = windows.package("LGUG2Z.komorebi");
  const whkdPackage = windows.package("LGUG2Z.whkd");
  const link = (target: string, source: string) =>
    windows.file.symlink(windows.knownFolder.userProfile(target), `../windows/komorebi/${source}`);

  // Config handles used as startup arguments also order the shortcuts after them.
  const komorebiConfig = link("komorebi.json", "komorebi.json");
  const komorebiConfigLinks = [
    link("komorebi.bar.json", "komorebi.bar.json"),
    link("applications.json", "applications.json"),
  ];
  const whkdConfig = link(".config/whkdrc", ".config/whkdrc");
  const startWhkd = link(".config/komorebi/start-whkd.ps1", "start-whkd.ps1");

  windows.startup.command("komorebi", {
    executable: windows.knownFolder.programFiles("komorebi/bin/komorebic-no-console.exe"),
    arguments: ["start", "--bar", "--config", komorebiConfig],
    windowStyle: "minimized",
    dependsOn: [komorebiPackage, ...komorebiConfigLinks],
  });
  windows.startup.command("whkd", {
    // "pwsh.exe" is ambiguous (Program Files and the WindowsApps alias); use the real path.
    executable: windows.knownFolder.programFiles("PowerShell/7/pwsh.exe"),
    arguments: [
      "-NoLogo", "-NoProfile", "-NonInteractive", "-WindowStyle", "Hidden",
      "-File", startWhkd,
    ],
    windowStyle: "minimized",
    dependsOn: [whkdPackage, whkdConfig],
  });
});
