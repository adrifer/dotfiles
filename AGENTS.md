# Repository instructions

## Winix is the source of truth

Make all system, package, shell integration, Git, WSL, Home Manager, macOS,
and Windows configuration changes in `winix/`, not `nixos/`.
This includes fixes whose errors mention NixOS, `/nix/store`, or
`git-credential-manager-windows`.

- Start with `winix/winix.config.ts`, then follow its imports: `winix/machines/`
  (one file per machine) lists `winix/roles/`, which list `winix/features/`
  (one file per tool, every OS inside). Put a new tool in its own feature with
  all its platforms, then add it to a role (or to one machine for extras).
- `nixos/` is the legacy configuration, retained for reference. Do not edit,
  rebuild, update its lockfile, or mirror Winix changes there unless the user
  explicitly requests legacy work.
- `winix/.winix/out/` is generated. Change the TypeScript source, never the
  generated Nix files.
- Existing application config files outside `winix/`, such as
  `nvim/.config/nvim/`, remain editable when the Winix feature links to them.
  Follow the active feature to find the actual source.
- Do not work around managed configuration by editing files in the home
  directory or `/nix/store`.

## Working with Winix

Run commands from `winix/`. On Windows and WSL/Linux, use the standalone
`winix` command. Inside this checkout it downloads and runs the Winix version
`package.json` pins, so it cannot go stale. Do not use `npm exec -- winix` or
`npx winix` there: those run whatever is in `node_modules`, which can lag behind
the pin after a `git pull`. On Windows the command is a `winix.cmd` launcher:
run it from PowerShell, or call `winix.cmd` from Git Bash. macOS has no
standalone Winix yet. There, run `npm ci` and use `npm exec -- winix` in place
of `winix` below.

Before editing, read `package.json` and load the pinned version's instructions:

```bash
cd winix
winix --skill
```

Validate changes without activating the host:

```bash
winix check
winix apply --dry --host wsl-work        # Nix hosts
winix plan --host ADRIFER-VISION         # Windows hosts
npm exec -- tsc --noEmit                 # needs `npm ci` once per checkout
```

Replace the host names with the intended hosts from `winix.config.ts`.
`winix apply` generates output; it does not activate the system.
When activation is requested, use:

```bash
winix switch --host wsl-work
```

Do not use `nixos-rebuild --flake /etc/nixos` or `--flake ./nixos`.
Those paths can point to the legacy flake and apply different package versions.
Do not update inputs as part of an unrelated fix.
