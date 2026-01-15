{ config, lib, pkgs, ... }:

{
  networking.hostName = "wsl";

  # Keep your initial install’s state version
  system.stateVersion = "25.05";
}
