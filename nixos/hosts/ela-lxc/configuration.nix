{ config, lib, pkgs, inputs, ... }:
{
  imports = [
    inputs.home-manager-stable.nixosModules.home-manager
  ];

  networking.hostName = "ela-lxc";

  # Moltbot overlay
  nixpkgs.overlays = [ inputs.nix-moltbot.overlays.default ];

  # Workaround: nix-moltbot uses hardcoded /bin paths
  system.activationScripts.binCompat = lib.stringAfter [ "binsh" ] ''
    ln -sfn ${pkgs.coreutils}/bin/mkdir /bin/mkdir
    ln -sfn ${pkgs.coreutils}/bin/ln /bin/ln
    ln -sfn ${pkgs.coreutils}/bin/rm /bin/rm
    ln -sfn ${pkgs.coreutils}/bin/cp /bin/cp
    ln -sfn ${pkgs.coreutils}/bin/mv /bin/mv
    ln -sfn ${pkgs.coreutils}/bin/cat /bin/cat
    ln -sfn ${pkgs.coreutils}/bin/chmod /bin/chmod
    ln -sfn ${pkgs.coreutils}/bin/chown /bin/chown
  '';

  # Additional packages
  environment.systemPackages = with pkgs; [
    gh  # GitHub CLI (may be needed for Copilot OAuth)
  ];

  # Moltbot user (runs the service)
  users.users.moltbot = {
    isNormalUser = true;
    home = "/home/moltbot";
    description = "Moltbot AI Assistant";
    # Enable lingering so user services run without login
    linger = true;
  };

  # Secrets directory
  systemd.tmpfiles.rules = [
    "d /home/moltbot/.secrets 0700 moltbot moltbot -"
  ];

  # Home Manager for moltbot user
  home-manager = {
    useGlobalPkgs = true;
    useUserPackages = true;
    extraSpecialArgs = { inherit inputs; };
    users.moltbot = import ./home.nix;
  };

  system.stateVersion = "25.05";
}
