import { feature } from "@adrifer/winix";

export const git = feature("git", ({ home }) => {
  home.program("git", {
    settings: {
      alias: {
        review: "!tuicr",
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
