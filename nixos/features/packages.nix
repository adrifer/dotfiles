{ ... }:

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
        icu
        mkcert
        nixfmt
        nixd
        azure-cli
        python3
        gnumake
      ];
    };
}
