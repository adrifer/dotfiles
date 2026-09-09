import { feature } from "@adrifer/winix";

export const trackagents = feature("trackagents", ({ home, platforms }) => {
  home.imports("inputs.trackagents.homeManagerModules.default");
  home.program("trackagents", {});
});
