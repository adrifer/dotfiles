import { feature } from "@adrifer/winix";

export const zoxide = feature("zoxide", ({ home, windows }) => {
  home.program("zoxide", { enableZshIntegration: true });
  // PowerShell runs `zoxide init` from the profile (see the powershell feature).
  windows.package("ajeetdsouza.zoxide");
});
