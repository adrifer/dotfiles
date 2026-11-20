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
  windows.package("Proton.ProtonPass");
  windows.package("Proton.ProtonVPN");

  windows.package("Adrifer.Sonarctl");

  // These update themselves (or report no comparable version): ensure they
  // are installed, but never pin, compare or downgrade them.
  const anyVersion = { version: "any" };
  windows.package("Obsidian.Obsidian", anyVersion);
  windows.package("SimplyCA.Typeless", anyVersion);
  windows.package("xAI.GrokBot", anyVersion);
  windows.package("CoreyButler.NVMforWindows", anyVersion);
  windows.package("T3Tools.T3Code", anyVersion);
  windows.package("Blizzard.BattleNet", anyVersion);
  windows.package("Valve.Steam", anyVersion);
  windows.package("Corsair.iCUE.5", anyVersion);
  windows.package("Elgato.StreamDeck", anyVersion);
  windows.package("SteelSeries.GG", anyVersion);
});
