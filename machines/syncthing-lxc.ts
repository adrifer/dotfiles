import { host, platforms } from "@adrifer/winix";
import { lxc } from "../features/system/lxc.ts";
import { syncthingLxc } from "../features/system/syncthing-lxc.ts";

/** Syncthing server in a NixOS LXC container: system only, no user environment. */
export const syncthing = host(
  "syncthing-lxc",
  platforms.nixos({ stateVersion: "25.05", homeManager: false }),
  [lxc(), syncthingLxc()],
);
