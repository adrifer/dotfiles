import { feature } from "@adrifer/winix";

export const fzf = feature("fzf", ({ home }) => {
  home.program("fzf", { enableZshIntegration: true });
});
