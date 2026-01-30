{ config, lib, pkgs, ... }:
{
  networking.hostName = "syncthing-lxc";

  # Additional packages
  environment.systemPackages = with pkgs; [
    gh
  ];

  # Syncthing service
  services.syncthing = {
    enable = true;
    user = "syncthing";
    group = "syncthing";
    dataDir = "/var/lib/syncthing";
    configDir = "/var/lib/syncthing/.config/syncthing";

    # Bind to all interfaces for LAN access
    guiAddress = "0.0.0.0:8384";

    # Open firewall for Syncthing
    openDefaultPorts = true;

    settings = {
      folders = {
        "TrackVault" = {
          path = "/var/lib/syncthing/TrackVault";
          devices = [ "ADRIFER-Ultron" "iPhone" "Ela" ];
          versioning = {
            type = "simple";
            params.keep = "10";
          };
        };
      };
      devices = {
        "ADRIFER-Ultron" = { id = "SUYK5EV-GZD6WAJ-DOHS524-7RMYH54-23I4TYS-YN6HYL2-V4FCOEN-MBBG7AG"; };
        "iPhone" = { id = "Z2LB3T3-MW5JCBR-ZAFY6XE-SUIKOV4-JAEGMDZ-JQIZLZC-2W346Y6-XI2WXQX"; };
        "Ela" = { id = "DTDYOAX-QOJUM4U-ENTU5W3-P5XCUGG-R5M67OU-ARZBZVP-7TZKSU2-SYRJFAF"; };
      };
    };
  };

  # Auto backup TrackVault to GitHub every 6 hours
  systemd.services.vault-git-backup = {
    description = "Backup TrackVault to GitHub";
    path = [ pkgs.git pkgs.openssh ];
    serviceConfig = {
      Type = "oneshot";
      User = "syncthing";
      WorkingDirectory = "/var/lib/syncthing/TrackVault";
    };
    script = ''
      if [[ -n $(git status --porcelain) ]]; then
        git add .
        git commit -m "Auto backup $(date '+%Y-%m-%d %H:%M')"
        git push
      fi
    '';
  };

  systemd.timers.vault-git-backup = {
    description = "Run Vault backup every 6 hours";
    wantedBy = [ "timers.target" ];
    timerConfig = {
      OnCalendar = "*-*-* 00/6:00:00";  # Every 6 hours
      Persistent = true;  # Run if missed while powered off
    };
  };

  # Open GUI port in firewall
  networking.firewall.allowedTCPPorts = [ 8384 ];

  system.stateVersion = "25.05";
}
