{ ... }:

{
  flake.darwinModules.homebrew =
    { ... }:
    {
      nix-homebrew = {
        enable = true;
        user = "adrifer";
        autoMigrate = true;
      };

      homebrew = {
        enable = true;
        casks = [
          "scroll-reverser"
        ];
      };
    };
}
