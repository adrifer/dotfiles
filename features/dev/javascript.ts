import { feature, nix, type HomeHelper } from "@adrifer/winix";

export type NpmGlobalPackage = string | { pkg: string; bin: string };

const npmGlobalPkgs: NpmGlobalPackage[] = [
  { pkg: "@github/copilot", bin: "copilot" },
  { pkg: "@openai/codex", bin: "codex" },
  { pkg: "@anthropic-ai/claude-code", bin: "claude" },
];

function normalizeNpmGlobalPackage(entry: NpmGlobalPackage): { pkg: string; bin: string } {
  if (typeof entry !== "string") return entry;
  const withoutScope = entry.startsWith("@") ? entry.slice(entry.indexOf("/") + 1) : entry;
  const atIndex = withoutScope.indexOf("@");
  const bin = atIndex > 0 ? withoutScope.slice(0, atIndex) : withoutScope;
  return { pkg: entry, bin };
}

function defaultActivationName(entries: ReadonlyArray<{ bin: string }>): string {
  const slug = entries.map((e) => e.bin.replace(/[^a-zA-Z0-9]+/g, "_")).join("_");
  return `installNpmGlobal_${slug}`;
}

/**
 * Installs one or more npm packages globally into ~/.npm-global during Home
 * Manager activation when their binaries are not yet present. Missing packages
 * are batched into a single `npm i -g` call and respect Home Manager dry runs.
 * Requires the `javascript` feature on the host.
 */
export function npmGlobalPackages(
  home: HomeHelper,
  pkgs: NpmGlobalPackage | ReadonlyArray<NpmGlobalPackage>,
  activationName?: string,
): void {
  if (!javascript.isActive) {
    throw new Error("npmGlobalPackages() requires the `javascript` feature on this host");
  }
  const entries = (Array.isArray(pkgs) ? pkgs : [pkgs]).map(normalizeNpmGlobalPackage);
  if (entries.length === 0) return;

  const checks = entries
    .map(({ pkg, bin }) =>
      `if [ ! -x "\${config.home.homeDirectory}/.npm-global/bin/${bin}" ]; then\n  missing+=('${pkg}')\nfi`,
    )
    .join("\n");

  home.activation(activationName ?? defaultActivationName(entries), {
    after: ["writeBoundary", "ensureWritableNpmrc"],
    script: [
      `export NPM_CONFIG_PREFIX="\${config.home.homeDirectory}/.npm-global"`,
      `export PATH="\${pkgs.nodejs_24}/bin:$PATH"`,
      `missing=()`,
      checks,
      `if [ ''\${#missing[@]} -gt 0 ]; then`,
      `  run \${pkgs.nodejs_24}/bin/npm i -g "''\${missing[@]}"`,
      `fi`,
    ].join("\n"),
  });
}

export const javascript = feature("javascript", ({ home, windows }) => {
  // Windows: Node through NVM for Windows, and GitHub Copilot CLI (npm globals
  // below are Linux/macOS only). Both update themselves.
  windows.package("CoreyButler.NVMforWindows", { version: "any" });
  windows.package("GitHub.Copilot", { version: "any" });

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
    "nodejs_24",
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
  npmGlobalPackages(home, npmGlobalPkgs, "installNpmGlobalPkgs");
});
