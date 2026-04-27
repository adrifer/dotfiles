{ config, inputs, ... }:

let
  system = "x86_64-linux";
in
{
  flake.nixosModules.profile-base =
    { ... }:
    {
      imports = [
        inputs.home-manager.nixosModules.home-manager
        config.flake.nixosModules.user-adrifer
        config.flake.nixosModules."nix-gc"
      ];

      nixpkgs = {
        overlays = [ config.flake.overlays.stable ];
        config.allowUnfree = true;
        hostPlatform = system;
      };

      nix.settings.experimental-features = [
        "nix-command"
        "flakes"
      ];

      home-manager.useGlobalPkgs = true;
      home-manager.useUserPackages = true;
      home-manager.users.adrifer.imports = [
        config.flake.homeModules.user-adrifer
        config.flake.homeModules.packages
        config.flake.homeModules.javascript
        config.flake.homeModules.dotnet
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
