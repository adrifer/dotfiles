import { feature, raw } from "winix";

export const git = feature("git", () =>
  raw.home(`
    programs.git.enable = true;
    programs.git.settings.diff.tool = "nvimdiff";
    programs.git.settings.difftool.prompt = false;
    programs.git.settings.difftool.nvimdiff.cmd = ''\${pkgs.neovim}/bin/nvim -d "$LOCAL" "$REMOTE"'';
    programs.git.settings.user.name = "Adrian Fernandez Garcia";
    programs.git.settings.user.email = "tracker086@outlook.com";
    programs.git.settings.credential."https://dev.azure.com".useHttpPath = true;
    programs.git.includes = [
      {
        condition = "gitdir:~/work/";
        contents.user = {
          name = "Adrian Fernandez Garcia";
          email = "adrifer@microsoft.com";
        };
      }
    ];
  `)
);
