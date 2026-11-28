import { feature } from "@adrifer/winix";

export const lazygit = feature("lazygit", ({ home, windows }) => {
  home.packages("lazygit");
  home.configFiles({
    lazygit: home.symlink("./config/lazygit", { recursive: true }),
  });

  windows.package("JesseDuffield.lazygit");
  windows.file.symlink(
    windows.knownFolder.localAppData("lazygit/config.yml"),
    "./config/lazygit/config.yml",
  );
});
