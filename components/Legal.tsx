import type { ReactNode } from 'react';

// IMPORTANT: The privacy policy and terms are sensible starting templates written for a small
// Singapore social enterprise. They are not legal advice. Have them reviewed before launch,
// especially once Cirvola is incorporated (add the entity name and UEN).

export const legalUpdated = '22 October 2026';

export type LegalSection = { id: string; title: string; body: ReactNode };

export function LegalShell({ title, sections }: { title: string; sections: LegalSection[] }) {
  return (
    <section className="legal">
      <div className="wrap legal-inner">
        <h1 className="page-title">{title}</h1>
        <p className="legal-updated">{`Last updated ${legalUpdated}`}</p>
        <nav className="legal-toc" aria-label="Contents">
          <ol>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.title}</a>
              </li>
            ))}
          </ol>
        </nav>
        {sections.map((s) => (
          <section id={s.id} className="legal-section" key={s.id}>
            <h2>{s.title}</h2>
            {s.body}
          </section>
        ))}
      </div>
    </section>
  );
}
