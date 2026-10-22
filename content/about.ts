// The About page timeline. Chapters tell the story; milestones (kind: 'milestone')
// are the achievement posts that sit between them. Order = order on the timeline.
// `body` is an array of paragraphs. [[...]] = placeholder.

export const timeline = [
  {
    id: 'how-it-started',
    kind: 'chapter',
    label: 'How it started',
    when: '[[Year]]',
    title: 'It started in a restaurant kitchen',
    image: '/images/photos/workshop-pouring.webp',
    alt: 'A participant carefully pouring liquid into a row of cups',
    body: [
      'Before Cirvola, our CEO Srihari worked at a restaurant built around valorisation: a kitchen where by-products weren’t rubbish but the start of the next dish. Peels, husks and trimmings came back as sauces, crisps and ferments.',
      'Seeing that culture up close changed how he saw food waste. If one kitchen could do it every day, why couldn’t homes, schools and whole communities? [[Add the restaurant name if you want to, and a personal detail or moment from Srihari]]',
    ],
  },
  {
    id: 'the-problem',
    kind: 'chapter',
    label: 'The problem',
    when: null,
    title: 'Good food, thrown away too early',
    image: '/images/photos/food-scraps-bowl.webp',
    alt: 'A plate piled with food scraps and peels',
    body: [
      'Singapore generated 790,000 tonnes of food waste in 2025, and only 18% of it was recycled. Households alone throw away an estimated S$342 million of food a year, and Semakau, the country’s only landfill, is expected to be full by 2035.',
      'Much of what gets binned isn’t spoiled food. It’s by-products: calamansi pulp after juicing, corn husks, beetroot pulp, orange peel. Most people simply have never seen what those could become.',
    ],
  },
  {
    id: 'how-we-met',
    kind: 'chapter',
    label: 'How we met',
    when: '2025',
    title: '[[How the team came together]]',
    image: '/images/photos/booth-team.webp',
    alt: 'The Cirvola team together at a booth',
    body: [
      '[[Tell the story of how the founders met. For example: at SUTD, in a class, at a hackathon, or through Create4Good.]]',
      '[[What made you decide to build Cirvola together?]]',
    ],
  },
  {
    id: 'create4good',
    kind: 'milestone',
    label: 'Create4Good finalist',
    when: '2025',
    title: 'Our first stage: Create4Good',
    image: '/images/photos/workshop-talk.webp',
    alt: 'Participants and facilitators talking in a workshop',
    body: ['Cirvola became a finalist in SUTD’s Create4Good Innovation Fund. It was the first time we pitched the idea of a circular food ecosystem led by the community. [[Add a line about the experience]]'],
  },
  {
    id: 'eco-tour',
    kind: 'milestone',
    label: 'First eco-tour',
    when: 'Jul 2025',
    title: 'Waste-to-Wonder: our first eco-tour',
    image: '/images/photos/ecotour-garden-group.webp',
    alt: 'A tour group walking through a lush garden',
    body: [
      'On 26 July 2025 we ran our first eco-tour at a circular-kitchen restaurant campus: a garden and fermentation walk, a hands-on eco-enzyme session, and a zero-waste corn tasting where husks became crisps and kernels became chutney.',
    ],
  },
  {
    id: 'the-solution',
    kind: 'chapter',
    label: 'The solution',
    when: null,
    title: 'Learn it by making it',
    image: '/images/photos/workshop-stations.webp',
    alt: 'Participants cooking at kitchen stations',
    body: [
      'Cirvola transforms food waste into opportunities through circular upcycling, education and community engagement. We run action-oriented workshops where people make something real from a by-product, taste it, and take the know-how home.',
      'Behind the workshops sits a bigger loop: collecting clean, traceable by-products, testing what they can safely become, and putting valorised products back into the community. Schools are where we’re scaling first, through our School Innovation Lab.',
    ],
  },
  {
    id: 'tampines',
    kind: 'milestone',
    label: 'Workshops in Tampines',
    when: 'Jan 2026',
    title: 'A home in the East',
    image: '/images/photos/workshop-families.webp',
    alt: 'Families at a cooking workshop',
    body: [
      'Our Tampines Hub became our pilot location and community partner, with support from North East CDC. From January 2026 we ran recurring Waste to Wonder workshops there for families, students and seniors, backed by an S$2,000 Our Tampines Hub grant.',
    ],
  },
  {
    id: 'hult',
    kind: 'milestone',
    label: 'Hult Prize',
    when: '2026',
    title: 'On the Hult Prize stage',
    image: '/images/photos/ecotour-kitchen-group.webp',
    alt: 'A group gathered around a kitchen counter',
    body: ['As Hult Prize qualifiers, we presented our plan for a community hub that brings collection, valorisation, education and data together. [[Add the round and what you learned]]'],
  },
  {
    id: 'bsf',
    kind: 'milestone',
    label: 'S$8,000 grant',
    when: 'Sep 2026',
    title: 'Backed by the Baby Shark Fund',
    image: '/images/photos/workshop-room.webp',
    alt: 'A workshop kitchen with a projected presentation',
    body: ['We were awarded an S$8,000 Baby Shark Fund grant to turn our workshops into a repeatable school programme and classroom kits.'],
  },
  {
    id: 'vjc',
    kind: 'milestone',
    label: '200 students at VJC',
    when: 'Oct 2026',
    title: 'Our biggest classroom yet',
    image: '/images/photos/workshop-cooking-group.webp',
    alt: 'Students cooking together',
    body: [
      'About 200 Victoria Junior College students joined our School Innovation Lab: design thinking in the auditorium, interviews in the canteen, and live valorisation cooking in the kitchen. Every team left with a problem backed by evidence and a first idea to test.',
    ],
  },
  {
    id: 'scaling',
    kind: 'chapter',
    label: 'Scaling',
    when: '2026 onwards',
    title: 'From pilot workshops to a movement',
    image: '/images/photos/workshop-kitchen-wide.webp',
    alt: 'A busy workshop kitchen with participants at every station',
    body: [
      'Phase 1 (2026 to Q2 2027): 30 to 40 pilot workshops, school partnerships, and becoming a certified body.',
      'Phase 2 (Q2 to Q4 2027): reaching out to F&B partners, R&D on food valorisation, validating demand for our products, and growing our facilitator network.',
      'Phase 3 (2028 onwards): valorisation consulting and recurring partnerships. We identify talent in our workshops and train them as certified eco-stewards, each able to run programmes in three schools. Our goal is 20+ certified eco-stewards by year three, then taking the model across ASEAN, starting with Indonesia.',
    ],
  },
];

export const mission = {
  vision: 'A future where food is never wasted, and communities thrive through sustainable, circular food practices.',
  mission: [
    'Reduce food waste through education and upcycling.',
    'Engage communities in hands-on experiences that inspire circular innovation.',
  ],
};

// Team. Confirm roles and portraits before launch.
export const team = [
  { name: 'Srihari Adheenamilagi', role: 'Chief Executive Officer', bio: 'Data analyst and community engagement specialist.', photo: '/images/team/srihari-adheenamilagi.webp' },
  { name: 'Davin Handreas Chen', role: 'Chief Experience and Operations Officer', bio: 'AI data operations; AI, bioinformatics and sustainability researcher.', photo: '/images/team/davin-handreas-chen.webp' },
  { name: 'Gabriel Marcel Danandjaja', role: 'Co-founder, Technology', bio: 'Full-stack developer and tech innovation lead. Builds Cirvola’s web and data systems.', photo: '/images/team/gabriel-marcel-danandjaja.webp' },
  { name: 'Tan Rui Anh', role: 'Chief Technology and Finance Officer', bio: 'Full-stack software engineer and culinary enthusiast.', photo: '/images/team/tan-rui-anh.webp' },
  { name: 'Nicholas Wang', role: 'Chief Innovation and Marketing Officer', bio: 'Mechatronics engineer, culinary enthusiast and community engagement specialist.', photo: '/images/team/nicholas-wang.webp' },
];

export const mentors = [{ name: 'Li Ying Ying', role: 'Sustainability mentor, Yingfluence' }];
