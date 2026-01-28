# Syncthing LXC Setup

Syncthing configuration for the `syncthing-lxc` container. For base NixOS LXC setup on Proxmox, see [[proxmox-nixos-lxc]].

## Overview

| Setting | Value |
|---------|-------|
| Hostname | `syncthing-lxc` |
| Container ID | 500 |
| GUI | `http://<IP>:8384` |
| Data directory | `/var/lib/syncthing` |
| Config directory | `/var/lib/syncthing/.config/syncthing` |

### Synced Folders

| Folder | Path | Versioning |
|--------|------|------------|
| TrackVault | `/var/lib/syncthing/TrackVault` | Simple (10 revisions) |

### Connected Devices

| Device | ID |
|--------|-----|
| ADRIFER-Ultron | `SUYK5EV-GZD6WAJ-DOHS524-7RMYH54-23I4TYS-YN6HYL2-V4FCOEN-MBBG7AG` |
| iPhone | `Z2LB3T3-MW5JCBR-ZAFY6XE-SUIKOV4-JAEGMDZ-JQIZLZC-2W346Y6-XI2WXQX` |

---

## Initial Setup (After Base NixOS LXC)

### Step 1: Clone TrackVault from GitHub

```bash
cd /var/lib/syncthing

# Login to GitHub CLI
gh auth login

# Clone the vault (if folder exists from syncthing, use temp)
gh repo clone adrifer/TrackVault TrackVault-temp
mv TrackVault-temp/* TrackVault-temp/.* TrackVault/ 2>/dev/null
rm -rf TrackVault-temp

# Fix ownership
chown -R syncthing:syncthing TrackVault
```

### Step 2: Setup Git Auth for Syncthing User

Required for auto-backup to work:

```bash
sudo -u syncthing gh auth login
```

### Step 3: Rebuild and Verify

```bash
nixos-rebuild switch --flake /etc/nixos#syncthing-lxc

# Check syncthing is running
systemctl status syncthing

# Check backup timer is active
systemctl list-timers | grep vault
```

### Step 4: Accept Connections on Other Devices

Open Syncthing on ADRIFER-Ultron and iPhone to accept the new device connection.

---

## Auto-Backup to GitHub

A systemd timer automatically backs up TrackVault to GitHub every 6 hours.

### How It Works

- Runs every 6 hours (00:00, 06:00, 12:00, 18:00 UTC)
- Only commits and pushes if there are changes
- Commit message format: `Auto backup YYYY-MM-DD HH:MM`
- Uses `Persistent = true` - catches up if container was off

### Manual Commands

```bash
# Trigger backup manually
systemctl start vault-git-backup

# Check backup logs
journalctl -u vault-git-backup

# Check timer status
systemctl list-timers | grep vault
```

### Test the Backup

```bash
# Create a test change
sudo -u syncthing bash -c 'cd /var/lib/syncthing/TrackVault && echo "test" >> test.txt'

# Run backup
systemctl start vault-git-backup

# Check logs
journalctl -u vault-git-backup -n 20

# Revert test (or let it sync away)
sudo -u syncthing bash -c 'cd /var/lib/syncthing/TrackVault && git checkout -- test.txt'
```

---

## File Versioning

Simple versioning keeps the last 10 revisions of modified/deleted files.

- Location: `/var/lib/syncthing/TrackVault/.stversions/`
- Format: `filename~YYYYMMDD-HHMMSS.ext`

### Restore a File

```bash
# List versions
ls /var/lib/syncthing/TrackVault/.stversions/

# Restore a specific version
cp /var/lib/syncthing/TrackVault/.stversions/myfile~20260127-143022.md \
   /var/lib/syncthing/TrackVault/myfile.md
```

---

## Adding a New Folder

1. Edit `hosts/syncthing-lxc/configuration.nix`:

```nix
folders = {
  "TrackVault" = { ... };
  "NewFolder" = {
    path = "/var/lib/syncthing/NewFolder";
    devices = [ "ADRIFER-Ultron" "iPhone" ];
    versioning = {
      type = "simple";
      params.keep = "10";
    };
  };
};
```

2. Create and set permissions:
```bash
mkdir -p /var/lib/syncthing/NewFolder
chown -R syncthing:syncthing /var/lib/syncthing/NewFolder
```

3. Rebuild:
```bash
nixos-rebuild switch --flake /etc/nixos#syncthing-lxc
```

---

## Adding a New Device

1. Get the device ID from the new device's Syncthing GUI (Actions → Show ID)

2. Edit `hosts/syncthing-lxc/configuration.nix`:

```nix
devices = {
  "ADRIFER-Ultron" = { id = "..."; };
  "iPhone" = { id = "..."; };
  "NewDevice" = { id = "NEW-DEVICE-ID-HERE"; };
};
```

3. Add device to folders:
```nix
folders = {
  "TrackVault" = {
    devices = [ "ADRIFER-Ultron" "iPhone" "NewDevice" ];
    ...
  };
};
```

4. Rebuild and accept connection on the new device.

---

## Troubleshooting

### Syncthing not starting

```bash
systemctl status syncthing
journalctl -u syncthing -f
```

### Folder not syncing

```bash
# Check folder status in GUI
http://<IP>:8384

# Check permissions
ls -la /var/lib/syncthing/TrackVault
```

### Backup not running

```bash
# Check timer
systemctl list-timers | grep vault

# Check service logs
journalctl -u vault-git-backup

# Test git auth as syncthing user
sudo -u syncthing git -C /var/lib/syncthing/TrackVault push --dry-run
```

### GUI not accessible

```bash
# Check firewall
iptables -L -n | grep 8384

# Check syncthing is binding correctly
ss -tlnp | grep 8384
```

---

## Quick Reference

```bash
# Syncthing status
systemctl status syncthing

# Restart syncthing
systemctl restart syncthing

# View syncthing logs
journalctl -u syncthing -f

# Manual backup
systemctl start vault-git-backup

# Check backup timer
systemctl list-timers | grep vault

# Rebuild config
nixos-rebuild switch --flake /etc/nixos#syncthing-lxc
```
