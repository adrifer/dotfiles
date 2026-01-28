{ config, lib, pkgs, inputs, ... }:
{
  imports = [
    inputs.nix-clawdbot.homeManagerModules.clawdbot
  ];

  home.username = "moltbot";
  home.homeDirectory = "/home/moltbot";
  home.stateVersion = "25.05";

  programs.home-manager.enable = true;

  programs.clawdbot = {
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
