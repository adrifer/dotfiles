{ config, pkgs, ... }:
{
  systemd.tmpfiles.rules = [
    "L+ /usr/bin/bash - - - - ${pkgs.bash}/bin/bash"
  ];
}
