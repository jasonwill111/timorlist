// NOTE: Mastra is instantiated lazily because Cloudflare Workers environment
// bindings are not available at module initialization time. Use getMastra()
// to access the Mastra instance — it creates the instance on first call.
// The CloudflareDeployer vars use placeholder values since they are resolved
// at request-handler time when the real env is available.

import { Mastra } from "@mastra/core";
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";
import { agents } from "./agents";

export const providers = {
  default: "minimax-cn-coding-plan",
} as const;

export type ProviderName = typeof providers.default;

let _mastra: Mastra | null = null;

export function getMastra(): Mastra {
  if (!_mastra) {
    _mastra = new Mastra({
      agents,
      deployer: new CloudflareDeployer({
        name: 'TimorUp-ai',
        // Placeholder — replace with real env vars at request time if needed
        vars: {},
      }),
    });
  }
  return _mastra;
}

// Backwards-compatible named export
export const mastra = { get mastra() { return getMastra(); } };

