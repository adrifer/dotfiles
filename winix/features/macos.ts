import { feature, nix } from "winix";

export const macos = feature("macos", () => ({
  darwin: {
    programs: {
      zsh: { enable: true },
    },
    system: {
      primaryUser: "adrifer",
    },
    security: {
      pam: {
        services: {
          sudo_local: {
            touchIdAuth: true,
          },
        },
      },
    },
    environment: {
      shells: [nix.pkg("zsh")],
    },
    users: {
      users: {
        adrifer: {
          home: "/Users/adrifer",
          shell: nix.pkg("zsh"),
        },
      },
    },
  },
  homeManager: {
    manual: {
      manpages: {
        enable: false,
      },
    },
  },
}));
