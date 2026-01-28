# NixOS LXC Containers on Proxmox

Guide for deploying NixOS LXC containers on Proxmox using the flake configuration.

## Overview

NixOS can run in unprivileged LXC containers on Proxmox. The configuration is managed declaratively through the flake, making it easy to reproduce or update containers.

### Available LXC Hosts

| Host | Purpose | Ports |
|------|---------|-------|
| `syncthing-lxc` | File synchronization | 8384 (GUI), 22000 (sync), 21027/udp (discovery) |
| `ela-lxc` | TBD | - |

---

## Initial Setup (First Time Only)

### Step 1: Download NixOS LXC Template

On your Proxmox host:

```bash
# Download the official NixOS LXC template
cd /var/lib/vz/template/cache/
wget https://hydra.nixos.org/build/319296903/download/1/nixos-image-lxc-proxmox-25.11pre-git-x86_64-linux.tar.xz
```

Or via Proxmox UI:
1. Datacenter → Storage → local → CT Templates
2. Templates are not in the default list; use the wget method above

### Step 2: Create the LXC Container

Via Proxmox UI:
1. **Create CT** (top right)
2. **General**:
   - CT ID: Choose an ID (e.g., 500 for syncthing-lxc)
   - Hostname: `syncthing-lxc` (must match flake hostname)
   - Password: Set a root password (won't work until rebuild, but required by UI)
   - Unprivileged: ✅ Yes
3. **Template**: Select `nixos-image-lxc-proxmox-25.11pre-git-x86_64-linux.tar.xz`
4. **Disks**: 8GB+ recommended (NixOS uses more than minimal Debian)
5. **CPU**: 1-2 cores
6. **Memory**: 512MB minimum, 1024MB recommended
7. **Network**: 
   - Bridge: vmbr0 (or your LAN bridge)
   - IPv4: DHCP
8. **DNS**: Use host settings

Or via CLI:

```bash
pct create 500 local:vztmpl/nixos-image-lxc-proxmox-25.11pre-git-x86_64-linux.tar.xz \
  --hostname syncthing-lxc \
  --cores 2 \
  --memory 1024 \
  --swap 512 \
  --rootfs local-lvm:8 \
  --net0 name=eth0,bridge=vmbr0,ip=dhcp \
  --unprivileged 1 \
  --features nesting=1
```

### Step 3: Start Container and Get IP

From the Proxmox host:

```bash
# Start the container
pct start 500

# Get the IP address (from Proxmox host)
lxc-info -n 500 -iH
```

### Step 4: Clone Dotfiles and Setup

Enter the container shell:

```bash
pct enter 500
```

Inside the container, first source the environment to get Nix commands in PATH:

```bash
source /etc/set-environment
```

Set the root password now (optional, can also do after rebuild):

```bash
passwd root
```

Now get a shell with git available:

```bash
nix --extra-experimental-features "nix-command flakes" shell nixpkgs#git nixpkgs#bash -c bash
```

Clone and setup:

```bash
# Clone dotfiles to root home
cd ~
git clone https://github.com/adrifer/dotfiles.git

# Create symlink to /etc/nixos (use -n to overwrite existing directory)
ln -sfn ~/dotfiles/nixos /etc/nixos
```

### Step 5: Build and Switch

Still inside the nix shell:

```bash
cd /etc/nixos

# Build and switch
nixos-rebuild switch --flake .#syncthing-lxc

# Exit nix shell (git is now installed permanently via the config)
exit
```

### Step 6: Verify SSH Access

You can now SSH into the container using the password you set:

```bash
ssh root@<CONTAINER_IP>
```

---

## Updating the Container

After making changes to your flake:

### Option A: Push changes, pull on container

```bash
# On your local machine
cd ~/dotfiles && git add -A && git commit -m "update" && git push

# On the container
cd ~/dotfiles && git pull && nixos-rebuild switch --flake /etc/nixos#syncthing-lxc
```

### Option B: Remote build (advanced)

```bash
# Build on local machine, deploy to container
nixos-rebuild switch --flake .#syncthing-lxc --target-host root@<CONTAINER_IP>
```

---

## Service-Specific Notes

### Syncthing (`syncthing-lxc`)

**Access the GUI:**
- URL: `http://<CONTAINER_IP>:8384`
- First access will prompt you to set a GUI password

**Important paths:**
- Config: `/var/lib/syncthing/.config/syncthing/`
- Data: `/var/lib/syncthing/`

**Adding sync folders:**
1. Use the web GUI to add folders/devices
2. Or configure declaratively in `hosts/syncthing-lxc/configuration.nix`:

```nix
services.syncthing = {
  settings = {
    folders = {
      "documents" = {
        path = "/var/lib/syncthing/Documents";
        devices = [ "phone" "laptop" ];
      };
    };
    devices = {
      "phone" = { id = "DEVICE-ID-HERE"; };
      "laptop" = { id = "DEVICE-ID-HERE"; };
    };
  };
};
```

**Bind mount host directories (optional):**
To sync folders outside the container, add mount points in Proxmox:

```bash
# On Proxmox host
pct set 500 -mp0 /mnt/data/syncthing,mp=/data
```

---

## Troubleshooting

### Container won't start

Check features are enabled:
```bash
cat /etc/pve/lxc/500.conf | grep features
# Should show: features: nesting=1
```

### Network not working

Verify DHCP is getting an IP:
```bash
pct exec 500 -- journalctl -u systemd-networkd
```

### nixos-rebuild fails

Ensure experimental features are enabled:
```bash
nix --version
# If < 2.4, the flake might not work
```

Check that all files are tracked by git:
```bash
git status  # New .nix files must be git added
```

### SSH connection refused

SSH might not start until first rebuild:
```bash
pct exec 500 -- systemctl status sshd
```

---

## Backup Strategy

### Container backup (Proxmox)
- Use Proxmox Backup Server or vzdump
- Backs up entire container state

### Configuration backup
- Your flake IS the backup
- Just keep your git repo safe
- To restore: create new container + apply flake

### Syncthing data backup
- Syncthing itself provides redundancy across devices
- For extra safety, backup `/var/lib/syncthing/` 

---

## Quick Reference

```bash
# Start/stop container
pct start 500
pct stop 500

# Enter container shell
pct enter 500

# View container console
pct console 500

# Check container status
pct status 500

# Rebuild NixOS (inside container)
nixos-rebuild switch --flake /etc/nixos#syncthing-lxc

# Update flake inputs and rebuild
nix flake update && nixos-rebuild switch --flake /etc/nixos#syncthing-lxc

# View system logs
journalctl -f

# Check syncthing status
systemctl status syncthing
```
