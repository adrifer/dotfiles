import { feature } from "@adrifer/winix";

export const windowsWsl = feature("windows-wsl", ({ windows }) => {
  windows.wsl();
});
