import { darwin, feature, home } from "winix";

export const macos = feature("macos", () => [
  darwin.raw({
    security: {
      pam: {
        services: {
          sudo_local: { touchIdAuth: true },
        },
      },
    },
  }),
  home.raw({ manual: { manpages: { enable: false } } }),
]);
