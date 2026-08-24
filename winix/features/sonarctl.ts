import { feature, nix } from "@adrifer/winix";

const windowsInstallDir = "/mnt/c/Tools/sonarctl";

export const sonarctl = feature("sonarctl", ({ home }) => {
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
