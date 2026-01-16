# NixOS on WSL - Setup Instructions

Follow these steps to set up **NixOS on WSL** using this repository.

---

## 1. Install NixOS-WSL

1. Download the latest release from [nix-community/NixOS-WSL](https://github.com/nix-community/NixOS-WSL/releases).

2. Import it into WSL (from PowerShell or CMD):

   ```powershell
   wsl --install --from-file nixos.wsl
   ```

3. Launch the new distro:

   ```powershell
   wsl -d wsl-nixos
   ```

---

## 2. Bootstrap Git (inside WSL)

Run inside your new WSL instance:

```bash
nix-shell -p git
```

---

## 3. Clone this repository

```bash
git clone https://github.com/adrifer/dotfiles.git ~/dotfiles
cd ~/dotfiles
```

---

## 4. Link configuration to `/etc/nixos`

Replace the default configuration with a symlink to this repo:

```bash
sudo rm -rf /etc/nixos
sudo ln -s ~/dotfiles/nixos /etc/nixos
```

---

## 5. Apply the configuration

Run the initial rebuild:

```bash
sudo nixos-rebuild switch --flake /etc/nixos#wsl
```

After this, exit and restart WSL - you should now log in as your configured user.

---
## 6. Reboot the machine and re link dotfiles

```powershell
wsl -t NixOS
```

Then run NixOS again, and this time repeat the step #4 and #5
