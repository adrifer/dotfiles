{ pkgs, ... }:

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

    # dev
    unstable.neovim
    unstable.lazygit
    unstable.bun
    unstable.gh
    gcc
    tmux
    nixfmt-rfc-style

    # I need to find the best way to install node versions on nix
    # nvm

    # ripgrep
    # fd
    # jq
    # yq

    # add languages/toolchains you want everywhere:
    # nodejs_22 pnpm deno bun go python3 rustup zig
  ];

  home.sessionVariables = { EDITOR = "nvim"; };
}
