{ config, pkgs, ... }:
{
  systemd.tmpfiles.rules = [
    "L+ /usr/bin/bash - - - - ${pkgs.bash}/bin/bash"
  ];
  
  # Set unprivileged port start to 443 (for work project)
  boot.kernel.sysctl = {
    "net.ipv4.ip_unprivileged_port_start" = 443;
  };
}
