// Browser-side form helpers shared by the compose panel, Idea Studio and Lab forms.
// The forms are uncontrolled; these read and mark the live DOM fields.

export async function postJSON<T = Record<string, unknown>>(url: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  } catch {
    throw new Error('We couldn’t reach the server. Check your connection and try again.');
  }
  let data: { ok?: boolean; error?: string } = {};
  try {
    data = await res.json();
  } catch {}
  if (!res.ok || data.ok === false)
    throw new Error(data.error || `Something went wrong (error ${res.status}). Please try again, or email us at cirvola.zerowaste@gmail.com.`);
  return data as T;
}

type Field = HTMLInputElement | HTMLTextAreaElement;

export function formToObject(form: HTMLFormElement): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (const el of Array.from(form.elements) as Field[]) {
    if (!el.name || (el as HTMLInputElement).disabled) continue;
    if (el.type === 'checkbox') out[el.name] = (el as HTMLInputElement).checked;
    else if (el.type === 'radio') {
      if ((el as HTMLInputElement).checked) out[el.name] = el.value;
    } else out[el.name] = el.value.trim();
  }
  return out;
}

/** Marks invalid required fields and returns the first one, or null. */
export function validate(form: HTMLFormElement): Field | null {
  let first: Field | null = null;
  for (const el of Array.from(form.querySelectorAll<Field>('input, textarea'))) {
    if (el.type === 'hidden' || el.closest('.hp')) continue;
    let bad = false;
    if (el.required && el.type === 'checkbox') bad = !(el as HTMLInputElement).checked;
    else if (el.required) bad = !el.value.trim();
    if (!bad && el.type === 'email' && el.value.trim()) bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim());
    if (el.type !== 'checkbox') el.setAttribute('aria-invalid', bad ? 'true' : 'false');
    if (bad && !first) first = el;
  }
  return first;
}

const fieldName = (el: Field) => {
  const lab = el.id && document.querySelector(`label[for="${el.id}"]`);
  return ((lab && lab.textContent) || el.name || 'this field').replace(/Optional/, '').trim();
};

export function describeInvalid(el: Field): string {
  if (el.type === 'checkbox') return 'Please tick the consent box so we can use your details to reply.';
  if (el.type === 'email' && el.value.trim()) return 'That email address doesn’t look right. Check it and try again.';
  return `Please fill in ${fieldName(el).toLowerCase()}.`;
}

/** Clears the invalid mark as soon as someone edits a flagged field. */
export function clearInvalid(target: EventTarget | null) {
  const el = target as Element | null;
  if (el?.getAttribute?.('aria-invalid') === 'true') el.setAttribute('aria-invalid', 'false');
}

export const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const reducedMotion = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
