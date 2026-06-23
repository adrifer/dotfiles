{ ... }:

{
  flake.homeModules.azure-dev-cli =
    { lib, pkgs, ... }:
    let
      version = "1.25.5";
      sources = {
        x86_64-linux = {
          file = "azd-linux-amd64.tar.gz";
          hash = "sha256-h45MPTkA/qTmXV56A3GCjKEnoKx9G1jALEpa81ZNHEk=";
          binary = "azd-linux-amd64";
        };
        aarch64-linux = {
          file = "azd-linux-arm64.tar.gz";
          hash = "sha256-4qKxal8wKt3Uh+Ubrw8TyhD/qL59hKxEGuq91Dxx4hk=";
          binary = "azd-linux-arm64";
        };
        x86_64-darwin = {
          file = "azd-darwin-amd64.zip";
          hash = "sha256-ph7ts7Oy4nVXxu0H79i9Rokp8BDG1d7zan6AhfxZUAY=";
          binary = "azd-darwin-amd64";
        };
        aarch64-darwin = {
          file = "azd-darwin-arm64.zip";
          hash = "sha256-pO+HW/udYlfJRDJdNyD8g0Ftck94X67cU6+rjRDbUcc=";
          binary = "azd-darwin-arm64";
        };
      };
      source = sources.${pkgs.stdenv.hostPlatform.system};
      azure-dev-cli = pkgs.stdenvNoCC.mkDerivation {
        pname = "azure-dev-cli";
        inherit version;

        src = pkgs.fetchurl {
          url = "https://github.com/Azure/azure-dev/releases/download/azure-dev-cli_${version}/${source.file}";
          inherit (source) hash;
        };

        nativeBuildInputs = lib.optionals pkgs.stdenv.hostPlatform.isDarwin [ pkgs.unzip ];

        unpackPhase = ''
          runHook preUnpack
          mkdir source
          case "$src" in
            *.zip) unzip -q "$src" -d source ;;
            *.tar.gz) tar -xzf "$src" -C source ;;
          esac
          sourceRoot=source
          runHook postUnpack
        '';

        installPhase = ''
          runHook preInstall
          install -Dm755 "${source.binary}" "$out/bin/azd"
          install -Dm644 NOTICE.txt "$out/share/doc/$pname/NOTICE.txt"
          runHook postInstall
        '';

        meta = {
          description = "Azure Developer CLI";
          homepage = "https://github.com/Azure/azure-dev";
          license = lib.licenses.mit;
          mainProgram = "azd";
          platforms = builtins.attrNames sources;
        };
      };
    in
    {
      home.packages = [ azure-dev-cli ];
    };
}
