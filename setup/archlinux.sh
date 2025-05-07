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

# Clone Dotfiles
if [ ! -d "$HOME/dotfiles" ]; then
  git clone git@github.com:adrifer/dotfiles.git "$HOME/dotfiles"
else
  echo "✅ Dotfiles already cloned"
fi

# === 3. Use stow to symlink configs ===
echo "📁 Stowing config files..."
cd "$HOME/dotfiles"

stow -t ~/.config starship
stow tmux
stow nvim
stow lazygit
stow eza
stow git

source ./bashrc

# === 4. Configure nvm and node ===
nvm install 22.10.0
nvm alias default 22.10.0

echo "✅ Setup complete!"

