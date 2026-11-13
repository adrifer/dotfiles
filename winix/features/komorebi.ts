import { feature } from "@adrifer/winix";

export const komorebi = feature("komorebi", ({ windows }) => {
  const komorebiPackage = windows.package("LGUG2Z.komorebi");
  const whkdPackage = windows.package("LGUG2Z.whkd");
  const komorebiConfigLinks = [
    windows.file.symlink(
      windows.knownFolder.userProfile("komorebi.json"),
      "../windows/komorebi/komorebi.json",
      { backup: true },
    ),
    windows.file.symlink(
      windows.knownFolder.userProfile("komorebi.bar.json"),
      "../windows/komorebi/komorebi.bar.json",
      { backup: true },
    ),
    windows.file.symlink(
      windows.knownFolder.userProfile("applications.json"),
      "../windows/komorebi/applications.json",
      { backup: true },
    ),
  ];
  const whkdConfigLinks = [
    windows.file.symlink(
      windows.knownFolder.userProfile(".config/whkdrc"),
      "../windows/komorebi/.config/whkdrc",
      { backup: true },
    ),
    windows.file.symlink(
      windows.knownFolder.userProfile(".config/komorebi/start-whkd.ps1"),
      "../windows/komorebi/start-whkd.ps1",
      { backup: true },
    ),
  ];

  windows.startup.command("komorebi", {
    executable: "%ProgramFiles%/komorebi/bin/komorebic-no-console.exe",
    arguments: ["start", "--bar", "--config", windows.knownFolder.userProfile("komorebi.json")],
    windowStyle: "minimized",
    backup: true,
    dependsOn: [komorebiPackage, ...komorebiConfigLinks],
  });
  windows.startup.command("whkd", {
    executable: "pwsh.exe",
    arguments: [
      "-NoLogo", "-NoProfile", "-NonInteractive", "-WindowStyle", "Hidden",
      "-File", windows.knownFolder.userProfile(".config/komorebi/start-whkd.ps1"),
    ],
    windowStyle: "minimized",
    backup: true,
    dependsOn: [whkdPackage, ...whkdConfigLinks],
  });
});
