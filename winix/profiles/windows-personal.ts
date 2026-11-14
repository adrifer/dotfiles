import { profile } from "@adrifer/winix";
import { komorebi } from "../features/komorebi.ts";
import { packagesWindowsPersonal } from "../features/packages.ts";
import { windowsPersonalDotfiles } from "../features/windows-personal-dotfiles.ts";
import { windowsBase } from "./windows-base.ts";

export const windowsPersonal = profile("windows-personal", [
  windowsBase(),
  packagesWindowsPersonal(),
  windowsPersonalDotfiles(),
  komorebi(),
]);
