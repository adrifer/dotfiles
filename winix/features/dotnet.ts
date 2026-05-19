import { feature, home, nix } from "winix";

export const dotnet = feature("dotnet", () => [
  home.packages(nix.pkg("dotnet-sdk_10")),
  home.env({
    DOTNET_ROOT: "${pkgs.dotnet-sdk_10}/share/dotnet",
    DOTNET_ROOT_X64: "${pkgs.dotnet-sdk_10}/share/dotnet",
  }),
  home.path(
    "${config.home.homeDirectory}/.dotnet/tools",
    "${config.home.homeDirectory}/.aspire/bin"
  ),
  home.activation("installAspireCli", {
    script: `
      export DOTNET_CLI_HOME="\${config.home.homeDirectory}"
      export PATH="\${pkgs.dotnet-sdk_10}/bin:$PATH"
      if [ ! -x "\${config.home.homeDirectory}/.dotnet/tools/aspire" ]; then
        \${pkgs.dotnet-sdk_10}/bin/dotnet tool install --global Aspire.Cli
      fi
    `,
  }),
]);
