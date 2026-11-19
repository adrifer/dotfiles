import { host, platforms } from "@adrifer/winix";
import { docker } from "../features/docker.ts";
import { dotnet } from "../features/dotnet.ts";
import { komorebi } from "../features/komorebi.ts";
import { lazygit } from "../features/lazygit.ts";
import { neovim } from "../features/neovim.ts";
import { powershell } from "../features/powershell.ts";
import { windowsTerminal } from "../features/windows-terminal.ts";
import { zoxide } from "../features/zoxide.ts";
import { starship } from "../features/starship.ts";
import { windowsPreferences } from "../features/windows-preferences.ts";
import { winget } from "../features/winget.ts";
import { rust } from "../features/rust.ts";
import { sonarctl } from "../features/sonarctl.ts";
import { adrifer } from "../features/user-adrifer.ts";
import { windowsNixosWsl } from "../features/windows-nixos-wsl.ts";
import { wsl } from "../features/wsl.ts";
import { linuxProfile } from "../profiles/linux.ts";
import { windowsPersonal } from "../profiles/windows-personal.ts";

/** Personal desktop: the Windows host plus the NixOS-WSL host in its "NixOS" distro. */
const linux = host("wsl", platforms.wsl({ stateVersion: "25.05" }), ({ home }) => {
  home.packages("ffmpeg-full");

  return [
    linuxProfile(),
    wsl(),
    dotnet(),
    rust(),
    sonarctl(),
    docker(adrifer),
  ];
});

// Rolling the Windows config out on this machine one tool at a time; each step
// adds entries here until it matches the full set:
//   windowsPersonal(), windowsNixosWsl(linux)
const windows = host("ADRIFER-VISION", platforms.windows(), [
  windowsPreferences(),
  winget(),
  lazygit(),
  starship(),
  zoxide(),
  powershell(),
  windowsTerminal(),
  neovim(),
  komorebi(),
]);

export const adriferVision = [windows, linux];
