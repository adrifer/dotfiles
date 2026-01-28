# Ela LXC Setup (Moltbot AI Assistant)

Moltbot (formerly Clawdbot) AI assistant running on the `ela-lxc` container. For base NixOS LXC setup on Proxmox, see [[proxmox-nixos-lxc]].

## Overview

| Setting | Value |
|---------|-------|
| Hostname | `ela-lxc` |
| Container ID | TBD |
| User | `moltbot` |
| Service | systemd user service |
| State directory | `/home/moltbot/.clawdbot` |

### Providers

| Provider | Type | Auth Method |
|----------|------|-------------|
| WhatsApp | Messaging | QR code scan via CLI |
| GitHub Copilot | LLM | OAuth via CLI |
| Anthropic (fallback) | LLM | API key file |

---

## Initial Setup

### Step 1: Create LXC Container

Follow [[proxmox-nixos-lxc]] steps 1-5, using:
- Hostname: `ela-lxc`
- Config: `nixos-rebuild switch --flake /etc/nixos#ela-lxc`

### Step 2: Create Secrets Directory

```bash
# As root
mkdir -p /home/moltbot/.secrets
chown moltbot:moltbot /home/moltbot/.secrets
chmod 700 /home/moltbot/.secrets
```

### Step 3: Setup Anthropic API Key (Optional Fallback)

If using Anthropic as fallback LLM:

```bash
# Get key from https://console.anthropic.com
echo "sk-ant-xxxxx" > /home/moltbot/.secrets/anthropic-api-key
chown moltbot:moltbot /home/moltbot/.secrets/anthropic-api-key
chmod 600 /home/moltbot/.secrets/anthropic-api-key
```

### Step 4: Authenticate GitHub Copilot

```bash
# Switch to moltbot user
su - moltbot

# Authenticate with GitHub Copilot
moltbot auth copilot
```

This opens an OAuth flow - follow the instructions to authorize.

### Step 5: Setup WhatsApp

```bash
# As moltbot user
moltbot gateway whatsapp
```

This shows a QR code - scan it with your WhatsApp app (Settings → Linked Devices → Link a Device).

### Step 6: Verify Service

```bash
# Check service status
systemctl --user status clawdbot-gateway

# View logs
journalctl --user -u clawdbot-gateway -f
```

---

## Configuration

### Agent Personality

Edit files in `hosts/ela-lxc/documents/`:

| File | Purpose |
|------|---------|
| `AGENTS.md` | Agent identity and capabilities |
| `SOUL.md` | Personality and values |
| `TOOLS.md` | Available tools documentation |

After editing, rebuild:
```bash
nixos-rebuild switch --flake /etc/nixos#ela-lxc
```

### Adding Plugins

Edit `hosts/ela-lxc/home.nix`:

```nix
plugins = [
  { source = "github:clawdbot/nix-steipete-tools?dir=tools/summarize"; }
  { source = "github:clawdbot/nix-steipete-tools?dir=tools/oracle"; }
];
```

Then rebuild.

### Switching LLM Providers

**To use GitHub Copilot (recommended if you have subscription):**
```bash
moltbot auth copilot
```

**To use Anthropic:**
1. Add API key to `/home/moltbot/.secrets/anthropic-api-key`
2. It's already configured in home.nix

---

## Commands

### Service Management

```bash
# As moltbot user
systemctl --user status clawdbot-gateway
systemctl --user restart clawdbot-gateway
systemctl --user stop clawdbot-gateway

# View logs
journalctl --user -u clawdbot-gateway -f
```

### Moltbot CLI

```bash
# Auth commands
moltbot auth copilot      # Authenticate GitHub Copilot
moltbot auth anthropic    # Set Anthropic key

# Gateway commands  
moltbot gateway whatsapp  # Setup WhatsApp (QR code)
moltbot gateway telegram  # Setup Telegram

# Status
moltbot status            # Show current status
moltbot status --usage    # Show usage stats
```

### NixOS Management

```bash
# Rebuild after config changes
nixos-rebuild switch --flake /etc/nixos#ela-lxc

# Update and rebuild
cd ~/dotfiles && git pull
nixos-rebuild switch --flake /etc/nixos#ela-lxc
```

---

## Troubleshooting

### Service not starting

```bash
# Check if moltbot user can run user services
loginctl enable-linger moltbot

# Check service
systemctl --user status clawdbot-gateway
journalctl --user -u clawdbot-gateway --no-pager
```

### WhatsApp disconnected

Re-run the QR code setup:
```bash
moltbot gateway whatsapp
```

### Copilot auth expired

Re-authenticate:
```bash
moltbot auth copilot
```

### Missing API key

```bash
# Check file exists and has content
ls -la /home/moltbot/.secrets/
cat /home/moltbot/.secrets/anthropic-api-key
```

---

## Architecture

```
WhatsApp ──┐
           ├── Gateway (clawdbot-gateway) ── LLM Provider
Telegram ──┘           │                    (Copilot/Anthropic)
                       │
                    Plugins
                    (summarize, etc.)
```

- **Gateway**: Receives messages from WhatsApp/Telegram, routes to LLM
- **LLM Provider**: GitHub Copilot or Anthropic Claude
- **Plugins**: Extend capabilities (summarize, web search, etc.)

State lives in `/home/moltbot/.clawdbot/`.
