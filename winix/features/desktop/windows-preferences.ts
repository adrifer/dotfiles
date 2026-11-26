import { feature } from "@adrifer/winix";

export const windowsPreferences = feature("windows-preferences", ({ windows }) => {
  windows.settings({
    developer: { mode: true, sudo: "inline" },
    theme: { colorMode: "dark" },
    explorer: {
      // Start Run entries and Startup shortcuts without Explorer's initial delay
      // or waiting for an idle desktop.
      startupDelay: false,
      waitForIdle: false,
      showExtensions: true,
      openTo: "thisPC",
    },
    taskbar: {
      endTask: true,
      multiMonitor: true,
      multiMonitorMode: "windowOnly",
    },
    clipboard: { history: true },
  });
});
