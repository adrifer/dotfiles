import { feature, nix } from "@adrifer/winix";

export const herdr = feature("herdr", ({ home }) => {
  home.packages(
    nix.expr("inputs.herdr.packages.${pkgs.stdenv.hostPlatform.system}.default"),
  );
  home.activation("installHerdrVimNavigation", {
    script: `
      HERDR="\${inputs.herdr.packages.\${pkgs.stdenv.hostPlatform.system}.default}/bin/herdr"
      JQ="\${pkgs.jq}/bin/jq"

      if ! "$HERDR" plugin list --json | "$JQ" -e '.result.plugins[]? | select(.plugin_id == "vim-herdr-navigation")' >/dev/null; then
        "$HERDR" plugin install paulbkim-dev/vim-herdr-navigation --yes
      fi
    `,
  });
});
