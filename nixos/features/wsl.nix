{ ... }:

{
  flake.nixosModules.wsl-custom =
    { lib, pkgs, ... }:
    {
      wsl.enable = true;
      wsl.defaultUser = lib.mkDefault "adrifer";

      wsl.extraBin = with pkgs; [
        { src = "${coreutils}/bin/mkdir"; }
        { src = "${coreutils}/bin/cat"; }
        { src = "${coreutils}/bin/whoami"; }
        { src = "${coreutils}/bin/ls"; }
        { src = "${busybox}/bin/addgroup"; }
        { src = "${su}/bin/groupadd"; }
        { src = "${su}/bin/usermod"; }
      ];

      wsl.wslConf.interop = {
        enabled = true;
        appendWindowsPath = false;
      };

      wsl.interop.register = true;

      environment.systemPackages = with pkgs; [ wl-clipboard ];

      programs.nix-ld.enable = true;
      programs.nix-ld.libraries = with pkgs; [
        icu
        zlib
        openssl
      ];

      environment.interactiveShellInit = ''
        # Derive Windows username from WSL home (no cmd.exe needed)
        win_home="$(wslpath -w "$HOME")"
        win_home_slash="''${win_home//\\//}"
        win_user="''${win_home_slash##*/}"

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
    };

  flake.homeModules.wsl =
    { pkgs, ... }:
    let
      git-credential-manager-windows = pkgs.writeShellScriptBin "git-credential-manager-windows" ''
        "/mnt/c/Program Files/Git/mingw64/bin/git-credential-manager.exe" "$@"
      '';
    in
    {
      home.packages = with pkgs; [
        stable.wslu
      ];

      programs.git.settings.credential.helper =
        "${git-credential-manager-windows}/bin/git-credential-manager-windows";

      programs.zsh.initContent = ''
        export BROWSER=wslview

        keep_current_path() {
          printf "\e]9;9;%s\e\\" "$(wslpath -w "$PWD")"
        }
        precmd_functions+=(keep_current_path)
      '';
    };
}
