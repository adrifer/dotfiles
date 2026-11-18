import { host, platforms } from "@adrifer/winix";
import { windowsNixosWsl } from "../features/windows-nixos-wsl.ts";
import { windowsWork } from "../profiles/windows-work.ts";
import { wslWork } from "../profiles/wsl-work.ts";

/**
 * A work devbox: the Windows host plus the NixOS-WSL host provisioned in its
 * "NixOS" distro. Declared once so the pair cannot drift between machines.
 */
export const workDevbox = (name: string, wslName: string) => {
  const linux = host(wslName, platforms.wsl({ stateVersion: "25.05" }), [wslWork()]);
  const windows = host(name, platforms.windows(), [windowsWork(), windowsNixosWsl(linux)]);
  return [windows, linux];
};
