import { darwin, feature, home, nix } from "winix";

export const macos = feature("macos", () => [
  darwin.security({
    pam: {
      services: {
        sudo_local: { touchIdAuth: true },
      },
    },
    // sudo strips npm/pnpm env by default; keep these so sudo pnpm can use the user's npmrc/auth.
    sudo: {
      extraConfig: `
        Defaults env_keep += NPM_CONFIG_PREFIX
        Defaults env_keep += NPM_CONFIG_USERCONFIG
        Defaults env_keep += PNPM_CONFIG_MANAGE_PACKAGE_MANAGER_VERSIONS
        Defaults env_keep += PNPM_HOME
      `,
    },
  }),
  darwin({
    nix: {
      settings: {
        // Determinate Nix adds install.determinate.systems, which was slow here.
        // Force the standard NixOS cache so rebuilds fetch from cache.nixos.org only.
        substituters: nix.lib.mkForce(["https://cache.nixos.org/"]),
        "trusted-public-keys": nix.lib.mkForce([
          "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY=",
        ]),
      },
    },
  }),
  darwin.defaults({
    CustomUserPreferences: {
      NSGlobalDomain: {
        // Enables Ctrl+Cmd dragging from anywhere inside a window.
        NSWindowShouldDragOnGesture: true,
      },
    },
  }),
  home({ manual: { manpages: { enable: false } } }),
]);
