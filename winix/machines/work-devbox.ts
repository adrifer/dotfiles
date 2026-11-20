import { host, platforms } from "@adrifer/winix";
import { windowsNixosWsl } from "../features/system/windows-nixos-wsl.ts";
import { wsl } from "../features/system/wsl.ts";
import { dev } from "../roles/dev.ts";
import { everywhere } from "../roles/everywhere.ts";
import { linuxSystem } from "../roles/linux-system.ts";
import { windowsDesktop } from "../roles/windows-desktop.ts";
import { work } from "../roles/work.ts";

/**
 * A work Dev Box: Windows, plus NixOS in its "NixOS" WSL distro, where the
 * development happens. Declared once so both Dev Boxes stay identical.
 */
export const workDevbox = (name: string, wslName: string) => {
  const linux = host(wslName, platforms.wsl({ stateVersion: "25.05" }), [
    everywhere(),
    dev(),
    work(),
    linuxSystem(),
    wsl(),
  ]);
  const windows = host(name, platforms.windows(), [
    everywhere(),
    work(),
    windowsDesktop(),
    windowsNixosWsl(linux),
  ]);
  return [windows, linux];
};
