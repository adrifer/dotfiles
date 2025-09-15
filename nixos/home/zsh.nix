{ config, pkgs, ... }:

{
  programs.zsh = {
    enable = true;
    autosuggestion.enable = true;
    enableCompletion = true;
    syntaxHighlighting.enable = true;
    shellAliases = {
      ls = "eza -lh --group-directories-first --icons=auto";
      lsa = "ls -a";
      lt = "eza --tree --level=2 --long --icons --git";
      lt3 = "lt --level=3";
      lt4 = "lt --level=4";
      lt5 = "lt --level=5";
      lta = "lt -a";
      ff = "fzf --preview 'bat --style=numbers --color=always {}'";
      grep = "grep --color=auto";
      lg = "lazygit";
      cd = "zd";
      ci = "code-insiders";
      ta = "tmux attach-session";
      ".." = "cd ..";
      "..." = "cd ../..";
      i =
        "nix flake update --impure --flake /etc/nixos && sudo nixos-rebuild switch --flake /etc/nixos";
    };
    initContent = ''
            source ${pkgs.zsh-vi-mode}/share/zsh-vi-mode/zsh-vi-mode.plugin.zsh
            export  ZVM_VI_INSERT_ESCAPE_BINDKEY=jj
            y() {
              local tmp cwd
              tmp="$(mktemp -t yazi-cwd.XXXXXX)"
              yazi "$@" --cwd-file="$tmp"
              if cwd="$(command cat -- "$tmp")" && [[ -n "$cwd" && "$cwd" != "$PWD" ]]; then
                builtin cd -- "$cwd"
              fi
              rm -f -- "$tmp"
            }

            zd() {
              if [ $# -eq 0 ]; then
                builtin cd ~ && return
              elif [ -d "$1" ]; then
                builtin cd "$1"
              else
                z "$@" && printf "\U000F17A9 " && pwd || echo "Error: Directory not found"
              fi
            } 
    '';
  };
}
