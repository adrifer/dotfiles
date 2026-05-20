import { darwin, feature, home } from "winix";

export const macos = feature("macos", () => [
  darwin({
    security: {
      pam: {
        services: {
          sudo_local: { touchIdAuth: true },
        },
      },
    },
  }),
  home({ manual: { manpages: { enable: false } } }),
]);
