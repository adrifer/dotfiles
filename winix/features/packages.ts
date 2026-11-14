import { feature, nix } from "@adrifer/winix";

export const packages = feature("packages", ({ home }) => {
  home.packages(
    "wget",
    "curl",
    "eza",
    "bat",
    "tree",
    "fastfetch",
    "btop",
    "unzip",
    "yazi",
    "superfile",
    "powershell",
    "ripgrep",
    "fd",
    "jq",
    "openssl",
    "lazygit",
    "gh",
    "icu",
    "mkcert",
    "nixfmt",
    "nixd",
    nix.expr(
      "(pkgs.stable.azure-cli.withExtensions [ pkgs.stable.azure-cli.extensions.azure-devops ])",
    ),
    "python3",
    "gnumake",
  );
});

export const packagesLinux = feature("packages-linux", ({ home }) => {
  home.packages("azure-artifacts-credprovider", "gcc");
});

export const packagesMacos = feature("packages-macos", ({ home }) => {
  home.packages("nerd-fonts.jetbrains-mono");
});

export const packagesWindowsPersonal = feature("packages-windows-personal", ({ windows }) => {
  windows.package("7zip.7zip");
  windows.package("Hanselman.WingetTUI");
  windows.package("Microsoft.PowerToys");
  windows.package("Microsoft.WindowsApp");
  windows.package("Obsidian.Obsidian");
  windows.package("Proton.ProtonPass");
  windows.package("Proton.ProtonVPN");
  windows.package("SimplyCA.Typeless");
  windows.package("xAI.GrokBot");

  windows.package("Adrifer.Sonarctl");
  windows.package("CoreyButler.NVMforWindows");
  windows.package("eza-community.eza");
  windows.package("Neovim.Neovim");
  windows.package("T3Tools.T3Code");

  windows.package("Blizzard.BattleNet");
  windows.package("Valve.Steam");
  windows.package("Corsair.iCUE.5");
  windows.package("Elgato.StreamDeck");
  windows.package("SteelSeries.GG");
});
