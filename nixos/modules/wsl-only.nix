{ lib, pkgs, ... }:
{
  wsl.enable = true;
  wsl.defaultUser = lib.mkDefault "adrifer";

  wsl.wslConf.interop = {
    enabled = true;
    appendWindowsPath = false; # ⬅️ don't import Windows PATH into WSL
  };

  environment.systemPackages = with pkgs; [ wl-clipboard ];

  # Workaround for WSL NixOS vscode remote
  programs.nix-ld.enable = true;
  programs.nix-ld.libraries = with pkgs; [
    icu
    zlib
    openssl
  ];
  home-manager.users.adrifer.programs.git.extraConfig = {
    credential.helper = "/mnt/c/Program\\ Files/Git/mingw64/bin/git-credential-manager.exe";
  };

  environment.interactiveShellInit = ''
    # Derive Windows username from WSL home (no cmd.exe needed)
    win_home="$(wslpath -w "$HOME")"            # e.g. C:\Users\Adrian
    win_home_slash="''${win_home//\\//}"        # => C:/Users/Adrian
    win_user="''${win_home_slash##*/}"          # => Adrian

    hardcoded_bin="/mnt/c/Users/track/AppData/Local/Programs/Microsoft VS Code Insiders/bin"
    user_bin="/mnt/c/Users/$win_user/AppData/Local/Programs/Microsoft VS Code Insiders/bin"

    for d in "$hardcoded_bin" "$user_bin"; do
      if [ -d "$d" ]; then
        case ":$PATH:" in
          *":$d:"*) ;;                      # already present
          *) PATH="$PATH:$d" ;;
        esac
      fi
    done

    export PATH
  '';

  # You can put WSL niceties here later (interop, automount, etc.)
  # Example:
  # wsl.wslConf.automount.root = "/mnt";
}
