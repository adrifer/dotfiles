{ lib, pkgs, ... }:
let
  username = "adrifer";
in
{
  programs.zsh.enable = true;

  users.users.${username} = {
    isNormalUser = true;
    extraGroups = [ "wheel" ]; # sudo
    # Optional: pin UID to keep consistent ownership across machines
    uid = 1000;
    # Optional: seed SSH key(s)
    # openssh.authorizedKeys.keys = [ "ssh-ed25519 AAAA..." ];
  };

  users.defaultUserShell = pkgs.zsh;

  # Optional: passwordless sudo policy (toggle to your taste)
  # security.sudo.wheelNeedsPassword = false;
}
