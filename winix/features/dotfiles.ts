import { escape, feature, ifDarwinAttrs } from "winix";

export const dotfiles = feature("dotfiles", () => ({
  home: {
    xdg: {
      configFile: escape(`let
        dotfiles = "\${config.home.homeDirectory}/dotfiles";
        createSymlink = path: config.lib.file.mkOutOfStoreSymlink path;
        configs = {
          nvim = "nvim";
          eza = "eza";
          lazygit = "lazygit";
          yazi = "yazi";
        } // ${ifDarwinAttrs({ ghostty: "ghostty" }).expr};
      in
      builtins.mapAttrs (name: subpath: {
        source = createSymlink "\${dotfiles}/\${subpath}/.config/\${subpath}";
        recursive = true;
      }) configs`),
    },
  },
}));
