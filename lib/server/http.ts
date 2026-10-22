// Small helpers shared by the API routes.

export function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  const text = await req.text();
  if (text.length > 4_000_000) throw new HttpError('That submission is too large.', 413);
  try {
    const body = JSON.parse(text || '{}');
    return body && typeof body === 'object' ? body : {};
  } catch {
    return {};
  }
}

export const clientIp = (req: Request) =>
  String(req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown')
    .split(',')[0]
    .trim();

// Best-effort, per-instance rate limiting. Good enough to stop casual abuse.
const hits = new Map<string, number[]>();
export function rateLimited(req: Request, bucket: string, { max = 8, windowMs = 10 * 60 * 1000 } = {}) {
  const k = `${bucket}:${clientIp(req)}`;
  const now = Date.now();
  const list = (hits.get(k) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(k, list);
  if (hits.size > 5000) hits.clear();
  return list.length > max;
}

export const str = (v: unknown, max = 500) =>
  String(v ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, max);

export const isEmail = (v: string) => /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/.test(v);

type Guarded = { body: Record<string, unknown>; response?: undefined } | { body?: undefined; response: Response };

/** Shared guard for public forms: honeypot, rate limit and body parsing. */
export async function guardForm(req: Request, bucket: string, limits?: { max?: number; windowMs?: number }): Promise<Guarded> {
  let body: Record<string, unknown>;
  try {
    body = await readJson(req);
  } catch (e) {
    return { response: json((e as HttpError).status || 400, { ok: false, error: (e as Error).message }) };
  }
  // Honeypot filled in: pretend success so bots move on.
  if (body.website) return { response: json(200, { ok: true }) };
  if (rateLimited(req, bucket, limits)) {
    return { response: json(429, { ok: false, error: 'You’ve sent a lot of requests in a short time. Please wait a few minutes and try again.' }) };
  }
  return { body };
}

/** Next.js answers other methods with 405 by itself; this keeps the original JSON message. */
export const methodNotAllowed = () => json(405, { ok: false, error: 'Use POST.' });
