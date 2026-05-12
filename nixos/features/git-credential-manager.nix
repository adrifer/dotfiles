{ ... }:

{
  flake.homeModules.git-credential-manager =
    { pkgs, ... }:
    {
      home.packages = [
        pkgs.git-credential-manager
      ];

      programs.git.settings.credential = {
        helper = [
          ""
          "${pkgs.git-credential-manager}/bin/git-credential-manager"
        ];
        credentialStore = "keychain";
        azreposCredentialType = "oauth";
        "https://msdata.visualstudio.com".useHttpPath = true;
        "urn:ado:org/msdata".username = "adrifer@microsoft.com";
      };
    };
}
