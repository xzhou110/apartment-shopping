import type { Apartment } from '../types';

// ============================================================================
// SEED — source of truth for the listing SET + data (contract / tech-plan §6).
//
// Real listings the user is shopping. Each is fed via a screenshot + link; Claude
// extracts the fields, geocodes the address (coords baked in below), downloads the
// photo into public/img/, and appends here. localStorage overlays only the user's
// rating + status onto this seed.
// ============================================================================
export const APARTMENTS: Apartment[] = [
  {
    // a3 — San Carlos 1BR in a small 7-unit complex. Coords are the Cedar St centroid
    // (Nominatim, 2026-06-30) — the ad only gives "Cedar near Cherry" (no house #), so the pin
    // is approximate. ✅ Reads LEGIT (market price, grounded copy, standard terms) — unlike a1/a2.
    id: 'a3',
    status: 'New',
    title: 'Beautiful 1BR Apartment — San Carlos',
    address: 'Cedar St near Cherry St, San Carlos, CA 94070',
    neighborhood: '',
    city: 'San Carlos',
    lat: 37.492684,
    lng: -122.2539068,

    beds: 1,
    baths: 1,
    sqft: 640,
    floor: '',

    rent: 2290,
    parkingCost: null, // one-car carport included
    petRent: null,
    utilitiesIncluded: null,
    utilitiesEstimate: null,

    deposit: 2290, // "$2290 security deposit" — stated
    appFee: null, // none stated (a credit report is required, but no fee named)
    brokerFee: null,

    leaseTermMonths: null, // not stated — likely a standard 12-mo; confirm they'll do a 6-mo term
    minLeaseMonths: null,
    maxLeaseMonths: null,
    availableDate: '2026-08-01', // body: "available around August 1st" (the sidebar's "Jul 1" conflicts — see notes)
    furnished: false,

    petPolicy: 'Cats only', // cats OK; no dogs mentioned
    listingType: 'Landlord', // small 7-unit complex, "email Chris" — reads as a private owner/manager
    contact: { company: '', name: 'Chris', phone: '', email: '', website: '' }, // craigslist email relay only; no phone/email published
    comments: [],

    laundry: 'on-site', // on-site laundry (not in-unit) — now its own field
    amen: {
      parking: true, // one-car carport (dedicated/covered)
      gym: null,
    },
    amenities: ['One-car carport', 'Large deck', 'Hardwood floors', 'Granite counters', 'Ceiling fans', 'Outside storage'],

    dateSeen: '2026-06-30',
    daysOnMarket: null,
    marketRent: 2500, // Est. — San Carlos 1BR comp; $2,290 is at/slightly under market (NOT a scam discount)

    expertRating: 4,
    scamRisk: false,
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — none of the a1/a2 scam tells. Priced at/near market (~$2,290 vs ~$2,500 est. comp), ' +
      'specific grounded description (granite, hardwood, carport, on-site laundry), standard terms ' +
      '(rent + an equal $2,290 deposit + a credit report), and contact via the craigslist email relay — no ' +
      '"send your phone number," no up-front holding fee.\n' +
      'Confirm before signing: (1) lease term is not stated — likely a standard 12-mo, so confirm up front they will do a 6-month term (a standard 12-mo lease would NOT fit your 6-month goal). ' +
      '(2) Available date conflicts: sidebar says "Jul 1," body says "around Aug 1." (3) Laundry is on-site, NOT in-unit. ' +
      '(4) No A/C (ceiling fans only). (5) Cats OK but no dogs. (6) Address is "Cedar near Cherry" with no house number, so the map pin is approximate. ' +
      'Standard due diligence still applies: tour in person and verify "Chris" manages the unit before paying anything.',
    image: '', // no photo provided in the listing/by you — card shows the placeholder; send an image link to add one
    sourceUrl:
      'https://www.craigslist.org/view/d/san-carlos-beautiful-bed-bath-apartment/uajPQJhUrdfmNkTknHYMDi',
  },
  {
    // a4 — Woodside Place Apartments, Mountain View. Exact-building geocode (Nominatim,
    // OSM names the building "Woodside Place"). ✅ Reads LEGIT — real managed community.
    id: 'a4',
    status: 'New',
    title: 'Woodside Place 1BR — Mountain View',
    address: '2033 Latham Street, Mountain View, CA 94040',
    neighborhood: '',
    city: 'Mountain View',
    lat: 37.3959885,
    lng: -122.0997126,

    beds: 1,
    baths: 1,
    sqft: 500,
    floor: '',
    laundry: 'on-site', // "On-site Laundry Facility" — not in-unit

    rent: 2199, // advertised headline; body lists current rent $2,305–$2,315/mo (see notes)
    parkingCost: null, // assigned parking / carport included
    petRent: null, // refundable pet deposit (not monthly) — see notes
    utilitiesIncluded: false, // water & trash included, but TENANT PAYS PG&E (electric + gas)
    utilitiesEstimate: null,

    deposit: null, // security deposit not stated
    appFee: null, // "additional fees may apply" — none quantified
    brokerFee: null,

    leaseTermMonths: null, // not stated — likely a standard 12-mo community lease; confirm they'll do a 6-mo term
    minLeaseMonths: null,
    maxLeaseMonths: null,
    availableDate: '2026-05-15', // "Available Mid-May 2026" (rolling-availability community — a past date just means "ask about current openings")
    furnished: false,

    petPolicy: 'Allowed', // cats + dogs OK, up to 2 pets, breed restrictions, refundable pet deposit
    listingType: 'Property mgmt', // Apartment Management Consultants (AMC-CA Inc), CA BRE #01525033
    contact: {
      company: 'Apartment Management Consultants (AMC-CA Inc) — Woodside Place',
      name: '',
      phone: '(510) 899-5584 x66', // "Call Now" — or text 66 to the same number, per the listing
      email: '',
      website: 'amc.touraptnow.com/mjig3o', // "Interested in more information? See link below" — this unit's leasing page
    },
    comments: [],

    amen: {
      parking: true, // assigned parking + carport (dedicated)
      gym: null,
    },
    amenities: ['Hardwood floor', 'Assigned carport', 'Fully equipped kitchen', 'BBQ/picnic area', 'Courtyard', 'Water & trash included'],

    dateSeen: '2026-06-30',
    daysOnMarket: null,
    marketRent: 2500, // Est. — MV 1BR comp; $2,199–2,315 is at/slightly under market (fairly priced, not scam-cheap)

    expertRating: 4,
    scamRisk: false,
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — real managed community (Woodside Place; OSM confirms the building), run by ' +
      'Apartment Management Consultants (AMC-CA Inc) with a valid 8-digit CA BRE #01525033 — the opposite of a1/a2. ' +
      'Market-rate price, professional leasing flow (tour link, 3× income requirement, Equal Housing), building number matches the photo.\n' +
      'Confirm before signing: (1) PRICE — advertised $2,199 but the body lists current rent $2,305–$2,315/mo; budget ~$2,310, not $2,199. ' +
      '(2) Utilities — water & trash included, but YOU pay PG&E (electric + gas) on top. (3) Laundry is on-site, NOT in-unit. ' +
      '(4) Lease term not stated — likely a standard 12-mo; confirm they will do a 6-month term (a 12-mo lease would NOT fit your 6-month goal). ' +
      '(5) "Available Mid-May 2026" has passed — it\'s a rolling-availability community, so just ask what\'s open now. ' +
      '(6) Up to 2 pets w/ breed restrictions + a refundable pet deposit.',
    image: 'img/a4.jpg',
    sourceUrl:
      'https://www.craigslist.org/view/d/mountain-view-convenient-location/eSvSAk7oVas4GQwv5h9Qpw',
  },
  {
    // a5 — Fiesta Apartments, San Mateo (Hayward Park). Exact house-level geocode
    // (Nominatim, 2026-07-01 — "640, 19th Avenue, Hayward Park, San Mateo, 94403"). ✅ Reads LEGIT —
    // a Zillow "Verified Source" managed community; standard screening. Two 1BR units listed, both
    // "Currently unavailable" (rolling-availability); tracked row = the $2,250 entry unit (Unit 304).
    id: 'a5',
    status: 'New',
    title: 'Fiesta Apartments — San Mateo',
    address: '640 19th Ave, San Mateo, CA 94403',
    neighborhood: 'Hayward Park',
    city: 'San Mateo',
    lat: 37.5520296,
    lng: -122.3028616,

    beds: 1,
    baths: 1,
    sqft: 480, // Unit 304 (the $2,250 unit). The other listed 1BR, Unit 309, is 640 sqft @ $2,450 — see notes.
    floor: '', // unit #304/#309 hint at 3rd floor, but the listing doesn't state it — left unknown

    rent: 2250, // Unit 304, 480 sqft (headline "1 bed $2,250+"); Unit 309 (640 sqft) is $2,450
    parkingCost: null, // covered/assigned parking with outdoor storage — included
    petRent: null, // not stated
    utilitiesIncluded: false, // Policies: "Utilities included in rent: Heat" ONLY — water/trash/electric not listed as included
    utilitiesEstimate: null,

    deposit: null, // not stated (no cost calculator shown for this listing, unlike a6)
    appFee: null, // not stated
    brokerFee: null,

    leaseTermMonths: 12, // Policies: "Lease terms: One year" — confirmed 2026-07-01
    minLeaseMonths: null,
    maxLeaseMonths: null,
    availableDate: '', // both listed units "Currently unavailable" (Available "--") — rolling community, ask what's open
    furnished: false,

    petPolicy: 'Allowed', // "Cats and dogs" — small + large dogs allowed, up to 2 large dogs
    listingType: 'Property mgmt', // listed by a management company (Teri Penpraze, Verified Source); on-site mgmt + maintenance
    contact: { company: 'Fiesta Apartments', name: 'Teri Penpraze', phone: '', email: '', website: '' }, // Zillow "Verified Source"; office Mon–Fri 9–5, contact via Zillow
    comments: [],

    laundry: 'on-site', // "Shared laundry" / "Community laundry in building" — not in-unit
    amen: {
      parking: true, // covered / assigned parking with outdoor storage
      gym: null,
    },
    amenities: ['Pool', 'Covered/assigned parking + outdoor storage', 'Picnic & BBQ area', 'Controlled access', '24-hr maintenance + on-site management', 'Dishwasher + microwave', 'Laminate floors, patio balcony', 'Online rent payment'],

    dateSeen: '2026-07-01',
    daysOnMarket: null,
    marketRent: 2700, // Est. — San Mateo 1BR comp; $2,250 is under market (fairly priced, not scam-cheap)

    expertRating: 4,
    scamRisk: false,
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — a Zillow "Verified Source" managed community (Fiesta Apartments), listed by a ' +
      'management company (Teri Penpraze) with on-site management + maintenance and standard screening (3× gross monthly income). ' +
      'Under-market price, controlled access, pool + BBQ area — the opposite of the a1/a2 scam pattern.\n' +
      'Confirm before signing: (1) AVAILABILITY — both listed 1BR units show "Currently unavailable"; it\'s a ' +
      'rolling-availability community, so call to ask what\'s actually open (office Mon–Fri 9–5, Sat by appointment, Sun closed). ' +
      '(2) TWO OPTIONS — Unit 304 = 480 sqft @ $2,250 (tracked here); Unit 309 = 640 sqft @ $2,450 (bigger, +$200/mo, has a floor plan + 6 photos). ' +
      '(3) Laundry is community/on-site, NOT in-unit. (4) Lease term is 12 months (confirmed) — that does NOT fit your ' +
      '6-month goal, so ask up front whether they\'ll do a 6-month term; deposit and application fee ' +
      'are still not stated, so ask for move-in costs directly. (5) Utilities — only HEAT is included in rent; water, trash, ' +
      'and electric are not listed as included, so confirm what you\'ll actually pay. (6) Pets OK — cats + dogs, up to 2 large dogs. ' +
      '(7) Parking is covered/assigned with outdoor storage (included).',
    image: 'img/a5.webp',
    sourceUrl: 'https://www.zillow.com/apartments/san-mateo-ca/fiesta-apartments/CmJHfp/',
  },
  {
    // a6 — Imperial Apartments, Burlingame. Exact house-level geocode (Nominatim, 2026-07-01 —
    // "1900, Trousdale Drive, Burlingame, 94010"). ✅ Reads LEGIT — a Zillow "Verified Source" managed
    // property with a full cost calculator + GreatSchools/Walk Score data (most detailed listing yet).
    id: 'a6',
    status: 'New',
    title: 'Imperial Apartments — Burlingame',
    address: '1900 Trousdale Dr, Burlingame, CA 94010',
    neighborhood: '',
    city: 'Burlingame',
    lat: 37.591785,
    lng: -122.386339,

    beds: 1,
    baths: 1,
    sqft: 720, // Unit 109
    floor: '', // not stated

    rent: 2450, // Unit 109 base rent; cost calculator confirms $2,450/mo est. total (utilities below are included)
    parkingCost: null, // attached garage + covered parking — no separate charge stated
    petRent: null, // n/a — no pets allowed
    utilitiesIncluded: true, // garbage, hot water, sewer, water included; electric/gas not listed — likely tenant-paid
    utilitiesEstimate: null,

    deposit: 2000, // cost calculator: "Security deposit $2,000"
    appFee: 30, // cost calculator: "Application fee $30"
    brokerFee: null,

    leaseTermMonths: 12, // "Lease terms: One year" — stated explicitly
    minLeaseMonths: null,
    maxLeaseMonths: null,
    availableDate: '', // Unit 109 "Currently unavailable" (Available "--") — ask what's open
    furnished: false,

    petPolicy: 'No pets', // "Dogs are not allowed" + "Cats are not allowed" — both explicit
    listingType: 'Property mgmt', // Zac Amero, Verified Source; professional screening (2.5x rent, 660+ credit)
    contact: { company: 'Imperial Apartments', name: 'Zac Amero', phone: '', email: '', website: '' }, // Zillow "Verified Source"; contact via Zillow
    comments: [],

    laundry: 'on-site', // "Laundry: Shared"
    amen: {
      parking: true, // attached garage + covered parking
      gym: null, // not mentioned (pool + elevator are, but no gym)
    },
    amenities: ['Large balcony', 'Elevator', 'Pool', 'Dishwasher', 'Hardwood floors + carpet', 'Gas heating', 'On-site management'],

    dateSeen: '2026-07-01',
    daysOnMarket: null,
    marketRent: 2900, // Est. — Burlingame 1BR comp (top schools + hospital-adjacent premium); $2,450 is under market

    expertRating: 4,
    scamRisk: false,
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — a Zillow "Verified Source" listing managed by Zac Amero, with professional ' +
      'screening (2.5× gross monthly income, 660+ credit score) and a transparent built-in cost calculator. ' +
      'Excellent location: 2 blocks to groceries/pharmacy/Starbucks, 1 block to Mills Peninsula Hospital, ' +
      '4 blocks to BART/Caltrain, near 101/280. Walk Score 80 (Very Walkable), Bike Score 56. ' +
      'Nearby schools all GreatSchools 10/10 (Franklin Elementary, Burlingame Intermediate, Burlingame HS).\n' +
      'Confirm before signing: (1) AVAILABILITY — Unit 109 shows "Currently unavailable"; call to ask what\'s open now. ' +
      '(2) NO PETS — both cats and dogs disallowed (dealbreaker if you have a pet). ' +
      '(3) Utilities — garbage/hot water/sewer/water included, but electric & gas are NOT listed as included (likely tenant-paid PG&E). ' +
      '(4) Lease is a stated 12-mo term — that does NOT fit your 6-month goal; confirm they\'ll do a 6-month term. ' +
      '(5) Move-in cost per their calculator: $30 application fee + $2,000 deposit = ~$2,030, on top of first month\'s rent.',
    image: 'img/a6.webp',
    sourceUrl: 'https://www.zillow.com/apartments/burlingame-ca/imperial-apartments/CkBCvC/',
  },
  {
    // a7 — Tradewind Surf Apartments, Foster City. Exact house-level geocode (Nominatim,
    // 2026-07-01 — "1110, Polynesia Drive, Foster City, 94404"). ✅ Reads LEGIT — a Zillow
    // "Verified Source" community. No per-unit table was captured (page shows a Studio–2BR
    // range only) — rent/beds below are USER-PROVIDED (you confirmed $2,300 / 1 bed), not
    // scraped from a unit row like the others.
    id: 'a7',
    status: 'New',
    title: 'Tradewind Surf Apartments — Foster City',
    address: '1110 Polynesia Dr, Foster City, CA 94404',
    neighborhood: '',
    city: 'Foster City',
    lat: 37.5589561,
    lng: -122.2629116,

    beds: 1, // you confirmed
    baths: 1, // inferred (typical for a 1BR) — not explicitly confirmed, no per-unit table shown
    sqft: null, // not stated — no per-unit table captured
    floor: '', // not stated

    rent: 2300, // you confirmed
    parkingCost: null, // parking not mentioned anywhere in the listing — ask
    petRent: 50, // "Monthly dog rent $50" / "Monthly cat rent $50"
    utilitiesIncluded: null, // not stated
    utilitiesEstimate: null,

    deposit: null, // not stated
    appFee: null, // not stated
    brokerFee: null,

    leaseTermMonths: null, // no single fixed term — this IS month-to-month, not a "1-mo-only" lease (see min below)
    minLeaseMonths: 1, // Policies: "Lease terms: 1 month" = billed monthly, open-ended commitment
    maxLeaseMonths: null, // open-ended — month-to-month has no max
    availableDate: '', // not stated
    furnished: false,

    petPolicy: 'Allowed', // Dogs Allowed + Cats Allowed, 2 max each, 45 lb weight limit
    listingType: 'Property mgmt', // Blvd Residential, "Leasing Agent," Verified Source, (650) 547-8025
    contact: { company: 'Blvd Residential', name: 'Leasing Agent', phone: '(650) 547-8025', email: '', website: '' }, // Zillow "Verified Source"; phone from the listing
    comments: [],

    laundry: 'unknown', // not mentioned anywhere (no chip, no unit-feature line)
    amen: {
      parking: null, // not mentioned at all
      gym: true, // "Fitness Center: Gym" under Building Amenities
    },
    amenities: ['Fitness center', 'Pool (temporarily closed)', 'Community room', 'Dishwasher', 'Positive credit reporting available'],

    dateSeen: '2026-07-01',
    daysOnMarket: null,
    marketRent: 2700, // Est. — Foster City 1BR comp; $2,300 is under market

    expertRating: 4,
    scamRisk: false,
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — a Zillow "Verified Source" listing managed by Blvd Residential (Leasing Agent, ' +
      '(650) 547-8025), a long-standing pet-friendly community in a quiet Foster City neighborhood near ' +
      'Highway 101/92, equidistant from SF and Silicon Valley. Fitness center + community room; pool is ' +
      'temporarily closed. Notable: lease term is stated as 1 MONTH — true month-to-month, the most flexible ' +
      'term of any listing you\'ve tracked so far, and a perfect fit for your 6-month goal (it shows a green ' +
      'month-to-month flag on the card).\n' +
      'Confirm before signing: (1) UNIT SPECIFICS — the page shows a Studio–2BR range with no per-unit table; ' +
      'the $2,300 / 1 bed you gave me should be checked against their current "Available units" list (exact ' +
      'unit, sqft, floor). (2) Laundry type isn\'t stated anywhere — ask if it\'s in-unit, on-site, or none. ' +
      '(3) Parking isn\'t mentioned at all — ask if it\'s included, assigned, or extra. (4) Pool is temporarily ' +
      'closed — ask when it reopens if that matters. (5) Pet rent is $50/mo per pet (dogs + cats, up to 2, ' +
      '45 lb limit) — budget that on top of rent if bringing a pet. (6) Utilities, deposit, and application ' +
      'fee are not stated — ask for exact move-in costs. (7) Month-to-month often carries a premium over a ' +
      'signed 12-mo lease — confirm $2,300 is the actual month-to-month rate, not a longer-term rate.',
    image: 'img/a7.webp',
    sourceUrl: 'https://www.zillow.com/apartments/foster-city-ca/tradewind-surf-apartments/CqZtYk/',
  },
];
