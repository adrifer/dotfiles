import { host, platforms } from "@adrifer/winix";
import { antigravityCli } from "../features/dev/antigravity.ts";
import { docker } from "../features/dev/docker.ts";
import { dotnet } from "../features/dev/dotnet.ts";
import { rust } from "../features/dev/rust.ts";
import { t3WslProxy } from "../features/system/t3-wsl-proxy.ts";
import { adrifer } from "../features/system/user-adrifer.ts";
import { windowsNixosWsl } from "../features/system/windows-nixos-wsl.ts";
import { wsl } from "../features/system/wsl.ts";
import { dev } from "../roles/dev.ts";
import { everywhere } from "../roles/everywhere.ts";
import { linuxSystem } from "../roles/linux-system.ts";
import { personal } from "../roles/personal.ts";
import { windowsDesktop } from "../roles/windows-desktop.ts";

/** Personal desktop PC: Windows, plus NixOS in its "NixOS" WSL distro. */
const linux = host("wsl", platforms.wsl({ stateVersion: "25.05" }), ({ home }) => {
  home.packages("ffmpeg-full");

  return [
    everywhere(),
    dev(),
    personal(),
    linuxSystem(),
    wsl(),
    // Heavier toolchains, only here.
    dotnet(),
    rust(),
    docker(adrifer),
    // Trying out Antigravity CLI on this PC only, for now.
    antigravityCli(),
  ];
});

const windows = host("ADRIFER-VISION", platforms.windows(), ({ windows }) => {
  // Windows HDR Calibration (Store) for this PC's HDR display. The Store keeps
  // it updated and winget reports no version, so it is never pinned.
  windows.package({ source: "msstore", id: "9N7F2SM5D1LR", version: "any" });

  windows.settings({
    keyboard: { repeatDelay: 0, repeatSpeed: 31 },
    time: { zone: "Pacific Standard Time", automaticZone: false },
  });
  windows.wallpaper({
    source: "../windows/wallpapers/vision_wallpaper.jpeg",
    style: "Fill",
  });

  return [
    everywhere(),
    dev(),
    personal(),
    windowsDesktop(),
    windowsNixosWsl(linux),
    // LAN reverse proxy to T3 in WSL (this network only).
    t3WslProxy(),
    antigravityCli(),
  ];
});

export const adriferVision = [windows, linux];
