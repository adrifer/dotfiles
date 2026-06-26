import { feature } from "@adrifer/winix";

export const zoxide = feature("zoxide", ({ home }) => {
  home.program("zoxide", { enableZshIntegration: true });
});
