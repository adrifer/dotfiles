import { feature } from "@adrifer/winix";

export const windowsPreferences = feature("windows-preferences", ({ windows }) => {
  windows.setting({ DeveloperMode: true });
  windows.personalization({ colorMode: "Dark" });
  // Explorer starts Run entries and Startup shortcuts without its initial delay
  // or waiting for an idle desktop.
  windows.startup.explorer({ delay: false, waitForIdle: false });
});
