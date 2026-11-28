# Dotfiles

Personal and work machine configuration, managed with
[Winix](https://github.com/adrifer/winix).

## Overview

The repository root is the Winix project. See [AGENTS.md](AGENTS.md) for
editing rules and authoring checks.

| Path | Purpose |
| --- | --- |
| [winix.config.ts](winix.config.ts) | Nix inputs and the list of machines |
| [machines/](machines/) | One file per machine: its roles and machine-only extras |
| [roles/](roles/) | What a kind of machine gets (everywhere, dev, personal, work, OS basics) |
| [features/](features/) | One file per tool or topic, covering every OS it supports |
| [config/](config/) | Application config files that features link or copy, one folder per tool |
| [skills/](skills/) | Agent skills linked into `~/.agents/skills` |
| [assets/](assets/) | Wallpapers and other binary files |
| [setup/](setup/) | First-run setup scripts for Windows and Linux |
| `.winix/` | Generated output, runtime and editor types (ignored); never edit it |

Tooling and dependency versions are pinned by `package.json` and the lockfiles
at the root.

## Machines and roles

Each machine lists the roles it has; each role lists features; each feature
declares its tool for every OS it supports (Home Manager for Linux/WSL/macOS,
`windows.*` for Windows), and a machine gets the parts for its own platform.
For the whole picture run `winix inspect --matrix` (every feature against every
host, grouped by role); for one machine in full, `winix inspect --host <name>`.

| Machine | Hosts (platform) | Roles | Extras |
| --- | --- | --- | --- |
| [Personal PC](machines/adrifer-vision.ts) | `ADRIFER-VISION` (Windows) | everywhere, dev, personal, windows-desktop | NixOS-WSL distro, T3 proxy |
| | `wsl` (NixOS-WSL) | everywhere, dev, personal, linux-system | .NET, Rust, Docker, ffmpeg |
| [Work Dev Boxes](machines/work-devbox.ts) | `work-devbox`, `work-devbox-2`, `work-devbox-3` (Windows) | everywhere, work, windows-desktop | NixOS-WSL distro |
| | `wsl-work`, `wsl-work-2`, `wsl-work-3` (NixOS-WSL) | everywhere, dev, work, linux-system | |
| [MacBook Pro](machines/macbook-pro.ts) | `macbook-pro` (nix-darwin) | everywhere, dev, macos-system | |
| [Syncthing](machines/syncthing-lxc.ts) | `syncthing-lxc` (NixOS LXC) | (system only) | Syncthing |

| Role | What it adds |
| --- | --- |
| [everywhere](roles/everywhere.ts) | Shell (zsh or PowerShell, [same aliases](features/cli/shell.ts)), starship, zoxide, fzf, eza, lazygit, Neovim, Git/gh, VS Code Insiders, herdr, CLI tools, agent skills |
| [dev](roles/dev.ts) | JavaScript (Node, Bun, pnpm; NVM on Windows), Copilot/Codex/Claude CLIs, Playwright (Linux) |
| [personal](roles/personal.ts) | Personal apps and games, komorebi/whkd, per-user WinGet installs, sonarctl |
| [work](roles/work.ts) | Approved package feeds (Windows), work Linux settings, Azure Developer CLI, Tailscale |
| [windows-desktop](roles/windows-desktop.ts) | Windows preferences, Windows Terminal, WSL |
| [linux-system](roles/linux-system.ts) / [macos-system](roles/macos-system.ts) | Account, stable packages, Nix GC / Homebrew, macOS settings, Ghostty, Git Credential Manager |

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
`package.json` (checksum-verified), and applies the host, including the
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

`winix update` says when a newer Winix exists; it never changes it itself.

1. Where you edit the config, move the pin, check and push (read the linked
   changelog first):

   ```powershell
   winix upgrade
   winix plan
   git -C ~\dotfiles commit -am "chore: upgrade winix"; git -C ~\dotfiles push
   ```

2. Everywhere else (Windows PCs, WSL distros, Linux): `git pull` in that
   checkout, then `winix switch`. It downloads that release itself
   (checksum-verified) and removes older downloaded versions. On the Mac (npm
   route), run `npm install` after the pull.

### Editing the config

No npm install is needed: every `winix` command writes the pinned Winix's types
(SDK, NixOS/Home Manager option types, Node) to `.winix/types`, and
`tsconfig.json` points there, so VS Code autocompletes and type-checks right away
(after one `winix check` on a fresh checkout). `node_modules` never changes what
`winix` runs; `npm ci` is only needed for the npm route below and the
command-line `tsc` check in [AGENTS.md](AGENTS.md). To try Winix from source:
`$env:WINIX_SDK = 'D:\winix'; winix plan`.

For development (or on macOS), the npm route also works from the checkout
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
  existing backups rather than overwriting them blindly. After moving the
  checkout, run `winix switch` there: on Windows it offers to take over the
  packages and startup entries the old folder owned (answer yes once). If it
  can't tell which folder moved, `winix state migrate-owner --dry` (then
  `--yes`) does the same.
- Work VMs need nested virtualization for WSL 2. Respect organizational
  installation/execution policies and reboot manually when requested.

The bundled, unmodified [NixOS-WSL icon](https://github.com/nix-community/NixOS-WSL/blob/main/assets/NixOS-WSL.ico)
includes its [Apache 2.0 license](config/windows-terminal/nixos.ico.LICENSE).
