{ ... }:

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

  flake.homeModules.user-adrifer =
    { ... }:
    {
      home.username = "adrifer";
      home.homeDirectory = "/home/adrifer";
      home.stateVersion = "25.05";

      programs.home-manager.enable = true;
    };
}
