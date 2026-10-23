// Everything Cirvola has done, grouped the way /events shows it. Order in this
// list = order on the page, so keep each group oldest first with upcoming items last.
// The home page carousel shows items with status "upcoming" (soonest first).
//
// Fields
//   id        unique slug (also the #anchor of the card on /events)
//   category  'workshops' | 'booths' | 'funding'
//   kind      the small label on the card, see kindLabel in components/shared.tsx
//   status    'upcoming' | 'past'
//   date      'YYYY-MM', or null when not fixed yet. Month and year only.
//   dateLabel what visitors see, e.g. "Jul 2025" or "Date to be confirmed"
//   venue     optional
//   summary   one or more paragraphs
//   image     path under /images
//   [[...]]   placeholder text, shown dashed on the site until replaced

export const events = [
  // ── 1. Workshops ────────────────────────────────────────────
  {
    id: 'eco-tour-jul-2025',
    category: 'workshops',
    kind: 'eco-tour',
    status: 'past',
    date: '2025-07',
    dateLabel: 'Jul 2025',
    title: 'Waste-to-Wonder eco-tour',
    venue: 'Dempsey, Singapore',
    summary: [
      'Cirvola’s very first workshop. Participants explored food valorisation through a sustainability tour, chef-led food demonstrations and tastings, an eco-garden walk, and hands-on eco-enzyme making from fruit waste.',
      'It introduced our mission of giving food by-products a second life through practical, accessible experiences.',
    ],
    highlights: ['Sustainability tour', 'Chef-led demos and tastings', 'Eco-garden walk', 'Eco-enzyme making'],
    image: '/images/photos/ecotour-garden-group.webp',
    imageAlt: 'A group on a guided garden tour surrounded by greenery',
  },
  {
    id: 'oth-pilot-workshop-jan-2026',
    category: 'workshops',
    kind: 'pilot',
    status: 'past',
    date: '2026-01',
    dateLabel: 'Jan 2026',
    title: 'Waste to Wonder pilot workshop',
    venue: 'Function Room 2, Our Tampines Hub',
    summary: [
      'A pilot for the workshop series to come. Up to 25 participants learned what food valorisation is, made their own eco-enzyme to take home as a cleaning substitute, and sampled our calamansi bars.',
      'Eco-enzyme and calamansi bars were our first recipes, and this session showed us what a full workshop series could become.',
    ],
    highlights: ['Pilot session', 'Eco-enzyme take-home', 'Calamansi bar sampling', 'Up to 25 participants'],
    image: '/images/photos/poster-waste-to-wonder-jan.webp',
    imageAlt: 'Poster for the Waste to Wonder pilot workshop at Our Tampines Hub in January 2026',
    poster: true,
  },
  {
    id: 'oth-community-workshops-aug-2026',
    category: 'workshops',
    kind: 'community',
    status: 'past',
    date: '2026-08',
    dateLabel: 'Aug 2026',
    title: 'Community food valorisation workshops with North East CDC and Our Tampines Hub',
    venue: 'Our Tampines Hub, National Library cooking stations',
    summary: [
      'Our first full workshop series: Sunday-morning sessions, supported by North East CDC and Our Tampines Hub, introducing children, families and seniors to circular consumption. Participants turned fruit peels into eco-enzyme and saw how overlooked ingredients, like calamansi by-products, can become useful food products.',
      'This is where beetroot came in. We started making beetroot latte and beetroot-pulp chocolate here, and we’ve kept developing them since, with mixes like orange zest. The series also began our partnership with Our Tampines Hub, along with an S$1,000 grant from Our Tampines Hub and North East CDC.',
    ],
    highlights: ['Every Sunday', 'Beetroot latte and chocolate', 'Eco-enzyme from fruit peels', 'S$1,000 grant'],
    image: '/images/photos/poster-waste-to-wonders-aug.webp',
    imageAlt: 'Poster for the Waste to Wonders culinary workshop at Our Tampines Hub in August 2026',
    poster: true,
  },
  {
    id: 'vjc-design-thinking-oct-2026',
    category: 'workshops',
    kind: 'school',
    status: 'past',
    date: '2026-10',
    dateLabel: 'Oct 2026',
    title: 'Food valorisation and design thinking workshops at Victoria Junior College',
    venue: 'Victoria Junior College',
    summary: [
      'A school programme connecting sustainability with the engineering design process. Students investigate food-waste problems, carry out site analysis, explore valorisation techniques, brainstorm solutions, experiment with upcycled recipes and learn how to pitch their ideas.',
      'It runs as a large-group introduction, followed by cooking rotations, real-world problem finding, ideation and pitch preparation.',
    ],
    highlights: ['Design thinking', 'Cooking rotations', 'Problem → idea → pitch'],
    image: '/images/photos/workshop-cooking-group.webp',
    imageAlt: 'Students cooking together at kitchen stations during a Cirvola workshop',
  },
  {
    id: 'resource-impactz-eco-enzyme',
    category: 'workshops',
    kind: 'corporate',
    status: 'upcoming',
    date: null,
    dateLabel: 'Date to be confirmed',
    title: 'Corporate eco-enzyme workshop with Resource Impactz',
    venue: 'Venue to be confirmed',
    summary: [
      'A proposed 90-minute workshop for about 50 people, introducing food-waste valorisation through hands-on eco-enzyme making. Everyone would prepare their own fermentation batch to take home.',
      'Cirvola would run the workshop, with Resource Impactz coordinating the event logistics.',
    ],
    highlights: ['About 50 participants', '90 minutes', 'Take-home eco-enzyme'],
    image: '/images/photos/eco-enzyme-jars-garden.webp',
    imageAlt: 'Large jars of fermenting fruit peels for eco-enzyme',
  },

  // ── 2. Booths and public exhibitions ────────────────────────
  {
    id: 'bettr-unfiltered-summit-2025',
    category: 'booths',
    kind: 'exhibition',
    status: 'past',
    date: '2025-10',
    dateLabel: 'Oct 2025',
    title: '100% BETTR: The Unfiltered Summit 2025',
    venue: 'The Foundry, Singapore',
    summary: [
      'As Create4Good Innovation Fund finalists, we showcased upcycled orange marmalade bars made from leftover ingredients, alongside eco-enzymes made from fruit waste.',
      'Visitors sampled our food, learned about circular consumption and explored practical ways to cut food waste. We connected with sustainability-focused organisations including Resavour, Kita and Stick ’Em, as well as international visitors.',
    ],
    highlights: ['Orange marmalade bars', 'Eco-enzymes', 'Create4Good finalist'],
    image: '/images/photos/eco-enzyme-bottles.webp',
    imageAlt: 'Small bottles of amber and brown eco-enzyme lined up on a counter',
  },
  {
    id: 'clean-green-singapore-2025',
    category: 'booths',
    kind: 'exhibition',
    status: 'past',
    date: '2025-11',
    dateLabel: 'Nov 2025',
    title: 'Clean & Green Singapore 2025',
    venue: 'Our Tampines Hub',
    summary: [
      'Our second major sustainability showcase: calamansi bars made from valorised calamansi by-products, fully fermented eco-enzymes first prepared at our July Waste-to-Wonder eco-tour, and an early demo of our Waste-to-Wonder app.',
      'We showed policymakers, community leaders and public agencies how food valorisation could support community sustainability, including Grace Fu, Baey Yam Keng and representatives from North East CDC.',
    ],
    highlights: ['Calamansi bars', 'Eco-enzymes', 'Waste-to-Wonder app demo'],
    image: '/images/photos/calamansi-fibre-bars.webp',
    imageAlt: 'A tray of golden calamansi fibre bars cut into squares',
  },
  {
    id: 'oth-kopikao-oct-2026',
    category: 'booths',
    kind: 'booth',
    status: 'past',
    date: '2026-10',
    dateLabel: 'Oct 2026',
    title: 'Kopikao at Our Tampines Hub',
    venue: 'Our Tampines Hub',
    summary: [
      'A booth introducing valorisation to everyone passing through Our Tampines Hub, designed especially for the children with special needs visiting us.',
      'Visitors played Valorise It!, our fruit-ninja-style game, to discover what food waste can turn into.',
    ],
    highlights: ['Valorise It! game', 'Learning through play'],
    image: '/images/photos/workshop-families.webp',
    imageAlt: 'Families working together at kitchen stations',
  },
  {
    id: 'sia-charity-run-booth',
    category: 'booths',
    kind: 'booth',
    status: 'upcoming',
    date: '2026-11',
    dateLabel: 'Nov 2026',
    title: 'Engagement booth at the Singapore Airlines Charity Run',
    venue: 'Gardens by the Bay',
    summary: [
      'A planned interactive booth introducing Singapore Airlines staff to food-waste valorisation through a simple, hands-on activity with no cooking.',
      'With around 700 to 800 staff expected, the idea is a quick, memorable game where people match food waste with the second-life products it could become.',
    ],
    highlights: ['No-cooking booth', 'Waste-matching game'],
    image: '/images/photos/booth-team.webp',
    imageAlt: 'The Cirvola team at an exhibition booth holding up upcycled products',
  },

  // ── 3. Funding, pitch programmes and competitions ───────────
  {
    id: 'create4good',
    category: 'funding',
    kind: 'fund',
    status: 'past',
    date: '2025-07',
    dateLabel: 'Jul 2025',
    title: 'SUTD Create4Good Innovation Fund',
    venue: 'Singapore University of Technology and Design',
    summary: [
      'Cirvola took part in SUTD’s Create4Good Innovation Fund, advancing our mission of reducing food waste through food valorisation, circular innovation and sustainability education.',
      'The programme supported our early development and community validation, including our first workshops and public engagement. Being named a finalist was an early milestone in our social-enterprise journey.',
    ],
    highlights: ['Finalist'],
    image: '/images/photos/create4good-booth.webp',
    imageAlt: 'The Cirvola team at their Create4Good booth with eco-enzyme samples and calamansi bars',
  },
  {
    id: 'hult-prize',
    category: 'funding',
    kind: 'competition',
    status: 'past',
    date: '2026-02',
    dateLabel: 'Feb 2026',
    title: 'Hult Prize social entrepreneurship competition',
    summary: [
      'We presented our social-enterprise model in the Hult Prize: turning food by-products into valuable resources while promoting circular-economy practices and social impact.',
      'Our pitch connected food-waste reduction, sustainability education, community engagement and opportunities for vulnerable youths, in line with the UN Sustainable Development Goals.',
    ],
    highlights: ['Qualifier'],
    image: '/images/photos/ecotour-kitchen-group.webp',
    imageAlt: 'People gathered around a kitchen counter',
  },
  {
    id: 'baby-shark-fund',
    category: 'funding',
    kind: 'grant',
    status: 'past',
    date: '2026-09',
    dateLabel: 'Sep 2026',
    title: 'SUTD Baby Shark Fund 3.0',
    venue: 'Singapore University of Technology and Design',
    summary: [
      'We secured S$8,000 from the Baby Shark Fund to develop our circular-economy initiatives, food valorisation activities, educational workshops and future growth.',
      'It marks our move from a student-led initiative to a more structured social enterprise focused on practical sustainability solutions.',
    ],
    highlights: ['S$8,000 awarded'],
    image: '/images/photos/workshop-room.webp',
    imageAlt: 'A workshop kitchen with a projected presentation',
  },
];

// Impact and achievements, shown on /events and the About timeline.
export const achievements = [
  { value: 'S$8,000', title: 'Baby Shark Fund 3.0', detail: 'From SUTD, to grow our workshops, valorisation activities and social enterprise. Sep 2026.' },
  { value: 'S$1,000', title: 'Our Tampines Hub grant', detail: 'From Our Tampines Hub and North East CDC, for our community workshops in Tampines. Aug 2026.' },
  { value: 'Finalist', title: 'Create4Good Innovation Fund', detail: 'SUTD’s student innovation fund. Jul 2025.' },
  { value: 'Qualifier', title: 'Hult Prize', detail: 'The global social entrepreneurship competition. Feb 2026.' },
];

// What a school took away from working with us.
export const schoolImpact = {
  school: 'Victoria Junior College',
  logo: '/images/logos/victoria-junior-college.png',
  students: '~200',
  taught: [
    { title: 'Notice → make → ask', detail: 'Spot a real waste problem, make something, then ask whether anyone would actually use it.' },
    { title: 'The Double Diamond', detail: 'Understand the problem before jumping to a solution, then explore and test ideas.' },
    { title: 'Valorisation in the kitchen', detail: 'A whole-ingredient calamansi activity: nothing from the fruit goes to waste.' },
    { title: 'Evidence from the canteen', detail: 'Students interviewed stall holders and classmates to back their problem statements.' },
    { title: 'Pitching with purpose', detail: 'A good pitch uses a real problem, a meaningful solution and evidence, not just a flashy product.' },
  ],
};
