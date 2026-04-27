# Dendritic Architecture

This flake uses the dendritic pattern: every `.nix` file outside entry points is a module of one top-level flake-parts configuration.

## Why This Layout

The previous layout split related config across `home/`, `modules/`, and host directories. That made cross-cutting concerns awkward. For example, WSL behavior involved NixOS WSL settings, Home Manager packages, shell environment, Git credential helper, and browser settings in separate places.

The dendritic layout keeps related behavior together:

```text
features/wsl.nix        # WSL NixOS + WSL Home Manager config
features/javascript.nix # Node/Bun/PNPM/npm globals and paths
features/dotnet.nix     # .NET SDK, DOTNET env vars, Aspire CLI
profiles/wsl.nix        # WSL machine role
hosts/wsl.nix           # concrete machine
```

The goal is not fewer files. The goal is that each file owns one concept across all relevant layers.

## Layers

### Features

`features/` contains atomic capabilities. A feature can publish:

- a NixOS module under `flake.nixosModules.*`
- a Home Manager module under `flake.homeModules.*`
- an overlay under `flake.overlays.*`
- any other flake output needed by that feature

Example shape:

```nix
{ ... }:

{
  flake.homeModules.example = { pkgs, ... }: {
    home.packages = [ pkgs.example ];
  };

  flake.nixosModules.example = { ... }: {
    services.example.enable = true;
  };
}
```

Current feature conventions:

| File | Owns |
| --- | --- |
| `packages.nix` | Plain package list only. |
| `javascript.nix` | Node.js, Bun, PNPM, npm globals, npm/PNPM env/path setup. |
| `dotnet.nix` | .NET SDK, DOTNET env vars, Aspire CLI activation. |
| `neovim.nix` | Neovim package and editor environment. |
| `playwright.nix` | Chromium and Playwright browser env vars. |
| `wsl.nix` | WSL system config and WSL user integration. Uses stable `wslu` because unstable removed it. |
| `git.nix`, `zsh.nix`, `starship.nix`, `fzf.nix`, `zoxide.nix` | Dedicated Home Manager program config. |

### Profiles

`profiles/` contains reusable machine roles. Profiles compose features but should avoid host-specific values like hostnames.

Current profiles:

| Profile | Purpose |
| --- | --- |
| `profile-base` | Common interactive Adri machine: user, Home Manager plumbing, nixpkgs settings, GC, and dev/user features. |
| `profile-wsl` | WSL role: upstream NixOS-WSL module, custom WSL behavior, WSL user integration, Playwright setup. |
| `profile-lxc` | Proxmox LXC role: container mode, SSH, root shell, server packages, system Git, Nix settings. |

Profiles are normal NixOS modules published from flake-parts:

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

### Hosts

`hosts/` contains concrete machines. Host files should stay small:

- choose `nixpkgs.lib.nixosSystem` or `nixpkgs-stable.lib.nixosSystem`
- import profiles
- set `networking.hostName`
- set `system.stateVersion`
- add host-specific services or overrides

Example:

```nix
{ config, inputs, ... }:

let
  system = "x86_64-linux";
in
{
  flake.nixosConfigurations.wsl = inputs.nixpkgs.lib.nixosSystem {
    inherit system;
    modules = [
      config.flake.nixosModules.profile-base
      config.flake.nixosModules.profile-wsl
      {
        networking.hostName = "wsl";
        system.stateVersion = "25.05";
      }
    ];
  };
}
```

## Decision Guide

### Should this go in `packages.nix`?

Only if it is a plain package install.

Use a dedicated feature instead if the package needs:

- env vars
- activation hooks
- shell config
- service config
- PATH additions
- Home Manager `programs.*` settings
- multiple related packages

Examples:

- `starship` is not in `packages.nix`; it belongs to `features/starship.nix`.
- `nodejs`, `bun`, `pnpm`, npm globals, and npm paths belong to `features/javascript.nix`.
- `dotnet` and Aspire belong to `features/dotnet.nix`.
- `chromium` for Playwright belongs to `features/playwright.nix`.

### Should this be a feature or profile?

Use a **feature** when the concept is an individual capability or tool.

Use a **profile** when the concept describes a machine role or reusable bundle:

- WSL machine
- LXC container
- base interactive machine
- future desktop/server roles

### Should this be host-specific?

Put it in `hosts/<host>.nix` when it only applies to one named machine:

- hostname
- `system.stateVersion`
- work-only sysctls
- Syncthing device/folder declarations for the Syncthing container
- one-off service definitions

## Avoided Patterns

Do not reintroduce:

- `home/` as a separate Home Manager module tree
- `modules/` as a separate NixOS module tree
- `isWSL` flags passed into Home Manager
- hostname conditionals for deciding imports
- `specialArgs`/`extraSpecialArgs` just to access repo-local modules
- giant package lists that also configure tools

Instead, publish modules through top-level flake-parts config and compose them in profiles/hosts.

## Validation

Because flakes evaluate the Git source, new files must be staged before validation:

```bash
git add -N nixos/features/new-feature.nix
```

Then run:

```bash
nix flake check ./nixos --no-build

nix build ./nixos#nixosConfigurations.wsl.config.system.build.toplevel \
          ./nixos#nixosConfigurations.wsl-work.config.system.build.toplevel \
          ./nixos#nixosConfigurations.syncthing-lxc.config.system.build.toplevel \
          --no-link
```

## Future Improvement

The current flake uses a custom `flake.homeModules` option plus standard `flake.nixosModules`. A future cleanup could use `inputs.flake-parts.flakeModules.modules` and publish modules under typed `flake.modules.*` namespaces for better class checking.
