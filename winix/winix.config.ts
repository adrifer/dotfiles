import { host, home, nixos, platforms, workspace } from "@adrifer/winix";
import { inputs } from "./inputs.ts";
import { syncthingLxc } from "./features/syncthing-lxc.ts";
import { linuxProfile } from "./profiles/linux.ts";
import { lxcProfile } from "./profiles/lxc.ts";
import { macosProfile } from "./profiles/macos.ts";
import { wsl } from "./features/wsl.ts";
import { dotnet } from "./features/dotnet.ts";

export default workspace({
  inputs,
  hosts: [
    host("wsl", platforms.nixos({ stateVersion: "25.05" }), [
      linuxProfile(),
      wsl(),
      dotnet(),
    ]),
    host("wsl-work", platforms.nixos({ stateVersion: "25.05" }), [
      linuxProfile(),
      wsl(),
      nixos.sysctl({
        "net.ipv4.ip_unprivileged_port_start": 443,
        "fs.inotify.max_user_watches": 1048576,
        "fs.inotify.max_user_instances": 1024,
        "fs.inotify.max_queued_events": 65536,
      }),
      home.packages("socat", "bubblewrap"),
    ]),
    host("syncthing-lxc", platforms.nixos({ stateVersion: "25.05", homeManager: false }), [
      lxcProfile(),
      syncthingLxc(),
    ]),
    host("macbook-pro", platforms.darwin({ stateVersion: 6, homebrew: true }), [
      macosProfile(),
    ]),
  ],
});
