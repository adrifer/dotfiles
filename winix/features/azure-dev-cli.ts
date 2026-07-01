import { feature, nix } from "@adrifer/winix";

export const azureDevCli = feature("azure-dev-cli", ({ home }) => {
  home.packages(
    nix.binaryRelease({
      name: "azure-dev-cli",
      version: "1.26.0",
      binary: "azd",
      urlTemplate:
        "https://github.com/Azure/azure-dev/releases/download/azure-dev-cli_{version}/{file}",
      platforms: {
        "x86_64-linux": {
          file: "azd-linux-amd64.tar.gz",
          hash: "sha256-DEU06gxx2D9jPEaev8FCTKcPJHCEvbFGjVJQ3ONvEiY=",
          binary: "azd-linux-amd64",
        },
        "aarch64-linux": {
          file: "azd-linux-arm64.tar.gz",
          hash: "sha256-dmOzlxPWW+bddMvzi11Srw5/L2y1dQ7JoA2F4GpAct8=",
          binary: "azd-linux-arm64",
        },
        "x86_64-darwin": {
          file: "azd-darwin-amd64.zip",
          hash: "sha256-qFFGsQGQPlzTjMMwwX+7Y9GOSjcdcoKErocGWreVugY=",
          binary: "azd-darwin-amd64",
        },
        "aarch64-darwin": {
          file: "azd-darwin-arm64.zip",
          hash: "sha256-CDgg0Hjhf0FUq5asNj8y1T03wq4kCTymfy3dxUNuBuE=",
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
