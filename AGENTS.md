# Repository instructions

## Winix is the source of truth

Make all system, package, shell integration, Git, WSL, Home Manager, macOS,
and Windows configuration changes in `winix/`, not `nixos/`.
This includes fixes whose errors mention NixOS, `/nix/store`, or
`git-credential-manager-windows`.

- Start with `winix/winix.config.ts`, then follow its imports into
  `winix/features/` and `winix/profiles/`.
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

Run commands from `winix/`. Before editing, read `package.json` and load
the installed version's instructions:

```bash
cd winix
npm exec -- winix --skill
```

Validate changes without activating the host:

```bash
npm exec -- winix check
npm exec -- tsc --noEmit
npm exec -- winix apply --dry --host wsl-work
```

Replace `wsl-work` with the intended host from `winix.config.ts`.
`winix apply` generates output; it does not activate the system.
When activation is requested, use:

```bash
npm exec -- winix switch --host wsl-work
```

Do not use `nixos-rebuild --flake /etc/nixos` or `--flake ./nixos`.
Those paths can point to the legacy flake and apply different package versions.
Do not update inputs as part of an unrelated fix.
