/*
 * The contact form's only server-side moment: it takes what someone wrote on
 * /app/#contact and hands it to Cloudflare Email Routing, which delivers it to
 * a verified destination address. No mailbox exists on this domain and none is
 * needed — the `send_email` binding sends from a routing address, and the free
 * plan allows any destination the account has verified.
 *
 * Nothing here is trusted from the page. The client validates so the reader
 * gets fast, specific errors; this file validates again because the endpoint is
 * public and the page's own gate is client-side. `validateContact` is imported
 * rather than restated so both ends enforce one set of limits.
 */
import { validateContact, type ContactMessage } from '../src/lib/contact';

export interface Env {
  /** Bound in wrangler.jsonc. Restricted by Cloudflare to verified destinations. */
  CONTACT_EMAIL: SendEmail;
  CONTACT_RATE_LIMIT: RateLimit;
  /** A routing address on this zone — the envelope sender, not a mailbox. */
  CONTACT_FROM: string;
  SITE_ORIGIN: string;
  /*
   * A secret, not a var: this repository is public, and a personal address in
   * a committed config is an address handed to every scraper that reads it.
   * `wrangler secret put CONTACT_TO`.
   */
  CONTACT_TO: string;
}

const ENDPOINT = '/api/contact';

/*
 * `validateContact` caps the message at 4,000 characters, so a body four times
 * past that is not a long message — it is someone probing.
 */
const MAX_BODY = 16 * 1024;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // `run_worker_first` sends only /api/* here, but the Worker should not
    // depend on routing config to know what it serves.
    if (url.pathname !== ENDPOINT) return json(404, { error: 'Not found.' });

    if (request.method !== 'POST') {
      return json(405, { error: 'Use POST.' }, { Allow: 'POST' });
    }

    /*
     * A soft check: a browser sends Origin on cross-origin POSTs, so this
     * turns away a form posted from someone else's page. It cannot stop a
     * direct request — that is what the rate limit below is for — so a missing
     * Origin is allowed rather than treated as an attack.
     */
    const origin = request.headers.get('Origin');
    if (origin && !allowedOrigin(origin, url.origin, env.SITE_ORIGIN)) {
      return json(403, { error: 'Not allowed from this origin.' });
    }

    const { success } = await env.CONTACT_RATE_LIMIT.limit({
      key: request.headers.get('CF-Connecting-IP') ?? 'unknown',
    });
    if (!success) return json(429, { error: 'Too many messages. Try again in a minute.' });

    // Content-Length first so an oversized body is refused before it is read
    // into memory; the length check after covers a chunked request, which has
    // no Content-Length to refuse.
    if (Number(request.headers.get('Content-Length') ?? 0) > MAX_BODY) {
      return json(413, { error: 'Message too large.' });
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY) return json(413, { error: 'Message too large.' });

    let body: Partial<ContactMessage> & { company?: string };
    try {
      body = JSON.parse(raw) as typeof body;
    } catch {
      return json(400, { error: 'Expected JSON.' });
    }

    /*
     * The honeypot answers exactly as a real send does. A bot that learns which
     * field gave it away is a bot that stops filling that field.
     */
    if (typeof body.company === 'string' && body.company.trim()) {
      return json(202, { delivered: true });
    }

    const values: ContactMessage = {
      name: text(body.name),
      email: text(body.email),
      message: text(body.message),
    };

    const errors = validateContact(values);
    if (Object.values(errors).some(Boolean)) return json(400, { errors });

    const name = values.name.trim();
    const email = values.email.trim();
    const site = new URL(env.SITE_ORIGIN).host;

    /*
     * The binding composes the MIME itself, which is the reason there is no
     * mail library here: nothing in this file hand-builds a header, so nothing
     * in this file can hand-build a malformed one. `header()` is still applied
     * to the name, the one piece of stranger-typed text that reaches a header.
     */
    try {
      await env.CONTACT_EMAIL.send({
        from: { name: site, email: env.CONTACT_FROM },
        to: env.CONTACT_TO,
        replyTo: { name: header(name), email },
        subject: `${site} — ${header(name)}`,
        text: [
          `From:    ${name} <${email}>`,
          `Sent:    ${new Date().toISOString()}`,
          `Country: ${(request.cf?.country as string | undefined) ?? 'unknown'}`,
          '',
          values.message.trim(),
          '',
        ].join('\n'),
      });
    } catch (error) {
      // Observability is on for this Worker, so this lands somewhere readable.
      console.error('contact: send failed', error);
      return json(502, { error: 'The message could not be sent.' });
    }

    return json(202, { delivered: true });
  },
};

/** Same-origin covers www and workers.dev previews without listing them. */
function allowedOrigin(origin: string, self: string, site: string): boolean {
  if (origin === self || origin === site) return true;
  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/** CR and LF are the only characters that can break out of a header line. */
function header(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function json(status: number, body: unknown, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });
}
