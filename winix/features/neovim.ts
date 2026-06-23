import { feature, home } from "@adrifer/winix";

export const neovim = feature("neovim", () => [
  home.packages("neovim"),
  home.env({ EDITOR: "nvim" }),
]);
