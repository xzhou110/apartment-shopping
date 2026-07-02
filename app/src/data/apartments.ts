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
      balcony: true, // "Large deck" — private outdoor space
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
      balcony: true, // "Large balcony" — private outdoor space
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
  {
    // a8 — Three21@Belmont, Belmont. Exact house-level geocode (Nominatim, 2026-07-01 —
    // "321, Oxford Way, Belmont, 94002"). ✅ Reads LEGIT — a Zillow "Verified Source" community
    // with a real per-unit table, floor plans, and a 3D tour. Two identical 1BR units listed
    // (both 650 sqft @ $2,550); tracked row = Unit 32 (the sooner-available one, Jul 7).
    id: 'a8',
    status: 'New',
    title: 'Three21@Belmont — Belmont',
    address: '321 Oxford Way, Belmont, CA 94002',
    neighborhood: '',
    city: 'Belmont',
    lat: 37.5280101,
    lng: -122.2732257,

    beds: 1,
    baths: 1,
    sqft: 650, // Unit 32 (and Unit 76) — both 650 sqft per the unit table
    floor: '', // not stated (unit #s don't reliably map to a floor)

    rent: 2550, // Unit 32, 650 sqft (Unit 76 is identical: 650 sqft @ $2,550)
    parkingCost: null, // detached garage / garage / off-street surface lot — no separate charge stated
    petRent: 50, // "Monthly dog rent $50" / "Monthly cat rent $50"
    utilitiesIncluded: null, // not stated
    utilitiesEstimate: null,

    deposit: null, // unit security deposit not stated (pet deposit is $500/pet — see notes)
    appFee: null, // not stated
    brokerFee: null,

    leaseTermMonths: null, // no "Lease terms" line shown — unknown; ask
    minLeaseMonths: null,
    maxLeaseMonths: null,
    availableDate: '2026-07-07', // Unit 32 available Jul 7 (Unit 76 available Jul 25) — both near-term
    furnished: false,

    petPolicy: 'Allowed', // Dogs + Cats Allowed, 2 max each; $50/mo pet rent + $500 deposit per pet
    listingType: 'Property mgmt', // Vasona (Leasing Agent), Zillow "Verified Source", (214) 833-5650
    contact: { company: 'Vasona', name: 'Leasing Agent', phone: '(214) 833-5650', email: '', website: '' }, // Zillow "Verified Source"; note: 214 = a Dallas TX area code (likely a central leasing line)
    comments: [],

    laundry: 'on-site', // "Shared: Laundry" — community/shared, not in-unit
    amen: {
      parking: true, // detached garage + garage + off-street surface lot
      gym: true, // "Fitness Center" under Community Rooms
    },
    amenities: ['Club house', 'Fitness center', 'Pool', 'Elevator', 'Hardwood floors', 'Ceiling fans', 'Package receiving', 'On-site management & maintenance'],

    dateSeen: '2026-07-01',
    daysOnMarket: null,
    marketRent: 2800, // Est. — Belmont 1BR comp; $2,550 is under market (before the up-to-2-weeks-off concession)

    expertRating: 4,
    scamRisk: false,
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — a Zillow "Verified Source" community (Three21@Belmont) with a real per-unit ' +
      'availability table, floor plans, and a 3D tour — the opposite of the a1/a2 scam pattern. Managed by ' +
      'Vasona (Leasing Agent, (214) 833-5650). Strong amenities: club house, fitness center, pool, elevator, ' +
      'hardwood floors, garage parking, package receiving. 🎁 SPECIAL OFFER: "up to 2 weeks off" — a move-in ' +
      'concession worth ~$1,275 off first-year rent; ask exactly how it applies.\n' +
      'Confirm before signing: (1) LEASE TERM not stated anywhere on the page — this is the one big unknown; ' +
      'ask if they will do a 6–12 mo term (and whether the special offer requires a 12-mo lease). ' +
      '(2) TWO UNITS, both 650 sqft @ $2,550 — Unit 32 available Jul 7 (tracked here), Unit 76 available Jul 25. ' +
      '(3) Laundry is shared/on-site, NOT in-unit. (4) Pets: cats + dogs OK (2 max each) but $50/mo pet rent ' +
      'AND a $500 deposit PER pet — budget that if bringing one. (5) Security deposit, application fee, and ' +
      'utilities are not stated — ask for exact move-in costs. (6) Minor: the (214) contact number is a Dallas ' +
      'TX area code (likely a central leasing line, not a red flag given the Verified Source + real unit data), ' +
      'but confirm you\'re reaching the actual Belmont office.',
    image: 'img/a8.webp',
    sourceUrl: 'https://www.zillow.com/apartments/belmont-ca/three21@belmont/9NGvp2/',
  },
  {
    // a9 — 735 Glenmere Way #B, Redwood City (Emerald Hills). A 300 sqft TINY HOUSE / backyard
    // ADU, not a normal apartment. Geocoded via the US Census geocoder (rooftop match) —
    // Nominatim had no record of this small residential way. ✅ Reads LEGIT (real Zillow home-detail
    // page w/ zpid, 24 days on market, 39 contacts, accepts Zillow applications) but very niche.
    id: 'a9',
    status: 'New',
    title: 'Tiny House — Redwood City (Emerald Hills)',
    address: '735 Glenmere Way #B, Redwood City, CA 94062',
    neighborhood: 'Emerald Hills',
    city: 'Redwood City',
    lat: 37.459878,
    lng: -122.272013,

    beds: 2, // Zillow lists "2 beds," but this is a 300 sqft tiny house — nominal sleeping lofts, not two real bedrooms
    baths: 1,
    sqft: 300, // "Total interior livable area: 300 sqft" — extremely small; drives a very high $/sqft (~$8.50)
    floor: '',

    rent: 2550, // "$2,550/mo Total monthly price" — INCLUDES utilities (see below)
    parkingCost: null, // off-street parking included; two-car limit
    petRent: null, // n/a — no pets
    utilitiesIncluded: true, // "Utilities included." — stated explicitly (a real plus vs the others)
    utilitiesEstimate: null,

    deposit: null, // not stated
    appFee: null, // no property app fee; note: Zillow's own application is $35/30 days (cross-property, not this landlord's)
    brokerFee: null,

    leaseTermMonths: null, // no single fixed term — month-to-month (see min); "Lease term: 1 Month" = billed monthly
    minLeaseMonths: 1, // "Month to month" — open-ended, maximally flexible (like a7)
    maxLeaseMonths: null,
    availableDate: '', // "Available now" — left blank on purpose (a concrete today-date instantly reads as "passed" once UTC rolls over; empty = no false stale flag)
    furnished: null, // "Fully equipped tiny house" + a couch in photos suggests furnished, but appliances ≠ furniture — CONFIRM

    petPolicy: 'No pets', // "Pets allowed: No" + "No pets" chip — explicit
    listingType: 'Landlord', // private tiny-house/ADU (unit "#B"), "Contact manager," no mgmt company named
    contact: { company: '', name: '', phone: '', email: '', website: '' }, // no contact published in the listing — inquire via Zillow
    comments: [],

    laundry: 'in-unit', // "In unit laundry" chip + "Laundry: In Unit" + washer/dryer in appliances
    amen: {
      parking: true, // off-street parking (two-car limit)
      gym: null, // n/a
      balcony: true, // "private deck" — private outdoor space
    },
    amenities: ['Utilities included', 'Wall A/C unit', 'In-unit washer/dryer', 'Full kitchen (dishwasher, gas oven, microwave)', 'Hardwood floors', 'Private deck + views', 'Bicycle storage', '5-min walk to Edgewood Park'],

    dateSeen: '2026-07-01',
    daysOnMarket: 24, // "24 days on Zillow" (39 contacts) — real interest, not stale
    marketRent: null, // deliberately null — a 300 sqft tiny house has no clean 2BR comp; the ~$8.50/sqft on the card is the honest signal

    expertRating: 3, // flexible + utilities-included + in-unit laundry + parking are strong, BUT 300 sqft for a nominal "2 beds," no pets, and high $/sqft are real limits
    scamRisk: false,
    rating: 0,
    notes:
      '✅ Reads LEGITIMATE but VERY NICHE — a real Zillow home-detail listing (24 days on market, 39 contacts, ' +
      'accepts Zillow applications) for a 300 sqft TINY HOUSE / backyard ADU in quiet Emerald Hills, a 5-min walk ' +
      'to Edgewood Park. Genuinely strong flexibility perks: 🟢 MONTH-TO-MONTH (open-ended — great for your 6-mo ' +
      'goal), UTILITIES INCLUDED (the only listing so far that bundles them), in-unit washer/dryer, off-street ' +
      'parking, wall A/C + wall furnace, hardwood floors, private deck.\n' +
      'Reality check before you get excited: (1) SIZE — this is 300 sqft. Zillow says "2 beds," but that\'s nominal ' +
      'sleeping lofts in a tiny house, NOT two real bedrooms; the description even says "sleep location in tiny ' +
      'house only" w/ a separate work/play structure. At ~$8.50/sqft it\'s the priciest-per-foot on your list — ' +
      'the value is the flexibility + utilities, not the space. (2) NO PETS (explicit). (3) NON-SMOKING, two-car ' +
      'limit. (4) FURNISHED? — "fully equipped" + a couch in photos hint yes, but that\'s unconfirmed; ask, since ' +
      'it matters for a short stay. (5) Deposit not stated — ask move-in cost. (6) The $35 "application" is ' +
      'Zillow\'s own cross-property fee (30 days), not this landlord\'s. Tour in person — a 300 sqft space is very ' +
      'hard to judge from photos.',
    image: 'img/a9.webp',
    sourceUrl: 'https://www.zillow.com/homedetails/735-Glenmere-Way-B-Redwood-City-CA-94062/463007839_zpid/',
  },
  {
    // a10 — 4711 Callan Blvd #16, Daly City. Rooftop geocode via US Census (2026-07-01).
    // ✅ Reads LEGIT — a real Zillow home-detail listing (zpid) by a private owner (Nelly Chin),
    // standard terms, market price. A basic 3rd-floor walk-up unit.
    id: 'a10',
    status: 'New',
    title: 'Bright 1BR (3rd floor) — Daly City',
    address: '4711 Callan Blvd #16, Daly City, CA 94015',
    neighborhood: '',
    city: 'Daly City',
    lat: 37.669734,
    lng: -122.475597,

    beds: 1,
    baths: 1,
    sqft: null, // "-- sqft" — not stated
    floor: '3rd floor', // "Bright 1 bedroom apartment on the third floor"

    rent: 2400, // "$2,400/mo" (fees may apply)
    parkingCost: null, // no paid parking — street only (see parking note)
    petRent: null, // n/a — no pets
    utilitiesIncluded: true, // "Water, garbage, gas" included; "Only extra cost - electricity and internet" (mostly included — see notes)
    utilitiesEstimate: null,

    deposit: 2400, // "Move in cost minimum: $2400 (1st month rent) + $2400 (security deposit)"
    appFee: 30, // "$30 for credit reports" (per adult)
    brokerFee: null,

    leaseTermMonths: null, // "6 month lease, then month to month" — modeled as a 6-mo minimum, open after
    minLeaseMonths: 6, // shortest commitment is 6 months (then rolls to month-to-month) — an exact fit for your goal
    maxLeaseMonths: null, // open-ended after the initial 6 months
    availableDate: '', // "Available now"
    furnished: false, // empty rooms in photos

    petPolicy: 'No pets', // "No animals" + "Pets allowed: No" — explicit
    listingType: 'Landlord', // "Listed by property owner — Nelly Chin"
    contact: { company: '', name: 'Nelly Chin', phone: '', email: '', website: '' }, // property owner; inquire via Zillow ("Contact manager for more details")
    comments: [],

    laundry: 'on-site', // "Shared laundry" / "Coin operated laundry facilities in the building"
    amen: {
      parking: false, // owner says "No assigned parking, only street parking" (Zillow's structured field mislabels it "Off Street" — see notes)
      gym: null, // n/a
      balcony: null, // not mentioned
    },
    amenities: ['Water/garbage/gas included', 'Hardwood floors', 'Near BART (Daly City & Colma) + Serramonte/Target/Home Depot'],

    dateSeen: '2026-07-01',
    daysOnMarket: 1, // "1 day on Zillow" (13 contacts) — fresh listing (updated Jun 29, 2026)
    marketRent: 2600, // Est. — Daly City 1BR comp; $2,400 w/ water+garbage+gas included is fair-to-slightly-under

    expertRating: 3, // fair price + utilities mostly included + a 6-mo-then-M2M lease that fits perfectly, BUT 3rd-floor walk-up (no elevator), street parking only, coin laundry, no pets — a basic unit
    scamRisk: false,
    rating: 0,
    notes:
      '✅ Reads LEGITIMATE — a real Zillow home-detail listing (1 day on market, 13 contacts) by a private ' +
      'owner (Nelly Chin) with standard terms: first month + an equal $2,400 deposit + a $30 credit report, ' +
      'proof of income required. Central Daly City near Serramonte, Target, Home Depot, Gellert Park, and BART ' +
      '(Daly City + Colma). 🟢 LEASE FIT: "6 month lease, then month to month" — a 6-mo minimum that then goes ' +
      'flexible, an exact match for your 6-mo goal. Utilities mostly included (water, garbage, gas — you only ' +
      'pay electricity + internet).\n' +
      'Reality check before signing: (1) PARKING — the owner says "No assigned parking, ONLY STREET PARKING." ' +
      'Zillow\'s structured field mislabels it "Off Street," but per the owner\'s own words there is NO dedicated ' +
      'parking; the card shows a "No parking" flag on that basis — confirm with them. (2) 3rd-FLOOR WALK-UP — ' +
      '"no elevators" stated. (3) Laundry is COIN-OPERATED / shared, not in-unit. (4) NO PETS, non-smoking, no ' +
      'BBQ. (5) sqft not listed — ask. (6) "Fees may apply" — confirm any beyond the $30 credit report.',
    image: 'img/a10.webp',
    sourceUrl: 'https://www.zillow.com/homedetails/4711-Callan-Blvd-16-Daly-City-CA-94015/463541127_zpid/',
  },
  {
    // a11 — Gatewood Village, Daly City. Rooftop geocode via US Census (2026-07-01). ✅ Reads LEGIT —
    // a Zillow "Verified Source" community (Brighthaven Communities) w/ a real unit table + a
    // "reduced rent" special offer. Tracked row = Unit 618 (1BR, 570 sqft, $2,500, available now).
    id: 'a11',
    status: 'New',
    title: 'Gatewood Village 1BR — Daly City',
    address: '500 King Dr, Daly City, CA 94015',
    neighborhood: '',
    city: 'Daly City',
    lat: 37.654653,
    lng: -122.453089,

    beds: 1,
    baths: 1,
    sqft: 570, // Unit 618
    floor: '',

    rent: 2500, // Unit 618, 570 sqft, "Now" (studio from $2,000; 2BR from $3,007) — a "reduced rent" offer
    parkingCost: null, // covered parking included
    petRent: null, // not stated (pet deposit is $300/pet — see notes)
    utilitiesIncluded: null, // not stated
    utilitiesEstimate: null,

    deposit: null, // unit security deposit not stated (pet deposit $300/pet)
    appFee: null, // not stated
    brokerFee: null,

    leaseTermMonths: null, // no "Lease terms" line shown — unknown; ask
    minLeaseMonths: null,
    maxLeaseMonths: null,
    availableDate: '', // Unit 618 "Now"
    furnished: false,

    petPolicy: 'Allowed', // Dogs + Cats allowed, but a LOW 20 lb weight limit each + $300 deposit per pet
    listingType: 'Property mgmt', // Brighthaven Communities, Zillow "Verified Source", (760) 546-5420
    contact: { company: 'Brighthaven Communities', name: 'Gatewood Village', phone: '(760) 546-5420', email: '', website: '' }, // Verified Source; note: 760 = a San Diego-area code (likely a central leasing line)
    comments: [],

    laundry: 'unknown', // not listed in the captured facts — ask (in-unit vs on-site)
    amen: {
      parking: true, // covered parking + off-street covered lot
      gym: true, // "Fitness Center"
      balcony: true, // "Patio Balcony" / "Patio: Patio/balcony"
    },
    amenities: ['Pool', 'Spa', 'Club house', 'Fitness center', 'Rec room', 'BBQ/picnic area', 'Courtyard', 'A/C', 'Covered parking', 'Cable ready'],

    dateSeen: '2026-07-01',
    daysOnMarket: null,
    marketRent: 2700, // Est. — Daly City 1BR comp; $2,500 (reduced-rent offer) is at/under market

    expertRating: 4, // strong amenity set (pool, spa, gym, clubhouse, covered parking, balcony, A/C) + reduced-rent offer + pet-friendly; downsides are the low 20 lb pet limit, unstated laundry/lease term, and a non-local contact number
    scamRisk: false,
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — a Zillow "Verified Source" community (Gatewood Village, run by Brighthaven ' +
      'Communities) with a real per-unit table and its own website — the opposite of the a1/a2 scam pattern. ' +
      'Resort-style amenities: pool, spa, fitness center, club house (Zillow notes <8% of Daly City buildings ' +
      'have one), rec room, BBQ/picnic area, courtyard, covered parking, A/C, and a private patio/balcony. ' +
      '🎁 SPECIAL OFFER: "Now offering reduced rent" — ask what the actual reduced number + any term/lease-up ' +
      'conditions are.\n' +
      'Confirm before signing: (1) LEASE TERM not stated on the page — ask if they will do a 6–12 mo term. ' +
      '(2) PETS — cats + dogs OK, but a LOW 20 lb weight limit each (small pets only) + a $300 deposit per pet. ' +
      '(3) LAUNDRY type isn\'t in the captured facts — confirm in-unit vs on-site. (4) Deposit, application fee, ' +
      'and utilities not stated — ask for exact move-in costs. (5) Unit 618 is the tracked 1BR (570 sqft, $2,500, ' +
      'available now); studios start ~$2,000 and 2BRs ~$3,007 if you want a different size. (6) Minor: the (760) ' +
      'contact number is a San Diego-area code (likely a central leasing line, not a red flag given the Verified ' +
      'Source + real unit data) — confirm you\'re reaching the Daly City office.',
    image: 'img/a11.webp',
    sourceUrl: 'https://www.zillow.com/apartments/daly-city-ca/gatewood-village/5XjTQL/',
  },
  {
    // a12 — Carlmont Heights Apartments, Belmont (Belmont Hills). Rooftop geocode via US Census
    // (2026-07-01). ✅ Reads LEGIT — a Zillow "Verified Source" hillside community (4 acres) with a
    // real unit table, floor plan, and premium finishes. The most premium (and priciest) 1BR so far.
    id: 'a12',
    status: 'New',
    title: 'Carlmont Heights 1BR — Belmont',
    address: '2203 Hastings Dr, Belmont, CA 94002',
    neighborhood: 'Belmont Hills',
    city: 'Belmont',
    lat: 37.509347,
    lng: -122.295831,

    beds: 1,
    baths: 1,
    sqft: 717, // Unit 35 — the largest 1BR on your list
    floor: '',

    rent: 2995, // Unit 35, 717 sqft ("1 bed $2,995+") — the highest rent on your list
    parkingCost: null, // covered parking included
    petRent: null, // not stated
    utilitiesIncluded: null, // not stated (heating is electric = tenant-paid)
    utilitiesEstimate: null,

    deposit: null, // not stated
    appFee: null, // not stated
    brokerFee: null,

    leaseTermMonths: null, // "Lease terms: Monthly" = month-to-month (see min)
    minLeaseMonths: 1, // month-to-month — open-ended, maximally flexible (fits your goal)
    maxLeaseMonths: null,
    availableDate: '', // Unit 35 "Currently unavailable" (rolling community) — ask what's open
    furnished: false,

    petPolicy: 'Allowed', // small dogs + large dogs + cats allowed — pet-friendly
    listingType: 'Property mgmt', // large managed community (leasing office, on-site mgmt, online rent); Zillow byline says "property owner" but it's professionally managed — Verified Source
    contact: { company: 'Carlmont Heights Apartments', name: 'Leasing Agent', phone: '', email: '', website: '' }, // Zillow "Verified Source"; no phone published — inquire via Zillow
    comments: [],

    laundry: 'in-unit', // "In-unit laundry (W/D)" chip + "Laundry: In Unit" + washer/dryer in appliances
    amen: {
      parking: true, // covered parking
      gym: true, // "Fitness Center"
      balcony: true, // "Private patio or balcony" / "Balcony" / "Patio Balcony"
    },
    amenities: ['Pool', 'Club house', 'Fitness center', 'Putting green', 'Sunken lounge', 'BBQ/picnic area', 'Nature trail', 'Storage space', 'Granite countertops', 'Vaulted ceilings (select units)', 'SF Bay views', 'Online rent payment'],

    dateSeen: '2026-07-01',
    daysOnMarket: null,
    marketRent: 3000, // Est. — Belmont Hills 1BR w/ views + premium finishes; $2,995 is about at-market for this tier

    expertRating: 4, // excellent fit: month-to-month + in-unit W/D + covered parking + balcony + pool/gym/clubhouse + Bay views + the largest 1BR (717 sqft) & nicest finishes on your list — held from 5 only by the top-of-list price and current unavailability
    scamRisk: false,
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — a Zillow "Verified Source" hillside community (Carlmont Heights, spanning ~4 acres ' +
      'in Belmont Hills) with a real unit table, floor plan, leasing office, and online rent payment. The most ' +
      'premium option on your list: panoramic SF Bay views, pool, club house, fitness center, putting green, ' +
      'sunken lounge, BBQ/picnic area, nature trail, plus in-unit finishes (granite counters, vaulted ceilings + ' +
      'recessed lighting in select units, dual-pane windows). 🟢 STANDOUT FITS FOR YOU: MONTH-TO-MONTH lease ' +
      '(maximum flexibility), in-unit washer/dryer, covered parking, and a private patio/balcony — and at 717 ' +
      'sqft it\'s the LARGEST 1BR you\'re tracking.\n' +
      'Confirm before signing: (1) PRICE — at $2,995 it\'s the priciest on your list (about at-market for this ' +
      'premium tier, not a deal); make sure the extra ~$450–$700/mo vs your other 1BRs is worth the views + ' +
      'amenities to you. (2) AVAILABILITY — Unit 35 shows "Currently unavailable"; it\'s a rolling community, so ' +
      'call to ask what\'s actually open (office Mon–Sat 10–6). (3) Utilities not stated + heating is electric ' +
      '(tenant-paid) — ask for a typical monthly. (4) Deposit + application fee not stated — ask move-in costs. ' +
      '(5) Some premium finishes are "in select units" — confirm the actual unit you\'d get has them.',
    image: 'img/a12.webp',
    sourceUrl: 'https://www.zillow.com/apartments/belmont-ca/carlmont-heights-apartments/ChVVch/',
  },
  {
    // a13 — Kent Court, Daly City. Rooftop geocode via US Census (2026-07-01). ✅ Reads LEGIT —
    // a Zillow "Verified Source" listing by a management company (GPS/Logos Property Investment),
    // small 30-unit gated complex. Tracked row = Unit 25 (1BR, 700 sqft, $2,350).
    id: 'a13',
    status: 'New',
    title: 'Kent Court 1BR — Daly City',
    address: '90 Kent Ct, Daly City, CA 94015',
    neighborhood: '',
    city: 'Daly City',
    lat: 37.669752,
    lng: -122.479004,

    beds: 1,
    baths: 1,
    sqft: 700, // Unit 25
    floor: '',

    rent: 2350, // Unit 25, 700 sqft ("1 bed $2,350+"); studios start ~$2,095
    parkingCost: null, // off-street resident parking lot included
    petRent: null, // not stated
    utilitiesIncluded: true, // "Utilities included: Garbage, Sewer, Water" — the trio; you still pay gas (heat) + electric (see notes)
    utilitiesEstimate: null,

    deposit: null, // not stated
    appFee: null, // not stated
    brokerFee: null,

    leaseTermMonths: null, // offers BOTH terms (see min/max)
    minLeaseMonths: 6, // "Lease terms: One year, Six months" — they explicitly offer a 6-mo lease (a perfect fit for your goal)
    maxLeaseMonths: 12, // …and a 12-mo option
    availableDate: '', // Unit 25 "Currently unavailable" (rolling) — ask what's open
    furnished: false,

    petPolicy: 'Allowed', // cats + small dogs (2 each) confirmed; large dogs shown on a pet card but criteria says "Cats and small dogs" — see notes
    listingType: 'Property mgmt', // GPS/Logos Property Investment (Nate Chen), Zillow "Verified Source"
    contact: { company: 'GPS/Logos Property Investment', name: 'Nate Chen', phone: '', email: '', website: '' }, // Verified Source; no phone published — inquire via Zillow
    comments: [],

    laundry: 'on-site', // "Shared laundry" / "Laundry: Shared" — not in-unit
    amen: {
      parking: true, // off-street resident parking lot (may be unassigned/first-come — see notes)
      gym: null, // not mentioned
      balcony: null, // not listed as a unit feature (exterior photo shows some balconies, but not stated) — ask
    },
    amenities: ['Gated entry', 'Off-street parking lot', 'Water/sewer/garbage included', 'Online rent payment + maintenance portal', 'On-site management'],

    dateSeen: '2026-07-01',
    daysOnMarket: null,
    marketRent: 2600, // Est. — Daly City 1BR comp; $2,350 (w/ water/sewer/garbage included) is under market

    expertRating: 4, // strong practical fit: EXPLICIT 6-mo lease option (exactly your goal) + gated + off-street parking + water/sewer/garbage included + under market + 700 sqft; basic finishes (carpet/vinyl), on-site (not in-unit) laundry, no gym keep it from higher
    scamRisk: false,
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — a Zillow "Verified Source" listing by a management company (GPS/Logos Property ' +
      'Investment, Nate Chen), a quiet, well-maintained 30-unit gated complex in central Daly City with an ' +
      'online rent/maintenance portal and standard screening (2.5× income, 660+ credit, negotiable). 🟢 BEST ' +
      'LEASE FIT ON YOUR LIST: they explicitly offer a SIX-MONTH lease (as well as a 12-mo) — a direct match for ' +
      'your 6-mo goal, no negotiation needed. Also under market at $2,350 with water/sewer/garbage included, ' +
      'gated entry, and an off-street parking lot.\n' +
      'Confirm before signing: (1) AVAILABILITY — Unit 25 shows "Currently unavailable"; call to ask what\'s open ' +
      '(office Mon–Fri 9–5). (2) PETS — cats + small dogs (2 each) are confirmed, but the criteria says "Cats and ' +
      'small dogs" while a pet card also shows "Large dogs" — clarify if large dogs are actually allowed. ' +
      '(3) UTILITIES — water/sewer/garbage are included, but you still pay GAS (heat is gas) + electricity. ' +
      '(4) Laundry is shared/on-site, NOT in-unit. (5) Basic finishes (carpet + vinyl), no gym. (6) Parking is a ' +
      'shared lot — confirm whether spots are assigned or first-come. (7) Deposit + application fee not stated — ' +
      'ask move-in costs.',
    image: 'img/a13.webp',
    sourceUrl: 'https://www.zillow.com/apartments/daly-city-ca/kent-court/CmPfSY/',
  },
];
