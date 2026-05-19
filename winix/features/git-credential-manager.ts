import { feature, home, nix, program } from "winix";

export const gitCredentialManager = feature("git-credential-manager", () => [
  home.packages(nix.pkg("git-credential-manager")),
  program("git", {
    settings: {
      credential: {
        helper: [
          "",
          nix.str`${nix.pkg("git-credential-manager")}/bin/git-credential-manager`,
        ],
        credentialStore: "keychain",
        azreposCredentialType: "oauth",
        "https://msdata.visualstudio.com": {
          useHttpPath: true,
        },
        "urn:ado:org/msdata": {
          username: "adrifer@microsoft.com",
        },
      },
    },
  }),
]);
