import { feature } from "@adrifer/winix";
import { npmGlobalPackages } from "../dev/javascript.ts";

/** T3 Code desktop app on Windows, started automatically at sign-in. */
export const t3App = feature("t3-app", ({ windows }) => {
  // T3 Code updates itself; ensure it is installed without pinning its version.
  const t3Code = windows.package("T3Tools.T3Code", { version: "any" });
  windows.startup.shortcut("T3 Code (Beta)", {
    executable: windows.knownFolder.localAppData("Programs/t3code/T3 Code (Beta).exe"),
    dependsOn: [t3Code],
  });
});

/** T3 CLI/server installed globally via npm on Linux/WSL and macOS. */
export const t3Server = feature("t3-server", ({ home }) => {
  npmGlobalPackages(home, "t3");
});
