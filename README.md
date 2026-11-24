# Dotfiles

Personal and work machine configuration, managed with
[Winix](https://github.com/adrifer/winix).

## Overview

Make system configuration changes in **`winix/`**, not the legacy `nixos/`.
See [AGENTS.md](AGENTS.md) for editing rules and authoring checks.

| Path | Purpose |
| --- | --- |
| [winix/machines/](winix/machines/) | One file per machine: its roles and machine-only extras |
| [winix/roles/](winix/roles/) | What a kind of machine gets (everywhere, dev, personal, work, OS basics) |
| [winix/features/](winix/features/) | One file per tool or topic, covering every OS it supports |
| [winix/winix.config.ts](winix/winix.config.ts) | Nix inputs and the list of machines |
| `winix/.winix/out/` | Generated output; never edit manually |
| `windows/`, `nvim/`, and other application directories | Config files linked or copied by features |
| `nixos/` | Legacy configuration, retained for reference |

Tooling and dependency versions are pinned by the manifest and lockfiles in
`winix/`.

## Machines and roles

Each machine lists the roles it has; each role lists features; each feature
declares its tool for every OS it supports (Home Manager for Linux/WSL/macOS,
`windows.*` for Windows), and a machine gets the parts for its own platform.
For the whole picture run `winix inspect --matrix` (every feature against every
host, grouped by role); for one machine in full, `winix inspect --host <name>`.

| Machine | Hosts (platform) | Roles | Extras |
| --- | --- | --- | --- |
| [Personal PC](winix/machines/adrifer-vision.ts) | `ADRIFER-VISION` (Windows) | everywhere, dev, personal, windows-desktop | NixOS-WSL distro, T3 proxy |
| | `wsl` (NixOS-WSL) | everywhere, dev, personal, linux-system | .NET, Rust, Docker, ffmpeg |
| [Work Dev Boxes](winix/machines/work-devbox.ts) | `work-devbox`, `work-devbox-2`, `work-devbox-3` (Windows) | everywhere, work, windows-desktop | NixOS-WSL distro |
| | `wsl-work`, `wsl-work-2`, `wsl-work-3` (NixOS-WSL) | everywhere, dev, work, linux-system | |
| [MacBook Pro](winix/machines/macbook-pro.ts) | `macbook-pro` (nix-darwin) | everywhere, dev, macos-system | |
| [Syncthing](winix/machines/syncthing-lxc.ts) | `syncthing-lxc` (NixOS LXC) | (system only) | Syncthing |

| Role | What it adds |
| --- | --- |
| [everywhere](winix/roles/everywhere.ts) | Shell (zsh or PowerShell, [same aliases](winix/features/cli/shell.ts)), starship, zoxide, fzf, eza, lazygit, Neovim, Git/gh, VS Code Insiders, herdr, CLI tools, agent skills |
| [dev](winix/roles/dev.ts) | JavaScript (Node, Bun, pnpm; NVM on Windows), Copilot/Codex/Claude CLIs, Playwright (Linux) |
| [personal](winix/roles/personal.ts) | Personal apps and games, komorebi/whkd, per-user WinGet installs, sonarctl |
| [work](winix/roles/work.ts) | Approved package feeds (Windows), work Linux settings, Azure Developer CLI, Tailscale |
| [windows-desktop](winix/roles/windows-desktop.ts) | Windows preferences, Windows Terminal, WSL |
| [linux-system](winix/roles/linux-system.ts) / [macos-system](winix/roles/macos-system.ts) | Account, stable packages, Nix GC / Homebrew, macOS settings, Ghostty, Git Credential Manager |

Host names are configuration targets, not Windows rename operations; each
Windows host provisions its paired Linux host in a WSL distro named `NixOS`.
Features live in `features/cli` (terminal tools), `features/dev`,
`features/desktop` (Windows/macOS desktop and apps), `features/system`
(OS integration) and `features/apps`. To add a tool, give it one feature file
with every OS it needs and put it in a role; something only one machine needs
goes in that machine's file.

## Initial setup

Review the [important caveats](#important-caveats) before setting up an existing
machine.

### Windows: from a fresh installation

In **Windows PowerShell** (not PowerShell 7), as the user to configure, with no
PowerShell 7 windows open (review [setup/windows.ps1](setup/windows.ps1) first
if you like):

```powershell
irm https://raw.githubusercontent.com/adrifer/dotfiles/main/setup/windows.ps1 -OutFile $env:TEMP\setup.ps1
powershell -ExecutionPolicy Bypass -File $env:TEMP\setup.ps1
```

It lists the hosts above, asks which one this PC is, and asks **once** to
continue. It then installs Git, PowerShell 7 and DSC (approve the UAC prompts),
clones this repository to `$HOME\dotfiles`, downloads the Winix version pinned in
`winix/package.json` (checksum-verified), and applies the host, including the
NixOS-WSL distro. If WinGet is missing, it opens App Installer in the Store first.

If Windows needs a restart (enabling WSL), restart and run the same two lines
again: it reuses the checkout and the chosen host.

If PowerShell 7 is already installed but older than the locked version, the
script fixes that first. winget's PowerShell is an MSIX package, so it can't
upgrade a copy from the classic installer (which Dev Box images ship). For that
copy, the script offers to install winget's MSIX and then remove the old one, so
Winix can upgrade it from then on. Run the script from Windows PowerShell with
no PowerShell 7 windows open. Rerunning it later fixes an existing machine too.

| Option | Purpose |
| --- | --- |
| `-HostName <host>` | Skip the question |
| `-PrepareOnly` | Prepare and preview without applying anything |
| `-DryRun` | Only show what would happen |
| `-ReplacePowerShell` | Replace an outdated classic PowerShell 7 without asking |
| `-Ref <ref>` | Branch, tag or commit (default `main`) |
| `-Destination <path>` | Checkout location (default `$HOME\dotfiles`) |

### NixOS-WSL and Linux

A NixOS distro created by the Windows setup is already set up: it has its own
checkout at `~/dotfiles` and the `winix` command. From then on it is managed from
inside WSL; Windows switches never change it again.

For an existing distro, or a Linux machine, run inside it (it reuses an existing
`~/dotfiles`, even an SSH clone, and never pulls or resets it):

```bash
curl -fsSL https://raw.githubusercontent.com/adrifer/dotfiles/main/setup/linux.sh -o /tmp/setup.sh
bash /tmp/setup.sh
```

It asks which host this is and asks **once** to continue, then downloads the
pinned Winix (checksum-verified), installs `~/.local/bin/winix` and applies the
host (`sudo` asks for your password). It takes the same `--host`,
`--prepare-only`, `--dry-run`, `--ref` and `--destination` options.

### macOS

There is no standalone Winix for macOS yet: clone to `~/dotfiles` and use the
npm route below. See the [Winix documentation](https://github.com/adrifer/winix#readme).

## Daily usage

Setup installs a `winix` command on Windows (open a new terminal once) and in
WSL/Linux. Inside this checkout (or any other Winix project) it runs the Winix
version the project pins; from any other folder, `winix plan` and `winix switch`
use this checkout, with the host it remembered. Each side is switched on its own:

```bash
winix plan            # what would change (nothing is applied)
winix switch          # apply it
```

### Updating Winix

1. Where you edit the config, bump the pin and push:

   ```powershell
   cd ~\dotfiles\winix
   npm install --save https://github.com/adrifer/winix/releases/download/vX/adrifer-winix-X.tgz
   git commit -am "chore: bump winix to X"; git push
   ```

2. Everywhere else (Windows PCs, WSL distros, Linux): `git pull` in that
   checkout, then `winix switch`. It downloads that release itself
   (checksum-verified) and removes older downloaded versions.

### Editing the config

No npm install is needed: every `winix` command writes the pinned Winix's types
(SDK, NixOS/Home Manager option types, Node) to `winix/.winix/types`, and
`tsconfig.json` points there, so VS Code autocompletes and type-checks right away
(after one `winix check` on a fresh checkout). `node_modules` never changes what
`winix` runs; `npm ci` is only needed for the npm route below and the
command-line `tsc` check in [AGENTS.md](AGENTS.md). To try Winix from source:
`$env:WINIX_SDK = 'D:\winix'; winix plan`.

For development (or on macOS), the npm route also works from `winix/`
after `npm ci`: `npm exec -- winix switch --host <host>`.
`apply` only generates output; `switch` activates it. Authoring checks are
listed in [AGENTS.md](AGENTS.md).

## Important caveats

- Back up personal files, credentials, repositories, and WSL exports before
  reinstalling. The personal Windows profile is still a work in progress;
  rehearse on a disposable machine before formatting the main PC.
- An existing `NixOS` distro is adopted (recorded, not changed) when it runs
  WSL 2 and NixOS with the host's Linux hostname; anything else is refused
  rather than replaced. Never unregister a distro to clear an error.
- `work-devbox-2` was previously named `windows-devbox`. Applied-state ownership
  was not migrated by that source rename; review it before activating the
  renamed target on the already-managed Dev Box.
- Config files are live links to this checkout. Keep its location stable;
  application edits can modify repository files. Review conflicting files and
  existing backups rather than overwriting them blindly.
- Work VMs need nested virtualization for WSL 2. Respect organizational
  installation/execution policies and reboot manually when requested.

The bundled, unmodified [NixOS-WSL icon](https://github.com/nix-community/NixOS-WSL/blob/main/assets/NixOS-WSL.ico)
includes its [Apache 2.0 license](windows/terminal-preview/nixos.ico.LICENSE).
