import { feature } from "@adrifer/winix";

export const windowsWorkRepositories = feature("windows-work-repositories", ({ windows }) => {
  windows.powershell.repositories({
    repositories: {
      microsoftApproved: {
        uri: "https://packagefeedproxy.microsoft.io/powershell/v3/index.json",
      },
    },
    default: "microsoftApproved",
    allowed: ["microsoftApproved"],
  });
});
