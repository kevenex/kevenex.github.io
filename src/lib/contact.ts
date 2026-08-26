/*
 * Delivery for the contact form — the only module that knows where a message
 * goes. The form component owns every visible state and never learns how
 * sending works, so wiring a real backend later is a change to this file and
 * nothing else.
 *
 * Right now a message goes nowhere. That is a decision, not an oversight, and
 * `submitContact` is typed so it cannot pretend otherwise: it reports whether
 * the message was delivered, and today the answer is always no. A form that
 * says "sent" while discarding what someone wrote misleads the person who
 * wrote it, so the page tells the truth instead.
 *
 * When a backend exists — a Worker route holding its credential server-side —
 * only the body of `submitContact` changes.
 */

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export type ContactField = keyof ContactMessage;

export type ContactErrors = Partial<Record<ContactField, string>>;

export interface ContactOutcome {
  /** False while no backend is wired. The UI must not claim otherwise. */
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

export function submitContact(): Promise<ContactOutcome> {
  return Promise.resolve({ delivered: false });
}

export { LIMITS as CONTACT_LIMITS };
