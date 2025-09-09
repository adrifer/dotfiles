{ lib, pkgs, ... }:
{
  wsl.enable = true;
  wsl.defaultUser = lib.mkDefault "adrifer";

  environment.systemPackages = with pkgs; [
    wl-clipboard
  ];

  # Workaround for WSL NixOS vscode remote
  programs.nix-ld.enable = true;

  # You can put WSL niceties here later (interop, automount, etc.)
  # Example:
  # wsl.wslConf.automount.root = "/mnt";
}

