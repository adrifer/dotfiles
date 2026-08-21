import { feature, nix } from "@adrifer/winix";

export const javascript = feature("javascript", ({ home }) => {
  home.packages(
    // Temporary workaround until Bun 1.4 is available in nixpkgs.
    nix.binaryRelease({
      name: "bun",
      version: "1.4.0",
      binary: "bun",
      urlTemplate:
        "https://github.com/oven-sh/bun/releases/download/bun-v{version}/{file}",
      platforms: {
        "x86_64-linux": {
          file: "bun-linux-x64-baseline.zip",
          hash: "sha256-GE+0WV8NQBohfPfHjBvEMLqDMU2reouUgFurv3+nCX8=",
          binary: "bun-linux-x64-baseline/bun",
        },
        "aarch64-linux": {
          file: "bun-linux-aarch64.zip",
          hash: "sha256-SxozLuhhmD65O8/m93D/+U4+MbLDiL2uo8jtNeWO7Q4=",
          binary: "bun-linux-aarch64/bun",
        },
        "x86_64-darwin": {
          file: "bun-darwin-x64-baseline.zip",
          hash: "sha256-2pufG0unZsbymXEfON+qmGI+HtnECJaqU9uAPFLsH6A=",
          binary: "bun-darwin-x64-baseline/bun",
        },
        "aarch64-darwin": {
          file: "bun-darwin-aarch64.zip",
          hash: "sha256-xmnpf2Fk4cluBwF0jbmN+ndJKQjL2DlMdVcTSnNd44E=",
          binary: "bun-darwin-aarch64/bun",
        },
      },
      extraInstall: 'ln -s "$out/bin/bun" "$out/bin/bunx"',
      linuxPatchelf: true,
      linuxBuildInputs: ["openssl"],
      meta: {
        description:
          "Fast JavaScript runtime, bundler, transpiler, and package manager",
        homepage: "https://bun.sh",
        license: "mit",
      },
    }),
    "nodejs_22",
    "pnpm",
  );
  home.env({
    NPM_CONFIG_PREFIX: nix.homePath(".npm-global"),
    NPM_CONFIG_USERCONFIG: nix.homePath(".config/npm/npmrc"),
    // Prevent pnpm from self-downloading the packageManager version from a private project registry.
    PNPM_CONFIG_MANAGE_PACKAGE_MANAGER_VERSIONS: "false",
    PNPM_HOME: nix.homePath(".local/share/pnpm"),
  });
  home.path(
    nix.homePath(".npm-global/bin"),
    nix.homePath(".local/share/pnpm"),
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
