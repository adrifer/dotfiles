import { feature, home } from "winix";

export const hunk = feature("hunk", () => [
  {
    homeManager: {
      imports: ["inputs.hunk.homeManagerModules.default"],
    },
  },
  home.program("hunk", {
    enableGitIntegration: true,
  }),
]);
