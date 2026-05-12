{ ... }:

{
  flake.darwinModules.macos-custom =
    { pkgs, ... }:
    {
      programs.zsh.enable = true;

      environment.shells = [
        pkgs.zsh
      ];

      users.users.adrifer = {
        home = "/Users/adrifer";
        shell = pkgs.zsh;
      };

      nix.gc = {
        automatic = true;
        interval = {
          Weekday = 0;
          Hour = 3;
          Minute = 15;
        };
        options = "--delete-older-than 7d";
      };
    };
}
