import { feature, home } from "@adrifer/winix";

export const fzf = feature("fzf", () =>
  home.program("fzf", { enableZshIntegration: true })
);
