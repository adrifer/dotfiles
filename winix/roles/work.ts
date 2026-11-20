import { profile } from "@adrifer/winix";
import { azureDevCli } from "../features/dev/azure-dev-cli.ts";
import { tailscale } from "../features/system/tailscale.ts";
import { workLinux } from "../features/system/work-linux.ts";
import { workRepositories } from "../features/system/work-repositories.ts";

/**
 * Work machines: approved package feeds (Windows), work Linux settings,
 * Azure Developer CLI and Tailscale (Linux).
 */
export const work = profile("work", [
  workRepositories(),
  workLinux(),
  azureDevCli(),
  tailscale(),
]);
