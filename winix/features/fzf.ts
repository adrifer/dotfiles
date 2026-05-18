import { feature } from "winix";

export const fzf = feature("fzf", () => ({
  home: {
    programs: {
      fzf: {
        enable: true,
        enableZshIntegration: true,
      },
    },
  },
}));
