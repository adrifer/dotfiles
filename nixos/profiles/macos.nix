{ config, inputs, ... }:

let
  system = "aarch64-darwin";
in
{
  flake.darwinModules.profile-macos =
    { ... }:
    {
      imports = [
        inputs.home-manager.darwinModules.home-manager
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
        config.flake.homeModules.profile-home-base
      ];
    };
}
