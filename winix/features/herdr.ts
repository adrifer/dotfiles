import { feature, nix } from "@adrifer/winix";

export const herdr = feature("herdr", ({ home }) => {
  home.packages(
    nix.expr("inputs.herdr.packages.${pkgs.stdenv.hostPlatform.system}.default"),
  );
});
