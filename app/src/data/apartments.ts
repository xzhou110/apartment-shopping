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
    availability: 'unavailable',
    furnished: false,

    petPolicy: 'No pets', // "Dogs are not allowed" + "Cats are not allowed" — both explicit
    listingType: 'Property mgmt', // Zac Amero, Verified Source; professional screening (2.5x rent, 660+ credit)
    contact: { company: 'Imperial Apartments', name: 'Zac Amero', phone: '', email: '', website: '' }, // Zillow "Verified Source"; contact via Zillow
    comments: [],

    laundry: 'on-site', // "Laundry: Shared"
    amen: {
      parking: true, // attached garage + covered parking
      woodenFloor: true, // "Hardwood floors + carpet"
      balcony: true, // "Large balcony" — private outdoor space
      gym: false, // building amenities listed (elevator, pool, package, laundry) but NO fitness center
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
    availability: 'unknown', // no date and no "now"/"unavailable" signal anywhere on the page
    furnished: false,

    petPolicy: 'Allowed', // Dogs Allowed + Cats Allowed, 2 max each, 45 lb weight limit
    listingType: 'Property mgmt', // Blvd Residential, "Leasing Agent," Verified Source, (650) 547-8025
    contact: { company: 'Blvd Residential', name: 'Leasing Agent', phone: '(650) 547-8025', email: '', website: '' }, // Zillow "Verified Source"; phone from the listing
    comments: [],

    laundry: 'unknown', // not mentioned anywhere (no chip, no unit-feature line)
    amen: {
      parking: null, // not mentioned at all
      woodenFloor: null, // flooring not captured on the page
      balcony: null, // not mentioned (no per-unit features captured)
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
    availability: 'unknown', // date above wins for display
    furnished: false,

    petPolicy: 'Allowed', // Dogs + Cats Allowed, 2 max each; $50/mo pet rent + $500 deposit per pet
    listingType: 'Property mgmt', // Vasona (Leasing Agent), Zillow "Verified Source", (214) 833-5650
    contact: { company: 'Vasona', name: 'Leasing Agent', phone: '(214) 833-5650', email: '', website: '' }, // Zillow "Verified Source"; note: 214 = a Dallas TX area code (likely a central leasing line)
    comments: [],

    laundry: 'on-site', // "Shared: Laundry" — community/shared, not in-unit
    amen: {
      parking: true, // detached garage + garage + off-street surface lot
      woodenFloor: true, // "Flooring: Carpet, Hardwood"
      balcony: null, // not listed in the captured unit features
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
    availableDate: '', // "Available now" — no concrete date on purpose (a today-date instantly reads as "passed" once UTC rolls over); the status below carries it
    availability: 'now',
    furnished: null, // "Fully equipped tiny house" + a couch in photos suggests furnished, but appliances ≠ furniture — CONFIRM

    petPolicy: 'No pets', // "Pets allowed: No" + "No pets" chip — explicit
    listingType: 'Landlord', // private tiny-house/ADU (unit "#B"), "Contact manager," no mgmt company named
    contact: { company: '', name: '', phone: '', email: '', website: '' }, // no contact published in the listing — inquire via Zillow
    comments: [],

    laundry: 'in-unit', // "In unit laundry" chip + "Laundry: In Unit" + washer/dryer in appliances
    amen: {
      parking: true, // off-street parking (two-car limit)
      woodenFloor: true, // "Hardwood floors"
      balcony: true, // "private deck" — private outdoor space
      gym: false, // standalone tiny house / ADU — no community gym
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
    availability: 'now',
    furnished: false, // empty rooms in photos

    petPolicy: 'No pets', // "No animals" + "Pets allowed: No" — explicit
    listingType: 'Landlord', // "Listed by property owner — Nelly Chin"
    contact: { company: '', name: 'Nelly Chin', phone: '', email: '', website: '' }, // property owner; inquire via Zillow ("Contact manager for more details")
    comments: [],

    laundry: 'on-site', // "Shared laundry" / "Coin operated laundry facilities in the building"
    amen: {
      parking: false, // owner says "No assigned parking, only street parking" (Zillow's structured field mislabels it "Off Street" — see notes)
      woodenFloor: true, // "Flooring: Hardwood"
      balcony: null, // not mentioned
      gym: false, // basic 3rd-floor walk-up; no community amenities (coin laundry, no elevator/gym)
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
    availability: 'now',
    furnished: false,

    petPolicy: 'Allowed', // Dogs + Cats allowed, but a LOW 20 lb weight limit each + $300 deposit per pet
    listingType: 'Property mgmt', // Brighthaven Communities, Zillow "Verified Source", (760) 546-5420
    contact: { company: 'Brighthaven Communities', name: 'Gatewood Village', phone: '(760) 546-5420', email: '', website: '' }, // Verified Source; note: 760 = a San Diego-area code (likely a central leasing line)
    comments: [],

    laundry: 'unknown', // not listed in the captured facts — ask (in-unit vs on-site)
    amen: {
      parking: true, // covered parking + off-street covered lot
      woodenFloor: null, // no flooring line in the captured unit features
      balcony: true, // "Patio Balcony" / "Patio: Patio/balcony"
      gym: true, // "Fitness Center"
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
    availability: 'unavailable',
    furnished: false,

    petPolicy: 'Allowed', // small dogs + large dogs + cats allowed — pet-friendly
    listingType: 'Property mgmt', // large managed community (leasing office, on-site mgmt, online rent); Zillow byline says "property owner" but it's professionally managed — Verified Source
    contact: { company: 'Carlmont Heights Apartments', name: 'Leasing Agent', phone: '', email: '', website: '' }, // Zillow "Verified Source"; no phone published — inquire via Zillow
    comments: [],

    laundry: 'in-unit', // "In-unit laundry (W/D)" chip + "Laundry: In Unit" + washer/dryer in appliances
    amen: {
      parking: true, // covered parking
      woodenFloor: true, // "Flooring: Carpet, Hardwood, Laminate"
      balcony: true, // "Private patio or balcony" / "Balcony" / "Patio Balcony"
      gym: true, // "Fitness Center"
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
    availability: 'unavailable',
    furnished: false,

    petPolicy: 'Allowed', // cats + small dogs (2 each) confirmed; large dogs shown on a pet card but criteria says "Cats and small dogs" — see notes
    listingType: 'Property mgmt', // GPS/Logos Property Investment (Nate Chen), Zillow "Verified Source"
    contact: { company: 'GPS/Logos Property Investment', name: 'Nate Chen', phone: '', email: '', website: '' }, // Verified Source; no phone published — inquire via Zillow
    comments: [],

    laundry: 'on-site', // "Shared laundry" / "Laundry: Shared" — not in-unit
    amen: {
      parking: true, // off-street resident parking lot (may be unassigned/first-come — see notes)
      woodenFloor: false, // "Flooring: Carpet, Vinyl" — no wood/laminate
      balcony: null, // not listed as a unit feature (exterior photo shows some balconies, but not stated) — ask
      gym: false, // building amenities captured (laundry, portal, gated) but NO fitness center
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
  {
    // a14 — Del Medio Garden Apartments, Mountain View (Palo Alto border). Rooftop geocode via
    // US Census (2026-07-01). ✅ Reads LEGIT — a Zillow "Verified Source" 85-unit community
    // (Gibraltar Investment Corp). Two 1BR units listed; tracked row = Unit 309A ($2,700, the cheaper).
    id: 'a14',
    status: 'New',
    title: 'Del Medio Garden 1BR — Mountain View',
    address: '250 Del Medio Ave, Mountain View, CA 94040',
    neighborhood: '',
    city: 'Mountain View',
    lat: 37.408171,
    lng: -122.112357,

    beds: 1,
    baths: 1,
    sqft: 640, // Unit 309A (and 302A) — both 640 sqft
    floor: '',

    rent: 2700, // Unit 309A, 640 sqft, avail Aug 1 (Unit 302A is $2,750, avail Jul 14 — see notes)
    parkingCost: null, // carport / covered / lot included
    petRent: null, // not stated
    utilitiesIncluded: true, // "Garbage, Hot water, Sewer, Water" included; you still pay gas (heat) + electric (see notes)
    utilitiesEstimate: null,

    deposit: null, // not stated
    appFee: null, // not stated
    brokerFee: null,

    leaseTermMonths: null, // offers both terms (see min/max)
    minLeaseMonths: 6, // "Lease terms: One year, Six months" — explicit 6-mo option (a direct fit for your goal)
    maxLeaseMonths: 12, // …and a 12-mo option
    availableDate: '2026-08-01', // Unit 309A (Unit 302A is available sooner, Jul 14, at $2,750)
    availability: 'unknown', // date above wins for display
    furnished: false,

    petPolicy: 'Allowed', // small dogs (1) + large dogs + cats allowed
    listingType: 'Property mgmt', // Gibraltar Investment Corporation (Leasing Agent), Zillow "Verified Source"
    contact: { company: 'Gibraltar Investment Corporation', name: 'Leasing Agent', phone: '(650) 420-2749', email: '', website: '' }, // Verified Source; local 650 number
    comments: [],

    laundry: 'on-site', // "Shared laundry" / "Laundry: Shared" — not in-unit
    amen: {
      parking: true, // carport + covered parking + parking lot
      woodenFloor: true, // "Wood Vinyl Flooring Throughout Unit" (+ laminate) — wood-style
      balcony: true, // "Patios and balconies" / "Balcony" / "Patio Balcony"
      gym: false, // building amenities listed (club house, party room, pool, elevator) but NO fitness center
    },
    amenities: ['Heated pool', 'Club house', 'Party room', 'Remodeled rec room', 'Garden + lawn + water feature', 'Elevator', 'Bicycle storage', 'Mountain view', 'Ceiling fans', 'Water/sewer/garbage/hot-water included'],

    dateSeen: '2026-07-01',
    daysOnMarket: null,
    marketRent: 3000, // Est. — MV/Palo Alto-border 1BR near Google + Caltrain; $2,700 is under market

    expertRating: 4, // strong: EXPLICIT 6-mo lease option + balcony + covered parking + heated pool + prime location (5 min to Google, walk to Caltrain, Los Altos schools) + under market + hot-water/water/sewer/garbage included; held from 5 by shared (not in-unit) laundry, no gym, and a Saturday-only leasing office
    scamRisk: false,
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — a Zillow "Verified Source" 85-unit community (Del Medio Garden, run by Gibraltar ' +
      'Investment Corporation) on the quiet Palo Alto/Mountain View border. Excellent location: walk to Caltrain ' +
      '+ VTA + San Antonio Shopping Center, 5 min to Google HQ, 15 min to Stanford, Los Altos schools. 🟢 STANDOUT ' +
      'FITS: explicit SIX-MONTH lease option (direct match for your goal), a private patio/balcony, covered ' +
      'parking, a heated pool, and under-market rent with water/sewer/garbage/HOT WATER included.\n' +
      'Confirm before signing: (1) TWO UNITS — Unit 309A tracked here ($2,700, 640 sqft, available Aug 1); ' +
      'Unit 302A is $2,750 and available sooner (Jul 14). (2) UTILITIES — water/sewer/garbage/hot water included, ' +
      'but you still pay gas (heat) + electric. (3) Laundry is shared/on-site, NOT in-unit. (4) No gym. ' +
      '(5) LEASING OFFICE IS ONLY OPEN SATURDAYS (10–3) — plan tours accordingly; (650) 420-2749. ' +
      '(6) Deposit + application fee not stated — ask move-in costs.',
    image: 'img/a14.webp',
    sourceUrl: 'https://www.zillow.com/apartments/mountain-view-ca/del-medio-garden-apartments/CgsndL/',
  },
  {
    // a15 — El Portal Apartments, Mountain View. Rooftop geocode via US Census (2026-07-01).
    // ✅ Reads LEGIT — a Zillow "Verified Source" listing by Blvd Residential (same mgmt co as a7).
    // Tracked row = Unit 38 (1BR, 800 sqft, $2,800) — the largest 1BR on your list.
    id: 'a15',
    status: 'New',
    title: 'El Portal 1BR — Mountain View',
    address: '2065 California St, Mountain View, CA 94040',
    neighborhood: '',
    city: 'Mountain View',
    lat: 37.398639,
    lng: -122.099245,

    beds: 1,
    baths: 1,
    sqft: 800, // Unit 38 — the largest 1BR on your list
    floor: '',

    rent: 2800, // Unit 38, 800 sqft, available Now
    parkingCost: null, // parking NOT mentioned anywhere in the listing — ask (see notes)
    petRent: null, // not stated
    utilitiesIncluded: null, // not stated
    utilitiesEstimate: null,

    deposit: null, // not stated
    appFee: null, // not stated
    brokerFee: null,

    leaseTermMonths: null, // a menu of terms (see min/max)
    minLeaseMonths: 1, // "Lease terms: 1 month, 7, 9, 10, 11, 12, 13, 14, 17, 18 months" — they'll do as short as 1 mo
    maxLeaseMonths: 18, // …up to 18 mo; the 7–12 mo options are direct fits for your goal
    availableDate: '', // "Available now"
    availability: 'now',
    furnished: false,

    petPolicy: 'Cats only', // pet essentials shows ONLY Cats (2 max) — and a very low 5 lb weight limit; no dogs listed
    listingType: 'Property mgmt', // Blvd Residential, Zillow "Verified Source", (650) 750-0967
    contact: { company: 'Blvd Residential', name: '', phone: '(650) 750-0967', email: '', website: '' }, // Verified Source; local 650 number
    comments: [],

    laundry: 'unknown', // NOT mentioned anywhere (no chip, no building-amenity line, no in-unit W/D) — ask
    amen: {
      parking: null, // not mentioned at all — ask (unusual gap)
      woodenFloor: null, // flooring not captured on the page
      balcony: null, // not mentioned
      gym: true, // "Fitness Center: Gym"
    },
    amenities: ['Heated pool', 'Fitness center', 'Club house', 'Poolside lounge', 'BBQ area', 'Wi-Fi in clubhouse', '800 sqft (large 1BR)', 'Positive credit reporting available'],

    dateSeen: '2026-07-01',
    daysOnMarket: null,
    marketRent: 3100, // Est. — MV 1BR comp; at 800 sqft w/ pool+gym, $2,800 is under market

    expertRating: 4, // big draws: the LARGEST 1BR (800 sqft) + heated pool + gym + very flexible lease menu (7–12 mo all fit); held back by cats-only (odd 5 lb limit) and — notably — parking + laundry are NOT mentioned at all
    scamRisk: false,
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — a Zillow "Verified Source" listing by Blvd Residential (the same management ' +
      'company as the Tradewind listing, a7), (650) 750-0967. Biggest draw: at 800 sqft it\'s the LARGEST ' +
      '1BR you\'re tracking, with a heated pool, fitness center, club house, and poolside lounge. 🟢 LEASE: a wide ' +
      'menu — 1, 7, 9, 10, 11, 12, 13, 14, 17, 18 months — so the 7–12 mo options are direct fits for your goal ' +
      '(they\'ll even do a single month). Under market at $2,800 for the size.\n' +
      'Confirm before signing — this listing has two notable GAPS: (1) PARKING is not mentioned anywhere on the ' +
      'page (no chip, no policy line) — ask whether there is any, and if it costs extra. (2) LAUNDRY is likewise ' +
      'not mentioned (no in-unit W/D, no shared-laundry line) — ask if it\'s in-unit, on-site, or none. ' +
      '(3) PETS — CATS ONLY (2 max), and the listed weight limit is a very low 5 lb; there are NO dogs allowed — ' +
      'a dealbreaker if you have a dog. (4) Utilities, deposit, and application fee are not stated — ask move-in ' +
      'costs and what utilities you pay.',
    image: 'img/a15.webp',
    sourceUrl: 'https://www.zillow.com/apartments/mountain-view-ca/el-portal-apartments/CkBcMW/',
  },
  {
    // a16 — Ednamary Apartments, Mountain View. Rooftop geocode via US Census (2026-07-01).
    // ✅ Reads LEGIT — a Zillow "Verified Source" 18-unit garden community. NOTE: this is a 2-BEDROOM
    // (the only 2BR on your list) — more space for near-1BR money. Tracked row = the "Upstairs" 2BR.
    id: 'a16',
    status: 'New',
    title: 'Ednamary 2BR — Mountain View',
    address: '1765 Ednamary Way, Mountain View, CA 94040',
    neighborhood: '',
    city: 'Mountain View',
    lat: 37.39186,
    lng: -122.096945,

    beds: 2, // a 2-bedroom (still fits your "1+ bd" criteria) — the only 2BR you're tracking
    baths: 1, // 2 bd / 1 ba
    sqft: 850, // "Upstairs" unit
    floor: 'Upstairs',

    rent: 2850, // "Upstairs" 2BR/1ba, 850 sqft ("2 bed $2,850+")
    parkingCost: null, // carport included
    petRent: null, // n/a — no pets
    utilitiesIncluded: true, // "Garbage, Hot water, Sewer, Water" included; you still pay gas (heat) + electric (see notes)
    utilitiesEstimate: null,

    deposit: null, // not stated
    appFee: null, // not stated
    brokerFee: null,

    leaseTermMonths: null, // a menu of terms (see min/max)
    minLeaseMonths: 1, // "Lease terms: Monthly, One year, Six months" — they offer month-to-month, 6-mo, and 12-mo
    maxLeaseMonths: 12, // longest is 12 mo; the monthly + 6-mo options are direct fits for your goal
    availableDate: '', // unit table says "Currently unavailable"; the blurb says "available June 10th" (already past) — ask what's actually open
    availability: 'unavailable',
    furnished: false,

    petPolicy: 'No pets', // "Dogs are not allowed" + "Cats are not allowed" — both explicit
    listingType: 'Property mgmt', // Don Dilbeck, Zillow "Verified Source"
    contact: { company: '', name: 'Don Dilbeck', phone: '', email: '', website: '' }, // Verified Source; no phone published — inquire via Zillow
    comments: [],

    laundry: 'on-site', // "Shared laundry" / "Laundry: Shared" — not in-unit
    amen: {
      parking: true, // "Carport parking" / "Carports with storage" (dedicated)
      woodenFloor: true, // "Flooring: Carpet, Laminate, Linoleum" — laminate is wood-style
      balcony: true, // "Large balcony" / "Patio Balcony"
      gym: false, // building amenities captured (pool, garden, BBQ, deck, maintenance) but NO fitness center
    },
    amenities: ['Large balcony', 'Carport w/ storage', 'Upgraded appliances', 'Recessed lighting', 'Pool', 'Garden + lawn + picnic area + BBQ + deck', 'Building-wide WiFi', '24-hr maintenance', 'Water/sewer/garbage/hot-water included'],

    dateSeen: '2026-07-01',
    daysOnMarket: null,
    marketRent: 3300, // Est. — MV 2BR comp; $2,850 for a 2BR is clearly under market (older/compact 1-bath — the tradeoff)

    expertRating: 4, // strong VALUE angle: a 2BR/850sqft for $2,850 = more room than the 1BRs at similar money, + large balcony + carport-with-storage + monthly/6-mo lease options + water/sewer/garbage/hot-water included + open 7 days; tradeoffs are NO PETS, only 1 bath, older finishes, and current unavailability
    scamRisk: false,
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — a Zillow "Verified Source" quiet 18-unit garden community (managed by Don Dilbeck), ' +
      'open 7 days a week. 💡 THE ANGLE: this is a 2-BEDROOM at $2,850 — for about the same money as your 1BRs ' +
      'you get a second room (good for a home office / guest). Nice extras: a LARGE balcony, a carport WITH ' +
      'storage, upgraded appliances, recessed lighting, a pool + garden, building-wide WiFi, and 24-hr ' +
      'maintenance. 🟢 LEASE: offers Monthly, Six-month, and One-year terms — the monthly + 6-mo options are ' +
      'direct fits for your goal. Water/sewer/garbage/hot water included.\n' +
      'Confirm before signing: (1) NO PETS — dogs AND cats both disallowed (dealbreaker if you have one). ' +
      '(2) Only 1 BATHROOM (for a 2BR) and older finishes (carpet/laminate/linoleum) — it\'s value, not luxury. ' +
      '(3) AVAILABILITY — the unit shows "Currently unavailable" while the blurb says "available June 10th" ' +
      '(already past); call to confirm what\'s actually open. (4) UTILITIES — water/sewer/garbage/hot water ' +
      'included, but you still pay gas (heat) + electric. (5) Laundry is shared/on-site, NOT in-unit. ' +
      '(6) Deposit + application fee not stated — ask move-in costs.',
    image: 'img/a16.webp',
    sourceUrl: 'https://www.zillow.com/apartments/mountain-view-ca/ednamary-apartments/CrHWyv/',
  },
  {
    // a17 — Verandas Apartments, Menlo Park. Rooftop geocode via US Census (2026-07-01, 720 Coleman Ave).
    // Source is apartments.com (not Zillow). NOTE: the primary photo could NOT be fetched — apartments.com
    // blocks server-side image requests (403, anti-hotlinking), unlike Zillow's static CDN. image left ''
    // (placeholder) until a fetchable image URL is provided. Tracked row = the "Matches" 1x1 ($2,425).
    id: 'a17',
    status: 'New',
    title: 'Verandas Apartments 1BR — Menlo Park',
    address: '720 Coleman Ave, Menlo Park, CA 94025',
    neighborhood: '',
    city: 'Menlo Park',
    lat: 37.462043,
    lng: -122.161948,

    beds: 1,
    baths: 1,
    sqft: 600, // 1x1 floor plan (the community spans 600–1,000 sqft across 1–2BR)
    floor: '',

    rent: 2425, // 1x1, 600 sqft, "Available Now" (community range is $2,425–$3,350 across 1–2BR)
    parkingCost: null, // a "Parking" fees tab exists but its contents weren't captured — ask (may cost extra)
    petRent: null, // a "Pets" fees tab exists but wasn't captured — ask
    utilitiesIncluded: null, // not stated
    utilitiesEstimate: null,

    deposit: 500, // "$500 Deposit" — stated on the 1x1 floor plan (notably low)
    appFee: 50, // "Application Fee Per Applicant: $50"; Administrative Fee at move-in = $0 (no admin fee)
    brokerFee: null,

    leaseTermMonths: null, // offers a range (see min/max)
    minLeaseMonths: 6, // "6–12 Month Leases" + "Short term lease" — an EXPLICIT 6-mo option, a direct fit for your goal
    maxLeaseMonths: 12,
    availableDate: '', // "Available Now"
    availability: 'now', // 1x1 shows "Available Now"
    furnished: false,

    petPolicy: 'Unknown', // a Pets fees tab exists but pet rules weren't shown — confirm (building is not labeled pet-friendly in the captured sections)
    listingType: 'Property mgmt', // managed 34-unit community, Property Manager on Site, (650) 469-8458
    contact: { company: 'Verandas Apartments', name: '', phone: '(650) 469-8458', email: '', website: '' }, // apartments.com listing; local 650 number + a property website (URL not captured)
    comments: [],

    laundry: 'in-unit', // "Washer/Dryer" listed under Apartment Features (unit-level); NOTE the community also has shared "Laundry Facilities" — confirm the actual unit has in-unit W/D (see notes)
    amen: {
      parking: null, // not shown (parking fees tab not captured)
      woodenFloor: true, // "Hardwood Floors" in Highlights + Model Details
      balcony: true, // "Balcony" + "Patio" in Highlights and Model Details
      gym: false, // community amenities listed (pool, courtyard, laundry) but NO fitness center
    },
    amenities: ['Pool', 'Courtyard', 'Hardwood floors', 'In-unit W/D (confirm)', 'Stainless steel appliances', 'High-speed internet + WiFi', 'Ceiling fans', 'Smoke-free', '$0 admin fee', 'Built 1958 · 34 units'],

    dateSeen: '2026-07-01',
    daysOnMarket: null,
    marketRent: 2800, // Est. — Menlo Park 1BR comp (pricey area near Meta/Stanford); $2,425 for a small older unit is under market

    expertRating: 4, // one of your best FITS: prime Menlo Park (near Meta + Stanford + top schools), under-market $2,425, EXPLICIT 6–12 mo + short-term lease, likely in-unit W/D, a balcony/patio, hardwood, pool, $0 admin + low $500 deposit; held from 5 by small 600 sqft, a 1958 building (1 bath), and unconfirmed parking/pets
    scamRisk: false,
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — an apartments.com managed community (Verandas; built 1958, 34 units, Property ' +
      'Manager on Site, (650) 469-8458) in prime Menlo Park near Meta/Facebook, Stanford, and top-rated schools. ' +
      '🟢 ONE OF YOUR BEST 6-MONTH FITS: the listing explicitly offers "6–12 Month Leases" AND a "Short term ' +
      'lease" — a direct match, no negotiation needed — at an under-market $2,425 for the area, with a low $500 ' +
      'deposit, a $50 app fee, and a $0 admin fee. Also has a balcony/patio, hardwood floors, a pool, and likely ' +
      'in-unit W/D.\n' +
      'Confirm before signing: (1) LAUNDRY — "Washer/Dryer" is listed as a unit feature (great, in-unit), but the ' +
      'community ALSO lists shared "Laundry Facilities" — confirm THIS unit actually has in-unit W/D. ' +
      '(2) PARKING — a Parking fees tab exists but wasn\'t shown; ask if there\'s parking and whether it costs ' +
      'extra. (3) PETS — a Pets fees tab exists but the policy wasn\'t shown; confirm if pets are allowed. ' +
      '(4) SIZE/AGE — it\'s a small 600 sqft, 1-bath unit in a 1958 building — charming/value, not luxury. ' +
      '(5) MOVE-IN SPECIAL applies to 1-YEAR leases (a concession on the 6th month), so a 6-mo lease likely ' +
      'won\'t get it — ask. (6) 📷 No photo yet — apartments.com blocked the image download; send me a photo URL ' +
      '(e.g. from Zillow) and I\'ll add it.',
    image: '', // apartments.com blocked the photo fetch (403) — placeholder shown until a fetchable URL is provided
    sourceUrl: 'https://www.apartments.com/verandas-apartments-menlo-park-ca/e7kcxrp/',
  },
  {
    // a18 — 1300 Hoover St, APT 2, Menlo Park. Rooftop geocode via US Census (2026-07-01).
    // ✅ Reads LEGIT — a Zillow homedetails unit listed by a named, 5★-reviewed agent (Tim Proschold,
    // Luxuriant Realty). Small garden-style 1BR with a STATED 6-MONTH lease (your exact target).
    id: 'a18',
    status: 'New',
    title: 'Charming 1BR (garden-style) — Menlo Park',
    address: '1300 Hoover St APT 2, Menlo Park, CA 94025',
    neighborhood: '',
    city: 'Menlo Park',
    lat: 37.454145,
    lng: -122.1869,

    beds: 1,
    baths: 1,
    sqft: 533, // the smallest 1BR on your list
    floor: '',

    rent: 2495, // "$2,495/mo" (Fees may apply — see utilities note)
    parkingCost: null, // assigned covered parking included (no separate charge stated)
    petRent: null, // not stated
    utilitiesIncluded: false, // ONLY garbage is included; you pay electric, gas, internet + a required "utilities fee" (see notes)
    utilitiesEstimate: null,

    deposit: null, // not stated
    appFee: null, // not stated (screening: 2.5× income, 680+ credit)
    brokerFee: null,

    leaseTermMonths: 6, // "Lease term: 6 Month" — a stated 6-mo lease, an EXACT match for your goal
    minLeaseMonths: null,
    maxLeaseMonths: null,
    availableDate: '', // "Available now"
    availability: 'now',
    furnished: false, // photos are virtually staged (disclosed) — unit is unfurnished

    petPolicy: 'Allowed', // "Cats and dogs" OK (Negotiable)
    listingType: 'Property mgmt', // Tim Proschold, Luxuriant Realty (5★, 13 reviews), (415) 223-8548
    contact: { company: 'Luxuriant Realty', name: 'Tim Proschold', phone: '(415) 223-8548', email: '', website: '' }, // named agent w/ 5/5 rating (13 reviews); 415 = SF area code
    comments: [],

    laundry: 'on-site', // "Shared" coin-operated laundry facility — not in-unit
    amen: {
      parking: true, // "Assigned covered parking" (dedicated)
      woodenFloor: true, // "Flooring: Hardwood, Tile"
      balcony: null, // not mentioned (ground-floor garden unit w/ private entry) — ask
      gym: false, // private garden-style unit — no community gym
    },
    amenities: ['Assigned covered parking', 'Private entry', 'Garden-style complex', 'Mature landscaping', 'Hardwood + tile floors', 'Eat-in kitchen', 'Abundant natural light'],

    dateSeen: '2026-07-01',
    daysOnMarket: null, // brand-new (listed ~10 hours ago) — but 39 contacts already (see notes: acts fast)
    marketRent: 2700, // Est. — Menlo Park 1BR comp; $2,495 for a tiny 533 sqft unit is modestly under market

    expertRating: 4, // strong FIT: prime Menlo Park + a STATED 6-MONTH lease (your exact target) + assigned covered parking + cats/dogs OK + hardwood + under market + a 5★-reviewed agent; held from 5 by the TINY 533 sqft, shared coin laundry, wall-furnace-only heat, and utilities mostly tenant-paid
    scamRisk: false,
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — a real Zillow unit listed by a NAMED, well-reviewed agent (Tim Proschold, ' +
      'Luxuriant Realty, 5★ / 13 reviews, (415) 223-8548) with standard screening (2.5× income, 680+ credit). ' +
      '🟢 BEST-CASE LEASE FIT: the listing states a "6 Month" lease term outright — an EXACT match for your goal, ' +
      'no negotiation. In prime Menlo Park (near Meta + Stanford + top schools), under market at $2,495, with ' +
      'ASSIGNED COVERED PARKING, cats + dogs OK (negotiable), hardwood/tile floors, a private entry, and a quiet ' +
      'garden-style complex.\n' +
      '⚠️ ACT FAST: it was listed only ~10 hours ago and already has 39 contacts — high demand; it may be gone ' +
      'within a day or two, so call TODAY if interested.\n' +
      'Confirm before signing: (1) TINY — 533 sqft is the SMALLEST 1BR on your list; make sure the space works. ' +
      '(2) UTILITIES — only GARBAGE is included; you pay electricity, gas, internet, AND a required "utilities ' +
      'fee" on top of the $2,495 — ask what that fee is. (3) Heat is a WALL FURNACE only (no central heat/AC). ' +
      '(4) Laundry is shared/coin-operated, NOT in-unit. (5) Deposit + application fee not stated — ask move-in ' +
      'costs. (6) "6 Month" appears to be the only stated term — confirm they\'ll renew/extend if you want longer.',
    image: 'img/a18.webp',
    sourceUrl: 'https://www.zillow.com/homedetails/1300-Hoover-St-APT-2-Menlo-Park-CA-94025/2060137151_zpid/',
  },
  {
    // a19 — 853 Commodore Dr, San Bruno ("The Crossing San Bruno" community). Rooftop geocode via
    // Nominatim (2026-07-10, structured "853, Commodore Drive, San Bruno, 94066"). ✅ Reads LEGIT but
    // is a DIFFERENT PRODUCT: this is a **Blueground FURNISHED corporate-housing** listing (theblueground.com
    // watermarks, "1-12+ months", furnished perks), the FIRST furnished unit on your list — raw rent is NOT
    // apples-to-apples with the unfurnished listings. Page lists 7 units ($2,840 1BR → $4,510 2BR); tracked
    // row = Unit 5-ID988, the cheapest 1BR (568 sqft, $2,840, avail Jul 11). The hero photo you sent is of
    // Unit 5-ID2093 (the 2BR/2BA $4,510) — Blueground stages every unit alike, so it represents the finish.
    id: 'a19',
    status: 'New',
    title: 'Blueground Furnished 1BR — San Bruno',
    address: '853 Commodore Dr, San Bruno, CA 94066',
    neighborhood: 'The Crossing',
    city: 'San Bruno',
    lat: 37.634549,
    lng: -122.42204,

    beds: 1,
    baths: 1,
    sqft: 568, // Unit 5-ID988 (all three 1BRs are 568 sqft)
    floor: '', // not stated

    rent: 2840, // Unit 5-ID988, 568 sqft, avail Jul 11 (other 1BRs: ID583 $2,890 Oct 31, ID975 $2,920 Nov 1). FURNISHED — see notes
    parkingCost: null, // not stated on this Blueground view — ask (The Crossing community typically has garage parking)
    petRent: null, // not stated
    utilitiesIncluded: null, // not stated — Blueground rates sometimes bundle wifi/utilities on shorter terms; confirm what's included
    utilitiesEstimate: null,

    deposit: null, // not stated (Blueground usually charges a set deposit + a one-time cleaning fee — ask)
    appFee: null, // not stated
    brokerFee: null,

    leaseTermMonths: null, // flexible — the "1-12+ months" badge; modeled via min/max below
    minLeaseMonths: 1, // Blueground does flexible terms from ~1 month (open-ended up)
    maxLeaseMonths: null, // "12+" — open-ended; the 6-mo term you want is squarely in range
    availableDate: '2026-07-11', // Unit 5-ID988 available Jul 11 (essentially now)
    availability: 'unknown', // date above wins for display
    furnished: true, // ⭐ FULLY FURNISHED — the first furnished listing on your list (King bed, Smart TV, decor, kitchenware)

    petPolicy: 'Unknown', // not stated on this view — Blueground pet rules vary by building; confirm
    listingType: 'Property mgmt', // Blueground — a large, established furnished-apartment operator (professional leasing flow)
    contact: { company: 'Blueground', name: '', phone: '', email: '', website: 'https://www.theblueground.com/' },
    comments: [],

    laundry: 'in-unit', // "In-unit laundry (W/D)" chip + "IN-APARTMENT LAUNDRY" tag + Washer/Dryer in appliances
    amen: {
      parking: null, // not stated — ask
      woodenFloor: true, // wide-plank wood-look flooring throughout the photos
      balcony: true, // photo shows a private balcony with bistro seating
      gym: null, // not stated on the Blueground view (the wider community may have one) — ask
    },
    amenities: ['Fully furnished', 'Smart TV', 'King bed', 'Modern decor', 'Premium wireless speaker', 'In-unit washer/dryer', 'Dishwasher', 'Private balcony', 'Flexible 1–12+ mo lease', 'Move-in ready (turnkey)'],

    dateSeen: '2026-07-10',
    daysOnMarket: null,
    marketRent: null, // deliberately null — furnished corporate housing has no clean unfurnished comp in your set (like the a9 tiny house); the raw $/sqft on the card is the honest signal, but read it knowing it's FURNISHED

    expertRating: 4, // strong FIT *if* you want furnished/flexible: fully furnished + move-in-ready + a flexible 1-12+ mo term (your 6-mo goal fits perfectly) + in-unit W/D + balcony + BART/SFO-adjacent; held from 5 by the top-of-range raw rent, small 568 sqft, likely extra fees (cleaning/booking), and unconfirmed parking/pets/utilities
    scamRisk: false,
    rating: 0,
    notes:
      '✅ LEGITIMATE, but a DIFFERENT PRODUCT than the rest of your list — this is BLUEGROUND, a large, ' +
      'established furnished-apartment operator, at "The Crossing San Bruno," a real BART-adjacent community ' +
      '(the theblueground.com watermarks are their own marketing, not a scam tell). ⭐ THE ANGLE: it\'s FULLY ' +
      'FURNISHED and move-in-ready (King bed, Smart TV, modern decor, kitchenware, premium speaker) with a ' +
      'FLEXIBLE 1–12+ month term — which is arguably the BEST fit on your whole list for a 6-month stay: you ' +
      'bring a suitcase, buy/move no furniture, and hand it back at the end. In-unit W/D, a private balcony, and ' +
      'great transit (San Bruno BART + The Shops at Tanforan next door, 101/280, ~10 min to SFO).\n' +
      'Read the price honestly: (1) FURNISHED ≠ your other rows — $2,840 for a 568 sqft 1BR is the top of your ' +
      '1BR range in RAW dollars, but it bundles all the furniture; furnished San Bruno 1BRs typically run ' +
      '$3,200–3,600, so as furnished housing it\'s fair-to-good value (Blueground\'s pitch is literally "furnished ' +
      'at unfurnished prices"). If you already OWN furniture, the cheaper unfurnished options (a17/a18 Menlo Park ' +
      '~$2,425–2,495) win on cost; if you DON\'T, this likely nets out ahead for 6 months. I set market-rent to ' +
      '"—" on purpose (no clean unfurnished comp), so don\'t read an over/under-market flag into it.\n' +
      'Confirm before booking: (1) FEES — Blueground usually adds a one-time cleaning fee (and sometimes a ' +
      'booking/membership fee); the $2,840 is likely the 12-mo rate — a 6-mo term often prices a bit higher. Ask ' +
      'for the ALL-IN monthly at a 6-month term. (2) WHAT\'S INCLUDED — confirm whether wifi/utilities are ' +
      'bundled (Blueground varies by plan). (3) PETS — not stated here; their policy varies by building. ' +
      '(4) PARKING — not shown on this view; ask if there\'s a garage spot and what it costs. (5) UNIT CHOICE — ' +
      '7 units total: three 568 sqft 1BRs ($2,840 Jul 11 / $2,890 Oct 31 / $2,920 Nov 1) and four 2BR/2BAs ' +
      '($4,010–$4,510); this row tracks the cheapest 1BR, but tell me if you want a 2BR row instead.',
    image: 'img/a19.webp',
    sourceUrl: 'https://www.zillow.com/b/853-commodore-dr-san-bruno-ca-5j45xb/',
  },
];
