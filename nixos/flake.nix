{
  description = "NixOS - Adrifer";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";

    # Keep unstable around for select packages
    nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixos-unstable";

    nixos-wsl.url = "github:nix-community/NixOS-WSL";
    nixos-wsl.inputs.nixpkgs.follows = "nixpkgs";

    home-manager.url = "github:nix-community/home-manager/release-25.05";
    home-manager.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs =
    inputs@{ self, nixpkgs, nixpkgs-unstable, nixos-wsl, home-manager, ... }:
    let
      system = "x86_64-linux";

      # a tidy overlay that exposes pkgs.unstable
      unstableOverlay = final: prev: {
        unstable = import nixpkgs-unstable {
          # inherit nixpkgs config flags like allowUnfree
          inherit (final) system;
          config = final.config.nixpkgs.config or { };
        };
      };

      # one place to get pkgs outside NixOS (for devShell/formatter)
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ unstableOverlay ];
        config.allowUnfree = true;
      };
    in {
      # Nice-to-have outside NixOS:
      # formatter.${system} = pkgs.nixpkgs-fmt;
      # devShells.${system}.default = pkgs.mkShell { };

      nixosConfigurations.wsl-nixos = nixpkgs.lib.nixosSystem {
        system = system;
        specialArgs = { inherit inputs system; };

        modules = [
          # WSL integration
          nixos-wsl.nixosModules.wsl

          # Your modules
          ./modules/user-adrifer.nix
          ./modules/common-system.nix
          ./modules/wsl-only.nix

          # Host-specific config
          ./hosts/wsl-nixos/configuration.nix

          # Home Manager
          home-manager.nixosModules.home-manager
          {
            home-manager.useGlobalPkgs = true;
            home-manager.useUserPackages = true;

            # pass inputs/system to HM modules too
            home-manager.extraSpecialArgs = { inherit inputs system; };
            home-manager.users.adrifer = import ./home;
          }

          # One small combined module for nixpkgs + features
          ({ ... }: {
            nixpkgs = {
              overlays = [ unstableOverlay ];
              config.allowUnfree = true;
              hostPlatform = system; # preferred on 25.05
            };

            nix.settings.experimental-features = [ "nix-command" "flakes" ];
          })
        ];
      };
    };
}
