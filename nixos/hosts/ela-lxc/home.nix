{ config, lib, pkgs, inputs, ... }:
{
  imports = [
    inputs.nix-moltbot.homeManagerModules.moltbot
  ];

  home.username = "moltbot";
  home.homeDirectory = "/home/moltbot";
  home.stateVersion = "25.05";

  home.packages = with pkgs; [
    nodejs
    bun
  ];

  # Configure npm to use home directory for globals
  home.sessionVariables = {
    NPM_CONFIG_PREFIX = "$HOME/.npm-global";
  };

  home.sessionPath = [
    "$HOME/.npm-global/bin"
  ];

  # Create .npmrc for persistent npm config
  home.file.".npmrc".text = ''
    prefix=~/.npm-global
  '';

  programs.home-manager.enable = true;

  # Enable bash to source Home Manager session variables
  programs.bash.enable = true;

  programs.moltbot = {
    # Documents directory for agent personality
    documents = ./documents;

    instances.default = {
      enable = true;

      # Telegram disabled - using WhatsApp instead (configured via CLI)
      # After deployment, run: moltbot gateway whatsapp
      # This will show a QR code to scan with your WhatsApp app
      providers.telegram.enable = false;

      # Anthropic as LLM provider
      # For GitHub Copilot instead, run: moltbot auth copilot
      providers.anthropic = {
        apiKeyFile = "/home/moltbot/.secrets/anthropic-api-key";
      };

      # Plugins - add after initial setup
      plugins = [];
    };
  };
}
