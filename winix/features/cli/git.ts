import { feature } from "@adrifer/winix";
import { work } from "../../roles/work.ts";

const personalIdentity = {
  name: "Adrian Fernandez Garcia",
  email: "tracker086@outlook.com",
};

const workIdentity = {
  name: "Adrian Fernandez Garcia",
  email: "adrifer@microsoft.com",
};

function toGitIni(sections: Record<string, Record<string, string | boolean>>): string {
  return Object.entries(sections)
    .map(([section, entries]) =>
      `[${section}]\n` +
      Object.entries(entries)
        .map(([key, value]) => `\t${key} = ${value}`)
        .join("\n"),
    )
    .join("\n\n") + "\n";
}

/** Git and the GitHub CLI. */
export const git = feature("git", ({ home, windows }) => {
  windows.package("Git.Git");
  windows.package("GitHub.cli");
  windows.file.text(
    windows.knownFolder.userProfile(".gitconfig"),
    toGitIni({
      init: { defaultBranch: "main" },
      user: personalIdentity,
      ...(work.isActive && {
        'credential "https://dev.azure.com"': { useHttpPath: true },
      }),
    }),
  );

  home.packages("gh");
  home.program("git", {
    settings: {
      init: {
        defaultBranch: "main",
      },
      user: personalIdentity,
      ...(work.isActive && {
        credential: {
          "https://dev.azure.com": {
            useHttpPath: true,
          },
        },
      }),
    },
    ...(work.isActive && {
      includes: [
        {
          condition: "gitdir:~/work/",
          contents: {
            user: workIdentity,
          },
        },
      ],
    }),
  });
});
