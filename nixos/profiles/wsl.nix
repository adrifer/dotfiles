{ config, inputs, ... }:

{
  flake.nixosModules.profile-wsl =
    { ... }:
    {
      imports = [
        inputs.nixos-wsl.nixosModules.wsl
        config.flake.nixosModules.wsl-custom
      ];

      home-manager.users.adrifer.imports = [
        config.flake.homeModules.wsl
        config.flake.homeModules.playwright
      ];
    };
}
