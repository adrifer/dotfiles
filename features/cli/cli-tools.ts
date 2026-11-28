import { feature, nix, type HomeHelper } from "@adrifer/winix";

const dotfile = (home: HomeHelper, name: string) =>
  home.symlink(`./config/${name}`, { recursive: true });

/**
 * Everyday command-line tools without a feature of their own (Linux, WSL and
 * macOS). Tools with settings or a Windows side have their own feature:
 * eza, git (gh), lazygit, neovim, starship, zoxide, fzf, herdr.
 */
export const cliTools = feature("cli-tools", ({ home }) => {
  home.packages(
    "wget",
    "curl",
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
  home.configFiles({
    btop: dotfile(home, "btop"),
    yazi: dotfile(home, "yazi"),
  });
});
