import { feature, nix } from "@adrifer/winix";

export const herdr = feature("herdr", ({ home }) => {
  home.packages(
    nix.expr("inputs.herdr.packages.${pkgs.stdenv.hostPlatform.system}.default"),
  );
  home.activation("installHerdrVimNavigation", {
    script: `
      HERDR="\${inputs.herdr.packages.\${pkgs.stdenv.hostPlatform.system}.default}/bin/herdr"
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
