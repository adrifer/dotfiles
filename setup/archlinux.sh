#!/usr/bin/env bash

set -e  # Exit on error

# === 1. Install packages ===
PACKAGES=(
  mesa
  vulkan-icd-loader
  vulkan-dzn
  neovim
  wget
  git
  starship
  stow
  lazygit
  fastfetch
  bat
  zoxide
  eza
  tmux
  openssh
  unzip
  gcc
  nvm
  yazi
  which
)

echo "📦 Updating package database..."
sudo pacman -Syu --noconfirm

echo "📦 Installing packages..."
sudo pacman -S --noconfirm --needed "${PACKAGES[@]}"

# === SSH Key Generation ===
SSH_KEY="$HOME/.ssh/id_ed25519"

if [ ! -f "$SSH_KEY" ]; then
  echo "🔐 Generating SSH key..."
  ssh-keygen -t ed25519 -C "tracker086@outlook.com" -f "$SSH_KEY" -N ""
  eval "$(ssh-agent -s)"
  ssh-add "$SSH_KEY"
  echo "📋 Your public key:"
  cat "$SSH_KEY.pub"
  echo "👉 Add it to GitHub: https://github.com/settings/ssh/new"
  read -p "Press ENTER when done..."
else
  echo "✅ SSH key already exists."
fi

# === Locale Configuration ===
if ! grep -q '^LANG=en_US.UTF-8' /etc/locale.conf 2>/dev/null; then
  echo "🌐 Configuring locale..."
  sudo sed -i '/^#en_US.UTF-8 UTF-8/s/^#//' /etc/locale.gen
  sudo locale-gen
  echo "LANG=en_US.UTF-8" | sudo tee /etc/locale.conf > /dev/null
else
  echo "✅ Locale already set."
fi

# === Clone Repositories ===
if [ ! -d "$HOME/.tmux/plugins/tpm" ]; then
  git clone https://github.com/tmux-plugins/tpm "$HOME/.tmux/plugins/tpm"
else
  echo "✅ TPM already cloned."
fi

if [ ! -d "$HOME/dotfiles" ]; then
  git clone git@github.com:adrifer/dotfiles.git "$HOME/dotfiles"
else
  echo "✅ Dotfiles already cloned."
fi

mkdir -p "$HOME/.config"

# === Stow Configs ===
echo "📁 Linking dotfiles..."
cd "$HOME/dotfiles"

if [ ! -L "$HOME/.config/starship.toml" ]; then
  echo "🔗 Linking starship config..."
  stow -t "$HOME/.config" starship
fi

stow tmux
stow nvim
stow lazygit
stow eza
stow git
stow yazi

if [ ! -L "$HOME/.bashrc" ]; then
  echo "🔗 Linking bashrc..."
  rm -f "$HOME/.bashrc"
  stow bashrc
fi

source ~/.bashrc

# === NVM + Node ===
NODE_VERSION="22.10.0"
export NVM_DIR="$HOME/.nvm"
source /usr/share/nvm/init-nvm.sh || true  # allow running even if not yet installed

if command -v nvm >/dev/null 2>&1 && ! nvm list | grep -q "$NODE_VERSION"; then
  echo "⬇️ Installing Node.js $NODE_VERSION..."
  nvm install "$NODE_VERSION"
  nvm alias default "$NODE_VERSION"
else
  echo "✅ Node.js $NODE_VERSION already installed."
fi
echo "✅ Setup complete!"

