'use client';

// The programme-request compose panel (Gmail-style, bottom right) and the buttons that open it.

import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { site } from '@/content/site';
import { describeInvalid, formToObject, postJSON, validate } from '@/lib/forms';
import { Icon } from '../Icon';

type ComposeApi = { open: (preset?: string) => void; close: () => void };
const ComposeContext = createContext<ComposeApi>({ open: () => {}, close: () => {} });

declare global {
  interface Window {
    cirvolaCompose?: ComposeApi;
  }
}

export function ComposeButton({ preset, className, children }: { preset?: string; className?: string; children: ReactNode }) {
  const { open } = useContext(ComposeContext);
  return (
    <button
      type="button"
      className={className}
      data-compose-open=""
      data-compose-preset={preset}
      onClick={(e) => {
        e.preventDefault();
        open(preset);
      }}
    >
      {children}
    </button>
  );
}

const programmeTypes = ['School programme', 'Community workshop', 'Company or team workshop', 'Booth or exhibition', 'Live cooking session', 'Something else'];

export function ComposeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const panel = useRef<HTMLElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const subject = useRef<HTMLInputElement>(null);
  const doneBox = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  const subjectTouched = useRef(false);

  const [hidden, setHidden] = useState(true);
  const [minimised, setMinimised] = useState(false);
  const [entering, setEntering] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const doneRef = useRef(done);
  doneRef.current = done;

  const autoSubject = useCallback(() => {
    if (!form.current || !subject.current || subjectTouched.current) return;
    const data = formToObject(form.current);
    subject.current.value = `Programme request: ${data.programme || 'General'}${data.organisation ? ` for ${data.organisation}` : ''}`;
  }, []);

  const open = useCallback(
    (preset?: string) => {
      const f = form.current;
      if (!f) return;
      opener.current = document.activeElement;
      setHidden(false);
      setMinimised(false);
      setEntering(true);
      requestAnimationFrame(() => requestAnimationFrame(() => flushSync(() => setEntering(false))));
      if (preset) {
        const radios = Array.from(f.querySelectorAll<HTMLInputElement>('input[name="programme"]'));
        const radio = radios.find((r) => r.value === preset) || radios.find((r) => r.value === 'Something else');
        if (radio) radio.checked = true;
        const message = f.elements.namedItem('message') as HTMLTextAreaElement;
        if (preset === 'Post a waste stream' && !message.value) {
          message.value = 'We’d like to post a waste stream as an R&D brief.\n\nWhat we throw away:\nHow much, and how often:\nWhere we’re based:';
        }
      }
      autoSubject();
      if (!doneRef.current) setTimeout(() => f.querySelector<HTMLInputElement>('#c-name')?.focus({ preventScroll: true }), 60);
    },
    [autoSubject]
  );

  const close = useCallback(() => {
    setHidden(true);
    if (doneRef.current) {
      // reset after a successful send
      form.current?.reset();
      subjectTouched.current = false;
      setDone(false);
    }
    (opener.current as HTMLElement | null)?.focus?.();
  }, []);

  // Field listeners: keep the subject line in step, and clear invalid marks while typing.
  useEffect(() => {
    const f = form.current!;
    const onInput = (e: Event) => {
      const t = e.target as HTMLInputElement;
      if (t === subject.current) subjectTouched.current = t.value.trim() !== '';
      else autoSubject();
      if (t.getAttribute('aria-invalid') === 'true') t.setAttribute('aria-invalid', 'false');
    };
    f.addEventListener('input', onInput);
    f.addEventListener('change', autoSubject);
    return () => {
      f.removeEventListener('input', onInput);
      f.removeEventListener('change', autoSubject);
    };
  }, [autoSubject]);

  useEffect(() => {
    window.cirvolaCompose = { open, close };
  }, [open, close]);

  // A new page starts with the panel closed, as a fresh page load would.
  // Open it directly with a #request link (handy for emails or posters).
  const firstPath = useRef(true);
  useEffect(() => {
    if (!firstPath.current) {
      setHidden(true);
      setMinimised(false);
      setError(null);
      form.current?.reset();
      subjectTouched.current = false;
      setDone(false);
    }
    firstPath.current = false;
    if (location.hash === '#request') open();
  }, [pathname, open]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    setError(null);
    const bad = validate(f);
    if (bad) {
      setError(describeInvalid(bad));
      bad.focus();
      return;
    }
    setBusy(true);
    try {
      const data = formToObject(f);
      data.subject = data.subject || subject.current!.placeholder;
      data.page = location.pathname;
      await postJSON('/api/enquiry', data);
      flushSync(() => setDone(true));
      doneBox.current?.focus();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ComposeContext.Provider value={{ open, close }}>
      {children}
      <section
        ref={panel}
        className={`compose${minimised ? ' is-minimised' : ''}${entering ? ' is-entering' : ''}`}
        data-compose=""
        hidden={hidden}
        aria-labelledby="compose-title"
        role="dialog"
        aria-modal="false"
        onKeyDown={(e) => {
          if (e.key === 'Escape') close();
        }}
      >
        <div className="compose-bar" onDoubleClick={() => setMinimised((m) => !m)}>
          <h2 id="compose-title" className="compose-title">New programme request</h2>
          <div className="compose-actions">
            <button type="button" className="icon-btn" data-compose-min="" aria-label="Minimise" onClick={() => setMinimised((m) => !m)}>
              <Icon name="minus" />
            </button>
            <button type="button" className="icon-btn" data-compose-close="" aria-label="Close" onClick={close}>
              <Icon name="close" />
            </button>
          </div>
        </div>
        <form ref={form} className="compose-body" data-compose-form="" noValidate hidden={done} onSubmit={onSubmit}>
          <div className="compose-row compose-to">
            <span className="compose-label">To</span>
            <span className="compose-chip">
              <Icon name="leaf" />
              {` Cirvola <${site.email}>`}
            </span>
          </div>
          <div className="compose-row">
            <label className="compose-label" htmlFor="c-name">From</label>
            <input id="c-name" name="name" autoComplete="name" placeholder="Your name" required maxLength={120} />
          </div>
          <div className="compose-row">
            <label className="compose-label" htmlFor="c-email">Email</label>
            <input id="c-email" name="email" type="email" autoComplete="email" placeholder="you@school.edu.sg" required maxLength={200} />
          </div>
          <div className="compose-row">
            <label className="compose-label" htmlFor="c-org">Organisation</label>
            <input id="c-org" name="organisation" autoComplete="organization" placeholder="School, company or community group" maxLength={160} />
          </div>
          <fieldset className="compose-types">
            <legend className="compose-label">I’m looking for</legend>
            <div className="chip-set">
              {programmeTypes.map((t, i) => (
                <label className="chip" key={t}>
                  <input type="radio" name="programme" value={t} defaultChecked={i === 0} />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="compose-split">
            <div className="compose-row">
              <label className="compose-label" htmlFor="c-size">Group size</label>
              <input id="c-size" name="groupSize" inputMode="numeric" placeholder="e.g. 40" maxLength={40} />
            </div>
            <div className="compose-row">
              <label className="compose-label" htmlFor="c-date">Preferred date</label>
              <input id="c-date" name="preferredDate" placeholder="e.g. March 2027" maxLength={80} />
            </div>
          </div>
          <div className="compose-row">
            <label className="compose-label" htmlFor="c-subject">Subject</label>
            <input ref={subject} id="c-subject" name="subject" placeholder="Programme request" maxLength={160} data-compose-subject="" />
          </div>
          <label className="sr-only" htmlFor="c-message">Message</label>
          <textarea
            id="c-message"
            name="message"
            className="compose-message"
            required
            maxLength={4000}
            placeholder="Tell us about your group, what you’d like them to take away, and any space or equipment you have (kitchen, auditorium, outdoor area)."
          ></textarea>
          <div className="hp" aria-hidden="true">
            <label>
              Leave this empty <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <label className="consent">
            <input type="checkbox" name="consent" required />
            <span>
              I agree that Cirvola may use these details to reply to my request, as set out in the{' '}
              <a href="/privacy" target="_blank">privacy policy</a>.
            </span>
          </label>
          <p className="form-error" data-compose-error="" role="alert" hidden={!error}>
            {error}
          </p>
          <div className="compose-foot">
            <button type="submit" className={`btn btn-primary${busy ? ' is-busy' : ''}`} data-compose-send="" disabled={busy}>
              <span className="btn-label">{busy ? 'Sending…' : 'Send request'}</span>
              <Icon name="send" />
            </button>
            <span className="compose-hint">We usually reply within three working days.</span>
          </div>
        </form>
        <div ref={doneBox} className="compose-done" data-compose-done="" hidden={!done} tabIndex={-1}>
          <Icon name="check-circle" />
          <h3>Request sent</h3>
          <p>{`Thanks! It’s in our inbox at ${site.email}. We’ve emailed you a copy and will reply soon.`}</p>
          <button type="button" className="btn btn-secondary btn-sm" data-compose-close="" onClick={close}>
            Close
          </button>
        </div>
      </section>
    </ComposeContext.Provider>
  );
}
