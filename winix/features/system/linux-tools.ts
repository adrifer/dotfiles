import { feature } from "@adrifer/winix";

/** Linux-only tools (NixOS and NixOS-WSL). */
export const linuxTools = feature("linux-tools", ({ home }) => {
  home.packages("azure-artifacts-credprovider", "gcc");
});
