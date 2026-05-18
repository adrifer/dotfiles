import { host, workspace } from "winix";
import { inputs } from "./inputs.ts";
import { syncthingLxc } from "./features/syncthing-lxc.ts";
import { darwin } from "./platforms/darwin.ts";
import { nixos } from "./platforms/linux.ts";
import { linuxProfile } from "./profiles/linux.ts";
import { lxcProfile } from "./profiles/lxc.ts";
import { macosProfile } from "./profiles/macos.ts";
import { wslProfile } from "./profiles/wsl.ts";
import { dotnet } from "./features/dotnet.ts";

export default workspace({
  inputs,
  hosts: [
    host("wsl", nixos(), [
      ...linuxProfile,
      ...wslProfile,
      dotnet(),
      {
        nixos: {
          networking: { hostName: "wsl" },
          system: { stateVersion: "25.05" },
        },
      },
    ]),
    host("wsl-work", nixos(), [
      ...linuxProfile,
      ...wslProfile,
      {
        nixos: {
          networking: { hostName: "wsl-work" },
          system: { stateVersion: "25.05" },
          boot: {
            kernel: {
              sysctl: {
                "net.ipv4.ip_unprivileged_port_start": 443,
                "fs.inotify.max_user_watches": 1048576,
                "fs.inotify.max_user_instances": 1024,
                "fs.inotify.max_queued_events": 65536,
              },
            },
          },
        },
        home: {
          packages: ["socat", "bubblewrap"],
        },
      },
    ]),
    host("syncthing-lxc", nixos(), [
      lxcProfile(),
      syncthingLxc(),
    ]),
    host("macbook-pro", darwin(), [
      ...macosProfile,
      {
        darwin: {
          networking: { hostName: "macbook-pro" },
          system: { stateVersion: 6 },
        },
      },
    ]),
  ],
});
