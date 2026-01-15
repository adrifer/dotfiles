{ config, pkgs, lib, isWSL ? false, hostname ? "unknown", ... }:

{
  home.username = "adrifer";
  home.homeDirectory = "/home/adrifer";

  programs.home-manager.enable = true;

  imports = [
    ./packages.nix
    ./dotfiles.nix
    ./zsh.nix
    ./starship.nix
    ./fzf.nix
    ./zoxide.nix
    ./git.nix
  ] ++ lib.optionals isWSL [
    ./packages-wsl.nix
  ];

  home.stateVersion = "25.05";
}
