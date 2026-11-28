import { profile } from "@adrifer/winix";
import { cliTools } from "../features/cli/cli-tools.ts";
import { eza } from "../features/cli/eza.ts";
import { fzf } from "../features/cli/fzf.ts";
import { git } from "../features/cli/git.ts";
import { herdr } from "../features/cli/herdr.ts";
import { lazygit } from "../features/cli/lazygit.ts";
import { neovim } from "../features/cli/neovim.ts";
import { shell } from "../features/cli/shell.ts";
import { skills } from "../features/cli/skills.ts";
import { starship } from "../features/cli/starship.ts";
import { zoxide } from "../features/cli/zoxide.ts";
import { vscode } from "../features/desktop/vscode.ts";

/**
 * Every machine I work on, on every OS: the shell (zsh or PowerShell, same
 * aliases), prompt, editor, Git and terminal tools. Each feature declares its
 * Linux/macOS and Windows sides; a host gets the ones for its platform.
 */
export const everywhere = profile("everywhere", [
  shell(),
  starship(),
  zoxide(),
  fzf(),
  eza(),
  lazygit(),
  neovim(),
  git(),
  vscode(),
  herdr(),
  cliTools(),
  skills(),
]);
