import { feature, mkDefault, pkg, raw } from "winix";
import { playwright } from "./playwright.ts";

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
      },
      environment: {
        systemPackages: ["wl-clipboard"],
      },
      programs: {
        "nix-ld": {
          enable: true,
        },
      },
    },
    home: {
      packages: [pkg("stable.wslu")],
    },
  },
  raw.nixos(`
    wsl.extraBin = with pkgs; [
      { src = "\${coreutils}/bin/mkdir"; }
      { src = "\${coreutils}/bin/cat"; }
      { src = "\${coreutils}/bin/whoami"; }
      { src = "\${coreutils}/bin/ls"; }
      { src = "\${busybox}/bin/addgroup"; }
      { src = "\${su}/bin/groupadd"; }
      { src = "\${su}/bin/usermod"; }
    ];

    programs.nix-ld.libraries = with pkgs; [
      icu
      zlib
      openssl
    ];

    environment.interactiveShellInit = ''
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
    '';
  `),
  raw.home(`
    programs.git.settings.credential.helper =
      "\${pkgs.writeShellScriptBin "git-credential-manager-windows" ''
        "/mnt/c/Program Files/Git/mingw64/bin/git-credential-manager.exe" "$@"
      ''}/bin/git-credential-manager-windows";
  `),
  playwright(),
]);
