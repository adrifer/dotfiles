import { feature, nix } from "@adrifer/winix";

export const herdr = feature("herdr", ({ home }) => {
  home.packages(
    nix.binaryRelease({
      name: "herdr",
      version: "0.9.5",
      binary: "herdr",
      urlTemplate:
        "https://github.com/herdrdev/herdr/releases/download/v{version}/{file}",
      platforms: {
        "x86_64-linux": {
          file: "herdr-linux-x86_64",
          hash: "sha256-FNnovItKngEY13wyJm921GHwm0A0LrI3UpYL2J9Zkp0=",
          format: "raw",
        },
        "aarch64-linux": {
          file: "herdr-linux-aarch64",
          hash: "sha256-F9dTby2lCFlSNoDvJ53/ysjkojX05G/o2mwuxEFBiXw=",
          format: "raw",
        },
        "x86_64-darwin": {
          file: "herdr-macos-x86_64",
          hash: "sha256-X7CpCOx/Z0Xj4kVziwa/rVbEY5HDkas8CVX76tAfE2k=",
          format: "raw",
        },
        "aarch64-darwin": {
          file: "herdr-macos-aarch64",
          hash: "sha256-+3fCIyoFqANUITgsiUOS9BdOTjihjkivPdApAVfDp+I=",
          format: "raw",
        },
      },
      meta: {
        description: "Terminal workspace manager for AI coding agents",
        homepage: "https://herdr.dev",
        license: "asl20",
      },
    }),
  );
  home.activation("installHerdrVimNavigation", {
    script: `
      HERDR="$newGenPath/home-path/bin/herdr"
      JQ="\${pkgs.jq}/bin/jq"
      export HOME="\${config.home.homeDirectory}"
      export PATH="\${pkgs.git}/bin:\${pkgs.openssh}/bin:\${pkgs.bash}/bin:\${pkgs.coreutils}/bin:$PATH"

      if plugin_list="$("$HERDR" plugin list --json 2>&1)"; then
        if ! printf '%s' "$plugin_list" | "$JQ" -e '.result.plugins[]? | select(.plugin_id == "vim-herdr-navigation")' >/dev/null; then
          if ! install_output="$("$HERDR" plugin install paulbkim-dev/vim-herdr-navigation --yes 2>&1)"; then
            if printf '%s' "$install_output" | "$JQ" -e '.error.code == "protocol_mismatch"' >/dev/null 2>&1; then
              echo "warning: skipping Herdr plugin installation because the running server is from an older generation; restart Herdr after this switch" >&2
            else
              printf '%s\n' "$install_output" >&2
              false
            fi
          fi
        fi
      elif printf '%s' "$plugin_list" | "$JQ" -e '.error.code == "protocol_mismatch"' >/dev/null 2>&1; then
        echo "warning: skipping Herdr plugin check because the running server is from an older generation; restart Herdr after this switch" >&2
      else
        printf '%s\n' "$plugin_list" >&2
        false
      fi
    `,
  });
});
