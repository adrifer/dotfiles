import { feature, nix } from "@adrifer/winix";

export const dotnet = feature("dotnet", ({ home, nixos }) => {
  const dotnetSdk = nix.pkg("dotnet-sdk_10");

  nixos.program("nix-ld", {
    libraries: nix.withPkgs(["stdenv.cc.cc.lib", "icu"]),
  });
  home.packages(dotnetSdk);
  home.env({
    DOTNET_ROOT: nix.pkgPath("dotnet-sdk_10", "share/dotnet"),
    DOTNET_ROOT_X64: nix.pkgPath("dotnet-sdk_10", "share/dotnet"),
  });
  home.path(
    nix.homePath(".dotnet/tools"),
    nix.homePath(".aspire/bin"),
  );
  home.activation("installAspireCli", {
    script: `
      export DOTNET_CLI_HOME="\${config.home.homeDirectory}"
      export PATH="\${pkgs.dotnet-sdk_10}/bin:$PATH"
      aspire="\${config.home.homeDirectory}/.dotnet/tools/aspire"

      if ! "$aspire" --version >/dev/null 2>&1; then
        if \${pkgs.dotnet-sdk_10}/bin/dotnet tool list --global | grep -qi '^aspire\\.cli '; then
          \${pkgs.dotnet-sdk_10}/bin/dotnet tool uninstall --global Aspire.Cli
        fi
        \${pkgs.dotnet-sdk_10}/bin/dotnet tool install --global Aspire.Cli
      fi
    `,
  });
});
