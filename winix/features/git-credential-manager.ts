import { feature, pkg, raw } from "winix";

export const gitCredentialManager = feature("git-credential-manager", () => [
  {
    home: {
      packages: [pkg("git-credential-manager")],
    },
  },
  raw.home(`
    programs.git.settings.credential.helper = [
        ""
        "\${pkgs.git-credential-manager}/bin/git-credential-manager"
    ];
    programs.git.settings.credential.credentialStore = "keychain";
    programs.git.settings.credential.azreposCredentialType = "oauth";
    programs.git.settings.credential."https://msdata.visualstudio.com".useHttpPath = true;
    programs.git.settings.credential."urn:ado:org/msdata".username = "adrifer@microsoft.com";
  `),
]);
