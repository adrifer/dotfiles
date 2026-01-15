{ inputs, config, lib, pkgs, ... }:

let
  nodejs = pkgs.unstable.nodejs_22;
  npmGlobalPkgs = [
    "@github/copilot"
    "opencode-ai"
  ];
  npmInstallCmd = lib.concatStringsSep " " npmGlobalPkgs;
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

    # dev
    unstable.neovim
    unstable.lazygit
    unstable.bun
    unstable.gh
    nodejs
    azure-artifacts-credprovider
    pnpm
    icu # needed for credential Manager
    mkcert
    gcc
    nixfmt-rfc-style
    nixd
    inputs.codex-cli-nix.packages.${pkgs.system}.default
    azure-cli

    # I need to find the best way to install node versions on nix
    # nvm

    # ripgrep
    # fd
    # jq
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

  home.activation.installNpmGlobalPkgs = lib.hm.dag.entryAfter [ "writeBoundary" "ensureWritableNpmrc" ] ''
    export NPM_CONFIG_PREFIX="${config.home.homeDirectory}/.npm-global"
    export PATH="${nodejs}/bin:${pkgs.unstable.bun}/bin:$PATH"
    ${nodejs}/bin/npm i -g ${npmInstallCmd}
  '';

  # Add their bin dirs to PATH
  home.sessionPath = [
    "${config.home.homeDirectory}/.npm-global/bin"
    "${config.home.homeDirectory}/.local/share/pnpm"
  ];
}
