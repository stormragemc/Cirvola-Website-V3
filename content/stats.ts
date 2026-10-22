// Problem statistics shown on the home page. Every figure carries its source so
// anyone can check it. Update when NEA publishes new numbers.

export const problemStats = {
  generated: {
    value: 790000,
    unit: 'tonnes',
    label: 'of food waste generated in Singapore in 2025',
    perDay: 'About 2,160 tonnes every single day.',
    source: { name: 'NEA, Food Waste Management', url: 'https://www.nea.gov.sg/our-services/waste-management/3r-programmes-and-resources/food-waste-management' },
  },
  recycled: {
    value: 18,
    label: 'of it was recycled',
    note: 'The other 82 out of every 100 tonnes is incinerated, and the ash goes to landfill.',
    source: { name: 'NEA, Food Waste Management', url: 'https://www.nea.gov.sg/our-services/waste-management/3r-programmes-and-resources/food-waste-management' },
  },
  household: {
    value: 'S$342 million',
    label: 'worth of food thrown away by Singapore households each year',
    source: { name: 'DBS Live More', url: 'https://www.dbs.com/livemore/serious-talk/calls-to-change-eating-habits-and-overhaul-food-supply-chain-to-cut-singapores-food-waste.html' },
  },
  global: {
    value: '1/3',
    label: 'of all food produced in the world is lost or wasted',
    source: { name: 'FAO', url: 'https://www.fao.org/platform-food-loss-waste/en/' },
  },
  landfill: {
    year: 2035,
    label: 'Semakau, Singapore’s only landfill, is expected to be full',
    source: { name: 'DBS Live More, citing NEA', url: 'https://www.dbs.com/livemore/serious-talk/calls-to-change-eating-habits-and-overhaul-food-supply-chain-to-cut-singapores-food-waste.html' },
  },
  target: {
    value: '30%',
    label: 'less waste sent to landfill by 2030 is the national target under the Singapore Green Plan',
    source: { name: 'Singapore Green Plan 2030', url: 'https://www.greenplan.gov.sg/' },
  },
};

// Cirvola's own numbers. Keep these to what you can evidence.
export const ourNumbers = [
  { value: '100+', label: 'participants engaged in our workshops' },
  { value: '~200', label: 'Victoria Junior College students in one school programme' },
  { value: '35', label: 'interviews and workshop taste tests' },
  { value: '4.9/5', label: 'for instruction clarity, rated by participants on 16 August' },
];

export const ratings = {
  title: 'Workshop ratings out of 5',
  sessions: ['16 August 2026', '6 September 2026'],
  rows: [
    { label: 'Overall experience', values: [4.4, 4.3] },
    { label: 'Instruction clarity', values: [4.9, 4.4] },
    { label: 'Confidence explaining upcycling', values: [4.0, 3.6] },
  ],
};
