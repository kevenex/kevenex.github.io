/*
 * Delivery for the contact form — the only module that knows where a message
 * goes. The form component owns every visible state and never learns how
 * sending works, so where a message goes is a change to this file and nothing
 * else.
 *
 * It goes to `POST /api/contact`, a Cloudflare Worker route on this site's own
 * origin (`worker/index.ts`), which hands the message to Email Routing. The
 * recipient address lives in that Worker as a secret and never reaches the
 * browser bundle, which is public.
 *
 * `submitContact` reports whether the message was delivered rather than
 * assuming it was. A form that says "sent" while the request failed misleads
 * the person who wrote it, so the page waits to be told.
 */

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export type ContactField = keyof ContactMessage;

export type ContactErrors = Partial<Record<ContactField, string>>;

export interface ContactOutcome {
  /** The endpoint accepted the message. The UI must not claim more than this. */
  delivered: boolean;
  /** Why it did not, when it did not — the UI says something different for each. */
  reason?: 'rate-limited' | 'failed';
}

const LIMITS = { name: 120, email: 200, message: 4000 } as const;

/*
 * Deliberately permissive: a shape check, not an attempt to decide which
 * addresses are real. Rejecting a valid address is worse than accepting an
 * invalid one when the cost of being wrong is someone giving up.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Errors say what to fix, not what went wrong. */
export function validateContact(values: ContactMessage): ContactErrors {
  const errors: ContactErrors = {};

  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!name) {
    errors.name = 'Add your name.';
  } else if (name.length > LIMITS.name) {
    errors.name = `Shorten this to ${LIMITS.name} characters or fewer.`;
  }

  if (!email) {
    errors.email = 'Add an email address, so a reply can reach you.';
  } else if (email.length > LIMITS.email) {
    errors.email = `Shorten this to ${LIMITS.email} characters or fewer.`;
  } else if (!EMAIL.test(email)) {
    errors.email = 'This does not look like an email address.';
  }

  if (!message) {
    errors.message = 'Write a message.';
  } else if (message.length > LIMITS.message) {
    const over = message.length - LIMITS.message;
    errors.message = `Trim ${over.toLocaleString('en-US')} characters — the limit is ${LIMITS.message.toLocaleString('en-US')}.`;
  }

  return errors;
}

const ENDPOINT = '/api/contact';

/*
 * Long enough to survive a slow phone on a train, short enough that a dead
 * endpoint does not leave someone watching "Sending…" indefinitely.
 */
const TIMEOUT = 15_000;

/*
 * `honeypot` is the value of the off-screen field the form keeps for bots. It
 * is sent rather than checked here so the server decides too: the endpoint is
 * public, and anything posted straight to it skips this function entirely.
 */
export async function submitContact(
  values: ContactMessage,
  honeypot: string,
): Promise<ContactOutcome> {
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
        company: honeypot,
      }),
      signal: AbortSignal.timeout(TIMEOUT),
    });

    if (response.ok) return { delivered: true };
    if (response.status === 429) return { delivered: false, reason: 'rate-limited' };
    return { delivered: false, reason: 'failed' };
  } catch {
    // A timeout, an offline browser, a blocked request — all the same to the
    // person waiting, and none of them mean the message arrived.
    return { delivered: false, reason: 'failed' };
  }
}

export { LIMITS as CONTACT_LIMITS };
