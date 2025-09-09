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

  home-manager.users.adrifer.programs.git.extraConfig = {
    credential.helper = "/mnt/c/Program\\ Files/Git/mingw64/bin/git-credential-manager.exe";
  };

  # You can put WSL niceties here later (interop, automount, etc.)
  # Example:
  # wsl.wslConf.automount.root = "/mnt";
}
