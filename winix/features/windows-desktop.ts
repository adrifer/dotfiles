import { feature } from "@adrifer/winix";
import { packagesWindows } from "./packages.ts";
import { windowsShell } from "./windows-shell.ts";
import { windowsWindowManager } from "./windows-window-manager.ts";

export const windowsDesktop = feature("windows-desktop", ({ windows }) => {
  const developerMode = windows.setting({ DeveloperMode: true });

  windows.env.set("EDITOR", "nvim");
  windows.file.symlink(
    windows.knownFolder.localAppData("nvim"),
    "../nvim/.config/nvim",
    { dependsOn: developerMode },
  );
  windows.file.symlink(
    windows.knownFolder.localAppData("lazygit/config.yml"),
    "../lazygit/.config/lazygit/config.yml",
    { dependsOn: developerMode },
  );

  return [packagesWindows(), windowsShell(developerMode), windowsWindowManager(developerMode)];
});
