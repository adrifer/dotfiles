import { feature, type HomeHelper } from "@adrifer/winix";

const dotfile = (home: HomeHelper, name: string) =>
  home.symlink(`../${name}/.config/${name}`, { recursive: true });

export const dotfiles = feature("dotfiles", ({ home, platforms }) => {
  home.configFiles({
    nvim: dotfile(home, "nvim"),
    btop: dotfile(home, "btop"),
    eza: dotfile(home, "eza"),
    "herdr/config.toml": home.symlink(
      "../herdr/.config/herdr/config.toml",
      { force: true },
    ),
    yazi: dotfile(home, "yazi"),
    ...(platforms.darwin.isActive && { ghostty: dotfile(home, "ghostty") }),
  });
});
