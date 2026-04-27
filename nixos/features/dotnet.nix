{ ... }:

{
  flake.homeModules.dotnet =
    {
      config,
      lib,
      pkgs,
      ...
    }:
    let
      dotnet = pkgs.dotnet-sdk_10;
    in
    {
      home.packages = [
        dotnet
      ];

      home.sessionVariables = {
        DOTNET_ROOT = "${dotnet}/share/dotnet";
        DOTNET_ROOT_X64 = "${dotnet}/share/dotnet";
      };

      home.activation.installAspireCli = lib.hm.dag.entryAfter [ "writeBoundary" ] ''
        export DOTNET_CLI_HOME="${config.home.homeDirectory}"
        export PATH="${dotnet}/bin:$PATH"
        if [ ! -x "${config.home.homeDirectory}/.dotnet/tools/aspire" ]; then
          ${dotnet}/bin/dotnet tool install --global Aspire.Cli
        fi
      '';

      home.sessionPath = [
        "${config.home.homeDirectory}/.dotnet/tools"
        "${config.home.homeDirectory}/.aspire/bin"
      ];
    };
}
