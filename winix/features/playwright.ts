import { feature, nix } from "@adrifer/winix";

export const playwright = feature("playwright", ({ home }) => {
  const chromium = nix.pkg("chromium");

  home.packages(chromium);
  home.env({
    PLAYWRIGHT_CHROMIUM_EXECUTABLE: nix.pkgPath(
      "chromium",
      "bin/chromium",
    ),
    PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS: "true",
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: "1",
  });
});
