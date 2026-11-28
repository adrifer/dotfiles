import { feature } from "@adrifer/winix";

export const neovim = feature("neovim", ({ home, windows }) => {
  home.packages("neovim");
  home.env({ EDITOR: "nvim" });
  home.configFiles({
    nvim: home.symlink("./config/nvim", { recursive: true }),
  });

  // Machine-wide MSI (Neovim has no per-user installer), so upgrades ask for UAC.
  windows.package("Neovim.Neovim");
  windows.env.set("EDITOR", "nvim");
  windows.file.symlink(windows.knownFolder.localAppData("nvim"), "./config/nvim");
});
