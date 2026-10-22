// Branded HTML emails. Table-based with inline styles so they render in Gmail,
// Outlook and Apple Mail. Colours match the website.

const C = {
  bg: '#f3eee3',
  card: '#fcf9f4',
  forest: '#103d2c',
  forest2: '#18503a',
  ink: '#17291d',
  muted: '#4b5a4f',
  line: '#e2ddd0',
  zest: '#f7a928',
  sage: '#dce4d2',
  peel: '#e07609',
};
type Value = string | number | null | undefined | { __html: string };
type ListItem = string | { __html?: string; __text?: string };
export type EmailSection = { heading?: string; rows?: [string, Value][]; quote?: string; text?: string; list?: ListItem[]; html?: string };
export type Email = {
  label: string;
  title: string;
  intro?: string;
  action?: { label: string; href: string };
  sections: EmailSection[];
  footer?: string;
  footerText?: string;
  logoSrc: string;
  preheader?: string;
};

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export const escHtml = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const nl2br = (s: unknown) => escHtml(s).replace(/\r?\n/g, '<br>');

export function sgTime(date = new Date()) {
  return new Intl.DateTimeFormat('en-SG', { timeZone: 'Asia/Singapore', dateStyle: 'medium', timeStyle: 'short' }).format(date) + ' SGT';
}

function rowsTable(rows: [string, Value][]) {
  const filled = rows.filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${filled
    .map(
      ([k, v], i) => `<tr>
      <td valign="top" style="padding:11px 0;width:34%;font:600 13px/1.4 ${FONT};color:${C.muted};${i ? `border-top:1px solid ${C.line};` : ''}">${escHtml(k)}</td>
      <td valign="top" style="padding:11px 0 11px 12px;font:15px/1.5 ${FONT};color:${C.ink};${i ? `border-top:1px solid ${C.line};` : ''}">${v && typeof v === 'object' ? v.__html : nl2br(v)}</td>
    </tr>`
    )
    .join('')}</table>`;
}

export const htmlValue = (h: string) => ({ __html: h });

function block(section: EmailSection) {
  const heading = section.heading
    ? `<p style="margin:0 0 12px;font:700 12px/1.2 ${FONT};letter-spacing:.06em;color:${C.peel};">${escHtml(section.heading)}</p>`
    : '';
  let inner = '';
  if (section.rows) inner += rowsTable(section.rows);
  if (section.quote) inner += `<div style="border-left:4px solid ${C.zest};background:#fff;padding:16px 18px;border-radius:0 10px 10px 0;font:15px/1.6 ${FONT};color:${C.ink};">${nl2br(section.quote)}</div>`;
  if (section.text) inner += `<p style="margin:0;font:15px/1.6 ${FONT};color:${C.ink};">${nl2br(section.text)}</p>`;
  if (section.list) inner += `<ol style="margin:0;padding-left:20px;font:15px/1.6 ${FONT};color:${C.ink};">${section.list.map((x) => `<li style="margin:0 0 6px;">${typeof x === 'object' ? x.__html || '' : escHtml(x)}</li>`).join('')}</ol>`;
  if (section.html) inner += section.html;
  return `<tr><td style="padding:22px 32px 6px;">${heading}${inner}</td></tr>`;
}

/**
 * @param {object} o
 * @param {string} o.label     pill in the header, e.g. "Programme request"
 * @param {string} o.title     big heading
 * @param {string} o.intro     line under the heading
 * @param {{label:string, href:string}} [o.action]  primary button
 * @param {Array}  o.sections  [{heading, rows:[[k,v]], quote, text, list, html}]
 * @param {string} o.footer
 * @param {string} o.logoSrc   'cid:cirvola-logo' or an absolute URL
 * @param {string} [o.preheader] inbox preview text
 */
export function renderEmail(o: Email) {
  const action = o.action
    ? `<tr><td style="padding:20px 32px 4px;"><a href="${escHtml(o.action.href)}" style="display:inline-block;background:${C.zest};color:${C.ink};text-decoration:none;font:700 15px/1 ${FONT};padding:14px 22px;border-radius:999px;">${escHtml(o.action.label)}</a></td></tr>`
    : '';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${escHtml(o.title)}</title></head>
<body style="margin:0;padding:0;background:${C.bg};">
<span style="display:none!important;max-height:0;overflow:hidden;opacity:0;">${escHtml(o.preheader || o.intro || '')}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};"><tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:${C.card};border-radius:18px;overflow:hidden;">
  <tr><td style="background:${C.forest};padding:22px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td valign="middle"><img src="${escHtml(o.logoSrc)}" width="150" alt="Cirvola" style="display:block;border:0;width:150px;height:auto;"></td>
      <td valign="middle" align="right"><span style="display:inline-block;background:${C.zest};color:${C.ink};font:700 12px/1 ${FONT};padding:8px 12px;border-radius:999px;">${escHtml(o.label)}</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:${C.forest2};height:6px;line-height:6px;font-size:0;">&nbsp;</td></tr>
  <tr><td style="padding:30px 32px 0;">
    <h1 style="margin:0;font:800 26px/1.2 ${FONT};color:${C.forest};">${escHtml(o.title)}</h1>
    ${o.intro ? `<p style="margin:10px 0 0;font:15px/1.55 ${FONT};color:${C.muted};">${escHtml(o.intro)}</p>` : ''}
  </td></tr>
  ${action}
  ${o.sections.map(block).join('')}
  <tr><td style="padding:28px 32px 30px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid ${C.line};padding-top:18px;font:12px/1.55 ${FONT};color:${C.muted};">
      ${o.footer || ''}
    </td></tr></table>
  </td></tr>
</table>
<p style="margin:16px 0 0;font:12px/1.5 ${FONT};color:${C.muted};">Cirvola, Singapore. Waste to wonder.</p>
</td></tr></table>
</body></html>`;
}

/** Plain-text twin of an email for clients that don't show HTML. */
export function renderText(o: Email) {
  const lines = [o.label.toUpperCase(), '', o.title, o.intro || '', ''];
  for (const s of o.sections) {
    if (s.heading) lines.push(`— ${s.heading} —`);
    if (s.rows) for (const [k, v] of s.rows) if (v && String(typeof v === 'object' ? '' : v).trim()) lines.push(`${k}: ${v}`);
    if (s.quote) lines.push(s.quote);
    if (s.text) lines.push(s.text);
    if (s.list) s.list.forEach((x, i) => lines.push(`${i + 1}. ${typeof x === 'object' ? x.__text || x.__html?.replace(/<[^>]+>/g, '') || x : x}`));
    lines.push('');
  }
  if (o.footerText) lines.push(o.footerText);
  return lines.join('\n');
}
