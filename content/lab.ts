// The R&D Lab: the Valorisation Bench game, open briefs and the lab notebook.
//
// Bench rules: a visitor drops one MATERIAL and one PROCESS into the bench.
// If the pair is in `discoveries`, they unlock it. Unknown pairs can be sent to the
// AI lab assistant for a speculative idea (clearly labelled as untested).
// `source`: 'cirvola'  = something we've actually made
//           'known'    = an established technique used by cooks or makers
//           'unsafe'   = a teaching moment about what NOT to valorise

export const lab = {
  materials: [
    { id: 'calamansi-pulp', name: 'Calamansi pulp', hint: 'Left after juicing', color: '#C9D45C' },
    { id: 'citrus-peel', name: 'Citrus peel', hint: 'From juice stalls', color: '#F7A928' },
    { id: 'beetroot-pulp', name: 'Beetroot pulp', hint: 'Left after juicing', color: '#B4235A' },
    { id: 'coffee-grounds', name: 'Coffee grounds', hint: 'Every café, every day', color: '#5B3A29' },
    { id: 'corn-husks', name: 'Corn husks', hint: 'Papery outer leaves', color: '#D8C68A' },
    { id: 'corn-cobs', name: 'Corn cobs', hint: 'After the kernels are cut', color: '#E9C46A' },
    { id: 'okara', name: 'Okara', hint: 'Pulp from soy milk', color: '#EDE3C8' },
    { id: 'bread-ends', name: 'Bread ends', hint: 'Crusts and day-old loaves', color: '#C98B4E' },
    { id: 'banana-peel', name: 'Banana peel', hint: 'Ripe, unwaxed', color: '#E8D34F' },
    { id: 'pineapple-peel', name: 'Pineapple skin', hint: 'Rind and core', color: '#D9A43A' },
    { id: 'watermelon-rind', name: 'Watermelon rind', hint: 'The white part', color: '#8DBF6A' },
    { id: 'spent-grain', name: 'Spent grain', hint: 'From brewing', color: '#A97C50' },
    { id: 'eggshells', name: 'Eggshells', hint: 'Rinsed and dried', color: '#F1E7DA' },
    { id: 'bagasse', name: 'Sugarcane bagasse', hint: 'Fibre after pressing', color: '#CDBB8E' },
    { id: 'plate-leftovers', name: 'Plate leftovers', hint: 'Half-eaten food', color: '#8A8F86' },
  ],
  processes: [
    { id: 'bake', name: 'Bake', verb: 'baked' },
    { id: 'ferment', name: 'Ferment', verb: 'fermented' },
    { id: 'dry', name: 'Dry and grind', verb: 'dried and ground' },
    { id: 'candy', name: 'Candy', verb: 'candied' },
    { id: 'simmer', name: 'Simmer', verb: 'simmered' },
    { id: 'crisp', name: 'Crisp', verb: 'crisped' },
    { id: 'blend', name: 'Blend and set', verb: 'blended and set' },
    { id: 'press', name: 'Press and mould', verb: 'pressed and moulded' },
  ],
  discoveries: [
    // ── Made by Cirvola ──
    { m: 'calamansi-pulp', p: 'bake', name: 'Calamansi fibre bars', source: 'cirvola', kind: 'food', blurb: 'Tangy, chewy bars from the pulp and fibre left after juicing. Our signature workshop treat.', recipe: 'calamansi-fibre-bars' },
    { m: 'citrus-peel', p: 'ferment', name: 'Eco-enzyme cleaner', source: 'cirvola', kind: 'household', blurb: 'Peels, sugar and water fermented for 90 days into a home-made cleaner. Not for eating.', recipe: 'eco-enzyme' },
    { m: 'citrus-peel', p: 'candy', name: 'Candied orange peel', source: 'cirvola', kind: 'food', blurb: 'Boiled, simmered in syrup, sugared and dried. A snack, a garnish and a baking ingredient.', recipe: 'candied-orange-peel' },
    { m: 'citrus-peel', p: 'dry', name: 'Citrus peel powder', source: 'known', kind: 'food', blurb: 'Dried, ground peel that adds fibre and zest to bakes. Part of our orange-peel R&D.' },
    { m: 'beetroot-pulp', p: 'blend', name: 'Beetroot-pulp chocolate', source: 'cirvola', kind: 'food', blurb: 'Pulp saved from our beetroot latte, folded into chocolate.', recipe: 'beetroot-chocolate' },
    { m: 'beetroot-pulp', p: 'dry', name: 'Beetroot bark crumble', source: 'cirvola', kind: 'food', blurb: 'Dehydrated beetroot pulp, saved for the next chocolate bark batch.' },
    { m: 'coffee-grounds', p: 'blend', name: 'Coffee-ground chocolate', source: 'cirvola', kind: 'food', blurb: 'Dried coffee grounds give chocolate a deep, roasted crunch. Made at our August 2026 workshop.', recipe: 'beetroot-chocolate' },
    { m: 'corn-husks', p: 'crisp', name: 'Corn husk crisps', source: 'cirvola', kind: 'food', blurb: 'Emping-style chips with togarashi, from our first eco-tour.', recipe: 'corn-husk-chips' },
    { m: 'corn-cobs', p: 'simmer', name: 'Corn cob stock', source: 'known', kind: 'food', blurb: 'Stripped cobs still hold sweetness. Simmer them for a light stock, which is how we start our corn chutney.', recipe: 'white-corn-chutney' },
    { m: 'pineapple-peel', p: 'ferment', name: 'Pineapple-peel eco-enzyme', source: 'known', kind: 'household', blurb: 'Pineapple skins are one of the best eco-enzyme bases. Same 1:3:10 method.', recipe: 'eco-enzyme' },

    // ── Known techniques ──
    { m: 'okara', p: 'bake', name: 'Okara cookies', source: 'known', kind: 'food', blurb: 'Soy pulp adds protein and a soft crumb to cookies and crackers.' },
    { m: 'okara', p: 'ferment', name: 'Fermented okara (tempeh-style)', source: 'known', kind: 'food', blurb: 'Okara can be fermented into a tempeh-like cake. Needs careful hygiene and the right culture.' },
    { m: 'bread-ends', p: 'ferment', name: 'Bread kvass', source: 'known', kind: 'drink', blurb: 'A lightly fizzy, tangy drink brewed from stale rye or wholemeal bread.' },
    { m: 'bread-ends', p: 'dry', name: 'Breadcrumbs', source: 'known', kind: 'food', blurb: 'Dry, blitz and store. The simplest valorisation there is.' },
    { m: 'bread-ends', p: 'bake', name: 'Bread pudding', source: 'known', kind: 'food', blurb: 'Day-old bread soaked in custard and baked. A classic for a reason.' },
    { m: 'bread-ends', p: 'crisp', name: 'Croutons', source: 'known', kind: 'food', blurb: 'Cubed, oiled, seasoned and baked until crunchy.' },
    { m: 'banana-peel', p: 'simmer', name: 'Banana-peel chutney', source: 'known', kind: 'food', blurb: 'Cooked down with spices, ripe banana peel becomes a soft, savoury chutney.' },
    { m: 'banana-peel', p: 'bake', name: 'Banana-peel bread', source: 'known', kind: 'food', blurb: 'Blended peel adds moisture and fibre to banana bread.' },
    { m: 'pineapple-peel', p: 'simmer', name: 'Pineapple-skin tea', source: 'known', kind: 'drink', blurb: 'Simmer the skins and core with spices for a fragrant drink.' },
    { m: 'watermelon-rind', p: 'candy', name: 'Candied watermelon rind', source: 'known', kind: 'food', blurb: 'The white rind candies beautifully, like citron.' },
    { m: 'watermelon-rind', p: 'ferment', name: 'Pickled watermelon rind', source: 'known', kind: 'food', blurb: 'Crunchy, sweet-sour pickles from the part everyone throws away.' },
    { m: 'spent-grain', p: 'bake', name: 'Spent-grain crackers', source: 'known', kind: 'food', blurb: 'Brewers’ grain makes hearty, nutty crackers and granola.' },
    { m: 'spent-grain', p: 'dry', name: 'Spent-grain flour', source: 'known', kind: 'food', blurb: 'Dried and milled, it becomes a high-fibre flour for baking.' },
    { m: 'coffee-grounds', p: 'dry', name: 'Garden soil booster', source: 'known', kind: 'material', blurb: 'Dried grounds can be mixed into compost to add organic matter.' },
    { m: 'coffee-grounds', p: 'press', name: 'Coffee-ground coasters', source: 'known', kind: 'material', blurb: 'Bound with a natural binder and pressed, grounds become coasters and pots.' },
    { m: 'eggshells', p: 'dry', name: 'Eggshell garden calcium', source: 'known', kind: 'material', blurb: 'Rinsed, dried and ground shells add calcium to compost and soil.' },
    { m: 'bagasse', p: 'press', name: 'Bagasse plates and packaging', source: 'known', kind: 'material', blurb: 'Pressed sugarcane fibre is already used for compostable takeaway boxes.' },
    { m: 'corn-husks', p: 'press', name: 'Husk paper and wraps', source: 'known', kind: 'material', blurb: 'Husks can be pulped into paper, or used whole to wrap and steam food.' },
  ],
  // Any process + plate leftovers is a teaching moment.
  unsafe: {
    'plate-leftovers': {
      name: 'Not suitable for valorisation',
      blurb: 'Half-eaten plate food can carry bacteria from saliva and mixed handling, so we never turn it into food or products. Composting or proper food-waste collection is the right route. Valorisation starts with clean, traceable by-products.',
    },
  },

  briefs: [
    {
      id: 'brief-calamansi-shelf-life',
      title: 'Make calamansi fibre bars last two weeks',
      material: 'Calamansi pulp',
      body: 'Our bars are a hit fresh, but they don’t keep. How could we extend their shelf life without adding anything artificial?',
      skills: ['Food science', 'Baking', 'Packaging'],
      status: 'Open',
    },
    {
      id: 'brief-orange-peel',
      title: 'Find the best second life for juice-stall orange peel',
      material: 'Orange peel',
      body: 'Fresh-juice operations produce peel by the bucket. We’re exploring candied peel and peel powder (food), and natural cleaners and extracts (non-food). Which route makes the most sense, and why?',
      skills: ['R&D', 'Unit economics', 'Food safety'],
      status: 'Open',
    },
    {
      id: 'brief-corn-cob',
      title: 'Use the whole corn cob',
      material: 'Corn cobs',
      body: 'We use the husks and the kernels. The cob itself is the last piece. Stock is a start. What else could it be?',
      skills: ['Cooking', 'Materials'],
      status: 'Open',
    },
    {
      id: 'brief-eco-enzyme-kids',
      title: 'An eco-enzyme kit a 10-year-old can track',
      material: 'Fruit peels',
      body: 'Eco-enzyme takes 90 days. How might we help young learners stay curious and record what changes week by week?',
      skills: ['Education', 'Design', 'Illustration'],
      status: 'Open',
    },
    {
      id: 'brief-canteen',
      title: 'Cut waste at a school canteen',
      material: 'School canteen food waste',
      body: 'Students in our school programme found the same problems again and again at the canteen. Pick one stall’s by-product and design a way to give it value.',
      skills: ['Design thinking', 'Interviews', 'Prototyping'],
      status: 'Open',
    },
    {
      id: 'brief-your-stream',
      title: 'Your business’s waste stream here',
      material: 'Your by-product',
      body: 'Run a café, bakery, juice stall or kitchen? Tell us what you throw away and we’ll post it as a brief for valorisers to tackle.',
      skills: ['F&B partners'],
      status: 'Post a brief',
      cta: 'compose',
    },
  ],

  notebook: [
    { title: 'Calamansi fibre bars', status: 'Made', note: 'Served at our community workshops. Shelf-life testing next.' },
    { title: 'Beetroot latte', status: 'Made', note: 'Workshop recipe, with the pulp saved for chocolate.' },
    { title: 'Beetroot-pulp chocolate', status: 'Testing', note: 'Pilot product: refining texture and moisture.' },
    { title: 'Eco-enzyme batches', status: 'Made', note: 'Take-home module at many of our workshops.' },
    { title: 'Orange-peel pilot', status: 'Proposed', note: 'Next: a traceable pilot batch, then screening for safety, moisture, yield and shelf life.' },
    { title: 'Classroom kits', status: 'Testing', note: 'Recipe cards, lesson assets, measuring tools and pre-portioned materials for teachers.' },
  ],
};
