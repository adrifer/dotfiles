import { feature } from "@adrifer/winix";

export const javascript = feature("javascript", ({ home }) => {
  home.packages("bun", "nodejs_22", "pnpm");
  home.env({
    NPM_CONFIG_PREFIX: "${config.home.homeDirectory}/.npm-global",
    NPM_CONFIG_USERCONFIG: "${config.home.homeDirectory}/.config/npm/npmrc",
    // Prevent pnpm from self-downloading the packageManager version from a private project registry.
    PNPM_CONFIG_MANAGE_PACKAGE_MANAGER_VERSIONS: "false",
    PNPM_HOME: "${config.home.homeDirectory}/.local/share/pnpm",
  });
  home.path(
    "${config.home.homeDirectory}/.npm-global/bin",
    "${config.home.homeDirectory}/.local/share/pnpm",
  );
  home.activation("ensureWritableNpmrc", {
    script: `
      mkdir -p "\${config.home.homeDirectory}/.config/npm"
      touch "\${config.home.homeDirectory}/.config/npm/npmrc"
      chmod 600 "\${config.home.homeDirectory}/.config/npm/npmrc"
      # Keep this idempotent so repeated activations do not duplicate the setting.
      if ! grep -q '^manage-package-manager-versions=' "\${config.home.homeDirectory}/.config/npm/npmrc"; then
        printf '\\nmanage-package-manager-versions=false\\n' >> "\${config.home.homeDirectory}/.config/npm/npmrc"
      fi
    `,
  });
  home.activation("installNpmGlobalPkgs", {
    after: ["writeBoundary", "ensureWritableNpmrc"],
    script: `
      export NPM_CONFIG_PREFIX="\${config.home.homeDirectory}/.npm-global"
      export PATH="\${pkgs.nodejs_22}/bin:$PATH"

      if [ ! -x "\${config.home.homeDirectory}/.npm-global/bin/copilot" ]; then
        \${pkgs.nodejs_22}/bin/npm i -g @github/copilot
      fi
    `,
  });
});
