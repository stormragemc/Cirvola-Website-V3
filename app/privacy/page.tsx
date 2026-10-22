import { site } from '@/content/site';
import { LegalShell, type LegalSection } from '@/components/Legal';
import { BodyClass } from '@/components/site/BodyClass';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/privacy',
  title: 'Privacy policy',
  description: 'How Cirvola collects, uses and protects your personal data under Singapore’s PDPA.',
});

const mail = <a href={`mailto:${site.email}`}>{site.email}</a>;

const sections: LegalSection[] = [
  {
    id: 'who',
    title: 'Who we are',
    body: (
      <>
        <p>{`This website is run by ${site.legalName} (“Cirvola”, “we”, “us”), a student-founded social enterprise based in Singapore. We handle personal data in line with Singapore’s Personal Data Protection Act 2012 (PDPA).`}</p>
        <p>Questions or requests about your data can go to our Data Protection Officer at {mail}.</p>
      </>
    ),
  },
  {
    id: 'collect',
    title: 'What we collect',
    body: (
      <>
        <p>We only collect what you choose to give us through the forms on this site:</p>
        <ul>
          <li>
            <strong>Programme requests:</strong> your name, email, organisation, the type of programme, group size, preferred date and your message.
          </li>
          <li>
            <strong>Idea submissions</strong> (Recipes page): your name, email, country, organisation, role, the idea you describe, and the AI-generated visuals of it.
          </li>
          <li>
            <strong>Valorisers network:</strong> your name, email, country and what you work with.
          </li>
          <li>
            <strong>Lab progress:</strong> the discoveries you unlock in the R&amp;D Lab are saved only in your own browser (local storage). They never reach us.
          </li>
        </ul>
        <p>We do not ask for NRIC numbers, payment details or other sensitive data. Please don’t include them in messages.</p>
      </>
    ),
  },
  {
    id: 'use',
    title: 'How we use it',
    body: (
      <>
        <ul>
          <li>To reply to your request and plan a programme with you.</li>
          <li>To review, develop, and (only with credit as you choose) feature ideas you submit.</li>
          <li>
            To send network members occasional emails about briefs, recipes and collaborations. You can unsubscribe at any time by replying to any email or writing to us.
          </li>
        </ul>
        <p>We don’t sell your data, and we don’t use it for advertising.</p>
      </>
    ),
  },
  {
    id: 'ai',
    title: 'AI processing',
    body: (
      <p>
        {'When you press “Visualise my idea” or ask the Lab’s AI assistant, the text you entered about your idea is sent to Anthropic’s Claude API to generate the sketch. We don’t send your name or email for this step. Anthropic processes the request under its commercial terms and does not use API inputs to train its models by default. See '}
        <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener">
          Anthropic’s privacy policy
        </a>
        .
      </p>
    ),
  },
  {
    id: 'share',
    title: 'Who we share it with',
    body: (
      <p>
        Form submissions are delivered to Cirvola’s email inbox, hosted by Google (Gmail). The website is hosted by Vercel. These providers may store data outside
        Singapore. Where they do, we rely on their contractual protections to keep it to a standard comparable to the PDPA. We share your details with a partner
        organisation (for example, a venue co-hosting your workshop) only when it is needed to deliver what you asked for.
      </p>
    ),
  },
  {
    id: 'keep',
    title: 'How long we keep it',
    body: (
      <p>
        We keep enquiries and idea submissions for as long as we need them to respond and follow up, and for up to two years afterwards, unless you ask us to delete
        them sooner. Network members stay on our list until they unsubscribe.
      </p>
    ),
  },
  {
    id: 'rights',
    title: 'Your choices',
    body: (
      <p>
        You can ask to see, correct or delete the personal data we hold about you, or withdraw your consent, by emailing {mail}. We’ll respond within 30 days.
        Withdrawing consent may mean we can’t continue a conversation about a programme.
      </p>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and tracking',
    body: (
      <p>
        This site does not use tracking or advertising cookies, and it doesn’t load third-party analytics. Fonts are served from our own site. The R&amp;D Lab stores
        your discoveries in your browser’s local storage so your collection is still there next time. You can clear it with the Lab’s “Start over” button or your
        browser settings.
      </p>
    ),
  },
  {
    id: 'children',
    title: 'Young people',
    body: (
      <p>
        Many of our programmes are for students. If you are under 18, please ask a parent, guardian or teacher before sending us your details. Programme requests for
        schools should come from a teacher or staff member.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: <p>We may update this policy as Cirvola grows. The date at the top shows the latest version.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <BodyClass name="page-legal" />
      <LegalShell title="Privacy policy" sections={sections} />
    </>
  );
}
