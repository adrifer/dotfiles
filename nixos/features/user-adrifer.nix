{ ... }:

let
  homeModule =
    homeDirectory:
    { ... }:
    {
      home.username = "adrifer";
      home.homeDirectory = homeDirectory;
      home.stateVersion = "25.05";

      programs.home-manager.enable = true;
    };
in
{
  flake.nixosModules.user-adrifer =
    { pkgs, ... }:
    {
      programs.zsh.enable = true;

      users.users.adrifer = {
        isNormalUser = true;
        extraGroups = [ "wheel" ];
        uid = 1000;
      };

      users.defaultUserShell = pkgs.zsh;
    };

  flake.homeModules.user-adrifer = homeModule "/home/adrifer";
  flake.homeModules.user-adrifer-linux = homeModule "/home/adrifer";
  flake.homeModules.user-adrifer-macos = homeModule "/Users/adrifer";
}
