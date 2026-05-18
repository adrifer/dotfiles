import { feature } from "winix";

export const zoxide = feature("zoxide", () => ({
  home: {
    programs: {
      zoxide: {
        enable: true,
        enableZshIntegration: true,
      },
    },
  },
}));
