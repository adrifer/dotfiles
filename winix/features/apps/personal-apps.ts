import { feature } from "@adrifer/winix";

/** Personal Windows apps and games (personal machines only). */
export const personalApps = feature("personal-apps", ({ windows }) => {
  windows.package("7zip.7zip");
  windows.package("Hanselman.WingetTUI");
  windows.package("Microsoft.PowerToys");
  windows.package("Microsoft.WindowsApp");
  windows.package("Proton.ProtonPass");
  windows.package("Proton.ProtonVPN");

  // These update themselves (or report no comparable version): ensure they
  // are installed, but never pin, compare or downgrade them.
  const anyVersion = { version: "any" };
  windows.package("Obsidian.Obsidian", anyVersion);
  windows.package("SimplyCA.Typeless", anyVersion);
  windows.package("xAI.GrokBot", anyVersion);
  windows.package("T3Tools.T3Code", anyVersion);

  // Games and gaming peripherals.
  windows.package("Blizzard.BattleNet", anyVersion);
  windows.package("Valve.Steam", anyVersion);
  windows.package("Corsair.iCUE.5", anyVersion);
  windows.package("Elgato.StreamDeck", anyVersion);
  windows.package("SteelSeries.GG", anyVersion);
});
