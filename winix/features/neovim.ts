import { feature } from "@adrifer/winix";

export const neovim = feature("neovim", ({ home }) => {
  home.packages("neovim");
  home.env({ EDITOR: "nvim" });
});
