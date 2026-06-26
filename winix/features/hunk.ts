import { feature } from "@adrifer/winix";

export const hunk = feature("hunk", ({ home }) => {
  home.imports("inputs.hunk.homeManagerModules.default");
  home.program("hunk", {
    enableGitIntegration: true,
  });
});
