import { motion } from 'framer-motion';
import { CERTIFICATIONS, EDUCATION, SKILLS } from '../content/resume';
import { RAIL_PAD, RAIL_PAD_R, useReveal } from '../lib/layout';
import CompanyMark from './CompanyMark';

/*
 * The part of a résumé nobody reads for pleasure and everybody checks. Kept
 * to the machine voice and a two-column ledger: what, from where, and when,
 * with the years in a column of their own so they scan as a list of dates.
 *
 * No skill percentages. A self-assessed "95%" encodes nothing a peer can use.
 *
 * A row whose institution has a mark (Western, for now) carries it beside
 * the name, the same tile Experience uses, and centres its date against the
 * pair instead of on the first line.
 */
export default function Credentials() {
  const reveal = useReveal();

  const ledger = [
    { heading: 'Education', rows: EDUCATION },
    { heading: 'Certifications', rows: CERTIFICATIONS },
  ];

  return (
    <section id="credentials" className={`w-full py-32 sm:py-40 ${RAIL_PAD} ${RAIL_PAD_R}`}>
      <motion.p className="font-mono text-label uppercase text-muted" {...reveal}>
        Credentials
      </motion.p>

      <div className="mt-12 grid gap-x-16 gap-y-14 lg:grid-cols-2">
        {ledger.map(({ heading, rows }, index) => (
          <motion.div
            key={heading}
            {...reveal}
            transition={{ ...reveal.transition, delay: index * 0.06 }}
          >
            <h2 className="font-serif text-[32px] leading-tight">{heading}</h2>

            <dl className="mt-6 flex flex-col border-t border-ink/15">
              {rows.map((row) => (
                <div
                  key={row.what}
                  className={`flex justify-between gap-6 border-b border-ink/10 py-4 ${
                    row.mark ? 'items-center' : 'items-baseline'
                  }`}
                >
                  <dt className="flex items-center gap-4 font-sans text-body text-ink">
                    {row.mark && <CompanyMark mark={row.mark} />}
                    <span>
                      {row.what}
                      <span className="block font-sans text-small text-muted">{row.where}</span>
                    </span>
                  </dt>
                  <dd className="tabular shrink-0 font-mono text-data text-muted">{row.year}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        ))}
      </div>

      <motion.div className="mt-20 border-t border-ink/15 pt-8" {...reveal}>
        <h2 className="font-mono text-label uppercase text-muted">Skills</h2>

        <dl className="mt-6 grid gap-x-12 gap-y-6 sm:grid-cols-2">
          {SKILLS.map(({ group, items }) => (
            <div key={group}>
              <dt className="font-mono text-data uppercase tracking-[0.1em] text-ink">{group}</dt>
              <dd className="mt-2 font-sans text-small text-muted">{items.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
