{ ... }:

{
  flake.homeModules.javascript =
    {
      config,
      lib,
      pkgs,
      ...
    }:
    let
      nodejs = pkgs.nodejs_22;
      npmGlobalPkgs = [
        {
          pkg = "@github/copilot";
          bin = "copilot";
        }
        {
          pkg = "opencode-ai";
          bin = "opencode";
        }
      ];
    in
    {
      home.packages = with pkgs; [
        bun
        nodejs
        pnpm
      ];

      home.sessionVariables = {
        NPM_CONFIG_PREFIX = "${config.home.homeDirectory}/.npm-global";
        NPM_CONFIG_USERCONFIG = "${config.home.homeDirectory}/.config/npm/npmrc";
        PNPM_HOME = "${config.home.homeDirectory}/.local/share/pnpm";
      };

      home.activation.ensureWritableNpmrc = lib.hm.dag.entryAfter [ "writeBoundary" ] ''
        mkdir -p "${config.home.homeDirectory}/.config/npm"
        touch "${config.home.homeDirectory}/.config/npm/npmrc"
        chmod 600 "${config.home.homeDirectory}/.config/npm/npmrc"
      '';

      home.activation.installNpmGlobalPkgs =
        lib.hm.dag.entryAfter
          [
            "writeBoundary"
            "ensureWritableNpmrc"
          ]
          ''
            export NPM_CONFIG_PREFIX="${config.home.homeDirectory}/.npm-global"
            export PATH="${nodejs}/bin:$PATH"
            ${lib.concatMapStringsSep "\n" (p: ''
              if [ ! -x "${config.home.homeDirectory}/.npm-global/bin/${p.bin}" ]; then
                ${nodejs}/bin/npm i -g ${p.pkg}
              fi
            '') npmGlobalPkgs}
          '';

      home.sessionPath = [
        "${config.home.homeDirectory}/.npm-global/bin"
        "${config.home.homeDirectory}/.local/share/pnpm"
      ];
    };
}
