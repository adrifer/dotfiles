# Dotfiles

System configuration is managed through **[Winix](winix/)**.
Make configuration changes there, not in `nixos/`.

| Path | Role |
| --- | --- |
| `winix/winix.config.ts` | Active host definitions and Nix inputs |
| `winix/features/` | Active package, tool, Git, shell, WSL, and service configuration |
| `winix/profiles/` | Shared configuration composed into hosts |
| `winix/flake.lock` | Active Nix input versions |
| `winix/.winix/out/` | Generated backend output, not for manual edits |
| `nixos/` | Legacy configuration, retained for reference only |
| Other tool directories | Application config files, some linked by Winix |

For example, the WSL Git credential helper is configured in
[`winix/features/wsl.ts`](winix/features/wsl.ts), not
`nixos/features/wsl.nix`.

## Change and apply configuration

Read [`AGENTS.md`](AGENTS.md) for repository editing rules.
From the repository root:

```bash
cd winix
npm exec -- winix --skill
npm exec -- winix check
npm exec -- tsc --noEmit
npm exec -- winix apply --dry --host wsl-work
```

To activate the configuration:

```bash
npm exec -- winix switch --host wsl-work
```

Choose the intended host from `winix.config.ts`. `winix apply` only generates
files; `winix switch` generates and activates them.

Do not rebuild from `/etc/nixos` or `./nixos`. Those can select the legacy
configuration and its older lockfile rather than the active Winix configuration.

## Windows reinstall: staged restore

The Windows target is `ADRIFER-VISION`; the personal NixOS-WSL target is
`wsl` (`wsl-work` is a separate work configuration). The selected Windows apps
are declared in `packagesWindows` in `winix/features/packages.ts`.
`winix/features/windows-desktop.ts` composes that feature with Developer Mode
and live links to this checkout's Neovim and lazygit configs, plus the
`windowsShell` and `windowsWindowManager` features. This is not yet a complete
unattended machine restore.

### PowerShell and Terminal Preview

`winix/features/windows-shell.ts` deploys the configuration from
`windows/powershell/`, `windows/terminal-preview/`, and `windows/starship/`:

- All three configuration files are live symlinks to this checkout, ordered
  after Developer Mode. Keep the checkout in a stable location. Source edits
  are picked up when the shell/app reloads; they do not require reapplying Winix.
- The PowerShell 7 profile imports Terminal-Icons and initializes Starship and
  zoxide. `windows.powershell.module("Terminal-Icons")` installs the version
  pinned in `winix/winix-windows.lock` from PSGallery. Versions live in the
  lockfile, not the TypeScript or profile; an unversioned import can select a
  newer version if one is separately installed.
- File and module scripts run directly in PowerShell 7 through DSC. `pwsh` must
  already be on PATH before resource discovery; declaring its package does not
  bootstrap that prerequisite.
- The target profile directory uses Windows' actual Documents known folder at
  apply time through `windows.knownFolder.documents(...)`, so OneDrive
  redirection and a different Windows username work. Other targets use the
  corresponding named known-folder helpers. Link sources are relative to
  `winix/winix.config.ts`, not the feature file or current directory.
- Starship preserves the current Windows Catppuccin Macchiato prompt,
  independently of the Linux/macOS Home Manager Starship configuration.
- Terminal Preview preserves Catppuccin Macchiato, pane/tab keybindings, and
  explicit NixOS, PowerShell, and NixOS Herdr profiles. It uses
  `JetBrainsMono NF` throughout, installed via `DEVCOM.JetBrainsMonoNerdFont`,
  instead of relying on the old manually installed Delugia font.
- `repos` uses `WINIX_REPOS`, generated from this checkout's parent directory;
  `dl` uses the home Downloads directory and `desk` resolves the Desktop known
  folder. `lg`, `code` (Insiders), `kstart`, and `kstop` are retained.

Old work-repository paths, the AAD process-reset function, hardcoded monitor
controls, stale Visual Studio entries, and machine-specific SSH profile GUIDs
are not copied. SSH profiles can be rediscovered from separately restored SSH
configuration. Komorebi commands are available; sign-in startup is managed
separately as described below.

The three managed configuration links back up existing files to `.bak` before
replacing them, even if a regular file already has the desired content. Correct
links are left untouched. If a backup already exists when replacement is needed,
applying fails rather than overwriting the backup: archive/move it aside after
reviewing it, then retry. Review private values in existing files before moving
backups anywhere public. Terminal UI edits may update the repository's settings
file through its link; review the Git diff afterward. If an app replaces the link
with a regular file, a subsequent apply restores the link using the same backup
protection.

NixOS remains the default Terminal profile. Until the distro is provisioned,
open PowerShell from the new-tab dropdown. NixOS Herdr also requires the `herdr`
command from the Linux configuration. None of this sets Windows' system-wide
default terminal application or activates WSL.

No execution policies are changed; the PowerShell 7 profile still requires an
execution policy that permits loading it.
After activation, open a new PowerShell/Terminal session to pick up environment
variables and the installed font. The clean-machine module/font installation
still needs to be exercised during the disposable-machine restore rehearsal.

PowerShell 7 and DSC are prerequisites for the current Windows backend. The WSL
package supplies WSL itself, not the Windows optional features, NixOS distro,
or its registration. Windows .NET SDKs/runtimes are not explicitly selected:
installers can provide their own dependencies, and .NET development is already
configured on the personal WSL host. Add a specific Windows SDK only if needed.
Sunshine is intentionally deferred.

### Minimal Windows devbox

The separate `windows-devbox` host is a small restore/provisioning target for a
fresh work devbox. Its declarations live in
`winix/features/windows-devbox.ts`; it does not inherit the personal desktop,
gaming apps, window manager, sign-in shortcuts, or shell configuration.
`ADRIFER-VISION` and the existing Linux hosts are unchanged.

It installs Git, GitHub CLI, VS Code Insiders, Windows Terminal Preview, and
the WSL runtime, using their existing Windows package pins. `windows.wsl()`
enables the WSL/Virtual Machine Platform features without managing `.wslconfig`
or imposing machine-specific memory/CPU limits. NixOS-WSL is registered as
`NixOS` under `%LOCALAPPDATA%\Winix\WSL\NixOS` and selected as the default distro.
Official x64/ARM64 image URLs and SHA256 hashes are pinned in the `wslImages`
section of `winix/winix-windows.lock`; imports verify the download first.
Image updates only affect future registrations, never an existing Linux system.

Use the prerequisite bootstrap described below before activating this host.
If the devbox is a VM, its platform must expose nested virtualization for WSL 2;
workplace policy must also permit the optional features and package installation.
Unlike the desktop, the devbox does not declare NVM; the bootstrap's default
Node setup is sufficient on a fresh machine. This test branch pins the published
`@adrifer/winix@0.2.4-preview.0` SDK. Clone the same branch on Windows:

```powershell
git clone --branch feat/windows-devbox-preview --single-branch https://github.com/adrifer/dotfiles.git "$HOME\dotfiles"
Set-Location "$HOME\dotfiles\winix"
npm ci
```

From `winix`, preview with:

```powershell
npm exec -- winix check
npm exec -- tsc --noEmit
npm exec -- winix switch --dry --host windows-devbox
```

Only on the intended devbox, after reviewing the plan, run from PowerShell 7
under the intended Windows account, with elevation if required:

```powershell
npm exec -- winix switch --host windows-devbox
```

The configuration name is not a Windows rename operation; use `--host
windows-devbox` unless the computer's hostname matches, or change the host name
in the config once the devbox's actual name is known.
If feature enablement requests a reboot, restart Windows manually and rerun the
same switch command. Winix never reboots Windows or shuts down WSL for you.
An existing unrecorded `NixOS` distro or occupied install directory is refused,
not adopted or replaced; do not use this host to take over the current PC's WSL.
Removing the declaration never unregisters the distro or deletes its data.

The distro's opt-in `setup` clones this repository's
`feat/windows-devbox-preview` branch into `/home/adrifer/dotfiles`, installs the
locked npm dependencies from `winix`, creates the already-declared `adrifer`
account, and activates the existing `wsl-work` Linux host. No separate Linux
clone, manual user creation, or initial Linux switch is needed. This trusts the
repository and its npm/config code. The Windows devbox is minimal; the Linux
side deliberately uses the full existing work profile.

The first apply pins the setup branch to a commit in `winix-windows.lock`.
Repository pins are first-run only: subsequent branch changes do not update a
completed setup. Use `npm exec -- winix update --windows wsl-setup` to refresh
the commit for a new setup; an interrupted setup retains its original commit.
Changing the configured branch later requires explicit recovery/new distro,
not automatic replacement. Dirty or occupied Linux checkouts are refused.
If setup fails, retain the error and rerun after resolving it; do not unregister
the distro or delete its state. Fresh-machine activation remains unverified.

Verify after activation:

```powershell
wsl --list --verbose
wsl --distribution NixOS --user adrifer --exec whoami
wsl --distribution NixOS
```

If a new normal session still selects `nixos`, close Linux sessions and safely
terminate only this distro with `wsl --terminate NixOS`, then reopen it.

### Komorebi and whkd

`winix/features/windows-window-manager.ts` manages live links to the existing
`windows/komorebi/` assets: the window manager and bar configurations,
`applications.json`, and `.config/whkdrc`. It preserves the current Tokyo Night
theme, three-monitor preferences, resolution-specific work-area offsets, and
keybindings. Monitor identities/offsets must be reviewed if the display setup
changes. The configuration targets the locked Komorebi version; some bar fields
use older names that remain supported as aliases.

The feature also uses `windows.startup.command()` for two **separate,
current-user Startup shortcuts**, without custom DSC shortcut scripts:

- `komorebi.lnk` runs `komorebic-no-console.exe start --bar` with the managed
  configuration explicitly selected.
- `whkd.lnk` runs PowerShell 7 without a profile or visible console, invoking
  the linked `windows/komorebi/start-whkd.ps1`. The launcher supplies the whkd
  config explicitly, skips starting a duplicate process, and logs startup
  output/errors to `%LOCALAPPDATA%\whkd-startup.stdout.log` and
  `%LOCALAPPDATA%\whkd-startup.stderr.log`.

Do not combine these into `komorebic start --whkd` at sign-in: that previously
left whkd unstarted on this machine. The separate entries retain the working
approach without depending on Windows PowerShell 5.1 for the whkd launcher.
Packages and configuration links are dependencies of shortcut creation.
Existing nonmatching shortcuts are backed up to `.lnk.bak`; an existing backup
blocks replacement instead of being overwritten. Correct entries are unchanged
on subsequent applies.

Applying this feature only links files and registers the shortcuts; it does
not start, stop, or reload the running desktop. Already-linked configuration
files can be watched by the applications, so editing those assets may take
effect live. A real sign-out/sign-in still needs to be rehearsed after
activation. `kstart`/`kstop` remain available for intentional manual control.

Activate through `winix switch` to record startup/package ownership. Removing a
shortcut declaration then removes only an unchanged entry previously created or
replaced by Winix, after successful activation. Pre-existing matching shortcuts
and already-installed packages stay externally owned. Removed unused owned packages
are automatically uninstalled on the next successful switch; preview with
`winix switch --dry --host ADRIFER-VISION` first. Edited owned shortcuts
or externally changed package versions block reconciliation. Switches with removals
list them and ask for confirmation before activation; declining cancels the whole
switch. Noninteractive runs with removals require `--yes` (or `-y`); dry runs and
switches without removals do not prompt. `winix state forget
startup <name>` and `winix state forget package winget <id>` release removal
ownership without deleting anything. The machine-local inventory lives under
`%LOCALAPPDATA%\Winix`; it is separate from the version lockfile. Existing
manually created entries are not retroactively owned, and file links/module
cleanup are not tracked yet.

### Winix preview dependency

The manifest and npm lockfile pin published `@adrifer/winix@0.2.4-preview.0`.
Use `npm ci` on a fresh checkout; no sibling SDK checkout or local junction is
required. Both Windows and Linux first-run setup use that same locked package.
The preview release also provides `bootstrap-windows.ps1`,
`bootstrap-nixos.sh`, and their SHA256 checksum files at
https://github.com/adrifer/winix/releases/tag/v0.2.4-preview.0.
Review downloaded scripts and verify their checksums before execution.

### Before formatting

- Back up personal files, uncommitted repositories, SSH/GPG keys, and application
  data separately. Winix does not back up data or restore credentials.
- Export any WSL distro whose data must survive, using its actual name from
  `wsl --list --verbose`. Store the export on storage that will not be formatted:
  `wsl --export <distro-name> <backup-path.tar>`.
- Keep this repository and its npm, Windows package, and Nix lockfiles on that
  storage too. The `D:` drive is not a backup if it will also be formatted.

### Bootstrap Windows

Run these desktop restore steps manually. Nothing in this repository formats,
unregisters, or replaces a WSL distro. The separate `windows-devbox` host
explicitly provisions a new distro; the prerequisite bootstrap itself does not.

1. Install/update App Installer so `winget` is available. Download
   `bootstrap-windows.ps1` and its `.sha256` file from the preview release above,
   verify the checksum with `Get-FileHash`, and review the script. It runs in built-in Windows
   PowerShell; Git, Node, and Winix do not need to be installed first:

   ```powershell
   powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\bootstrap-windows.ps1 -Check
   powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\bootstrap-windows.ps1 -UseNvm
   ```

   Run these commands from the download directory. Omit `-UseNvm` for the
   minimal devbox, which uses the bootstrap's default Node installation.
   `-Check` reports missing tools without installing anything. Install mode asks
   for confirmation (`-Yes` for automation), installs only missing/outdated
   prerequisites, enables WinGet configuration support, and verifies the DSC
   resources and PowerShell module tooling. Installer UAC prompts may appear;
   NVM selection may require elevation. No host is activated or reboot performed.
   The execution-policy override is process-only, not a persistent policy change.

2. Open a new PowerShell 7 terminal. This dotfiles configuration chooses NVM,
   so keep `-UseNvm` when bootstrapping a clean machine; do not also install
   standalone Node, whose directory can conflict with NVM's symlink. Supported
   existing Node versions are left alone. Restore/clone this repository
   to a permanent location before generating the configuration: file links point
   to that checkout.
3. From `winix`, restore the locked dependencies and inspect the plan:

   ```powershell
   npm ci
   npm exec winix -- check
   npm exec tsc -- --noEmit
   npm exec winix -- apply --dry --host ADRIFER-VISION
   ```

   The npm lockfile includes the published preview SDK; a local development
   SDK link is not needed. Network access is required for locked dependencies.
   Missing Windows package locks are resolved through winget and missing
   PowerShell module locks through PSGallery; existing locks are retained.
   Use `npm exec winix -- update --windows` only when intentionally refreshing
   package and module versions. To update just Terminal-Icons, use
   `npm exec winix -- update --windows Terminal-Icons`.

4. Once the plan is reviewed, run the following from an **elevated PowerShell
   7 terminal under the same Windows account**:

   ```powershell
   npm exec winix -- switch --host ADRIFER-VISION
   ```

   Developer Mode requires administrator rights. File links depend on that
   setting and do not force replacement of existing files/directories. Back up
   and move conflicting config paths aside deliberately before retrying.
   This stage registers the managed sign-in startup shortcuts but does not
   launch programs.

### Restore WSL separately

For `ADRIFER-VISION`, Windows-side feature setup, reboots, NixOS distro
registration/import, `.wslconfig`, and default-distro selection remain manual;
the separate devbox target above declares feature setup and registration.
Do not treat
`winix switch --host wsl` as a distro installer: it requires an existing
NixOS-WSL installation.

If that installation lacks Git or Node/npm, download and review Winix's
`bootstrap-nixos.sh` prerequisite script from the preview release, then run
`bash bootstrap-nixos.sh`. It opens a
temporary pinned environment without installing a distro or activating any
host. Perform the following steps inside that shell; `exit` leaves it.

After restoring/installing NixOS-WSL, place a checkout at `~/dotfiles` inside
Linux (the Home Manager links use that location), then run from
`~/dotfiles/winix`:

```bash
npm ci
npm exec winix -- check
npm exec tsc -- --noEmit
npm exec winix -- apply --dry --host wsl
# Only after reviewing the generated configuration:
npm exec winix -- switch --host wsl
```

Remaining restore work: exercising the devbox's real WSL provisioning/reboot flow
and deciding when to adopt that declaration for a fresh personal desktop;
non-winget applications and remaining Windows settings;
and a clean-machine/sign-in rehearsal of the desktop startup configuration.
The shared lazygit config also references `tuicr`, which this
Windows baseline does not install yet. Rehearse on a disposable Windows + WSL
installation before formatting the main machine.
