import { feature, git as gitProgram, nix } from "winix";

export const git = feature("git", () =>
  gitProgram({
    settings: {
      diff: {
        tool: "nvimdiff",
      },
      difftool: {
        prompt: false,
        nvimdiff: {
          cmd: nix.str`${nix.pkg("neovim")}/bin/nvim -d "$LOCAL" "$REMOTE"`,
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
