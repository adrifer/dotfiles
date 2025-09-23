{ ... }: 

{
  programs.starship = {
    enable = true;
    enableZshIntegration = true;
    settings = {
      add_newline = false;
      format = "$directory$character";
      right_format = "$all";

      character = { vicmd_symbol = "[N](bold green)"; };

      directory = {
        substitutions = {
          "/Users/adrifer/Repos/trackseries/src/Web" = "ts-web";
        };
      };

      git_branch = { format = "[$symbol$branch(:$remote_branch)](fg:4) "; };

      docker_context = { disabled = true; };

      bun = { disabled = true; };

      nodejs = {
        detect_files =
          [ "package.json" ".node-version" "!bunfig.toml" "!bun.lockb" ];
      };
    };
  };
}
