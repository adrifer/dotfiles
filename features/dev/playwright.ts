import { feature, nix } from "@adrifer/winix";

/** Playwright with Nix's Chromium (Linux/WSL only; Chromium is not packaged for macOS). */
export const playwright = feature("playwright", ({ home, platforms }) => {
  if (!platforms.nixos.isActive) return;
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
