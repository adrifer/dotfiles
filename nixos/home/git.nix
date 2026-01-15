{ ... }:

{
  programs.git = {
    enable = true;

    # Git settings
    settings = {
      user = {
        name = "Adrian Fernandez Garcia";
        email = "tracker086@outlook.com";
      };
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
