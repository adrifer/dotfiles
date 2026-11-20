import { host, platforms } from "@adrifer/winix";
import { docker } from "../features/docker.ts";
import { dotnet } from "../features/dotnet.ts";
import { t3WslProxy } from "../features/t3-wsl-proxy.ts";
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

const windows = host("ADRIFER-VISION", platforms.windows(), [
  windowsPersonal(),
  windowsNixosWsl(linux),
  t3WslProxy(),
]);

export const adriferVision = [windows, linux];
