import { feature, home, nix, platforms } from "winix";

const dotfile = (name: string) => ({
  source: nix.expr(
    `config.lib.file.mkOutOfStoreSymlink "\${config.home.homeDirectory}/dotfiles/${name}/.config/${name}"`
  ),
  recursive: true,
});

export const dotfiles = feature("dotfiles", () => ({
  ...home.configFiles({
    nvim: dotfile("nvim"),
    eza: dotfile("eza"),
    lazygit: dotfile("lazygit"),
    yazi: dotfile("yazi"),
    ...(platforms.darwin.isActive && { ghostty: dotfile("ghostty") }),
  }),
}));
