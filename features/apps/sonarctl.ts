import { feature, nix } from "@adrifer/winix";

const windowsInstallDir = "/mnt/c/Tools/sonarctl";

/**
 * sonarctl: the Windows app, plus `sonar` in WSL, which runs the Windows build
 * this flake input produces (installed to C:\Tools\sonarctl).
 */
export const sonarctl = feature("sonarctl", ({ home, windows, platforms }) => {
  windows.package("Adrifer.Sonarctl");

  if (!platforms.wsl.isActive) return;
  home.files({
    ".local/bin/sonar": {
      executable: true,
      force: true,
      text: nix.script(`#!/usr/bin/env bash
      exec "${windowsInstallDir}/sonarctl.exe" "$@"
      `),
    },
  });
  home.activation("installSonarctl", {
    script: `
      \${pkgs.coreutils}/bin/install -Dm0755 \
        "\${inputs.sonarctl.packages.x86_64-linux.default}/bin/sonarctl.exe" \
        "${windowsInstallDir}/sonarctl.exe"
    `,
  });
});
