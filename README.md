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
