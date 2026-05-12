{ config, inputs, ... }:

let
  system = "aarch64-darwin";
in
{
  flake.darwinModules.profile-macos =
    { ... }:
    {
      imports = [
        inputs.nix-homebrew.darwinModules.nix-homebrew
        inputs.home-manager.darwinModules.home-manager
        config.flake.darwinModules.homebrew
        config.flake.darwinModules.macos-custom
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
        config.flake.homeModules.user-adrifer-macos
        config.flake.homeModules.packages-macos
        config.flake.homeModules.git-credential-manager
        config.flake.homeModules.profile-home-base
      ];
    };
}
