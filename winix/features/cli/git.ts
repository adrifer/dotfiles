import { feature } from "@adrifer/winix";

/** Git and the GitHub CLI. Git for Windows keeps its own settings (not managed yet). */
export const git = feature("git", ({ home, windows }) => {
  windows.package("Git.Git");
  windows.package("GitHub.cli");
  home.packages("gh");
  home.program("git", {
    settings: {
      init: {
        defaultBranch: "main",
      },
      user: {
        name: "Adrian Fernandez",
        email: "tracker086@outlook.com",
      },
      credential: {
        "https://dev.azure.com": {
          useHttpPath: true,
        },
      },
    },
    includes: [
      {
        condition: "gitdir:~/work/",
        contents: {
          user: {
            name: "Adrian Fernandez Garcia",
            email: "adrifer@microsoft.com",
          },
        },
      },
    ],
  });
});
