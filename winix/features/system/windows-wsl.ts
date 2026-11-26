import { feature } from "@adrifer/winix";

export const windowsWsl = feature("windows-wsl", ({ windows }) => {
  windows.wsl({
    config: {
      wsl2: {
        guiApplications: true,
      },
    },
  });
});
