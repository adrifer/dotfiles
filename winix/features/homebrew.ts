import { feature } from "winix";

export const homebrew = feature("homebrew", () => ({
  darwin: {
    "nix-homebrew": {
      enable: true,
      user: "adrifer",
      autoMigrate: true,
    },
    homebrew: {
      enable: true,
      casks: [
        "scroll-reverser",
        "visual-studio-code@insiders",
      ],
    },
  },
}));
