import { feature, home } from "@adrifer/winix";

export const hunk = feature("hunk", () => [
  home.imports("inputs.hunk.homeManagerModules.default"),
  home.program("hunk", {
    enableGitIntegration: true,
  }),
]);
