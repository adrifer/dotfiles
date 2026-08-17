import { feature, nix } from "@adrifer/winix";

export const dotnet = feature("dotnet", ({ home }) => {
  const dotnetSdk = nix.pkg("dotnet-sdk_10");

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
      if [ ! -x "\${config.home.homeDirectory}/.dotnet/tools/aspire" ]; then
        \${pkgs.dotnet-sdk_10}/bin/dotnet tool install --global Aspire.Cli
      fi
    `,
  });
});
