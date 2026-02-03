{ config, lib, pkgs, ... }:
{
  # LXC container mode
  boot.isContainer = true;

  # Disable mounts that don't work in unprivileged LXC
  systemd.mounts = [{
    where = "/sys/kernel/debug";
    enable = false;
  }];

  # Fix /sbin/init to follow system profile (Proxmox templates hardcode wrong path)
  system.activationScripts.fixInit = lib.stringAfter [ "specialfs" ] ''
    if [ ! -L /sbin/init ] || [ "$(readlink /sbin/init)" != "/nix/var/nix/profiles/system/init" ]; then
      rm -f /sbin/init
      ln -s /nix/var/nix/profiles/system/init /sbin/init
    fi
  '';

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
