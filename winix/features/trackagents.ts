import { feature } from "@adrifer/winix";

export const trackagents = feature("trackagents", ({ home, platforms }) => {
  home.imports("inputs.trackagents.homeManagerModules.default");
  home.program("trackagents", {
    runtime: "self-updating",
    updateOrigin: "https://ai.adrifer.com",
  });
});
