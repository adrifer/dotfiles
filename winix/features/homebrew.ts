import { darwin, feature } from "@adrifer/winix";

export const homebrew = feature("homebrew", () =>
  darwin.homebrew({
    enable: true,
    casks: [
      "scroll-reverser",
      "visual-studio-code@insiders",
    ],
  })
);
