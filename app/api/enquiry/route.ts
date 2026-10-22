// POST /api/enquiry: programme request from the compose panel.
// Emails Cirvola a branded request, and (optionally) the sender a confirmation copy.

import { json, guardForm, str, isEmail, methodNotAllowed } from '@/lib/server/http';
import { sendMail, inbox, logoAttachment, logoSrc as getLogoSrc } from '@/lib/server/mail';
import { renderEmail, renderText, sgTime, type Email } from '@/lib/server/email-templates';

export const runtime = 'nodejs';
export const maxDuration = 20;
export const GET = methodNotAllowed;

const pageNames: Record<string, string> = { '/': 'Home', '/events': 'Events', '/recipes': 'Recipes', '/lab': 'R&D Lab', '/about': 'About' };

export async function POST(req: Request) {
  const { body, response } = await guardForm(req, 'enquiry', { max: 6 });
  if (response) return response;

  const d = {
    name: str(body.name, 120),
    email: str(body.email, 200).toLowerCase(),
    organisation: str(body.organisation, 160),
    programme: str(body.programme, 80) || 'Not specified',
    groupSize: str(body.groupSize, 40),
    preferredDate: str(body.preferredDate, 80),
    subject: str(body.subject, 160) || 'Programme request',
    message: str(body.message, 4000),
    page: str(body.page, 80),
  };
  if (!d.name) return json(400, { ok: false, error: 'Please add your name.' });
  if (!isEmail(d.email)) return json(400, { ok: false, error: 'Please add a valid email address so we can reply.' });
  if (!d.message) return json(400, { ok: false, error: 'Please add a short message about your group.' });
  if (body.consent !== true) return json(400, { ok: false, error: 'Please tick the consent box so we can use your details to reply.' });

  const logoSrc = getLogoSrc();
  const attachments = logoSrc.startsWith('cid:') ? [logoAttachment()] : [];
  const received = sgTime();

  const toCirvola: Email = {
    label: 'Programme request',
    title: d.subject,
    intro: `${d.name}${d.organisation ? ` from ${d.organisation}` : ''} would like to work with Cirvola.`,
    preheader: `${d.programme}${d.groupSize ? `, ${d.groupSize} people` : ''}. ${d.message.slice(0, 90)}`,
    action: { label: `Reply to ${d.name.split(' ')[0]}`, href: `mailto:${d.email}?subject=${encodeURIComponent(`Re: ${d.subject}`)}` },
    sections: [
      {
        heading: 'Request details',
        rows: [
          ['Programme', d.programme],
          ['Organisation', d.organisation],
          ['Group size', d.groupSize],
          ['Preferred date', d.preferredDate],
        ],
      },
      { heading: 'Message', quote: d.message },
      {
        heading: 'Contact',
        rows: [
          ['Name', d.name],
          ['Email', d.email],
          ['Received', received],
          ['Sent from', `Website, ${pageNames[d.page] || 'a'} page`],
        ],
      },
    ],
    logoSrc,
    footer: `Sent from the programme request form on the Cirvola website. ${d.name} agreed to be contacted about this request under the privacy policy. Reply directly to this email to answer them.`,
    footerText: 'Sent from the programme request form on the Cirvola website.',
  };

  try {
    await sendMail({
      to: [{ name: 'Cirvola', email: inbox() }],
      replyTo: { name: d.name, email: d.email },
      subject: `[Programme request] ${d.subject}`,
      html: renderEmail(toCirvola),
      text: renderText(toCirvola),
      attachments,
    });
  } catch (e) {
    console.error('enquiry mail failed:', (e as Error).message);
    const notSetUp = (e as { code?: string }).code === 'NO_MAIL';
    return json(notSetUp ? 503 : 502, {
      ok: false,
      error: notSetUp
        ? `Our request form isn’t switched on yet. Please email us directly at ${inbox()}.`
        : `We couldn’t send your request just now. Please try again, or email us directly at ${inbox()}.`,
    });
  }

  if (process.env.SEND_CONFIRMATION !== 'false') {
    const copy: Email = {
      label: 'Request received',
      title: `Thanks, ${d.name.split(' ')[0]}. We’ve got your request.`,
      intro: 'Here’s a copy of what you sent. Someone from the Cirvola team will reply, usually within three working days.',
      sections: [
        {
          heading: 'Your request',
          rows: [
            ['Programme', d.programme],
            ['Organisation', d.organisation],
            ['Group size', d.groupSize],
            ['Preferred date', d.preferredDate],
          ],
        },
        { heading: 'Your message', quote: d.message },
        {
          heading: 'What happens next',
          list: [
            'We read your request and check our calendar.',
            'We reply with ideas for the session and any questions about your space and group.',
            'Together we confirm the date, format and what everyone will make.',
          ],
        },
      ],
      logoSrc,
      footer: `You’re receiving this because you sent a programme request on the Cirvola website. If that wasn’t you, you can ignore this email. Questions? Just reply.`,
      footerText: 'You’re receiving this because you sent a programme request on the Cirvola website.',
    };
    try {
      await sendMail({
        to: [{ name: d.name, email: d.email }],
        replyTo: { name: 'Cirvola', email: inbox() },
        subject: 'We’ve received your Cirvola programme request',
        html: renderEmail(copy),
        text: renderText(copy),
        attachments,
      });
    } catch (e) {
      console.warn('confirmation mail failed:', (e as Error).message);
    }
  }

  return json(200, { ok: true });
}
