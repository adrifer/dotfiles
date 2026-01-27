{ config, pkgs, ... }:
{
  # LXC container mode
  boot.isContainer = true;

  # Networking via DHCP (Proxmox handles this)
  networking.useDHCP = true;

  # Enable SSH for remote management
  services.openssh = {
    enable = true;
    settings = {
      PermitRootLogin = "yes";
      PasswordAuthentication = true;
    };
  };

  # Minimal packages for server management
  environment.systemPackages = with pkgs; [
    vim
    htop
    curl
    git
  ];

  # Auto garbage collection
  nix.gc = {
    automatic = true;
    dates = "weekly";
    options = "--delete-older-than 14d";
  };

  nix.settings.experimental-features = [ "nix-command" "flakes" ];
}
