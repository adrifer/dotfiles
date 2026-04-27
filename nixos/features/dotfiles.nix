{ ... }:

{
  flake.homeModules.dotfiles =
    { config, ... }:
    let
      dotfiles = "${config.home.homeDirectory}/dotfiles";
      createSymlink = path: config.lib.file.mkOutOfStoreSymlink path;
      configs = {
        nvim = "nvim";
        eza = "eza";
        lazygit = "lazygit";
        yazi = "yazi";
      };
    in
    {
      xdg.configFile = builtins.mapAttrs (name: subpath: {
        source = createSymlink "${dotfiles}/${subpath}/.config/${subpath}";
        recursive = true;
      }) configs;
    };
}
