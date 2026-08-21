import { feature, nix } from "@adrifer/winix";

export const herdr = feature("herdr", ({ home }) => {
  home.packages(
    nix.binaryRelease({
      name: "herdr",
      version: "0.8.2",
      binary: "herdr",
      urlTemplate:
        "https://github.com/herdrdev/herdr/releases/download/v{version}/{file}",
      platforms: {
        "x86_64-linux": {
          file: "herdr-linux-x86_64",
          hash: "sha256-l2FQoU1JDJSyQ+ouGn6y37Z/EuNrGC25CTb2co5q7PQ=",
          format: "raw",
        },
        "aarch64-linux": {
          file: "herdr-linux-aarch64",
          hash: "sha256-9VYQZY4cLg0qrvcwtLKriF9/i6AChas3K/sU8uPVtA0=",
          format: "raw",
        },
        "x86_64-darwin": {
          file: "herdr-macos-x86_64",
          hash: "sha256-q1AmLIGQzXqpBW0knSVcCMMow+hxbenPop208TG44sE=",
          format: "raw",
        },
        "aarch64-darwin": {
          file: "herdr-macos-aarch64",
          hash: "sha256-pdT01QTYswnJH4EQUFWTAPq6MSWEJfU8UIUvyW9q5XQ=",
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
