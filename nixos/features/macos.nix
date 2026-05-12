{ ... }:

{
  flake.darwinModules.macos-custom =
    { pkgs, ... }:
    {
      programs.zsh.enable = true;

      nix.enable = false;

      security.pam.services.sudo_local.touchIdAuth = true;

      home-manager.users.adrifer.manual.manpages.enable = false;

      environment.shells = [
        pkgs.zsh
      ];

      users.users.adrifer = {
        home = "/Users/adrifer";
        shell = pkgs.zsh;
      };
    };
}
