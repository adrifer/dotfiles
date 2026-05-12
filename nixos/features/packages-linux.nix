{ ... }:

{
  flake.homeModules.packages-linux =
    { pkgs, ... }:
    {
      home.packages = with pkgs; [
        azure-artifacts-credprovider
        gcc
      ];
    };
}
