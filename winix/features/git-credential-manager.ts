import { feature, nixStr, pkg } from "winix";

export const gitCredentialManager = feature("git-credential-manager", () => [
  {
    home: {
      packages: [pkg("git-credential-manager")],
      programs: {
        git: {
          settings: {
            credential: {
              helper: [
                "",
                nixStr`${pkg("git-credential-manager")}/bin/git-credential-manager`,
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
        },
      },
    },
  },
]);
