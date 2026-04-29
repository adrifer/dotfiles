{ ... }:

{
  flake.homeModules.git =
    { pkgs, ... }:
    {
      programs.git = {
        enable = true;

        settings = {
          diff.tool = "nvimdiff";
          difftool = {
            prompt = false;
            nvimdiff.cmd = ''${pkgs.neovim}/bin/nvim -d "$LOCAL" "$REMOTE"'';
          };
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
