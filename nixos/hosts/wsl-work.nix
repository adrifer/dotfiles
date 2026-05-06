{ config, inputs, ... }:

let
  system = "x86_64-linux";
in
{
  flake.nixosConfigurations.wsl-work = inputs.nixpkgs.lib.nixosSystem {
    inherit system;
    modules = [
      config.flake.nixosModules.profile-base
      config.flake.nixosModules.profile-wsl
      (
        { pkgs, ... }:
        {
          networking.hostName = "wsl-work";
          system.stateVersion = "25.05";

          boot.kernel.sysctl = {
            "net.ipv4.ip_unprivileged_port_start" = 443;
            "fs.inotify.max_user_watches" = 1048576;
            "fs.inotify.max_user_instances" = 1024;
            "fs.inotify.max_queued_events" = 65536;
          };

          home-manager.users.adrifer.home.packages = with pkgs; [
            socat # Need this for copilot being able to query app insights
            bubblewrap # Need this for copilot being able to query app insights
          ];
        }
      )
    ];
  };
}
