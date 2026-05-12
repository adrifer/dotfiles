{ config, inputs, ... }:

let
  system = "aarch64-darwin";
in
{
  flake.darwinConfigurations.macbook-pro = inputs.nix-darwin.lib.darwinSystem {
    inherit system;
    modules = [
      config.flake.darwinModules.profile-macos
      {
        networking.hostName = "macbook-pro";
        system.stateVersion = 6;
      }
    ];
  };
}
