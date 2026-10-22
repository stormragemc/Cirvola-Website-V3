// Every Cirvola programme, booth and appearance. The home page carousel shows
// items with status "upcoming" (soonest first). Past items appear on /events.
//
// Fields
//   id        unique slug
//   kind      'workshop' | 'cooking' | 'school' | 'booth' | 'appearance'
//   status    'upcoming' | 'past'
//   date      ISO date (YYYY-MM-DD) or null when not fixed yet
//   dateLabel what visitors see, e.g. "Sat 26 Jul 2025" or "Date to be confirmed"
//   image     path under /images
//   [[...]]   placeholder text, shown dashed on the site until replaced

export const events = [
  // ── Upcoming ────────────────────────────────────────────────
  {
    id: 'sia-charity-run-booth',
    kind: 'booth',
    status: 'upcoming',
    date: '2026-11-14',
    dateLabel: 'Sat 14 Nov 2026',
    title: 'Valorisation booth at the Singapore Airlines Charity Run',
    venue: 'Gardens by the Bay',
    partner: 'Singapore Airlines',
    summary:
      'A hands-on, no-cooking booth where runners and families see what everyday food by-products can become, and test their instincts on what can and can’t be saved.',
    image: '/images/photos/booth-team.webp',
    imageAlt: 'The Cirvola team at an exhibition booth holding up upcycled products',
  },
  {
    id: 'resource-impactz-eco-enzyme',
    kind: 'workshop',
    status: 'upcoming',
    date: '2026-12-12',
    dateLabel: '12 Dec 2026 or 27 Jan 2027, to be confirmed',
    title: 'Eco-enzyme team workshop with Resource Impactz',
    venue: '[[Venue to be confirmed]]',
    partner: 'Resource Impactz',
    summary:
      'A 90-minute team session for about 50 people. Everyone prepares their own eco-enzyme batch from fruit peels and takes it home with simple aftercare steps.',
    image: '/images/photos/eco-enzyme-jars-garden.webp',
    imageAlt: 'Large jars of fermenting fruit peels for eco-enzyme',
  },
  {
    id: 'vjc-kitchen-sessions',
    kind: 'school',
    status: 'upcoming',
    date: null,
    dateLabel: 'Dates to be confirmed with the school',
    title: 'School Innovation Lab: next kitchen sessions at Victoria Junior College',
    venue: 'Victoria Junior College',
    partner: 'Victoria Junior College',
    summary:
      'Follow-up kitchen rotations for the classes who started their valorisation projects with us, so every student gets to cook, test and refine an idea.',
    image: '/images/photos/vjc-campus.webp',
    imageAlt: 'Victoria Junior College campus with students gathered outside',
  },

  // ── Past workshops and cooking sessions ─────────────────────
  {
    id: 'vjc-design-thinking-valorisation',
    kind: 'school',
    status: 'past',
    date: '2026-10-01',
    dateLabel: '[[Workshop date, Oct 2026]]',
    title: 'Design thinking meets live valorisation cooking at Victoria Junior College',
    venue: 'Victoria Junior College',
    partner: 'Victoria Junior College',
    summary:
      'Our biggest programme yet: about 200 students across five classes. A design-thinking session in the auditorium, canteen interviews to find real food-waste problems, and live kitchen rotations turning calamansi by-products into something worth eating.',
    highlights: ['~200 students', '5 classes', 'Design thinking + cooking', 'Problem → evidence → idea → pitch'],
    image: '/images/photos/workshop-cooking-group.webp',
    imageAlt: 'Students cooking together at kitchen stations during a Cirvola workshop',
  },
  {
    id: 'oth-community-sep-2026',
    kind: 'cooking',
    status: 'past',
    date: '2026-09-06',
    dateLabel: 'Sun 6 Sep 2026',
    title: 'Community valorisation workshop',
    venue: 'Our Tampines Hub',
    partner: 'Our Tampines Hub',
    summary: 'A repeat community session that participants rated 4.3 out of 5 overall. [[Add a line about what was made]]',
    image: '/images/photos/workshop-pans.webp',
    imageAlt: 'Participants stirring pans at a community cooking workshop',
  },
  {
    id: 'waste-to-wonders-aug-2026',
    kind: 'cooking',
    status: 'past',
    date: '2026-08-16',
    dateLabel: 'Sun 16 Aug 2026',
    title: 'Waste to Wonders culinary workshop',
    venue: 'Culinary Studio, Tampines Regional Library, Our Tampines Hub',
    partner: 'Tampines Central CC and North East CDC',
    summary:
      'Participants turned beetroot pulp and coffee grounds into chocolate, made a fresh beetroot latte, and went home with simple zero-waste habits. Rated 4.9 out of 5 for instruction clarity.',
    highlights: ['Beetroot-pulp chocolate', 'Beetroot latte', 'Rated 4.4/5 overall'],
    image: '/images/photos/poster-waste-to-wonders-aug.webp',
    imageAlt: 'Poster for the Waste to Wonders culinary workshop on 16 August 2026',
    poster: true,
  },
  {
    id: 'waste-to-wonder-jan-2026',
    kind: 'workshop',
    status: 'past',
    date: '2026-01-18',
    dateLabel: 'Sun 18 Jan 2026',
    title: 'Waste to Wonder food valorisation workshop',
    venue: 'Function Room 2, Our Tampines Hub',
    partner: 'Our Tampines Hub',
    summary:
      'Up to 25 participants learned what food valorisation is, made their own eco-enzyme to use as a cleaning substitute, and sampled our calamansi fibre bars.',
    highlights: ['Eco-enzyme take-home', 'Calamansi bar sampling', 'Up to 25 participants'],
    image: '/images/photos/poster-waste-to-wonder-jan.webp',
    imageAlt: 'Poster for the Waste to Wonder workshop at Our Tampines Hub on 18 January',
    poster: true,
  },
  {
    id: 'eco-tour-jul-2025',
    kind: 'workshop',
    status: 'past',
    date: '2025-07-26',
    dateLabel: 'Sat 26 Jul 2025',
    title: 'Waste-to-Wonder eco-tour on food valorisation',
    venue: 'A circular-kitchen restaurant campus in Dempsey',
    partner: null,
    summary:
      'Our first eco-tour: a garden and fermentation walk, a hands-on eco-enzyme session, then a zero-waste corn demonstration where corn husks became crisp chips and the rest of the cob became chutney.',
    highlights: ['Garden + fermentation tour', 'Eco-enzyme hands-on', 'Zero-waste corn tasting'],
    image: '/images/photos/ecotour-garden-group.webp',
    imageAlt: 'A group on a guided garden tour surrounded by greenery',
  },

  // ── Booths and exhibitions ──────────────────────────────────
  {
    id: 'exhibition-booth',
    kind: 'booth',
    status: 'past',
    date: null,
    dateLabel: '[[Event date]]',
    title: '[[Exhibition name]] booth',
    venue: '[[Venue]]',
    partner: null,
    summary:
      'We showed visitors our upcycled products and the by-products they started as. [[Add visitor numbers or a highlight]]',
    image: '/images/photos/booth-team.webp',
    imageAlt: 'The Cirvola team at an exhibition booth',
  },
  {
    id: 'clean-green-booth',
    kind: 'booth',
    status: 'past',
    date: null,
    dateLabel: '[[Year]]',
    title: 'Clean & Green Singapore public exhibition',
    venue: '[[Venue]]',
    partner: null,
    summary: '[[Confirm the event and add one line on what visitors did at the booth]]',
    image: '/images/photos/product-tubs.webp',
    imageAlt: 'Small tubs stamped with the Cirvola logo',
  },

  // ── Appearances: pitches, competitions, panels ──────────────
  {
    id: 'baby-shark-fund',
    kind: 'appearance',
    status: 'past',
    date: '2026-09-01',
    dateLabel: '[[Month 2026]]',
    title: 'Baby Shark Fund pitch',
    venue: '[[Venue]]',
    partner: null,
    summary: 'We pitched our school innovation programme and starter kits, and were awarded an S$8,000 grant.',
    image: '/images/photos/workshop-room.webp',
    imageAlt: 'A workshop kitchen with a projected presentation',
  },
  {
    id: 'hult-prize',
    kind: 'appearance',
    status: 'past',
    date: '2026-02-01',
    dateLabel: '[[Hult Prize cycle]]',
    title: 'Hult Prize',
    venue: '[[Round or campus event]]',
    partner: null,
    summary: 'We presented Cirvola’s community hub model for circular food systems as Hult Prize qualifiers.',
    image: '/images/photos/ecotour-kitchen-group.webp',
    imageAlt: 'People gathered around a kitchen counter',
  },
  {
    id: 'create4good',
    kind: 'appearance',
    status: 'past',
    date: '2025-09-01',
    dateLabel: '2025',
    title: 'Create4Good Innovation Fund finals',
    venue: 'Singapore University of Technology and Design',
    partner: null,
    summary: 'Cirvola was selected as a Create4Good finalist, the student innovation fund where the idea first took shape.',
    image: '/images/photos/workshop-talk.webp',
    imageAlt: 'Participants and facilitators talking in a workshop space',
  },
];

// Impact and achievements, shown on /events and the About timeline.
export const achievements = [
  { value: 'S$8,000', title: 'Baby Shark Fund grant', detail: 'Awarded to grow our school programme and starter kits.' },
  { value: 'S$2,000', title: 'Our Tampines Hub grant', detail: 'Supporting our recurring community workshops in Tampines.' },
  { value: 'Finalist', title: 'Create4Good Innovation Fund', detail: 'SUTD’s student innovation fund, 2025.' },
  { value: 'Qualifier', title: 'Hult Prize', detail: 'The global social-enterprise competition. [[Confirm cycle]]' },
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
