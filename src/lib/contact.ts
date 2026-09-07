/*
 * Delivery for the contact form — the only module that knows where a message
 * goes. The form component owns every visible state and never learns how
 * sending works, which is why wiring the backend was a change to this file and
 * the component's wording, and nothing else.
 *
 * Messages now reach a real inbox: `POST /api/contact` on the Worker in
 * `worker/index.ts`, which mails them through Cloudflare's send binding.
 * `submitContact` still reports whether that happened rather than assuming it,
 * because the form's rule has not changed — it must never say "sent" about a
 * message it discarded.
 *
 * `validateContact` below is shared with that Worker, so the rules the reader
 * sees and the rules the server enforces are the same rules.
 */

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export type ContactField = keyof ContactMessage;

export type ContactErrors = Partial<Record<ContactField, string>>;

export interface ContactOutcome {
  /** Only ever true when the route confirmed it. The UI must not claim otherwise. */
  delivered: boolean;
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

/**
 * Posts a validated message to the Worker route.
 *
 * `company` is the honeypot's value, forwarded so the server can reject a bot
 * that skipped the form and posted here directly.
 */
export async function submitContact(
  values: ContactMessage,
  company = ''
): Promise<ContactOutcome> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...values, company }),
    });

    /*
     * The body has to say so — `response.ok` alone is not enough. This site is
     * also published to GitHub Pages, where /api/contact does not exist and the
     * single-page fallback answers 200 with the app shell. Trusting the status
     * would make the form claim success on a host that delivered nothing.
     */
    const body: unknown = await response.json().catch(() => null);
    const delivered =
      response.ok &&
      typeof body === 'object' &&
      body !== null &&
      (body as { delivered?: unknown }).delivered === true;

    return { delivered };
  } catch {
    // Offline, blocked, DNS — all the same to the reader, and all not sent.
    return { delivered: false };
  }
}

export { LIMITS as CONTACT_LIMITS };
