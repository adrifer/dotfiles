import { feature } from "@adrifer/winix";

export const tailscale = feature("tailscale", ({ nixos }) => {
  nixos.service("tailscale", {
    openFirewall: true,
  });
});
