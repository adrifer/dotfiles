import { account } from "winix";

export const homeUser = (homeDirectory: string) =>
  account("adrifer", { homeDirectory, shell: "zsh", stateVersion: "25.05", wslDefault: true });

export const userAdrifer = () =>
  account("adrifer", { admin: true, shell: "zsh", stateVersion: "25.05", uid: 1000, wslDefault: true });
