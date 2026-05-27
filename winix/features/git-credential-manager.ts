import { feature, home, nix } from "winix";

export const gitCredentialManager = feature("git-credential-manager", () => [
  home.packages(nix.pkg("git-credential-manager")),
  home.program("git", {
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
        // Home Manager writes ~/.config/git/config as a read-only Nix store symlink.
        // Preseed GCM's Azure Repos cache keys so auth does not try to mutate it.
        "azrepos:org/msdata": {
          azureAuthority: "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47",
          username: "adrifer@microsoft.com",
        },
      },
    },
  }),
]);
