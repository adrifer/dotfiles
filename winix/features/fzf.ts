import { feature, programs } from "winix";

export const fzf = feature("fzf", () =>
  programs.enable("fzf", { enableZshIntegration: true })
);
