# Dotfiles

Personal and work machine configuration, managed with
[Winix](https://github.com/adrifer/winix).

## Overview

Make system configuration changes in **`winix/`**, not the legacy `nixos/`.
See [AGENTS.md](AGENTS.md) for editing rules and authoring checks.

| Path | Purpose |
| --- | --- |
| [winix/winix.config.ts](winix/winix.config.ts) | Host definitions and Nix inputs |
| [winix/features/](winix/features/) | Packages, settings, and application integrations |
| [winix/profiles/](winix/profiles/) | Shared compositions of features |
| `winix/.winix/out/` | Generated output; never edit manually |
| `windows/`, `nvim/`, and other application directories | Config files linked or copied by features |
| `nixos/` | Legacy configuration, retained for reference |

Tooling and dependency versions are pinned by the manifest and lockfiles in
`winix/`.

## Hosts and profiles

| Windows target | Windows profile | NixOS-WSL target / hostname |
| --- | --- | --- |
| `ADRIFER-VISION` | `windows-personal` | `wsl` |
| `work-devbox` | `windows-work` | `wsl-work` |
| `work-devbox-2` | `windows-work` | `wsl-work-2` |

These are configuration targets, not Windows rename operations. Each Windows
host selects its paired Linux target; the WSL distribution is named `NixOS`.

| Profile | Role |
| --- | --- |
| [home-base](winix/profiles/home-base.ts) | Shared Home Manager shell, editor, Git, dotfiles, and development tools |
| [linux-profile](winix/profiles/linux.ts) | Home base plus Linux packages, user account, and Nix cleanup |
| [macos-profile](winix/profiles/macos.ts) | Home base plus macOS settings, Homebrew, user account, and packages |
| [wsl-work](winix/profiles/wsl-work.ts) | Linux profile plus WSL integration, work settings, and Azure Developer CLI |
| [windows-base](winix/profiles/windows-base.ts) | Common development shell, Terminal, WSL support, and app/system dark mode |
| [windows-work](winix/profiles/windows-work.ts) | Base plus work PowerShell repository policy |
| [windows-personal](winix/profiles/windows-personal.ts) | Base plus personal applications, editor configs, and Komorebi/whkd |

The personal `wsl` host extends `linux-profile`; `wsl-work` and `wsl-work-2`
share the `wsl-work` profile. `macbook-pro` uses `macos-profile`, while
`syncthing-lxc` composes its features directly. Keep machine-specific extras in
the host definitions in [winix.config.ts](winix/winix.config.ts).

## Initial setup

Review the [important caveats](#important-caveats) before setting up an existing
machine.

### Windows: from a fresh installation

In **Windows PowerShell**, as the user to configure (review
[setup/windows.ps1](setup/windows.ps1) first if you like):

```powershell
irm https://raw.githubusercontent.com/adrifer/dotfiles/feat/windows-devbox-preview/setup/windows.ps1 -OutFile $env:TEMP\setup.ps1
powershell -ExecutionPolicy Bypass -File $env:TEMP\setup.ps1
```

It lists the hosts above, asks which one this PC is, and asks **once** to
continue. It then installs Git, PowerShell 7 and DSC (approve the UAC prompts),
clones this repository to `$HOME\dotfiles`, downloads the Winix version pinned in
`winix/package.json` (checksum-verified), and applies the host, including the
NixOS-WSL distro. If WinGet is missing, it opens App Installer in the Store first.

If Windows needs a restart (enabling WSL), restart and run the same two lines
again: it reuses the checkout and the chosen host.

| Option | Purpose |
| --- | --- |
| `-HostName <host>` | Skip the question |
| `-PrepareOnly` | Prepare and preview without applying anything |
| `-DryRun` | Only show what would happen |
| `-Ref <ref>` | Branch, tag or commit (default `feat/windows-devbox-preview`) |
| `-Destination <path>` | Checkout location (default `$HOME\dotfiles`) |

### Linux/macOS

For bootstrap instructions, advanced options, and troubleshooting, use the
[Winix documentation](https://github.com/adrifer/winix#readme). Existing
Linux/macOS checkouts should live at `~/dotfiles`, as expected by the linked
application configs.

## Daily usage

On Windows, setup installs a `winix` command (open a new terminal once). It runs
the pinned Winix for this checkout from any folder and remembers the host:

```powershell
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

2. On other Windows PCs: `git pull`, then `winix switch`. It downloads that
   release itself (checksum-verified) and removes older downloaded versions.
3. Inside NixOS-WSL, from `~/dotfiles/winix`:
   `git pull && npm ci && npm exec -- winix switch --host <wsl-host>`
   (the Linux side does not download releases by itself yet).

`winix` uses `winix/node_modules` whenever it exists (`npm ci` was run), so keep
that to the PC where you edit the config (editor types, testing Winix sources).
There, run `npm ci` after pulling a bump; elsewhere, deleting `node_modules`
goes back to the downloaded release.

For development (or on Linux/macOS), the npm route also works from `winix/`
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
