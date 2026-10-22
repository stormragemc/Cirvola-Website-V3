// Home page copy, programmes, partners and testimonials.

export const hero = {
  intro:
    'We find the value in food that usually gets thrown away. Calamansi pulp becomes fibre bars. Corn husks become crisps. Fruit peels become a cleaner you make yourself. Then we teach schools, communities and companies to do the same.',
  primary: { label: 'Request a programme', action: 'compose' },
  secondary: { label: 'Try the R&D Lab', href: '/lab' },
};

export const problem = {
  headline: 'Food doesn’t stop being useful just because its first job is done.',
  streams: ['Corn husks', 'Calamansi pulp', 'Beetroot pulp', 'Orange peel', 'Coffee grounds', 'Bread ends', 'Okara'],
  streamsNote: 'All of these are binned every day in Singapore, and every one of them can become something people want.',
  pressures: [
    {
      title: 'The rules are tightening',
      body: 'Food waste segregation is now mandatory for large commercial premises. Businesses face growing ESG reporting expectations, and Singapore has committed to cutting waste sent to landfill by 30% by 2030.',
    },
    {
      title: 'The system only reacts',
      body: 'Most food waste is dealt with after it’s already rubbish. Cities are struggling to manage growing food waste streams, and community-level circular systems are still underdeveloped.',
    },
    {
      title: 'People don’t have a starting point',
      body: 'Most of us know food waste is bad. Very few of us have ever seen what a by-product could become, or tried making it with our own hands.',
    },
  ],
  question:
    'How might we redirect food by-products from waste streams into value-generating products, while building community-driven circular behaviour at scale?',
};

// The circular ecosystem from the pitch deck. These are steps in a loop, in order.
export const loop = {
  headline: 'We close the loop on food waste.',
  intro:
    'Valorisation turns surplus and by-products into safe, useful, market-ready products. That unlocks value while cutting waste at the source, with no new resources needed.',
  centre: {
    title: 'Community co-creation and education',
    body: 'Hands-on workshops turn students, residents and F&B partners into co-creators of circular solutions. This is what drives lasting change in behaviour.',
  },
  steps: [
    { title: 'Waste generation', body: 'By-products from households, F&B partners and institutions. We start with streams that are clean and traceable, never plate leftovers.' },
    { title: 'Collection', body: 'Scheduled pick-ups and drop-off points move materials efficiently, guided by our surplus forecasting.' },
    { title: 'Valorisation and R&D', body: 'We test what each material can safely become: food, drinks, cleaners or new ingredients.' },
    { title: 'Upcycled products', body: 'Valorised food, eco-enzymes and new products go back to the community, along with the know-how to make them.' },
  ],
  transformations: [
    {
      before: { label: 'Corn cobs and husks', image: '/images/photos/corn-cob-husk.webp', alt: 'Corn cobs with their husks still on' },
      after: { label: 'Corn chutney with crisp husk chips', image: '/images/photos/corn-chutney-bowl.webp', alt: 'A bowl of corn chutney served with crisp chips' },
    },
    {
      before: { label: 'Calamansi by-products', image: '/images/photos/calamansi.webp', alt: 'Whole and halved calamansi' },
      after: { label: 'Calamansi fibre bars', image: '/images/photos/calamansi-fibre-bars.webp', alt: 'A tray of golden calamansi fibre bars cut into squares' },
    },
    {
      before: { label: 'Fruit and vegetable peels', image: '/images/photos/fruit-peels-bag.webp', alt: 'A paper bag full of fruit and vegetable peels' },
      after: { label: 'Home-made eco-enzyme', image: '/images/photos/eco-enzyme-harvest.webp', alt: 'Bottles of amber eco-enzyme' },
    },
  ],
};

export const programmes = [
  {
    title: 'Community workshops',
    body: 'One to two hours of making something useful from a by-product, for families, residents and seniors.',
    image: '/images/photos/workshop-families.webp',
    alt: 'Families working together at kitchen stations',
  },
  {
    title: 'Live cooking sessions',
    body: 'Cook and taste valorised recipes like beetroot-pulp chocolate and calamansi fibre bars.',
    image: '/images/photos/workshop-pans.webp',
    alt: 'Hands stirring vivid mixtures in several pans',
  },
  {
    title: 'School Innovation Lab',
    body: 'Design thinking plus live valorisation cooking: students find a real problem, test an idea and pitch it.',
    image: '/images/photos/workshop-stations.webp',
    alt: 'Students at kitchen stations during a school programme',
  },
  {
    title: 'Booths and exhibitions',
    body: 'Interactive booths for public events and company days, with or without cooking.',
    image: '/images/photos/booth-team.webp',
    alt: 'The Cirvola team at an exhibition booth',
  },
];

// Organisations we've worked or are working with. Showing a logo does not imply endorsement.
export const partners = [
  { name: 'Our Tampines Hub', logo: '/images/logos/our-tampines-hub.png' },
  { name: 'North East Community Development Council', logo: '/images/logos/northeast-cdc.png' },
  { name: 'Victoria Junior College', logo: '/images/logos/victoria-junior-college.png' },
  // Add the official logo files to public/images/logos and set `logo` to the path.
  { name: 'Singapore Airlines', logo: null },
  { name: 'Resource Impactz', logo: null },
];

// PLACEHOLDER testimonials. Replace with real quotes you have permission to publish
// (name or role, and the event). Delete any you don't have.
export const testimonials = [
  {
    quote: '[[A quote from a workshop participant about what they made or learned]]',
    name: '[[Participant name]]',
    role: '[[Community workshop, Our Tampines Hub]]',
  },
  {
    quote: '[[A quote from a teacher or student at Victoria Junior College]]',
    name: '[[Teacher name]]',
    role: '[[Victoria Junior College]]',
  },
  {
    quote: '[[A quote from a partner organisation]]',
    name: '[[Partner contact]]',
    role: '[[Organisation]]',
  },
];
