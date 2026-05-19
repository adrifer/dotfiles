import { feature, home } from "winix";

export const zoxide = feature("zoxide", () =>
  home.program("zoxide", { enableZshIntegration: true })
);
