import { darwin, feature } from "winix";

export const homebrew = feature("homebrew", () =>
  darwin.homebrew({
    enable: true,
    casks: [
      "scroll-reverser",
      "visual-studio-code@insiders",
    ],
  })
);
