import { escape, feature, mkDefault, nixStr, pkg, script, withPkgs } from "winix";
import { playwright } from "./playwright.ts";

const bin = (packageName: string, executable: string) => ({
  src: nixStr`${pkg(packageName)}/bin/${executable}`,
});

export const wsl = feature("wsl", () => [
  {
    nixos: {
      imports: ["nixos-wsl"],
      wsl: {
        enable: true,
        defaultUser: mkDefault("adrifer"),
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
          bin("coreutils", "whoami"),
          bin("coreutils", "ls"),
          bin("busybox", "addgroup"),
          bin("su", "groupadd"),
          bin("su", "usermod"),
        ],
      },
      environment: {
        systemPackages: ["wl-clipboard"],
        interactiveShellInit: script(`
          # Derive Windows username from WSL home (no cmd.exe needed)
          win_home="$(wslpath -w "$HOME")"
          win_home_slash="''\${win_home//\\\\//}"
          win_user="''\${win_home_slash##*/}"

          hardcoded_bin="/mnt/c/Users/track/AppData/Local/Programs/Microsoft VS Code Insiders/bin"
          user_bin="/mnt/c/Users/$win_user/AppData/Local/Programs/Microsoft VS Code Insiders/bin"

          for d in "$hardcoded_bin" "$user_bin"; do
            if [ -d "$d" ]; then
              case ":$PATH:" in
                *":$d:"*) ;;
                *) PATH="$PATH:$d" ;;
              esac
            fi
          done

          export PATH
        `),
      },
      programs: {
        "nix-ld": {
          enable: true,
          libraries: withPkgs(["icu", "zlib", "openssl"]),
        },
      },
    },
    home: {
      packages: [pkg("stable.wslu")],
      programs: {
        git: {
          settings: {
            credential: {
              helper: nixStr`${escape(`pkgs.writeShellScriptBin "git-credential-manager-windows" ''
                "/mnt/c/Program Files/Git/mingw64/bin/git-credential-manager.exe" "$@"
              ''`)}/bin/git-credential-manager-windows`,
            },
          },
        },
      },
    },
  },
  playwright(),
]);
