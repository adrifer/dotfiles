import { account } from "winix";

/**
 * Primary user account. Context-aware: adjusts home directory,
 * system user config, and WSL default user based on platform.
 */
export const adrifer = () => account("adrifer", {
  admin: true,
  shell: "zsh",
  stateVersion: "25.05",
  wslDefault: true,
});
