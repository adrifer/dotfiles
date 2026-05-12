# AGENTS.md

This document gives AI agents the conventions for working with Adri's NixOS flake.

## Architecture

This repository uses the dendritic pattern with `flake-parts`: every `.nix` file outside entry points such as `flake.nix` and `import-tree.nix` is a top-level flake-parts module.

```text
nixos/
├── flake.nix              # flake-parts entry point; imports features/, profiles/, hosts/
├── import-tree.nix        # tiny helper that imports all .nix files in a directory
├── features/              # atomic capabilities; one file per feature/tool/concern
├── profiles/              # reusable machine roles composed from features
├── hosts/                 # concrete host declarations
├── docs/                  # operational and architecture docs
├── flake.lock             # locked input versions
└── README.md              # human setup overview
```

The old `home/` and `modules/` directories are intentionally gone. Do not recreate them.

## Mental Model

- **Features** publish reusable NixOS and/or Home Manager modules.
- **Profiles** compose features into reusable roles.
- **Hosts** compose one or more profiles plus host-specific settings into `flake.nixosConfigurations.*`.

Examples:

```text
features/git.nix        -> config.flake.homeModules.git
features/wsl.nix        -> config.flake.nixosModules.wsl-custom + config.flake.homeModules.wsl
features/macos.nix      -> config.flake.darwinModules.macos-custom
profiles/linux.nix      -> config.flake.nixosModules.profile-linux
profiles/macos.nix      -> config.flake.darwinModules.profile-macos
profiles/wsl.nix        -> config.flake.nixosModules.profile-wsl
hosts/wsl.nix           -> flake.nixosConfigurations.wsl
hosts/macbook-pro.nix   -> flake.darwinConfigurations.macbook-pro
```

## Current Modules

### Features

| File | Purpose |
| --- | --- |
| `features/packages.nix` | Plain miscellaneous cross-platform user packages only. Do not add env vars or activation hooks here. |
| `features/packages-linux.nix` | Plain miscellaneous Linux user packages only. Do not add env vars or activation hooks here. |
| `features/packages-macos.nix` | Plain miscellaneous macOS user packages only. Do not add env vars or activation hooks here. |
| `features/javascript.nix` | Node.js, Bun, PNPM, npm globals, npm/PNPM env vars and paths. |
| `features/dotnet.nix` | .NET SDK, DOTNET env vars, Aspire CLI activation, .NET tool paths. |
| `features/neovim.nix` | Neovim package and `EDITOR=nvim`. |
| `features/git.nix` | Home Manager Git config and identity/includes. |
| `features/zsh.nix` | Zsh config, aliases, plugins, shell functions. |
| `features/starship.nix` | Starship prompt config. |
| `features/fzf.nix` | Fzf Home Manager integration. |
| `features/zoxide.nix` | Zoxide Home Manager integration. |
| `features/dotfiles.nix` | Symlinks repo dotfiles into XDG config paths. |
| `features/playwright.nix` | Chromium package and Playwright browser env vars. |
| `features/macos.nix` | macOS nix-darwin settings. |
| `features/wsl.nix` | WSL NixOS config plus WSL-specific Home Manager bits such as stable `wslu`, browser, credential helper. |
| `features/user-adrifer.nix` | System user and Home Manager base user settings. |
| `features/nix-gc.nix` | Common Nix garbage collection and `/usr/bin/bash` symlink. |
| `features/overlays.nix` | Stable nixpkgs overlay exposed as `pkgs.stable`. |
| `features/flake-options.nix` | Declares custom mergeable `flake.homeModules` and `flake.darwinModules` options. |

### Profiles

| File | Purpose |
| --- | --- |
| `profiles/home-base.nix` | Shared Home Manager imports for interactive Adri machines. |
| `profiles/linux.nix` | Base interactive Linux profile: Home Manager plumbing, user, nixpkgs settings, nix-gc, and Linux package imports. |
| `profiles/macos.nix` | Base macOS profile: nix-darwin/Home Manager plumbing, nixpkgs settings, GC, and macOS package imports. |
| `profiles/wsl.nix` | WSL role: upstream NixOS-WSL module, custom WSL module, WSL home module, Playwright. |
| `profiles/lxc.nix` | LXC container role: container mode, SSH, root shell, server packages, system Git, Nix settings. |

### Hosts

| File | Purpose |
| --- | --- |
| `hosts/wsl.nix` | Personal WSL host; imports `profile-linux` and `profile-wsl`. |
| `hosts/wsl-work.nix` | Work WSL host; imports `profile-linux` and `profile-wsl`, plus work sysctls. |
| `hosts/macbook-pro.nix` | Personal macOS host; imports `profile-macos`. |
| `hosts/syncthing-lxc.nix` | Syncthing Proxmox LXC; imports `profile-lxc`, then defines Syncthing and backup timer. |

## Common Tasks

### Adding a Plain Package

Add it to `features/packages.nix`, `features/packages-linux.nix`, or `features/packages-macos.nix` only if it is just installed and needs no config.

If the package needs any of the following, create or update a dedicated feature file instead:

- session variables
- shell integration
- Home Manager `programs.*` config
- activation hooks
- custom PATH entries
- companion packages
- host/profile-specific composition

Examples:

- `starship` belongs in `features/starship.nix`, not a package-list feature.
- `nodejs`, `pnpm`, npm globals, and npm paths belong in `features/javascript.nix`.
- `dotnet` and Aspire setup belong in `features/dotnet.nix`.
- WSL-only user tooling belongs in `features/wsl.nix`.
- Playwright browser setup belongs in `features/playwright.nix`.

### Adding a New Feature

1. Create `features/<feature>.nix`.
2. Publish one or more modules:

   ```nix
   { ... }:

   {
     flake.homeModules.example = { pkgs, ... }: {
       home.packages = [ pkgs.example ];
     };

     flake.nixosModules.example = { ... }: {
       # Optional NixOS config for the same feature.
     };
   }
   ```

3. Import the published module from the relevant profile or host.
4. For new files, remember that Nix flakes only see tracked/staged files. Use `git add -N` or `git add` before evaluation.

### Adding a New Profile

Create `profiles/<role>.nix` when a group of features represents a reusable machine role.

```nix
{ config, ... }:

{
  flake.nixosModules.profile-example = { ... }: {
    imports = [
      config.flake.nixosModules.some-feature
    ];

    home-manager.users.adrifer.imports = [
      config.flake.homeModules.some-home-feature
    ];
  };
}
```

Use profiles for roles such as WSL, LXC, desktop, server, or base interactive machine setup.

### Adding a New WSL Host

1. Create `hosts/<hostname>.nix`.
2. Define `flake.nixosConfigurations.<hostname>`.
3. Import:
   - `config.flake.nixosModules.profile-linux`
   - `config.flake.nixosModules.profile-wsl`
4. Add only host-specific settings in the host file, such as `networking.hostName`, `system.stateVersion`, or host-only sysctls.

### Adding a New LXC Host

1. Create `hosts/<hostname>.nix`.
2. Use `inputs.nixpkgs-stable.lib.nixosSystem` unless there is a clear reason to use unstable.
3. Import `config.flake.nixosModules.profile-lxc`.
4. Put only that container's service configuration in the host file.
5. See `docs/proxmox-nixos-lxc.md` for deployment details.

## Rules for Future Changes

- Do not pass `specialArgs` or `extraSpecialArgs` just to share repo-local values. Prefer publishing values/modules through the top-level flake-parts `config`.
- Do not reintroduce `isWSL` or `hostname` conditionals for shared Home Manager imports. Compose the right modules in the host/profile instead.
- Keep package-list features boring: plain package installs only.
- Prefer a feature file over a package-list entry when config is required.
- Prefer a profile when the concept is a machine role or reusable bundle.
- Keep host files small and concrete.
- Do not update `system.stateVersion` unless intentionally reinstalling/rebaselining that machine.
- New `.nix` files must be staged before `nix flake check` or `nix build` can see them.

## Build and Validation Commands

```bash
# Evaluate all flake outputs without building
nix flake check ./nixos --no-build

# Build all current host toplevels without creating result symlinks
nix build ./nixos#nixosConfigurations.wsl.config.system.build.toplevel \
          ./nixos#nixosConfigurations.wsl-work.config.system.build.toplevel \
          ./nixos#nixosConfigurations.syncthing-lxc.config.system.build.toplevel \
          --no-link

# Rebuild current host from /etc/nixos
sudo nixos-rebuild switch --flake /etc/nixos

# Rebuild a specific host
sudo nixos-rebuild switch --flake /etc/nixos#wsl-work
```

## Shell Aliases

Defined in `features/zsh.nix`:

- `i` - rebuild NixOS: `sudo nixos-rebuild switch --flake /etc/nixos`
- `u` - update flake and rebuild
- `gc` - garbage collect: `sudo nix-collect-garbage -d`
