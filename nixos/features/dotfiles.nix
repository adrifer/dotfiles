{ ... }:

{
  flake.homeModules.dotfiles =
    {
      config,
      lib,
      pkgs,
      ...
    }:
    let
      dotfiles = "${config.home.homeDirectory}/dotfiles";
      createSymlink = path: config.lib.file.mkOutOfStoreSymlink path;
      configs = {
        nvim = "nvim";
        eza = "eza";
        lazygit = "lazygit";
        yazi = "yazi";
      } // lib.optionalAttrs pkgs.stdenv.isDarwin {
        ghostty = "ghostty";
      };
    in
    {
      xdg.configFile = builtins.mapAttrs (name: subpath: {
        source = createSymlink "${dotfiles}/${subpath}/.config/${subpath}";
        recursive = true;
      }) configs;
    };
}
