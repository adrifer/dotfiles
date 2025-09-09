{ config, pkgs, ... }:

{
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
}
