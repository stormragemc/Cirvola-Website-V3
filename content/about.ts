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
    when: 'Jul 2025',
    title: 'Our first stage: Create4Good',
    image: '/images/photos/create4good-booth.webp',
    alt: 'The Cirvola team at their Create4Good booth with eco-enzyme samples and calamansi bars',
    body: [
      'Cirvola became a finalist in SUTD’s Create4Good Innovation Fund. The programme supported our early development and community validation, including our very first workshop and public events.',
    ],
  },
  {
    id: 'eco-tour',
    kind: 'milestone',
    label: 'First eco-tour',
    when: 'Jul 2025',
    title: 'Waste-to-Wonder: our first workshop',
    image: '/images/photos/ecotour-kitchen-demo.webp',
    alt: 'A chef demonstrating in an open kitchen while participants work at the counter',
    body: [
      'Our very first workshop was an eco-tour in Dempsey with AIR CCCC: a sustainability tour, chef-led food demonstrations and tastings, an eco-garden walk, and hands-on eco-enzyme making from fruit waste. Eco-enzyme became our first recipe.',
    ],
  },
  {
    id: 'bettr',
    kind: 'milestone',
    label: '100% BETTR summit',
    when: 'Oct 2025',
    title: 'Our first public showcase',
    image: '/images/photos/bettr-unfiltered-summit.webp',
    alt: 'Visitors browsing exhibitor tables inside the BETTR space at The Unfiltered Summit',
    body: [
      'At The Unfiltered Summit at The Foundry, visitors sampled our upcycled orange marmalade bars and eco-enzymes made from fruit waste. We met sustainability-focused organisations including Resavour, Kita and Stick ’Em.',
    ],
  },
  {
    id: 'clean-green',
    kind: 'milestone',
    label: 'Clean & Green Singapore',
    when: 'Nov 2025',
    title: 'Valorisation in front of policymakers',
    image: '/images/photos/clean-green-baey-yam-keng.webp',
    alt: 'The Cirvola team with Baey Yam Keng at their Clean & Green Singapore booth, holding eco-enzyme bottles',
    body: [
      'At Our Tampines Hub we presented calamansi bars made from valorised calamansi by-products, the eco-enzymes first prepared at our eco-tour, and an early demo of our Waste-to-Wonder app, to community leaders and public agencies including Grace Fu, Baey Yam Keng and North East CDC.',
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
    id: 'pilot',
    kind: 'milestone',
    label: 'Pilot workshop',
    when: 'Jan 2026',
    title: 'A pilot in Tampines',
    image: '/images/photos/poster-waste-to-wonder-jan.webp',
    alt: 'Poster for the Waste to Wonder pilot workshop at Our Tampines Hub',
    body: [
      'Our Waste to Wonder pilot at Our Tampines Hub brought our first two recipes together: participants made eco-enzyme to take home and sampled our calamansi bars. It showed us what a full workshop series could become.',
    ],
  },
  {
    id: 'hult',
    kind: 'milestone',
    label: 'Hult Prize',
    when: 'Feb 2026',
    title: 'Hult Prize qualifiers',
    image: '/images/photos/ecotour-kitchen-group.webp',
    alt: 'A group gathered around a kitchen counter',
    body: [
      'We qualified in the Hult Prize with a social-enterprise model that turns food by-products into valuable resources, connecting food-waste reduction, sustainability education, community engagement and opportunities for vulnerable youths. [[Add the round you reached]]',
    ],
  },
  {
    id: 'tampines',
    kind: 'milestone',
    label: 'Workshop series',
    when: 'Aug 2026',
    title: 'A home in the East',
    image: '/images/photos/workshop-families.webp',
    alt: 'Families at a cooking workshop',
    body: [
      'Our first full workshop series ran every Sunday at Our Tampines Hub, supported by North East CDC and Our Tampines Hub with an S$1,000 grant. Children, families and seniors made eco-enzyme and explored calamansi by-products.',
      'This is also where beetroot came in: beetroot latte and beetroot-pulp chocolate, which we’ve kept developing since, with mixes like orange zest.',
    ],
  },
  {
    id: 'bsf',
    kind: 'milestone',
    label: 'S$8,000 grant',
    when: 'Sep 2026',
    title: 'Backed by the Baby Shark Fund',
    image: '/images/photos/workshop-room.webp',
    alt: 'A workshop kitchen with a projected presentation',
    body: [
      'We secured S$8,000 from SUTD’s Baby Shark Fund 3.0 to develop our workshops and valorisation activities, marking our move from a student-led initiative to a more structured social enterprise.',
    ],
  },
  {
    id: 'vjc',
    kind: 'milestone',
    label: 'Victoria Junior College',
    when: 'Oct 2026',
    title: 'Valorisation meets design thinking',
    image: '/images/photos/workshop-cooking-group.webp',
    alt: 'Students cooking together',
    body: [
      'At Victoria Junior College we linked sustainability with the engineering design process: students investigated food-waste problems, experimented with upcycled recipes in cooking rotations, and learned how to pitch their ideas.',
    ],
  },
  {
    id: 'kopikao',
    kind: 'milestone',
    label: 'Kopikao',
    when: 'Oct 2026',
    title: 'Valorisation through play',
    image: '/images/photos/booth-team.webp',
    alt: 'The Cirvola team together at a booth',
    body: [
      'At the Kopikao event at Our Tampines Hub, we ran a booth designed especially for children with special needs, who played Valorise It!, our fruit-ninja-style game, to discover what food waste can turn into.',
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
