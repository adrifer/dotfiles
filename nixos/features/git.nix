{ ... }:

{
  flake.homeModules.git =
    { ... }:
    {
      programs.git = {
        enable = true;

        settings = {
          user = {
            name = "Adrian Fernandez Garcia";
            email = "tracker086@outlook.com";
          };
          credential."https://dev.azure.com".useHttpPath = true;
        };

        includes = [
          {
            condition = "gitdir:~/work/";
            contents.user = {
              name = "Adrian Fernandez Garcia";
              email = "adrifer@microsoft.com";
            };
          }
        ];
      };
    };
}
