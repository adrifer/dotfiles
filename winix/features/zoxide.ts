import { feature, home } from "@adrifer/winix";

export const zoxide = feature("zoxide", () =>
  home.program("zoxide", { enableZshIntegration: true })
);
