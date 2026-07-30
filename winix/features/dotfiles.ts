import { feature, type HomeHelper } from "@adrifer/winix";

const dotfile = (home: HomeHelper, name: string) =>
  home.symlink(`~/dotfiles/${name}/.config/${name}`, { recursive: true });

const skills = (home: HomeHelper, ...names: string[]) =>
  Object.fromEntries(
    names.map((name) => [
      `.agents/skills/${name}`,
      home.symlink(`~/dotfiles/skills/${name}`, { recursive: true }),
    ]),
  );

export const dotfiles = feature("dotfiles", ({ home, platforms }) => {
  home.files(skills(home, "tuicr"));

  home.configFiles({
    nvim: dotfile(home, "nvim"),
    btop: dotfile(home, "btop"),
    eza: dotfile(home, "eza"),
    "herdr/config.toml": home.symlink(
      "~/dotfiles/herdr/.config/herdr/config.toml",
      { force: true },
    ),
    lazygit: dotfile(home, "lazygit"),
    tuicr: dotfile(home, "tuicr"),
    yazi: dotfile(home, "yazi"),
    ...(platforms.darwin.isActive && { ghostty: dotfile(home, "ghostty") }),
  });
});
