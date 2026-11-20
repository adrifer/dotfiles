import { feature } from "@adrifer/winix";

/** eza, the shell's `ls` (see shell.ts), on every OS. */
export const eza = feature("eza", ({ home, windows }) => {
  home.packages("eza");
  home.configFiles({
    eza: home.symlink("../eza/.config/eza", { recursive: true }),
  });

  windows.package("eza-community.eza");
});
