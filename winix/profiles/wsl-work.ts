import { profile } from "@adrifer/winix";
import { azureDevCli } from "../features/azure-dev-cli.ts";
import { tailscale } from "../features/tailscale.ts";
import { wsl } from "../features/wsl.ts";
import { wslWorkSettings } from "../features/wsl-work.ts";
import { linuxProfile } from "./linux.ts";

export const wslWork = profile("wsl-work", [
  wslWorkSettings(),
  linuxProfile(),
  wsl(),
  azureDevCli(),
  tailscale(),
]);
