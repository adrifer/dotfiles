{ ... }:

{
  flake.nixosModules.profile-lxc =
    { lib, pkgs, ... }:
    {
      boot.isContainer = true;

      systemd.mounts = [
        {
          where = "/sys/kernel/debug";
          enable = false;
        }
      ];

      system.activationScripts.fixInit = lib.stringAfter [ "specialfs" ] ''
        if [ ! -L /sbin/init ] || [ "$(readlink /sbin/init)" != "/nix/var/nix/profiles/system/init" ]; then
          rm -f /sbin/init
          ln -s /nix/var/nix/profiles/system/init /sbin/init
        fi
      '';

      networking.useDHCP = true;

      services.openssh = {
        enable = true;
        settings = {
          PermitRootLogin = "yes";
          PasswordAuthentication = true;
        };
      };

      users.users.root.shell = pkgs.bash;

      environment.systemPackages = with pkgs; [
        vim
        htop
        curl
        git
        lazygit
      ];

      programs.git = {
        enable = true;
        config = {
          user.name = "Adrian Fernandez";
          user.email = "tracker086@outlook.com";
        };
      };

      nix.gc = {
        automatic = true;
        dates = "weekly";
        options = "--delete-older-than 14d";
      };

      nix.settings.experimental-features = [
        "nix-command"
        "flakes"
      ];
    };
}
