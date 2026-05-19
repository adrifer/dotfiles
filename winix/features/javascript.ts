import { activation, feature, home } from "winix";

export const javascript = feature("javascript", () => [
  home.packages("bun", "nodejs_22", "pnpm"),
  home.env({
    NPM_CONFIG_PREFIX: "${config.home.homeDirectory}/.npm-global",
    NPM_CONFIG_USERCONFIG: "${config.home.homeDirectory}/.config/npm/npmrc",
    PNPM_HOME: "${config.home.homeDirectory}/.local/share/pnpm",
  }),
  home.path(
    "${config.home.homeDirectory}/.npm-global/bin",
    "${config.home.homeDirectory}/.local/share/pnpm"
  ),
  activation("ensureWritableNpmrc", {
    script: `
      mkdir -p "\${config.home.homeDirectory}/.config/npm"
      touch "\${config.home.homeDirectory}/.config/npm/npmrc"
      chmod 600 "\${config.home.homeDirectory}/.config/npm/npmrc"
    `,
  }),
  activation("installNpmGlobalPkgs", {
    after: ["writeBoundary", "ensureWritableNpmrc"],
    script: `
      export NPM_CONFIG_PREFIX="\${config.home.homeDirectory}/.npm-global"
      export PATH="\${pkgs.nodejs_22}/bin:$PATH"

      if [ ! -x "\${config.home.homeDirectory}/.npm-global/bin/copilot" ]; then
        \${pkgs.nodejs_22}/bin/npm i -g @github/copilot
      fi

      if [ ! -x "\${config.home.homeDirectory}/.npm-global/bin/opencode" ]; then
        \${pkgs.nodejs_22}/bin/npm i -g opencode-ai
      fi
    `,
  }),
]);
