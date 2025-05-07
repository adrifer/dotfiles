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
  nvm
)

echo "📦 Updating package database..."
sudo pacman -Syu --noconfirm

echo "📦 Installing packages..."
sudo pacman -S --noconfirm --needed "${PACKAGES[@]}"

# === 2. Clone repos ===
echo "🔄 Cloning dotfiles and TPM..."

# Clone TPM
if [ ! -d "$HOME/.tmux/plugins/tpm" ]; then
  git clone https://github.com/tmux-plugins/tpm "$HOME/.tmux/plugins/tpm"
else
  echo "✅ TPM already cloned"
fi

# === 3. Generate SSH key and prompt user ===
SSH_KEY="$HOME/.ssh/id_ed25519"

if [ ! -f "$SSH_KEY" ]; then
  echo "🔐 Generating SSH key for GitHub..."
  ssh-keygen -t ed25519 -C "tracker086@outlook.com" -f "$SSH_KEY" -N ""

  echo "🔐 Starting ssh-agent..."
  eval "$(ssh-agent -s)"
  ssh-add "$SSH_KEY"

  echo "📋 Your new SSH public key:"
  echo "--------------------------------------------------"
  cat "$SSH_KEY.pub"
  echo "--------------------------------------------------"
  echo "📎 Copy this key and add it to GitHub: https://github.com/settings/ssh/new"
  read -p "Press ENTER after adding the SSH key to GitHub..."
else
  echo "✅ SSH key already exists at $SSH_KEY"
fi

# === 4. Fix locale issues ===
echo "🌐 Configuring locale (en_US.UTF-8)..."

# Uncomment en_US.UTF-8 in /etc/locale.gen
sudo sed -i '/^#en_US.UTF-8 UTF-8/s/^#//' /etc/locale.gen

# Generate locales
sudo locale-gen

# Set system-wide locale
echo "LANG=en_US.UTF-8" | sudo tee /etc/locale.conf > /dev/null

echo "✅ Locale setup complete"

# Clone Dotfiles
if [ ! -d "$HOME/dotfiles" ]; then
  git clone git@github.com:adrifer/dotfiles.git "$HOME/dotfiles"
else
  echo "✅ Dotfiles already cloned"
fi

# Create ~/.config folder
if [ ! -d "$HOME/.config" ]; then
  mkdir -p ~/.config
else
  echo "✅ .config folder already created"
fi

# === 5. Use stow to symlink configs ===
echo "📁 Stowing config files..."
cd "$HOME/dotfiles"

stow -t ~/.config starship
stow tmux
stow nvim
stow lazygit
stow eza
stow git

source .bashrc

# === 4. Configure nvm and node ===
nvm install 22.10.0
nvm alias default 22.10.0

echo "✅ Setup complete!"

