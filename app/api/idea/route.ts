// POST /api/idea: a valorisation idea from the Idea Studio, with its AI brief and visuals.

import { json, guardForm, str, isEmail, methodNotAllowed } from '@/lib/server/http';
import { sendMail, inbox, logoAttachment, logoSrc as getLogoSrc, type Attachment } from '@/lib/server/mail';
import { renderEmail, renderText, sgTime, htmlValue, escHtml, type Email, type EmailSection } from '@/lib/server/email-templates';
import { sanitizeSvg } from '@/lib/server/anthropic';

export const runtime = 'nodejs';
export const maxDuration = 20;
export const GET = methodNotAllowed;

type Plan = {
  title?: string;
  tagline?: string;
  summary?: string;
  input_material?: string;
  output?: string;
  who_benefits?: string;
  why_it_matters?: string;
  steps?: { title?: string; detail?: string }[];
  safety_notes?: string[];
  open_questions?: string[];
};
type Art = { concept_svg?: string; storyboard?: { caption?: string; svg?: string }[] };

function decodeImages(list: unknown): Attachment[] {
  const out: Attachment[] = [];
  for (const [i, img] of (Array.isArray(list) ? list : []).slice(0, 5).entries()) {
    const m = /^data:image\/(jpeg|png);base64,([A-Za-z0-9+/=]+)$/.exec(String(img?.dataUrl || ''));
    if (!m) continue;
    const buf = Buffer.from(m[2], 'base64');
    if (buf.length > 900_000) continue;
    const name = /^[\w.-]{1,40}$/.test(img.name || '') ? img.name : `image-${i + 1}.${m[1] === 'png' ? 'png' : 'jpg'}`;
    out.push({ filename: name, content: buf, contentType: `image/${m[1]}`, cid: `idea-img-${i}` });
  }
  return out;
}

export async function POST(req: Request) {
  const { body, response } = await guardForm(req, 'idea', { max: 6 });
  if (response) return response;

  const d = {
    name: str(body.name, 120),
    email: str(body.email, 200).toLowerCase(),
    country: str(body.country, 80),
    organisation: str(body.organisation, 160),
    role: str(body.role, 60),
    material: str(body.material, 120),
    origin: str(body.origin, 80),
    amount: str(body.amount, 80),
    idea: str(body.idea, 2000),
    outcome: str(body.outcome, 60),
    audience: str(body.audience, 120),
    brief: str(body.brief, 160),
    credit: body.credit !== false,
  };
  if (!d.name) return json(400, { ok: false, error: 'Please add your name.' });
  if (!isEmail(d.email)) return json(400, { ok: false, error: 'Please add a valid email address.' });
  if (!d.material || !d.idea) return json(400, { ok: false, error: 'Please describe the by-product and your idea.' });
  if (body.consent !== true) return json(400, { ok: false, error: 'Please agree to the terms for idea submissions.' });

  const p = body.plan && typeof body.plan === 'object' ? (body.plan as Plan) : null;
  const art = body.art && typeof body.art === 'object' ? (body.art as Art) : null;
  const images = decodeImages(body.images);
  const concept = images.find((i) => i.filename.startsWith('concept'));
  const frames = images.filter((i) => i.filename.startsWith('storyboard'));
  const storyCaptions = Array.isArray(art?.storyboard) ? art.storyboard.map((s) => str(s.caption, 140)) : [];

  const logoSrc = getLogoSrc();
  const title = p?.title ? str(p.title, 80) : `${d.material}: a new idea`;

  const visualHtml = [
    concept
      ? `<img src="cid:${concept.cid}" width="576" alt="Concept sketch" style="display:block;width:100%;max-width:576px;height:auto;border-radius:12px;border:1px solid #e2ddd0;">`
      : '',
    frames.length
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;"><tr>${frames
          .map(
            (f, i) =>
              `<td width="${Math.floor(100 / frames.length)}%" valign="top" style="padding:${i ? '0 0 0 6px' : '0'};"><img src="cid:${f.cid}" alt="Storyboard scene ${i + 1}" style="display:block;width:100%;height:auto;border-radius:8px;border:1px solid #e2ddd0;"><p style="margin:6px 0 0;font:12px/1.4 Helvetica,Arial,sans-serif;color:#4b5a4f;">${escHtml(storyCaptions[i] || '')}</p></td>`
          )
          .join('')}</tr></table>`
      : '',
  ].join('');

  const sections: EmailSection[] = [
    {
      heading: 'The idea',
      rows: [
        ['By-product', d.material],
        ['Comes from', d.origin],
        ['Amount', d.amount],
        ['Becomes a', d.outcome],
        ['For', d.audience],
        ['Open brief', d.brief],
      ],
    },
    { heading: 'In their words', quote: d.idea },
  ];
  if (visualHtml) sections.push({ heading: body.demo ? 'Visuals (demo sketch)' : 'AI visuals', html: visualHtml });
  if (p) {
    sections.push({
      heading: 'AI concept brief',
      rows: [
        ['Concept', `${title}${p.tagline ? `: ${str(p.tagline, 200)}` : ''}`],
        ['Summary', str(p.summary, 600)],
        ['Turns', `${str(p.input_material, 80)} into ${str(p.output, 80)}`],
        ['Who benefits', str(p.who_benefits, 300)],
        ['Why it matters', str(p.why_it_matters, 300)],
      ],
    });
    if (Array.isArray(p.steps) && p.steps.length)
      sections.push({
        heading: 'Process',
        list: p.steps.slice(0, 8).map((s) => htmlValue(`<strong>${escHtml(str(s.title, 80))}.</strong> ${escHtml(str(s.detail, 240))}`)),
      });
    if (Array.isArray(p.safety_notes) && p.safety_notes.length) sections.push({ heading: 'Safety to check', list: p.safety_notes.slice(0, 5).map((x) => str(x, 200)) });
    if (Array.isArray(p.open_questions) && p.open_questions.length)
      sections.push({ heading: 'Questions to test', list: p.open_questions.slice(0, 5).map((x) => str(x, 200)) });
  }
  sections.push({
    heading: 'Submitted by',
    rows: [
      ['Name', d.name],
      ['Email', d.email],
      ['Role', d.role],
      ['Organisation', d.organisation],
      ['Country', d.country],
      ['Credit by name', d.credit ? 'Yes, credit them if featured' : 'No, keep them anonymous'],
      ['Received', sgTime()],
    ],
  });

  const email: Email = {
    label: 'New valorisation idea',
    title,
    intro: `${d.name}${d.country ? ` (${d.country})` : ''} sent an idea for ${d.material.toLowerCase()} through the Idea Studio.`,
    action: { label: `Reply to ${d.name.split(' ')[0]}`, href: `mailto:${d.email}?subject=${encodeURIComponent(`Your Cirvola idea: ${title}`)}` },
    sections,
    logoSrc,
    footer: `Submitted through the Idea Studio on the Cirvola website under the terms for idea submissions. AI content is a sketch, not a tested recipe. The full data is attached as idea.json, with the original SVG artwork.`,
    footerText: 'Submitted through the Idea Studio on the Cirvola website.',
  };

  const attachments: Attachment[] = [];
  if (logoSrc.startsWith('cid:')) attachments.push(logoAttachment());
  attachments.push(...images);
  if (art?.concept_svg) attachments.push({ filename: 'concept.svg', content: Buffer.from(sanitizeSvg(art.concept_svg)), contentType: 'image/svg+xml' });
  if (Array.isArray(art?.storyboard))
    art.storyboard
      .slice(0, 4)
      .forEach((s, i) => attachments.push({ filename: `storyboard-${i + 1}.svg`, content: Buffer.from(sanitizeSvg(s.svg)), contentType: 'image/svg+xml' }));
  attachments.push({
    filename: 'idea.json',
    content: Buffer.from(JSON.stringify({ submittedAt: new Date().toISOString(), submitter: d, plan: p, storyCaptions }, null, 2)),
    contentType: 'application/json',
  });

  try {
    await sendMail({
      to: [{ name: 'Cirvola', email: inbox() }],
      replyTo: { name: d.name, email: d.email },
      subject: `[Idea] ${title}, from ${d.name}`,
      html: renderEmail(email),
      text: renderText(email),
      attachments,
    });
  } catch (e) {
    console.error('idea mail failed:', (e as Error).message);
    const notSetUp = (e as { code?: string }).code === 'NO_MAIL';
    return json(notSetUp ? 503 : 502, {
      ok: false,
      error: notSetUp
        ? `Idea submissions aren’t switched on yet. Please email your idea to ${inbox()}.`
        : `We couldn’t send your idea just now. Please try again, or email it to ${inbox()}.`,
    });
  }

  if (process.env.SEND_CONFIRMATION !== 'false') {
    const thanks: Email = {
      label: 'Idea received',
      title: `Thanks for your idea, ${d.name.split(' ')[0]}!`,
      intro: `“${title}” is now with the Cirvola team.`,
      sections: [
        {
          heading: 'What you sent',
          rows: [
            ['By-product', d.material],
            ['Your idea', d.idea],
          ],
        },
        {
          heading: 'What happens next',
          list: [
            'We read every idea and discuss the promising ones as a team.',
            'If we want to test, develop or feature it, we’ll email you first.',
            d.credit ? 'If we feature it, we’ll credit you by name.' : 'You asked to stay anonymous, so we won’t name you.',
          ],
        },
      ],
      logoSrc,
      footer: 'You’re receiving this because you submitted an idea on the Cirvola website. Reply to this email if you’d like to add anything.',
      footerText: 'You’re receiving this because you submitted an idea on the Cirvola website.',
    };
    try {
      await sendMail({
        to: [{ name: d.name, email: d.email }],
        replyTo: { name: 'Cirvola', email: inbox() },
        subject: 'Your idea is with Cirvola',
        html: renderEmail(thanks),
        text: renderText(thanks),
        attachments: logoSrc.startsWith('cid:') ? [logoAttachment()] : [],
      });
    } catch (e) {
      console.warn('idea confirmation failed:', (e as Error).message);
    }
  }
  return json(200, { ok: true });
}
