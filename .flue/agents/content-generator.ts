// Flue content-generator agent module
// Handles listing / SKU / blog / landing page generation via skills
import { createAgent } from '@flue/runtime';
import { getMinimaxApiKey } from '@/lib/env';

const CONTENT_GENERATION_INSTRUCTIONS = `You are an AI assistant for TimorUp, Timor-Leste's business directory platform.
You generate structured content (listings, SKUs, blog articles, landing pages) that matches the platform's database schema exactly.
Always use actual Timor-Leste context. Output valid JSON matching the requested schema.`;

export default createAgent(() => ({
  name: 'content-generator',
  description: 'Generates business listings, SKUs, blog articles, and landing pages for TimorUp',
  model: `custom/${getMinimaxApiKey() ? 'MiniMax-M2.7' : 'anthropic/claude-sonnet-4-6'}`,
  instructions: CONTENT_GENERATION_INSTRUCTIONS,
}));
