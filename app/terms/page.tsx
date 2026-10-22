import { site } from '@/content/site';
import { LegalShell, type LegalSection } from '@/components/Legal';
import { BodyClass } from '@/components/site/BodyClass';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/terms',
  title: 'Terms of use',
  description: 'Terms for using the Cirvola website, recipes, AI tools and idea submissions.',
});

const sections: LegalSection[] = [
  {
    id: 'about',
    title: 'About these terms',
    body: (
      <p>
        By using this website you agree to these terms. If you don’t agree, please don’t use the site. These terms are governed by the laws of Singapore.
      </p>
    ),
  },
  {
    id: 'content',
    title: 'Our content',
    body: (
      <p>
        Text, photos, recipes, logos and designs on this site belong to Cirvola or the people who created them, and are used with permission. You may share links and
        print recipes for personal or classroom use with credit to Cirvola. Please ask us before reusing anything commercially. Partner logos belong to their owners.
        Showing a logo means we’ve worked with that organisation, not that it endorses Cirvola.
      </p>
    ),
  },
  {
    id: 'recipes',
    title: 'Recipes, activities and food safety',
    body: (
      <>
        <p>
          Recipes and activities are shared for general education. Results depend on your ingredients, equipment and care. You are responsible for checking
          ingredients for allergens, for safe food handling and hygiene, and for supervising children. Use only clean, traceable by-products prepared on the day or
          stored properly. Never use plate leftovers or spoiled food.
        </p>
        <p>
          <strong>Eco-enzyme</strong> is a home-made fermented cleaner. It is not food, drink or medicine. Cirvola makes no health, medical, disinfecting or
          water-treatment claims about it. Fermentation builds up gas pressure, so follow the venting step, label containers clearly, and keep them away from children
          and pets.
        </p>
      </>
    ),
  },
  {
    id: 'ai',
    title: 'AI-generated visuals',
    body: (
      <p>
        The Idea Studio and Lab assistant use artificial intelligence to sketch ideas. Their output can be inaccurate or incomplete. AI suggestions are illustrations
        for discussion, not tested recipes or safety, nutrition or business advice. Don’t rely on them without testing and, where needed, expert advice. Please don’t
        enter confidential information.
      </p>
    ),
  },
  {
    id: 'ideas',
    title: 'Ideas you submit',
    body: (
      <>
        <p>We love receiving ideas. To keep things fair and clear for everyone:</p>
        <ul>
          <li>
            You keep ownership of your idea. By submitting it, you give Cirvola a free, non-exclusive, worldwide permission to review, discuss, test, develop, adapt and
            publish it, including in workshops, recipes, products and R&amp;D.
          </li>
          <li>If you ticked “credit me by name”, we’ll credit you when we feature or develop your idea. If not, we won’t name you.</li>
          <li>
            Submissions are not confidential, and submitting doesn’t create a partnership, job or payment obligation. Many people have similar ideas, and we may already
            be working on something like yours.
          </li>
          <li>If we’d like to develop your idea commercially, we’ll contact you first to talk about it.</li>
          <li>Only submit ideas you have the right to share. Don’t submit anything that belongs to your employer or someone else without their permission.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'conduct',
    title: 'Using the forms',
    body: (
      <p>
        Please don’t use the forms to send spam, harmful content or other people’s personal data without their consent. We may ignore or delete submissions that
        misuse the site.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Liability',
    body: (
      <p>
        We work hard to keep the site accurate, but we provide it “as is” without guarantees. To the extent the law allows, Cirvola is not liable for any loss or
        injury arising from using this site, its recipes, activities or AI output. Nothing in these terms limits liability that can’t be limited under Singapore law.
      </p>
    ),
  },
  {
    id: 'links',
    title: 'Links to other sites',
    body: <p>We link to sources and partners for your convenience. We’re not responsible for their content or privacy practices.</p>,
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <p>
        Questions about these terms: <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <BodyClass name="page-legal" />
      <LegalShell title="Terms of use" sections={sections} />
    </>
  );
}
