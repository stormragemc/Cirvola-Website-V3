'use client';

import { useState } from 'react';
import { clearInvalid, describeInvalid, formToObject, postJSON, validate } from '@/lib/forms';
import { Icon } from '../Icon';

/** Join the valorisers network. */
export function JoinForm() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    const bad = validate(form);
    if (bad) {
      setError(describeInvalid(bad));
      bad.focus();
      return;
    }
    setBusy(true);
    try {
      await postJSON('/api/join', formToObject(form));
      setDone(true);
    } catch (ex) {
      setError((ex as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="join-form" data-join-form="" noValidate onSubmit={onSubmit} onInput={(e) => clearInvalid(e.target)}>
        <div className="field-row">
          <div className="field">
            <label htmlFor="j-name">Name</label>
            <input id="j-name" name="name" required autoComplete="name" maxLength={120} disabled={done} />
          </div>
          <div className="field">
            <label htmlFor="j-email">Email</label>
            <input id="j-email" name="email" type="email" required autoComplete="email" maxLength={200} disabled={done} />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="j-country">Country</label>
            <input id="j-country" name="country" autoComplete="country-name" maxLength={80} disabled={done} />
          </div>
          <div className="field">
            <label htmlFor="j-works">What do you work with?</label>
            <input id="j-works" name="worksWith" maxLength={160} placeholder="e.g. café coffee grounds, school canteen" disabled={done} />
          </div>
        </div>
        <div className="hp" aria-hidden="true">
          <label>
            Leave this empty <input name="website" tabIndex={-1} autoComplete="off" disabled={done} />
          </label>
        </div>
        <label className="consent">
          <input type="checkbox" name="consent" required disabled={done} />
          <span>
            {'Email me about Cirvola briefs and collaborations. I can unsubscribe any time. See the '}
            <a href="/privacy" target="_blank">
              privacy policy
            </a>
            .
          </span>
        </label>
      <p className="form-error" data-join-error="" role="alert" hidden={!error}>
        {error}
      </p>
      <button type="submit" className={`btn btn-primary${busy ? ' is-busy' : ''}`} data-join-send="" disabled={busy} hidden={done}>
        <span className="btn-label">{busy ? 'Joining…' : 'Join the network'}</span>
      </button>
      <p className="form-success" data-join-done="" hidden={!done}>
        <Icon name="check-circle" size={20} /> You’re in. Welcome to the valorisers.
      </p>
    </form>
  );
}
