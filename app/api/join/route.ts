// POST /api/join: someone joins the valorisers network. Cirvola gets an email
// so they can add the person to their mailing list.

import { json, guardForm, str, isEmail, methodNotAllowed } from '@/lib/server/http';
import { sendMail, inbox, logoAttachment, logoSrc as getLogoSrc } from '@/lib/server/mail';
import { renderEmail, renderText, sgTime, type Email } from '@/lib/server/email-templates';

export const runtime = 'nodejs';
export const maxDuration = 20;
export const GET = methodNotAllowed;

export async function POST(req: Request) {
  const { body, response } = await guardForm(req, 'join', { max: 5 });
  if (response) return response;
  const d = { name: str(body.name, 120), email: str(body.email, 200).toLowerCase(), country: str(body.country, 80), worksWith: str(body.worksWith, 160) };
  if (!d.name) return json(400, { ok: false, error: 'Please add your name.' });
  if (!isEmail(d.email)) return json(400, { ok: false, error: 'Please add a valid email address.' });
  if (body.consent !== true) return json(400, { ok: false, error: 'Please tick the box so we can email you.' });

  const logoSrc = getLogoSrc();
  const email: Email = {
    label: 'New valoriser',
    title: `${d.name} joined the valorisers network`,
    intro: 'Add them to the mailing list for briefs, recipes and collaboration calls.',
    sections: [
      {
        rows: [
          ['Name', d.name],
          ['Email', d.email],
          ['Country', d.country],
          ['Works with', d.worksWith],
          ['Joined', sgTime()],
          ['Consent', 'Agreed to receive Cirvola emails; can unsubscribe any time'],
        ],
      },
    ],
    logoSrc,
    footer: 'Sent from the “Join the valorisers network” form in the R&D Lab.',
    footerText: 'Sent from the Join the valorisers network form.',
  };
  try {
    await sendMail({
      to: [{ name: 'Cirvola', email: inbox() }],
      replyTo: { name: d.name, email: d.email },
      subject: `[Network] ${d.name}${d.country ? `, ${d.country}` : ''}`,
      html: renderEmail(email),
      text: renderText(email),
      attachments: logoSrc.startsWith('cid:') ? [logoAttachment()] : [],
    });
  } catch (e) {
    console.error('join mail failed:', (e as Error).message);
    return json((e as { code?: string }).code === 'NO_MAIL' ? 503 : 502, {
      ok: false,
      error: `We couldn’t sign you up just now. Please email ${inbox()} and we’ll add you.`,
    });
  }
  return json(200, { ok: true });
}
