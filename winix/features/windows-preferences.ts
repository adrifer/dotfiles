import { feature } from "@adrifer/winix";

export const windowsPreferences = feature("windows-preferences", ({ windows }) => {
  windows.setting({ DeveloperMode: true });
  windows.personalization({ colorMode: "Dark" });
});
