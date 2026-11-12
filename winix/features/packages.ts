import { feature, nix, windows } from "@adrifer/winix";

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
    "tuicr",
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

export const windowsKomorebiPackage = windows.package("LGUG2Z.komorebi");
export const windowsWhkdPackage = windows.package("LGUG2Z.whkd");

export const packagesWindows = feature("packages-windows", ({ windows }) => {
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
  windows.package("Git.Git");
  windows.package("GitHub.cli");
  windows.package("Microsoft.VisualStudioCode.Insiders");
  windows.package("Neovim.Neovim");
  windows.package("T3Tools.T3Code");

  windows.package("Blizzard.BattleNet");
  windows.package("Valve.Steam");
  windows.package("Corsair.iCUE.5");
  windows.package("Elgato.StreamDeck");
  windows.package("SteelSeries.GG");

  windows.package("Microsoft.PowerShell");
  windows.package("Microsoft.DSC");
  windows.package("Microsoft.WSL");

  return [windowsKomorebiPackage, windowsWhkdPackage];
});
