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
  };

  # Open GUI port in firewall
  networking.firewall.allowedTCPPorts = [ 8384 ];

  system.stateVersion = "25.05";
}
