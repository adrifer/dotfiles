import { feature } from "@adrifer/winix";

/** Work Linux (WSL) settings: low ports for local HTTPS, large inotify limits, sandboxing tools. */
export const workLinux = feature("work-linux", ({ home, nixos }) => {
  nixos.sysctl({
    "net.ipv4.ip_unprivileged_port_start": 443,
    "fs.inotify.max_user_watches": 1048576,
    "fs.inotify.max_user_instances": 1024,
    "fs.inotify.max_queued_events": 65536,
  });
  home.packages("socat", "bubblewrap");
});
