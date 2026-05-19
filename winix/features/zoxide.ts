import { feature, programs } from "winix";

export const zoxide = feature("zoxide", () =>
  programs.enable("zoxide", { enableZshIntegration: true })
);
