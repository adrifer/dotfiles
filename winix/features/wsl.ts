import { feature, nix, profile } from "@adrifer/winix";
import { playwright } from "./playwright.ts";

const bin = (packageName: string, executable: string) => ({
  src: nix.bin(packageName, executable),
});

// Resolved through interop on each run, so the Windows user is never hard-coded.
const CODE_INSIDERS =
  "%LOCALAPPDATA%\\Programs\\Microsoft VS Code Insiders\\bin\\code-insiders";

const wslBase = feature("wsl-base", ({ home, nixos }) => {
  nixos({
    wsl: {
      wslConf: {
        interop: {
          enabled: true,
          appendWindowsPath: false,
        },
      },
      interop: {
        register: true,
      },
      extraBin: [
        bin("coreutils", "mkdir"),
        bin("coreutils", "cat"),
        bin("coreutils", "install"),
        bin("coreutils", "mktemp"),
        bin("coreutils", "rm"),
        bin("coreutils", "whoami"),
        bin("coreutils", "uname"),
        bin("coreutils", "ls"),
        bin("findutils", "find"),
        bin("gzip", "gzip"),
        bin("gnutar", "tar"),
        bin("busybox", "addgroup"),
        bin("su", "groupadd"),
        bin("su", "usermod"),
      ],
    },
  });
  nixos.packages("wl-clipboard");
  // For scripts with a #!/usr/bin/bash shebang.
  nixos.systemd.tmpfiles.link("/usr/bin/bash", "/run/current-system/sw/bin/bash");
  nixos.program("nix-ld", {
    libraries: [nix.pkg("icu"), nix.pkg("zlib"), nix.pkg("openssl")],
  });
  home.path(nix.homePath(".local/bin"));
  home.packages(
    "wsl-open",
    "pulseaudio",
    nix.wsl.windowsBin("code-insiders", CODE_INSIDERS),
  );
  home.program("bash", {
    profileExtra: nix.script(`
      copilotd() {
        SHELL=/bin/bash command copilotd "$@"
      }
    `),
  });
  home.wsl.gitCredentialManager();
});

export const wsl = profile("wsl", [wslBase(), playwright()]);
