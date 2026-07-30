---
name: tuicr
description: Read and reply to comments from tuicr review sessions. Use when the user asks Copilot to inspect, address, or answer feedback they wrote in tuicr.
---

# Tuicr review workflow

Use `tuicr review` as the interface between Copilot and the user's persisted
Tuicr review sessions. The user normally opens Tuicr themselves with `t` in
Zsh, `prefix+t` in Herdr, or `t` from Lazygit's Files panel.

## Find the review session

Determine the repository from the current working directory or the user's
request, then list its sessions:

```bash
tuicr review list --repo /path/to/repo
```

Use the single relevant active session when one exists. Otherwise, use the
latest relevant persisted session. If multiple sessions are plausible, ask the
user which session slug to use.

## Read user comments

```bash
tuicr review comments \
  --repo /path/to/repo \
  --session <slug>
```

Treat these comments as user feedback:

- Address requests and reported issues in the code.
- Answer questions directly.
- Do not invent comments or impersonate the user.
- Re-read the session before claiming completion in case feedback changed.

If no session exists, tell the user to open Tuicr, add their comments, save
with `:wq`, and then ask Copilot to read them.

## Reply in Tuicr

When the user asks for a reply, add a separate attributed comment at the same
file and location:

```bash
tuicr review add \
  --repo /path/to/repo \
  --session <slug> \
  --target-file path/to/file \
  --line <line> \
  --side new \
  --username "GitHub Copilot" \
  "Reply text"
```

Add `--end-line <line>` for a range. Omit `--line` for a file-level reply, and
omit `--target-file` for a review-level reply. Preserve the original comment's
`old` or `new` side when replying to a specific line.

Tuicr local comments are not threaded and cannot be marked resolved. Replies
are separate attributed comments. The user removes completed comments with
`dd` or clears them with `:clearc`.

## User-led review rules

- Do not add unsolicited review findings to a session where the user is
  reviewing Copilot's changes.
- Do not delete or clear the user's comments.
- If comments are ambiguous, ask before modifying code or writing a reply.
- The TUI does not need to remain open; persisted sessions are readable after
  the user exits.
