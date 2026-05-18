import { feature } from "winix";

export const neovim = feature("neovim", () => ({
  home: {
    packages: ["neovim"],
    home: {
      sessionVariables: {
        EDITOR: "nvim",
      },
    },
  },
}));
