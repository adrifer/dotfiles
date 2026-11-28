# Repository instructions

## Winix is the source of truth

The repository root is a Winix project. Make all system, package, shell
integration, Git, WSL, Home Manager, macOS, and Windows configuration changes
through it, including fixes whose errors mention NixOS, `/nix/store`, or
`git-credential-manager-windows`.

- Start with `winix.config.ts`, then follow its imports: `machines/` (one file
  per machine) lists `roles/`, which list `features/` (one file per tool, every
  OS inside). Put a new tool in its own feature with all its platforms, then add
  it to a role (or to one machine for extras).
- Application config files live in `config/<tool>/` and stay editable; features
  link or copy them with paths relative to `winix.config.ts`
  (`./config/nvim`). Follow the active feature to find the actual source.
  Agent skills live in `skills/`, binary files in `assets/`.
- `.winix/` is generated (output, runtime, editor types). Change the TypeScript
  source, never the generated Nix files.
- Do not work around managed configuration by editing files in the home
  directory or `/nix/store`.

## Working with Winix

Run commands from the repository root. On Windows and WSL/Linux, use the standalone
`winix` command. Inside this checkout it downloads and runs the Winix version
`package.json` pins, so it cannot go stale. Do not use `npm exec -- winix` or
`npx winix` there: those run whatever is in `node_modules`, which can lag behind
the pin after a `git pull`. On Windows the command is a `winix.cmd` launcher:
run it from PowerShell, or call `winix.cmd` from Git Bash. macOS has no
standalone Winix yet. There, run `npm ci` and use `npm exec -- winix` in place
of `winix` below.

Before editing, read `package.json` and load the pinned version's instructions:

```bash
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

Do not use `nixos-rebuild` directly; `winix switch` builds the generated flake
with the pinned inputs.
Do not update inputs as part of an unrelated fix.
