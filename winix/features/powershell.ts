import { feature } from "@adrifer/winix";

/** PowerShell 7 with the shared profile. The profile starts starship and zoxide when they are installed. */
export const powershell = feature("powershell", ({ windows }) => {
  windows.package("Microsoft.PowerShell");
  // The profile's ls/lsa (same as zsh).
  windows.package("eza-community.eza");
  const icons = windows.powershell.module("Terminal-Icons");
  windows.powershell.profile("../windows/powershell/Microsoft.PowerShell_profile.ps1", {
    dependsOn: [icons],
  });

  // The directory that holds this dotfiles checkout; the profile's `repos` goes there.
  windows.env.set("WINIX_REPOS", windows.configPath("../.."));
});
