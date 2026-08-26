import { useId, useRef, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { RAIL_PAD, RAIL_PAD_R, useReveal } from '../lib/layout';
import {
  submitContact,
  validateContact,
  type ContactErrors,
  type ContactMessage,
} from '../lib/contact';

const EMPTY: ContactMessage = { name: '', email: '', message: '' };

/*
 * The page's one interactive moment, and it stays in the same register as
 * everything above it: a form that looks like a printed document rather than
 * an app. Fields are underlined rules, labels take the machine voice, and
 * submit is the same drawing rule the project links use — no filled buttons,
 * no rounded boxes, no shadows.
 */
export default function Contact() {
  const reveal = useReveal();

  const ids = useId();
  const [values, setValues] = useState<ContactMessage>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sending, setSending] = useState(false);
  const [outcome, setOutcome] = useState<'idle' | 'received'>('idle');

  /*
   * Bots fill every input they find. This one is off-screen rather than
   * `display:none` (which some fillers skip), hidden from assistive tech, and
   * out of the tab order, so nobody using the page can reach it by accident.
   */
  const honeypot = useRef<HTMLInputElement>(null);

  const update = (field: keyof ContactMessage) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    // Clear a field's error as soon as the reader starts fixing it, rather
    // than making them submit again to find out whether they succeeded.
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (honeypot.current?.value) return;

    const found = validateContact(values);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;

    setSending(true);
    await submitContact();
    setSending(false);
    setOutcome('received');
  };

  return (
    <section
      id="contact"
      className={`w-full bg-paper-lift py-32 sm:py-40 ${RAIL_PAD} ${RAIL_PAD_R}`}
    >
      <motion.p className="font-mono text-label uppercase text-muted" {...reveal}>
        Contact
      </motion.p>

      <motion.h2
        className="mt-8 max-w-[20ch] font-serif text-section"
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.05 }}
      >
        If something here is worth a reply, write it down.
      </motion.h2>

      {/*
       * Said before the form rather than after it. Someone should know the
       * message goes nowhere before they spend time writing one, not once
       * they have already sent it.
       */}
      <motion.p
        className="mt-8 max-w-measure border-l-2 border-oxide pl-4 font-mono text-data text-oxide"
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.1 }}
      >
        This form is not connected to anything yet. Nothing you send will reach anyone —
        it is here so the page is finished, and delivery comes next.
      </motion.p>

      <motion.div
        className="mt-16 max-w-2xl"
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.15 }}
      >
        {outcome === 'received' ? (
          <p className="max-w-measure font-serif text-lead text-ink" role="status">
            Nothing was sent — there is still nowhere for it to go. Your message stayed in
            this browser and went no further.
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">
            <Field
              id={`${ids}-name`}
              label="Name"
              value={values.name}
              onChange={update('name')}
              error={errors.name}
              autoComplete="name"
            />

            <Field
              id={`${ids}-email`}
              label="Email"
              type="email"
              value={values.email}
              onChange={update('email')}
              error={errors.email}
              autoComplete="email"
            />

            <Field
              id={`${ids}-message`}
              label="Message"
              value={values.message}
              onChange={update('message')}
              error={errors.message}
              multiline
            />

            <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label htmlFor={`${ids}-company`}>Company</label>
              <input id={`${ids}-company`} ref={honeypot} type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="group mt-2 inline-flex w-fit flex-col gap-2 font-mono text-label uppercase text-ink outline-none disabled:text-muted"
            >
              <span className="transition-colors group-hover:text-oxide group-focus-visible:text-oxide">
                {sending ? 'Sending…' : 'Send'} &rarr;
              </span>
              <span
                aria-hidden="true"
                className="h-px w-full origin-left scale-x-0 bg-oxide transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  multiline = false,
  autoComplete,
}: FieldProps) {
  const errorId = `${id}-error`;

  /*
   * The underline is two elements, not a border that changes width: a 1px
   * rule that is always there, and a 2px oxide bar that draws across it on
   * focus. Growing a border instead would shift every field below it by a
   * pixel each time focus moved.
   */
  const shared =
    'peer w-full bg-transparent pb-3 font-sans text-lead text-ink outline-none placeholder:text-muted/50';

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="font-mono text-label uppercase text-muted">
        {label}
      </label>

      <div className="relative">
        {multiline ? (
          <textarea
            id={id}
            rows={4}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={`${shared} resize-y`}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            autoComplete={autoComplete}
            onChange={(event) => onChange(event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={shared}
          />
        )}

        <span
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 h-px ${error ? 'bg-oxide' : 'bg-ink/25'}`}
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-oxide transition-transform duration-300 ease-out peer-focus:scale-x-100"
        />
      </div>

      {error && (
        <p id={errorId} className="font-mono text-data text-oxide">
          {error}
        </p>
      )}
    </div>
  );
}
