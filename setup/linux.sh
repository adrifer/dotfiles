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

# Clone dotfiles
if [ ! -d "$HOME/dotfiles" ]; then
  git clone git@github.com:adrifer/dotfiles.git "$HOME/dotfiles"
else
  echo "✅ dotfiles already cloned"
fi

# === 3. Use stow to symlink configs ===
echo "📁 Stowing config files..."
cd "$HOME/dotfiles"
stow nvim
stow -t ~/.config starship
stow tmux

echo "✅ Setup complete!"

