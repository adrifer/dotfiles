import { profile } from "winix";
import { dotfiles } from "../features/dotfiles.ts";
import { fzf } from "../features/fzf.ts";
import { git } from "../features/git.ts";
import { javascript } from "../features/javascript.ts";
import { neovim } from "../features/neovim.ts";
import { packages } from "../features/packages.ts";
import { starship } from "../features/starship.ts";
import { zoxide } from "../features/zoxide.ts";
import { zsh } from "../features/zsh.ts";

export const homeBase = profile("home-base", [
  packages(),
  javascript(),
  neovim(),
  dotfiles(),
  zsh(),
  starship(),
  fzf(),
  zoxide(),
  git(),
]);
