import { profile } from "@adrifer/winix";
import { t3Server } from "../features/apps/t3.ts";
import { javascript } from "../features/dev/javascript.ts";
import { playwright } from "../features/dev/playwright.ts";

/**
 * Development on every OS: JavaScript (Node, Bun, pnpm; NVM on Windows), AI
 * CLIs (Copilot, Codex, Claude), T3 server, and Playwright (Linux). Heavier
 * toolchains (.NET, Rust, Docker) are added per machine.
 */
export const dev = profile("dev", [
  javascript(),
  t3Server(),
  playwright(),
]);
