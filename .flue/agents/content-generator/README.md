# Content Generator Agent

Flue agent for generating TimorUp content: business listings, SKUs, blog articles, and landing pages.

## Model Configuration

- **Primary**: MiniMax-M2.7 (via `MINIMAX_API_KEY` env var)
- **Fallback**: anthropic/claude-sonnet-4-6
- Model selected at agent creation time via `createAgent()` factory

## Skills

4 markdown skills in `skills/` directory, activated per-content-type:

| Skill | File | Purpose |
|-------|------|---------|
| listing | `skills/listing.md` | Business directory listings |
| sku | `skills/sku.md` | Product/service SKUs |
| blog | `skills/blog.md` | Blog articles |
| landing | `skills/landing.md` | Landing page sections |

Each skill has frontmatter (`name`, `description`) and lives in the skills directory.

## Usage

```typescript
import { init } from '@flue/runtime';
import generator from '.flue/agents/content-generator';
import { ListingDataSchema } from '@/lib/ai/valibot-schemas';

const harness = await init(generator);
const session = harness.session();
const handle = session.prompt(userMessage, { result: ListingDataSchema });
const result = await handle; // { data: ListingOutput }
```

## Architecture

```
flue-generate.ts → flue-bridge.ts → init(agent).session().prompt() → MiniMax API
```

- `flue-generate.ts`: Thin wrapper, exports same 4 functions (generateListing/Sku/Blog/Landing)
- `flue-bridge.ts`: Bridge adapter — builds messages, routes to Flue session, handles timeout
- `.flue/agents/content-generator.ts`: Flue agent definition with model + instructions

## Logs

Flue events are observable via `observe()` from `@flue/runtime`:

```typescript
import { observe } from '@flue/runtime';
observe((event) => {
  if (event.type === 'prompt_end') {
    console.log('Prompt completed:', event.usage);
  }
});
```

## Error Handling

- 120s timeout enforced via `Promise.race`
- Returns typed data validated against valibot schemas
- Timeout errors thrown as `Error('AI generation timed out after 120s')`
