import { Fragment, type ReactNode } from 'react';

// Content strings can carry light markup:
//   **bold**, [link](url), and [[placeholder]] (shown as a visible dashed box).

/** A visible placeholder for content we don't have yet. Search content/ for "[[" before launch. */
export function Ph({ children }: { children: ReactNode }) {
  return (
    <span className="ph" title="Placeholder: replace in the content folder">
      {children}
    </span>
  );
}

const richPattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;

function richNodes(text: string, keyPrefix = 'r'): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(richPattern)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyPrefix}${i++}`;
    if (m[1] !== undefined) {
      out.push(<strong key={key}>{richNodes(m[1], `${key}-`)}</strong>);
    } else {
      const href = m[3];
      const external = /^https?:/.test(href);
      out.push(
        <a key={key} href={href} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
          {richNodes(m[2], `${key}-`)}
        </a>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Render text that may contain **bold** and [link](url) markup. */
export function Rich({ text }: { text?: string | null }) {
  if (!text) return null;
  return <>{richNodes(text)}</>;
}

/** Render content text: [[placeholders]] plus rich markup. */
export function Txt({ text }: { text?: string | null }) {
  if (!text) return null;
  const parts = String(text).split(/(\[\[.+?\]\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('[[') ? <Ph key={i}>{p.slice(2, -2)}</Ph> : p ? <Fragment key={i}>{richNodes(p, `${i}-`)}</Fragment> : null
      )}
    </>
  );
}

export const isPlaceholder = (text: unknown) => typeof text === 'string' && text.includes('[[');
