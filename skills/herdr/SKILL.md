---
name: herdr
description: Use Herdr to inspect or control agents, panes, tabs, workspaces, worktrees, integrations, plugins, or other Herdr features. Invoke when the user explicitly mentions Herdr or asks for a Herdr command or workflow.
---

# Herdr

The installed Herdr binary is the authoritative source for its current agent
instructions. Before answering a Herdr question or running Herdr commands, load
the version-matched skill:

```bash
herdr --skill
```

Follow the returned instructions for the rest of the task. Do not rely on a
previously cached or remembered copy because Herdr's commands, APIs, and safety
requirements may change between installed versions.

Running `herdr --skill` only prints instructions; it does not launch the TUI or
modify the current Herdr session.
