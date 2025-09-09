{ config, pkgs, ... }:

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
  ];

  home.stateVersion = "25.05";
}
