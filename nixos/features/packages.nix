{ inputs, ... }:

{
  flake.homeModules.packages =
    { pkgs, ... }:
    {
      home.packages = with pkgs; [
        wget
        curl
        eza
        bat
        tree
        fastfetch
        unzip
        yazi
        powershell
        ripgrep
        fd
        jq
        openssl

        lazygit
        gh
        azure-artifacts-credprovider
        icu
        mkcert
        gcc
        nixfmt
        nixd
        inputs.codex-cli-nix.packages.${pkgs.stdenv.hostPlatform.system}.default
        azure-cli
        python3
        gnumake
      ];
    };
}
