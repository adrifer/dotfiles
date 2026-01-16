{ config, pkgs, ... }:
{
  systemd.tmpfiles.rules = [
    "L+ /usr/bin/bash - - - - ${pkgs.bash}/bin/bash"
  ];

  nix.gc = {
    automatic = true;
    dates = "weekly";
    options = "--delete-older-than 7d";
  };
}
