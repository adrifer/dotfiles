---
name: winix
description: Use Winix to create, change, validate, generate, or activate typed system configuration for NixOS, nix-darwin, Home Manager, and Windows. Invoke when the user mentions Winix or asks to work on a Winix configuration.
---

# Winix

The installed Winix binary is the authoritative source for its current agent
instructions. Before answering a Winix question or editing a Winix project,
load the version-matched skill:

```bash
winix --skill
```

Follow the returned instructions for the rest of the task. Do not rely on a
previously cached or remembered copy. Winix commands, helpers, configuration
structure, platform support, and safety requirements may change between
installed versions.

Running `winix --skill` only prints instructions. It does not evaluate a
configuration, generate files, activate a host, or modify the project.
