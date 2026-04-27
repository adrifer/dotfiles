# NixOS Dotfiles

Adri's NixOS configuration uses a dendritic flake layout: every `.nix` file outside entry points such as `flake.nix` and `import-tree.nix` is a top-level flake-parts module.

The repository is organized by feature and role instead of by NixOS/Home Manager layer. A single feature file can publish NixOS modules, Home Manager modules, overlays, or host outputs through the shared top-level flake-parts config.

## Structure

```text
nixos/
  flake.nix         # flake-parts entry point
  import-tree.nix   # imports all .nix files in a directory
  features/         # one file per feature
  profiles/         # reusable bundles of features
  hosts/            # one file per host declaration
  docs/             # architecture and operational docs
```

Feature modules publish reusable pieces under `config.flake.nixosModules.*` and `config.flake.homeModules.*`. Profile modules bundle common feature sets, such as `profile-base` for interactive Adri machines and `profile-wsl` for WSL-specific behavior. Host modules in `hosts/` compose one or more profiles plus host-specific settings into `flake.nixosConfigurations.*`.

Current hosts:

| Host | Purpose |
| --- | --- |
| `wsl` | Personal NixOS-WSL environment |
| `wsl-work` | Work NixOS-WSL environment |
| `syncthing-lxc` | Proxmox LXC container running Syncthing |

## How to Make Changes

Use this rule of thumb:

| Change | Put it in |
| --- | --- |
| Plain package with no extra config | `features/packages.nix` |
| Tool with env vars, activation hooks, shell integration, or multiple packages | `features/<tool>.nix` |
| WSL-specific behavior | `features/wsl.nix` and/or `profiles/wsl.nix` |
| Playwright/browser runtime setup | `features/playwright.nix` |
| Reusable machine role | `profiles/<role>.nix` |
| Concrete machine settings | `hosts/<host>.nix` |

Examples:

- JavaScript tooling lives in `features/javascript.nix`.
- .NET and Aspire setup lives in `features/dotnet.nix`.
- Neovim and `EDITOR=nvim` live in `features/neovim.nix`.
- WSL hosts import both `profile-base` and `profile-wsl`.
- The Syncthing LXC host imports `profile-lxc`.

See `docs/dendritic-architecture.md` for the detailed architecture and decision guide.

## Validation

```bash
nix flake check ./nixos --no-build

nix build ./nixos#nixosConfigurations.wsl.config.system.build.toplevel \
          ./nixos#nixosConfigurations.wsl-work.config.system.build.toplevel \
          ./nixos#nixosConfigurations.syncthing-lxc.config.system.build.toplevel \
          --no-link
```

New files must be staged before Nix flakes can see them during evaluation:

```bash
git add -N nixos/features/new-feature.nix
```

## 1. Install NixOS-WSL

1. Download the latest release from [nix-community/NixOS-WSL](https://github.com/nix-community/NixOS-WSL/releases).

2. Import it into WSL (from PowerShell or CMD):

   ```powershell
   wsl --install --from-file nixos.wsl
   ```

3. Launch the new distro:

   ```powershell
   wsl -d wsl-nixos
   ```

---

## 2. Bootstrap Git (inside WSL)

Run inside your new WSL instance:

```bash
nix-shell -p git
```

---

## 3. Clone this repository

```bash
git clone https://github.com/adrifer/dotfiles.git ~/dotfiles
cd ~/dotfiles
```

---

## 4. Link configuration to `/etc/nixos`

Replace the default configuration with a symlink to this repo:

```bash
sudo rm -rf /etc/nixos
sudo ln -s ~/dotfiles/nixos /etc/nixos
```

---

## 5. Apply the configuration

Run the initial rebuild, replacing the host name if needed:

```bash
sudo nixos-rebuild switch --flake /etc/nixos#wsl
```

After this, exit and restart WSL - you should now log in as your configured user.

---

## 6. Reboot the machine and re link dotfiles

```powershell
wsl -t NixOS
```

Then run NixOS again, and this time repeat the step #4 and #5
