{ inputs, config, lib, pkgs, ... }:

let
  nodejs = pkgs.nodejs_22;
  dotnet = pkgs.dotnet-sdk_10;
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
    openssl

    # dev
    neovim
    lazygit
    bun
    gh
    nodejs
    dotnet
    azure-artifacts-credprovider
    pnpm
    icu # needed for credential Manager
    mkcert
    gcc
    nixfmt
    nixd
    inputs.codex-cli-nix.packages.${pkgs.system}.default
    azure-cli
    python3 # needed to build t3code
    gnumake # needed to build t3code

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
    DOTNET_ROOT = "${dotnet}/share/dotnet";
    DOTNET_ROOT_X64 = "${dotnet}/share/dotnet";
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

  home.activation.installAspireCli = lib.hm.dag.entryAfter [ "writeBoundary" ] ''
    export DOTNET_CLI_HOME="${config.home.homeDirectory}"
    export PATH="${dotnet}/bin:$PATH"
    if [ ! -x "${config.home.homeDirectory}/.dotnet/tools/aspire" ]; then
      ${dotnet}/bin/dotnet tool install --global Aspire.Cli
    fi
  '';

  # Add their bin dirs to PATH
  home.sessionPath = [
    "${config.home.homeDirectory}/.npm-global/bin"
    "${config.home.homeDirectory}/.dotnet/tools"
    "${config.home.homeDirectory}/.aspire/bin"
    "${config.home.homeDirectory}/.local/share/pnpm"
  ];
}
