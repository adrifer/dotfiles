{ config, inputs, ... }:

let
  system = "x86_64-linux";
in
{
  flake.nixosModules.profile-linux =
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
        config.flake.homeModules.user-adrifer-linux
        config.flake.homeModules.packages-linux
        config.flake.homeModules.profile-home-base
      ];
    };
}
