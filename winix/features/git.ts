import { feature, home, nix } from "@adrifer/winix";

export const git = feature("git", () =>
  home.program("git", {
    settings: {
      diff: {
        tool: "hunk",
      },
      difftool: {
        prompt: false,
        hunk: {
          cmd: nix.str`${nix.expr("config.programs.hunk.package")}/bin/hunk difftool "$LOCAL" "$REMOTE" "$MERGED"`,
        },
      },
      user: {
        name: "Adrian Fernandez Garcia",
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
  })
);
