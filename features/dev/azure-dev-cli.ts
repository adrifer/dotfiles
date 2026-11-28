import { feature, nix } from "@adrifer/winix";

export const azureDevCli = feature("azure-dev-cli", ({ home }) => {
  home.packages(
    nix.binaryRelease({
      name: "azure-dev-cli",
      version: "1.37.3",
      binary: "azd",
      urlTemplate:
        "https://github.com/Azure/azure-dev/releases/download/azure-dev-cli_{version}/{file}",
      platforms: {
        "x86_64-linux": {
          file: "azd-linux-amd64.tar.gz",
          hash: "sha256-i/Pn6G8dWpvBrm8BTHkml2YMzgT2MzqAkcbgi3+Md4Y=",
          binary: "azd-linux-amd64",
        },
        "aarch64-linux": {
          file: "azd-linux-arm64.tar.gz",
          hash: "sha256-qflv1fl3kjjtFnXNvPji2GhrQDGlZz/0lYweTebnKOU=",
          binary: "azd-linux-arm64",
        },
        "x86_64-darwin": {
          file: "azd-darwin-amd64.zip",
          hash: "sha256-O49dtKC0v8kvqj4AQdp3pO59ofzJGDsYe2WUW1z7Bck=",
          binary: "azd-darwin-amd64",
        },
        "aarch64-darwin": {
          file: "azd-darwin-arm64.zip",
          hash: "sha256-KsQ+WQ9iOM2AzBIVpVVnqLUd6SH50XgGyjrnzgfibO4=",
          binary: "azd-darwin-arm64",
        },
      },
      extraInstall: `install -Dm644 NOTICE.txt "$out/share/doc/$pname/NOTICE.txt"`,
      meta: {
        description: "Azure Developer CLI",
        homepage: "https://github.com/Azure/azure-dev",
        license: "mit",
      },
    }),
  );
});
