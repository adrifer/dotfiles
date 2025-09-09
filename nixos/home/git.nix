{ ... }:

{
  programs.git = {
    enable = true;

    # Default identity
    userName  = "Adrian Fernandez Garcia";
    userEmail = "tracker086@outlook.com";

    # Extra config snippets
    extraConfig = {
      credential."https://dev.azure.com".useHttpPath = true;
    };

    # Conditional includes (per-directory)
    includes = [
      {
        condition = "gitdir:~/work/";
        contents.user = {
          name  = "Adrian Fernandez Garcia";
          email = "adrifer@microsoft.com";
        };
      }
    ];
  };
}
