# AGENTS.md

This document provides context for AI agents working with this NixOS flake configuration.

## Repository Structure

```
nixos/
├── flake.nix              # Main flake configuration with inputs and host definitions
├── flake.lock             # Locked input versions
├── home/                  # Home Manager configuration
│   ├── default.nix        # Main HM entry point, imports all HM modules
│   ├── packages.nix       # Common packages for all hosts
│   ├── packages-wsl.nix   # WSL-specific packages (imported conditionally)
│   ├── zsh.nix            # Zsh shell configuration
│   ├── git.nix            # Git configuration
│   ├── starship.nix       # Starship prompt configuration
│   ├── fzf.nix            # Fzf configuration
│   ├── zoxide.nix         # Zoxide configuration
│   └── dotfiles.nix       # Dotfile symlinks
├── hosts/                 # Host-specific configurations
│   ├── wsl/               # Personal WSL host
│   │   └── configuration.nix
│   └── wsl-work/          # Work WSL host
│       └── configuration.nix
└── modules/               # Shared NixOS modules
    ├── common-system.nix  # Common system settings (bash symlink, auto gc)
    ├── user-adrifer.nix   # User account configuration
    └── wsl-only.nix       # WSL-specific settings (interop, credential helper)
```

## Key Concepts

### Flake Structure
- **nixpkgs**: Points to `nixos-unstable` (latest packages by default)
- **nixpkgs-stable**: Available as `pkgs.stable.*` for fallback
- **mkWSLHost**: Helper function to create WSL host configurations

### Conditional Configuration
- **`isWSL`**: Boolean passed via `extraSpecialArgs` to Home Manager modules
- **`hostname`**: Current host name passed to HM for host-specific conditionals

Example usage in HM modules:
```nix
{ lib, isWSL ? false, hostname ? "unknown", ... }:
{
  imports = lib.optionals isWSL [ ./packages-wsl.nix ];
  
  home.packages = lib.optionals (hostname == "wsl-work") [ some-package ];
}
```

### Package Management
- Most packages come from unstable nixpkgs (default)
- Use `pkgs.stable.packageName` for stable versions
- NPM global packages defined in `npmGlobalPkgs` list in `packages.nix`
- `codex-cli-nix` is a separate flake input

## Common Tasks

### Adding a New Package
1. Add to `home/packages.nix` in the `home.packages` list
2. For WSL-only packages, add to `home/packages-wsl.nix`
3. For work-only packages, use `lib.optionals (hostname == "wsl-work") [ pkg ]`

### Adding a New WSL Host
1. Create `hosts/<hostname>/configuration.nix` with hostname and stateVersion
2. Add to `flake.nix`: `<hostname> = mkWSLHost "<hostname>";`

### Adding a Non-WSL Host
Create a new helper function similar to `mkWSLHost` but without:
- `nixos-wsl.nixosModules.wsl`
- `./modules/wsl-only.nix`
- Set `isWSL = false` in `extraSpecialArgs`

## Build Commands

```bash
# Rebuild current host (uses hostname to find config)
sudo nixos-rebuild switch --flake /etc/nixos

# Rebuild specific host
sudo nixos-rebuild switch --flake /etc/nixos#wsl-work

# Update flake inputs and rebuild
nix flake update --flake /etc/nixos && sudo nixos-rebuild switch --flake /etc/nixos

# Garbage collect old generations
sudo nix-collect-garbage -d
```

## Shell Aliases (defined in zsh.nix)

- `i` - Rebuild NixOS (`sudo nixos-rebuild switch --flake /etc/nixos`)
- `u` - Update flake and rebuild
- `gc` - Garbage collect (`sudo nix-collect-garbage -d`)

## Important Notes

1. **stateVersion**: Keep at the version you first installed (25.05), don't update it
2. **Git credential helper**: Uses a wrapper script for Windows Git Credential Manager
3. **WSL interop**: Must be enabled for Windows exe execution; restart WSL after changes
4. **New files**: Must be `git add`ed before Nix can see them in the flake
