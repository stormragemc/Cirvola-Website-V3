// Organisation-wide details. Anything wrapped in [[double brackets]] shows on the
// site as a dashed placeholder until you replace it.

export const site = {
  name: 'Cirvola',
  // Change to your real domain once you have one. Used for sitemap and social previews.
  url: process.env.SITE_URL || 'https://cirvola.vercel.app',
  tagline: 'Waste to wonder.',
  description:
    'Cirvola is a student-founded social enterprise in Singapore. We run hands-on food valorisation workshops, develop upcycled recipes and products, and help schools and communities find value in food by-products.',
  email: 'cirvola.zerowaste@gmail.com',
  phone: '+65 8168 7741',
  phoneHref: 'tel:+6581687741',
  instagram: { handle: '@cirvola_official', url: 'https://www.instagram.com/cirvola_official/' },
  linkedin: { url: 'https://www.linkedin.com/company/cirvola' },
  location: 'Singapore',
  // Replace with your registered entity name / UEN once incorporated.
  legalName: 'Cirvola',
  founded: '2025',
  // The Valorise It! browser game. Swap in the permanent URL when it moves off the temporary host.
  gameUrl: 'https://valorise-it-cirvola.modestcamel4.chatgpt.site',
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/recipes', label: 'Recipes' },
  { href: '/lab', label: 'R&D Lab' },
  { href: '/about', label: 'About' },
];
