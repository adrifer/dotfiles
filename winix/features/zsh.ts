import { feature, nix, platforms, programs } from "winix";
import { wsl } from "./wsl.ts";

export const zsh = feature("zsh", () => {
  const initParts = [
    nix.script(`
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
             z "$@" && printf "\\U000F17A9 " && pwd || echo "Error: Directory not found"
           fi
         }
        `),
  ];

  if (wsl.isActive) {
    initParts.push(
      nix.script(`
           export BROWSER=wslview

           keep_current_path() {
            printf "\\e]9;9;%s\\e\\\\" "$(wslpath -w "$PWD")"
           }
           precmd_functions+=(keep_current_path)
        `)
    );
  }

  return programs.enable("zsh", {
    autosuggestion: {
      enable: true,
    },
    enableCompletion: true,
    syntaxHighlighting: {
      enable: true,
    },
    plugins: [
      {
        name: "zsh-vi-mode",
        src: nix.pkg("zsh-vi-mode"),
        file: "share/zsh-vi-mode/zsh-vi-mode.plugin.zsh",
      },
    ],
    shellAliases: {
      ls: "eza -lh --group-directories-first --icons=auto",
      lsa: "ls -a",
      lt: "eza --tree --level=2 --long --icons --git",
      lt3: "lt --level=3",
      lt4: "lt --level=4",
      lt5: "lt --level=5",
      lta: "lt -a",
      ff: "fzf --preview 'bat --style=numbers --color=always {}'",
      grep: "grep --color=auto",
      g: "lazygit",
      lg: "lazygit",
      cd: "zd",
      ci: "code-insiders",
      co: "copilot --yolo",
      coc: "co --continue",
      cor: "co --resume",
      cou: "copilot update",
      ta: "tmux attach-session",
      "..": "cd ..",
      "...": "cd ../..",
      n: "nvim",
      ...(platforms.darwin.isActive && {
        i: "cd ~/dotfiles/winix && npx winix apply && sudo darwin-rebuild switch --flake path:$PWD/.winix/out#macbook-pro",
        u: "cd ~/dotfiles/winix/.winix/out && nix flake update && sudo darwin-rebuild switch --flake path:$PWD#macbook-pro",
        gc: "nix-collect-garbage -d",
        "foundry-dev": "sudo CHOKIDAR_USEPOLLING=true CHOKIDAR_INTERVAL=1000 pnpm dev",
      }),
      ...(platforms.nixos.isActive && {
        i: "cd ~/dotfiles/winix && npx winix apply && sudo nixos-rebuild switch --flake path:$PWD/.winix/out",
        u: "cd ~/dotfiles/winix/.winix/out && nix flake update && sudo nixos-rebuild switch --flake path:$PWD",
        gc: "sudo nix-collect-garbage -d",
      }),
    },
    initContent: initParts.length === 1 ? initParts[0] : nix.concat(...initParts),
  });
});
