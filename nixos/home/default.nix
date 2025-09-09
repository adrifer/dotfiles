{ config, pkgs, ... }:

let
  dotfiles = "${config.home.homeDirectory}/dotfiles";
  create_symlink = path: config.lib.file.mkOutOfStoreSymlink path;

  # Standard .config/directory
  configs = {
    nvim = "nvim";
    eza = "eza";
    lazygit = "lazygit";
    yazi = "yazi";
  };

in {
  home.username = "adrifer";
  home.homeDirectory = "/home/adrifer";

  programs.home-manager.enable = true;

  # Shared user tools
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

  xdg.configFile = builtins.mapAttrs (name: subpath: {
    source = create_symlink "${dotfiles}/${subpath}/.config/${subpath}";
    recursive = true;
  }) configs;

  home.sessionVariables = { EDITOR = "nvim"; };

  programs.git = {
    enable = true;
    userName = "Adrian Fernandez Garcia";
    userEmail = "tracker086@outlook.com";
  };

  programs.zsh = {
    enable = true;
    autosuggestion.enable = true;
    enableCompletion = true;
    syntaxHighlighting.enable = true;
    shellAliases = {
      ls = "eza --long --no-filesize --color=always --icons=always --no-user";
      grep = "grep --color=auto";
      lg = "lazygit";
      ci = "code-insiders";
      ta = "tmux attach-session";
      ".." = "cd ..";
      "..." = "cd ../..";
      i = "nix flake update && sudo nixos-rebuild switch";
    };
    initContent = ''
      y() {
        local tmp cwd
        tmp="$(mktemp -t yazi-cwd.XXXXXX)"
        yazi "$@" --cwd-file="$tmp"
        if cwd="$(command cat -- "$tmp")" && [[ -n "$cwd" && "$cwd" != "$PWD" ]]; then
          builtin cd -- "$cwd"
        fi
        rm -f -- "$tmp"
      }
    '';
  };

  programs.starship = {
    enable = true;
    enableZshIntegration = true;
    settings = {
      add_newline = false;
      format = "$directory$character";
      right_format = "$all";

      character = { vicmd_symbol = "[N] >>>"; };

      directory = {
        substitutions = {
          "/Users/adrifer/Repos/trackseries/src/Web" = "ts-web";
        };
      };

      git_branch = { format = "[$symbol$branch(:$remote_branch)](fg:4)"; };

      docker_context = { disabled = true; };

      bun = { disabled = true; };

      nodejs = {
        detect_files =
          [ "package.json" ".node-version" "!bunfig.toml" "!bun.lockb" ];
      };
    };
  };

  programs.fzf = {
    enable = true;
    enableZshIntegration = true;
  };

  programs.zoxide = {
    enable = true;
    enableZshIntegration = true;
  };

  # Pin HM state version (matches your release line)
  home.stateVersion = "25.05";
}
