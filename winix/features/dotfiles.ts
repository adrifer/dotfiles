import { feature, type HomeHelper } from "@adrifer/winix";

const dotfile = (home: HomeHelper, name: string) =>
  home.symlink(`~/dotfiles/${name}/.config/${name}`, { recursive: true });

export const dotfiles = feature("dotfiles", ({ home, platforms }) => {
  home.configFiles({
    nvim: dotfile(home, "nvim"),
    eza: dotfile(home, "eza"),
    hunk: dotfile(home, "hunk"),
    lazygit: dotfile(home, "lazygit"),
    yazi: dotfile(home, "yazi"),
    ...(platforms.darwin.isActive && { ghostty: dotfile(home, "ghostty") }),
  });
});
