import { feature, pkg } from "winix";

export const homeUser = feature("home-user", (homeDirectory: string) => ({
  home: {
    username: "adrifer",
    home: {
      username: "adrifer",
      homeDirectory,
      stateVersion: "25.05",
    },
    programs: {
      homeManager: { enable: true },
    },
  },
}));

export const userAdrifer = feature("user-adrifer", () => ({
  nixos: {
    programs: { zsh: { enable: true } },
    users: {
      users: {
        adrifer: {
          isNormalUser: true,
          extraGroups: ["wheel"],
          uid: 1000,
        },
      },
      defaultUserShell: pkg("zsh"),
    },
  },
}));
