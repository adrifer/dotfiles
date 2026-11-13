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
| [windows-base](winix/profiles/windows-base.ts) | Common development shell, Terminal, and WSL support |
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

Run in built-in **Windows PowerShell** as the user to configure. The
[setup helper](setup/windows.ps1) handles prerequisites, cloning, and Windows
plus paired NixOS-WSL setup; no existing checkout or development tools needed.
Review the helper, then paste this block in a writable folder, replacing
`work-devbox-2` with your host:

```powershell
& {
    $ErrorActionPreference = 'Stop'
    Invoke-WebRequest -UseBasicParsing -OutFile .\windows.ps1 `
        -Uri 'https://raw.githubusercontent.com/adrifer/dotfiles/feat/windows-devbox-preview/setup/windows.ps1'
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\windows.ps1 -HostName work-devbox-2
}
```

Follow the prompts, including App Installer if WinGet is missing. If WSL needs
a reboot, restart and rerun the block with the same host.

| Argument | Purpose / default |
| --- | --- |
| `-HostName <host>` | Required Windows target from the host table above |
| `-Destination <path>` | Permanent checkout location; defaults to `$HOME\dotfiles` |
| `-Channel <channel>` | Installer channel: `stable` (default) or `preview` |
| `-Version <version>` | Exact installer release; cannot be combined with `-Channel` |
| `-Ref <ref>` | Checkout branch, tag, or commit; defaults to `feat/windows-devbox-preview` |
| `-PrepareOnly` | Prepare and preview without activation |

The download uses published GitHub files, not local changes. `-Channel` and
`-Version` select the installer; the checkout's manifest pins the Winix runtime.

### Linux/macOS

For bootstrap instructions, advanced options, and troubleshooting, use the
[Winix documentation](https://github.com/adrifer/winix#readme). Existing
Linux/macOS checkouts should live at `~/dotfiles`, as expected by the linked
application configs. Install Node.js/npm before using the daily workflow below
on any platform; the initial Windows bootstrap does not require them.

## Daily usage

Use the checkout's pinned Winix through npm on every platform, not a global
installation or standalone launcher. With Node.js and npm installed, run this
once from the repository root, and repeat `npm ci` after manifest or lockfile
changes:

```powershell
Set-Location .\winix
npm ci
```

Then run commands from `winix/`, selecting the intended host:

```powershell
npm exec -- winix check
npm exec -- winix switch --dry --host work-devbox-2
# Only after reviewing the plan:
npm exec -- winix switch --host work-devbox-2
```

Use the same npm commands on Linux/macOS with the corresponding host.
`apply` only generates output; `switch` activates it. `switch --dry` previews
without activation.

Authoring checks are listed in [AGENTS.md](AGENTS.md).

## Important caveats

- Back up personal files, credentials, repositories, and WSL exports before
  reinstalling. The personal Windows profile is still a work in progress;
  rehearse on a disposable machine before formatting the main PC.
- Windows-side NixOS provisioning refuses existing unrecorded distros rather
  than adopting or replacing them. Manage an existing Linux installation
  directly until its Windows-side setup is resolved; do not unregister it to
  clear an error.
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
