// Claude API client (Messages API with a forced tool call for structured output),
// plus the sanitiser for model-generated SVG.

import Anthropic from '@anthropic-ai/sdk';
import DOMPurify from 'isomorphic-dompurify';

export const aiConfigured = () => !!process.env.ANTHROPIC_API_KEY;
export const model = () => process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5';

let client: Anthropic | null = null;
const anthropic = () => (client ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 1 }));

export type Tool = { name: string; description: string; input_schema: Record<string, unknown> & { type: 'object' } };

/** Error with the HTTP status from the Claude API, when there was one. */
export class ClaudeError extends Error {
  status?: number;
  detail?: string;
  constructor(message: string, status?: number, detail?: string) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

export async function callTool<T = Record<string, unknown>>({
  system,
  user,
  tool,
  maxTokens = 4000,
  timeoutMs = 55_000,
}: {
  system: string;
  user: string;
  tool: Tool;
  maxTokens?: number;
  timeoutMs?: number;
}): Promise<T> {
  let data: Anthropic.Message;
  try {
    data = await anthropic().messages.create(
      {
        model: model(),
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: user }],
        tools: [tool],
        tool_choice: { type: 'tool', name: tool.name },
      },
      { timeout: timeoutMs }
    );
  } catch (e) {
    if (e instanceof Anthropic.APIError) throw new ClaudeError(`Claude API error ${e.status}`, e.status, String(e.message).slice(0, 300));
    throw e;
  }
  const block = data.content.find((b) => b.type === 'tool_use');
  if (!block) throw new ClaudeError('Claude did not return structured output.');
  if (data.stop_reason === 'max_tokens') throw new ClaudeError('The sketch was too long to finish. Please try again.');
  return block.input as T;
}

// Only same-document references (#id) survive in href attributes.
DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
  if ((data.attrName === 'href' || data.attrName === 'xlink:href') && !String(data.attrValue).trim().startsWith('#')) data.keepAttr = false;
});

/**
 * Remove anything active or external from model-generated SVG. DOMPurify's SVG profile drops scripts,
 * event handlers, foreignObject and embedded content; a final pass removes external url() references.
 * The SVG is also only ever shown via <img>, which blocks scripts.
 */
export function sanitizeSvg(svg: unknown, { viewBox = '0 0 800 500' } = {}) {
  let s = String(svg || '').trim();
  const start = s.indexOf('<svg');
  const end = s.lastIndexOf('</svg>');
  if (start === -1 || end === -1) return fallbackSvg(viewBox);
  s = DOMPurify.sanitize(s.slice(start, end + 6), {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['use'],
    FORBID_TAGS: ['image', 'foreignObject', 'iframe', 'object', 'embed', 'audio', 'video', 'a'],
  });
  s = s.replace(/url\(\s*(['"]?)(?!#)[^)]*\)/gi, 'none').replace(/@import[^;]*;/gi, '');
  if (!s.startsWith('<svg')) return fallbackSvg(viewBox);
  if (!/xmlns=/.test(s)) s = s.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  if (!/viewBox=/.test(s)) s = s.replace('<svg', `<svg viewBox="${viewBox}"`);
  if (s.length > 60_000) return fallbackSvg(viewBox);
  return s;
}

export function fallbackSvg(viewBox = '0 0 800 500') {
  const [, , w, h] = viewBox.split(' ').map(Number);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><rect width="${w}" height="${h}" fill="#fcf9f4"/><circle cx="${w / 2}" cy="${h / 2}" r="${h / 4}" fill="#dce4d2"/><path d="M${w / 2 - 40} ${h / 2} q40 -70 80 0 q-40 70 -80 0z" fill="#24734f"/></svg>`;
}
