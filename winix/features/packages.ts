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
      "(pkgs.azure-cli.withExtensions [ pkgs.azure-cli.extensions.azure-devops ])",
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
