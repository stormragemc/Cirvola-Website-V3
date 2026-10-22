// Email sending.
//   Option A: Gmail SMTP with an App Password (GMAIL_USER + GMAIL_APP_PASSWORD), via nodemailer
//   Option B: Resend HTTP API (RESEND_API_KEY + RESEND_FROM)
// SMTP_HOST / SMTP_PORT / SMTP_SECURE / SMTP_USER / SMTP_PASS override Gmail for other providers.
// MAIL_DRY_RUN=true writes each email to .mail-outbox/ instead of sending it.

import nodemailer, { type Transporter } from 'nodemailer';
import { emailLogoBase64 } from './email-logo';

export type Address = { name: string; email: string };
export type Attachment = { filename: string; content: Buffer; contentType: string; cid?: string };
type Mail = { to: Address[]; replyTo?: Address; subject: string; html: string; text?: string; attachments?: Attachment[] };

export const inbox = () => process.env.CIRVOLA_INBOX || 'cirvola.zerowaste@gmail.com';

export function mailConfigured() {
  return !!(process.env.RESEND_API_KEY || (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) || (process.env.SMTP_HOST && process.env.SMTP_USER));
}
export const usingResend = () => !!process.env.RESEND_API_KEY;

/** The light Cirvola wordmark as an inline (cid) attachment for email headers. */
export function logoAttachment(): Attachment {
  return { filename: 'cirvola.png', content: Buffer.from(emailLogoBase64, 'base64'), contentType: 'image/png', cid: 'cirvola-logo' };
}

/** Where the email header logo comes from: a public URL for Resend, otherwise the inline attachment. */
export const logoSrc = () =>
  usingResend() && process.env.SITE_URL ? `${process.env.SITE_URL}/images/logos/cirvola-wordmark-light.png` : 'cid:cirvola-logo';

const nm = (a: Address) => ({ name: a.name.replace(/["\\\r\n]/g, ''), address: a.email });
const nmAttachment = (a: Attachment) => ({ filename: a.filename, content: a.content, contentType: a.contentType, ...(a.cid ? { cid: a.cid } : {}) });

async function sendResend({ to, replyTo, subject, html, text, attachments = [] }: Mail) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || 'Cirvola Website <onboarding@resend.dev>',
      to: to.map((a) => a.email),
      reply_to: replyTo ? replyTo.email : undefined,
      subject,
      html,
      text,
      attachments: attachments.map((a) => ({
        filename: a.filename,
        content: Buffer.from(a.content).toString('base64'),
        content_type: a.contentType,
        ...(a.cid ? { content_id: a.cid } : {}),
      })),
    }),
  });
  if (!res.ok) throw new Error(`Resend error ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

let transport: Transporter | null = null;
function smtp(user: string, pass: string) {
  if (transport) return transport;
  const port = Number(process.env.SMTP_PORT || 465);
  transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: process.env.SMTP_INSECURE !== 'true' },
    connectionTimeout: 20_000,
    socketTimeout: 20_000,
    logger: process.env.SMTP_DEBUG === 'true',
    debug: process.env.SMTP_DEBUG === 'true',
  });
  return transport;
}

/** Send one email. Attachments with a `cid` are inline images. */
export async function sendMail(mail: Mail) {
  const { to, replyTo, subject, html, text, attachments = [] } = mail;
  const from = { name: 'Cirvola Website', address: process.env.SMTP_USER || process.env.GMAIL_USER || inbox() };
  const message = { from, to: to.map(nm), replyTo: replyTo ? nm(replyTo) : undefined, subject, html, text: text || '', attachments: attachments.map(nmAttachment) };

  if (process.env.MAIL_DRY_RUN === 'true') {
    // Local testing: write the email to .mail-outbox/ instead of sending it.
    const { mkdir, writeFile } = await import('node:fs/promises');
    const dir = `${process.cwd()}/.mail-outbox`;
    await mkdir(dir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const info = await nodemailer.createTransport({ streamTransport: true, buffer: true, newline: 'windows' }).sendMail(message);
    await writeFile(`${dir}/${stamp}.eml`, info.message as Buffer);
    await writeFile(`${dir}/${stamp}.html`, html.replace(/cid:cirvola-logo/g, '/images/logos/cirvola-wordmark-light.png'));
    console.log(`[mail dry run] "${subject}" → ${to.map((a) => a.email).join(', ')} (saved in .mail-outbox)`);
    return;
  }
  if (usingResend()) return sendResend(mail);
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
  if (!user || !pass) throw Object.assign(new Error('Email isn’t set up yet.'), { code: 'NO_MAIL' });
  await smtp(user, pass).sendMail(message);
}
