import { feature } from "@adrifer/winix";

export const windowsWorkRepositories = feature("windows-work-repositories", ({ windows }) => {
  windows.npm.registries({
    registries: {
      microsoftApproved: {
        uri: "https://packagefeedproxy.microsoft.io/npm/",
      },
    },
    default: "microsoftApproved",
  });
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
