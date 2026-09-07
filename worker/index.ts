/*
 * The one server this site has: a single route that takes the contact form's
 * submission and mails it.
 *
 * It sends through Cloudflare's `send_email` binding rather than a third-party
 * API, which means there is no credential anywhere — not in the bundle, not in
 * a secret, not at all. The binding may only reach addresses already verified
 * on the account, so the delivery target is not something an attacker can
 * redirect by tampering with a request.
 *
 * The recipient itself is a secret (`CONTACT_TO`) for a different reason: this
 * repository is public, and a personal address committed here is a personal
 * address handed to scrapers.
 */
import { validateContact, type ContactMessage } from '../src/lib/contact';

export interface Env {
  SEND_EMAIL: SendEmail;
  /** A verified destination address. Set with `wrangler secret put CONTACT_TO`. */
  CONTACT_TO: string;
}

/*
 * Machine mail sends from its own subdomain, so the apex keeps its reputation
 * for real correspondence and any future SPF/DKIM/DMARC records land here
 * instead of on the domain a human writes from.
 */
const FROM = { name: 'kevink.im', email: 'form@send.kevink.im' };

function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
}

/** Missing and non-string fields become empty strings, which validation rejects. */
function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    // The asset server handles everything else; `run_worker_first` in
    // wrangler.jsonc is what routes /api/* here in the first place.
    if (pathname !== '/api/contact') {
      return json({ error: 'Not found' }, 404);
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, { allow: 'POST' });
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return json({ error: 'Expected a JSON body' }, 400);
    }

    const body = (payload ?? {}) as Record<string, unknown>;

    /*
     * The honeypot, enforced here as well as in the form. A bot that posts
     * straight to this endpoint never renders the field the page hides, so
     * catching it client-side alone would catch only the polite ones. Answer
     * as though it worked — telling a bot why it failed just helps it retry.
     */
    if (text(body.company).trim()) {
      return new Response(null, { status: 204 });
    }

    const values: ContactMessage = {
      name: text(body.name),
      email: text(body.email),
      message: text(body.message),
    };

    /*
     * The same validator the form runs, imported rather than restated, so the
     * limits and the wording cannot drift apart. Client-side validation is a
     * courtesy to the reader; this is the one that counts.
     */
    const errors = validateContact(values);
    if (Object.values(errors).some(Boolean)) {
      return json({ delivered: false, errors }, 400);
    }

    try {
      await env.SEND_EMAIL.send({
        from: FROM,
        to: env.CONTACT_TO,
        // So that hitting Reply in the inbox answers the person who wrote,
        // rather than the address this Worker sends from.
        replyTo: { name: values.name.trim(), email: values.email.trim() },
        subject: `kevink.im — ${values.name.trim()}`,
        text: `${values.name.trim()}\n${values.email.trim()}\n\n${values.message.trim()}\n`,
      });
    } catch (error) {
      /*
       * Report the failure rather than swallowing it: the form's whole design
       * rests on never claiming to have sent something it did not.
       */
      console.error('contact: send failed', error);
      return json({ delivered: false }, 502);
    }

    return json({ delivered: true });
  },
};
