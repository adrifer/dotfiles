{ config, ... }:

{
  flake.homeModules.profile-home-base = {
    imports = [
      config.flake.homeModules.packages
      config.flake.homeModules.javascript
      config.flake.homeModules.neovim
      config.flake.homeModules.dotfiles
      config.flake.homeModules.zsh
      config.flake.homeModules.starship
      config.flake.homeModules.fzf
      config.flake.homeModules.zoxide
      config.flake.homeModules.git
    ];
  };
}
