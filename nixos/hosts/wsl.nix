{ config, inputs, ... }:

let
  system = "x86_64-linux";
in
{
  flake.nixosConfigurations.wsl = inputs.nixpkgs.lib.nixosSystem {
    inherit system;
    modules = [
      config.flake.nixosModules.profile-base
      config.flake.nixosModules.profile-wsl
      {
        networking.hostName = "wsl";
        system.stateVersion = "25.05";
      }
    ];
  };
}
