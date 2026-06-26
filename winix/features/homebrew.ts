import { feature } from "@adrifer/winix";

export const homebrew = feature("homebrew", ({ darwin }) => {
  darwin.homebrew({
    enable: true,
    casks: [
      "scroll-reverser",
      "visual-studio-code@insiders",
    ],
  });
});
