import { profile } from "winix";
import { wsl } from "../features/wsl.ts";

export const wslProfile = profile("wsl-profile", [
  wsl(),
]);
