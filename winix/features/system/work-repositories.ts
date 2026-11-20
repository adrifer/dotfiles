import { feature } from "@adrifer/winix";

/** Work Windows: npm and PowerShell packages only from the approved Microsoft feeds. */
export const workRepositories = feature("work-repositories", ({ windows }) => {
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
