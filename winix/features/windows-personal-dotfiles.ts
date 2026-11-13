import { feature } from "@adrifer/winix";

export const windowsPersonalDotfiles = feature("windows-personal-dotfiles", ({ windows }) => {
  windows.env.set("EDITOR", "nvim");
  windows.file.symlink(
    windows.knownFolder.localAppData("nvim"),
    "../nvim/.config/nvim",
  );
  windows.file.symlink(
    windows.knownFolder.localAppData("lazygit/config.yml"),
    "../lazygit/.config/lazygit/config.yml",
  );
});
