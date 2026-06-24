import { feature, home, nix, nixos } from "@adrifer/winix";
import { playwright } from "./playwright.ts";

const bin = (packageName: string, executable: string) => ({
  src: nix.bin(packageName, executable),
});

export const wsl = feature("wsl", () => [
  nixos.imports("inputs.nixos-wsl.nixosModules.wsl"),
  nixos({
    wsl: {
      enable: true,
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
        bin("coreutils", "uname"),
        bin("coreutils", "ls"),
        bin("busybox", "addgroup"),
        bin("su", "groupadd"),
        bin("su", "usermod"),
      ],
    },
  }),
  nixos.environment({
    interactiveShellInit: nix.script(`
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
  }),
  nixos.packages("wl-clipboard"),
  nixos.program("nix-ld", {
    libraries: nix.withPkgs(["icu", "zlib", "openssl"]),
  }),
  home.packages("wsl-open"),
  home.program("git", {
    settings: {
      credential: {
        helper: nix.str`${nix.expr(`pkgs.writeShellScriptBin "git-credential-manager-windows" ''
          "/mnt/c/Program Files/Git/mingw64/bin/git-credential-manager.exe" "$@"
        ''`)}/bin/git-credential-manager-windows`,
      },
    },
  }),
  playwright(),
]);
