import { feature, home } from "winix";

export const fzf = feature("fzf", () =>
  home.program("fzf", { enableZshIntegration: true })
);
