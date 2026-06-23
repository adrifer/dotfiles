import { feature, home, platforms } from "@adrifer/winix";

const dotfile = (name: string) =>
  home.symlink(`~/dotfiles/${name}/.config/${name}`, { recursive: true });

export const dotfiles = feature("dotfiles", () =>
  home.configFiles({
    nvim: dotfile("nvim"),
    eza: dotfile("eza"),
    hunk: dotfile("hunk"),
    lazygit: dotfile("lazygit"),
    yazi: dotfile("yazi"),
    ...(platforms.darwin.isActive && { ghostty: dotfile("ghostty") }),
  })
);
