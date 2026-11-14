import { profile } from "@adrifer/winix";
import { windowsWorkRepositories } from "../features/windows-work-repositories.ts";
import { windowsBase } from "./windows-base.ts";

export const windowsWork = profile("windows-work", [
  windowsWorkRepositories(),
  windowsBase(),
]);
