import { feature, pkg } from "winix";

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
      shells: [pkg("zsh")],
    },
    users: {
      users: {
        adrifer: {
          home: "/Users/adrifer",
          shell: pkg("zsh"),
        },
      },
    },
  },
  home: {
    manual: {
      manpages: {
        enable: false,
      },
    },
  },
}));
