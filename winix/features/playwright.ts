import { feature } from "@adrifer/winix";

export const playwright = feature("playwright", ({ home }) => {
  home.packages("chromium");
  home.env({
    PLAYWRIGHT_CHROMIUM_EXECUTABLE: "${pkgs.chromium}/bin/chromium",
    PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS: "true",
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: "1",
  });
});
