import { profile } from "@adrifer/winix";
import { javascript } from "../features/dev/javascript.ts";
import { playwright } from "../features/dev/playwright.ts";

/**
 * Development on every OS: JavaScript (Node, Bun, pnpm; NVM on Windows), AI
 * CLIs (Copilot, Codex, Claude) and Playwright (Linux). Heavier toolchains
 * (.NET, Rust, Docker) are added per machine.
 */
export const dev = profile("dev", [
  javascript(),
  playwright(),
]);
