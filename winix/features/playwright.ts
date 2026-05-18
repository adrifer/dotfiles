import { feature } from "winix";

export const playwright = feature("playwright", () => ({
  home: {
    packages: ["chromium"],
    home: {
      sessionVariables: {
        PLAYWRIGHT_CHROMIUM_EXECUTABLE: "${pkgs.chromium}/bin/chromium",
        PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS: "true",
        PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: "1",
      },
    },
  },
}));
