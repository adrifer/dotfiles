{
  description = "NixOS - Adrifer";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";

    # Keep unstable around for select packages
    nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixos-unstable";

    nixos-wsl.url = "github:nix-community/NixOS-WSL";
    nixos-wsl.inputs.nixpkgs.follows = "nixpkgs";

    home-manager.url = "github:nix-community/home-manager/release-25.11";
    home-manager.inputs.nixpkgs.follows = "nixpkgs";

    codex-cli-nix.url = "github:sadjow/codex-cli-nix";
    codex-cli-nix.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs =
    inputs@{ self, nixpkgs, nixpkgs-unstable, nixos-wsl, home-manager, ... }:
    let
      system = "x86_64-linux";

      # a tidy overlay that exposes pkgs.unstable
      unstableOverlay = final: prev: {
        unstable = import nixpkgs-unstable {
          inherit (final.stdenv.hostPlatform) system;
          config = final.config.nixpkgs.config or { };
        };
      };

      # one place to get pkgs outside NixOS (for devShell/formatter)
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ unstableOverlay ];
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
              overlays = [ unstableOverlay ];
              config.allowUnfree = true;
              hostPlatform = system;
            };

            nix.settings.experimental-features = [ "nix-command" "flakes" ];
          })
        ];
      };
    in {
      nixosConfigurations = {
        wsl = mkWSLHost "wsl";
        wsl-work = mkWSLHost "wsl-work";
      };
    };
}
