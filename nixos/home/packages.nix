{ inputs, config, lib, pkgs, ... }:

let
  nodejs = pkgs.nodejs_22;
  npmGlobalPkgs = [
    { pkg = "@github/copilot"; bin = "copilot"; }
    { pkg = "opencode-ai"; bin = "opencode"; }
  ];
in
{
  home.packages = with pkgs; [
    # Basics
    wget
    curl
    git
    starship
    eza
    bat
    tree
    fastfetch
    zoxide
    unzip
    yazi
    fzf
    powershell
    ripgrep
    fd
    jq

    # dev
    neovim
    lazygit
    bun
    gh
    nodejs
    azure-artifacts-credprovider
    pnpm
    icu # needed for credential Manager
    mkcert
    gcc
    nixfmt
    nixd
    inputs.codex-cli-nix.packages.${pkgs.system}.default
    azure-cli

    # I need to find the best way to install node versions on nix
    # nvm

    # yq

    # add languages/toolchains you want everywhere:
    # nodejs_22 pnpm deno bun go python3 rustup zig
  ];

  home.sessionVariables = {
    EDITOR = "nvim";
    NPM_CONFIG_PREFIX = "${config.home.homeDirectory}/.npm-global";
    NPM_CONFIG_USERCONFIG = "${config.home.homeDirectory}/.config/npm/npmrc";
    PNPM_HOME = "${config.home.homeDirectory}/.local/share/pnpm";
  };

  home.activation.ensureWritableNpmrc = lib.hm.dag.entryAfter [ "writeBoundary" ] ''
    mkdir -p "${config.home.homeDirectory}/.config/npm"
    touch "${config.home.homeDirectory}/.config/npm/npmrc"
    chmod 600 "${config.home.homeDirectory}/.config/npm/npmrc"
  '';

  # Install npm global packages only if not already present (skips on subsequent rebuilds)
  home.activation.installNpmGlobalPkgs = lib.hm.dag.entryAfter [ "writeBoundary" "ensureWritableNpmrc" ] ''
    export NPM_CONFIG_PREFIX="${config.home.homeDirectory}/.npm-global"
    export PATH="${nodejs}/bin:$PATH"
    ${lib.concatMapStringsSep "\n" (p: ''
      if [ ! -x "${config.home.homeDirectory}/.npm-global/bin/${p.bin}" ]; then
        ${nodejs}/bin/npm i -g ${p.pkg}
      fi
    '') npmGlobalPkgs}
  '';

  # Add their bin dirs to PATH
  home.sessionPath = [
    "${config.home.homeDirectory}/.npm-global/bin"
    "${config.home.homeDirectory}/.local/share/pnpm"
  ];
}
