{
  description = "NixOS - Adrifer";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

    # Keep stable around for fallback
    nixpkgs-stable.url = "github:NixOS/nixpkgs/nixos-25.11";

    nixos-wsl.url = "github:nix-community/NixOS-WSL";
    nixos-wsl.inputs.nixpkgs.follows = "nixpkgs";

    home-manager.url = "github:nix-community/home-manager";
    home-manager.inputs.nixpkgs.follows = "nixpkgs";

    codex-cli-nix.url = "github:sadjow/codex-cli-nix";
    codex-cli-nix.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs =
    inputs@{ self, nixpkgs, nixpkgs-stable, nixos-wsl, home-manager, ... }:
    let
      system = "x86_64-linux";

      # Overlay that exposes pkgs.stable for fallback
      stableOverlay = final: prev: {
        stable = import nixpkgs-stable {
          inherit (final.stdenv.hostPlatform) system;
          config = final.config.nixpkgs.config or { };
        };
      };

      # one place to get pkgs outside NixOS (for devShell/formatter)
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ stableOverlay ];
        config.allowUnfree = true;
      };

      # Helper to create WSL hosts
      mkWSLHost = hostname: nixpkgs.lib.nixosSystem {
        inherit system;
        specialArgs = { inherit inputs system; };

        modules = [
          # WSL integration
          nixos-wsl.nixosModules.wsl

          # Shared modules
          ./modules/user-adrifer.nix
          ./modules/common-system.nix
          ./modules/wsl-only.nix

          # Host-specific config
          ./hosts/${hostname}/configuration.nix

          # Home Manager
          home-manager.nixosModules.home-manager
          {
            home-manager.useGlobalPkgs = true;
            home-manager.useUserPackages = true;

            home-manager.extraSpecialArgs = { inherit inputs system hostname; isWSL = true; };
            home-manager.users.adrifer = import ./home;
          }

          # Nixpkgs config
          ({ ... }: {
            nixpkgs = {
              overlays = [ stableOverlay ];
              config.allowUnfree = true;
              hostPlatform = system;
            };

            nix.settings.experimental-features = [ "nix-command" "flakes" ];
          })
        ];
      };

      # Helper to create LXC container hosts (headless servers, uses stable nixpkgs)
      mkLXCHost = hostname: nixpkgs-stable.lib.nixosSystem {
        inherit system;
        specialArgs = { inherit inputs system; };

        modules = [
          # LXC base settings
          ./modules/lxc-base.nix

          # Host-specific config
          ./hosts/${hostname}/configuration.nix

          # Nixpkgs config
          ({ ... }: {
            nixpkgs = {
              config.allowUnfree = true;
              hostPlatform = system;
            };
          })
        ];
      };
    in {
      nixosConfigurations = {
        wsl = mkWSLHost "wsl";
        wsl-work = mkWSLHost "wsl-work";

        # LXC containers (Proxmox)
        syncthing-lxc = mkLXCHost "syncthing-lxc";
        ela-lxc = mkLXCHost "ela-lxc";
      };
    };
}
