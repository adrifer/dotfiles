{ config, lib, pkgs, inputs, ... }:
{
  imports = [
    inputs.home-manager-stable.nixosModules.home-manager
  ];

  networking.hostName = "ela-lxc";

  # Moltbot overlay
  nixpkgs.overlays = [ inputs.nix-moltbot.overlays.default ];

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
