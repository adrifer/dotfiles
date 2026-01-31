{ config, pkgs, ... }:
{
  # LXC container mode
  boot.isContainer = true;

  # Disable mounts that don't work in unprivileged LXC
  systemd.mounts = [{
    where = "/sys/kernel/debug";
    enable = false;
  }];

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

  # Ensure root has proper login shell
  users.users.root.shell = pkgs.bash;

  # Minimal packages for server management
  environment.systemPackages = with pkgs; [
    vim
    htop
    curl
    git
    lazygit
  ];

  # Git configuration (system-wide)
  programs.git = {
    enable = true;
    config = {
      user.name = "Adrian Fernandez";
      user.email = "tracker086@outlook.com";
    };
  };

  # Auto garbage collection
  nix.gc = {
    automatic = true;
    dates = "weekly";
    options = "--delete-older-than 14d";
  };

  nix.settings.experimental-features = [ "nix-command" "flakes" ];
}
