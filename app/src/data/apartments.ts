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
    // a7 — Tradewind Surf Apartments, Foster City. Exact house-level geocode (Nominatim,
    // 2026-07-01 — "1110, Polynesia Drive, Foster City, 94404"). ✅ Reads LEGIT — a Zillow
    // "Verified Source" community. Per-unit table captured 2026-07-10: Studio 562 sqft $1,975 ·
    // 1BR/1BA 747 sqft $2,300 · 2BR/1BA 1,020 sqft $2,850 · 2BR/2BA 1,163 sqft $2,995 (all "Now").
    // Tracked row = the One Bedroom One Bath (747 sqft, $2,300) — confirms the $2,300/1bd given earlier.
    id: 'a7',
    status: 'New',
    title: 'Tradewind Surf Apartments — Foster City',
    address: '1110 Polynesia Dr, Foster City, CA 94404',
    neighborhood: '',
    city: 'Foster City',
    lat: 37.5589561,
    lng: -122.2629116,

    beds: 1, // "One Bedroom One Bath" row
    baths: 1, // confirmed — "One Bedroom One Bath" (previously inferred)
    sqft: 747, // "One Bedroom One Bath" floor plan (unit table, 2026-07-10) — a roomy 1BR
    floor: '', // not stated

    rent: 2300, // "One Bedroom One Bath $2,300+" base rent (unit table) — matches the figure you'd given
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
    availableDate: '', // no exact date — unit table shows "Now" (availability below carries it)
    availability: 'now', // unit table: all floor plans available "Now"
    furnished: false,

    petPolicy: 'Allowed', // Dogs Allowed + Cats Allowed, 2 max each, 45 lb weight limit
    listingType: 'Property mgmt', // Blvd Residential, "Leasing Agent," Verified Source, (650) 547-8025
    contact: { company: 'Blvd Residential', name: 'Leasing Agent', phone: '(650) 547-8025', email: '', website: '' }, // Zillow "Verified Source"; phone from the listing
    comments: [
      { id: 'c1784330709521', text: 'Not available, check back next month\nPlenty of parking behind the building\nPoor management review 2.1/5 stars;\nFlooded twice a year; smells bad', ts: '2026-07-17T23:25:09.521Z' },
    ],

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
    incomeRestricted: false,
    rating: 2,
    notes:
      '✅ Looks LEGITIMATE — a Zillow "Verified Source" listing managed by Blvd Residential (Leasing Agent, ' +
      '(650) 547-8025), a long-standing pet-friendly community in a quiet Foster City neighborhood near ' +
      'Highway 101/92, equidistant from SF and Silicon Valley. Fitness center + community room; pool is ' +
      'temporarily closed. Notable: lease term is stated as 1 MONTH — true month-to-month, the most flexible ' +
      'term of any listing you\'ve tracked so far, and a perfect fit for your 6-month goal (it shows a green ' +
      'month-to-month flag on the card).\n' +
      'Confirm before signing: (1) UNIT LINEUP (now captured, all available "Now"): Studio 562 sqft $1,975 · ' +
      '1BR/1BA 747 sqft $2,300 (tracked here) · 2BR/1BA 1,020 sqft $2,850 · 2BR/2BA 1,163 sqft $2,995 — the 1BR ' +
      'is a roomy 747 sqft (~$3.08/sqft) at $2,300, a strong value; confirm the exact unit/floor + that pricing ' +
      'is current. (2) Laundry type isn\'t stated anywhere — ask if it\'s in-unit, on-site, or none. ' +
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
    comments: [
      { id: 'c1784330947484', text: 'The property may no longer be available\nNo response from the property at all\nNice location\n3/5 management review', ts: '2026-07-17T23:29:07.484Z' },
    ],

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
    incomeRestricted: false,
    rating: 3,
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
    status: 'Gone', // user-marked 2026-07-16 — "Too small for the price" (baked from the PC overlay)
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
    comments: [
      { id: 'c1783725581679', text: 'Too small for the price', ts: '2026-07-10T23:19:41.679Z' },
    ],

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
    incomeRestricted: false,
    rating: 1,
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
    status: 'Gone', // user-marked 2026-07-16 (baked from the PC overlay)
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
    comments: [
      { id: 'c1783725457179', text: 'Can\'t find reviews', ts: '2026-07-10T23:17:37.179Z' },
    ],

    laundry: 'on-site', // "Shared laundry" / "Coin operated laundry facilities in the building"
    amen: {
      parking: false, // owner says "No assigned parking, only street parking" (Zillow's structured field mislabels it "Off Street" — see notes)
      woodenFloor: true, // "Flooring: Hardwood"
      balcony: null, // not mentioned
      gym: false, // basic 3rd-floor walk-up; no community amenities (coin laundry, no elevator/gym)
    },
    amenities: ['Water/garbage/gas included', 'Hardwood floors', 'Near BART (Daly City & Colma) + Serramonte/Target/Home Depot'],

    dateSeen: '2026-07-01',
    daysOnMarket: 10, // "10 days on Zillow" · 53 contacts (up from 13 on Jul 1) — very high demand; listing updated 14h ago
    marketRent: 2600, // Est. — Daly City 1BR comp; $2,400 w/ water+garbage+gas included is fair-to-slightly-under

    expertRating: 3, // fair price + utilities mostly included + a 6-mo-then-M2M lease that fits perfectly, BUT 3rd-floor walk-up (no elevator), street parking only, coin laundry, no pets — a basic unit
    scamRisk: false,
    incomeRestricted: false,
    rating: 3,
    notes:
      '✅ Reads LEGITIMATE — a real Zillow home-detail listing (10 days on market, 53 contacts) by a private ' +
      'owner (Nelly Chin) with standard terms: first month + an equal $2,400 deposit + a $30 credit report, ' +
      'and proof of income (3 months of bank statements or pay stubs). Central Daly City near Serramonte, ' +
      'Target, Home Depot, Gellert Park, and BART ' +
      '(Daly City + Colma). 🟢 LEASE FIT: "6 month lease, then month to month" — a 6-mo minimum that then goes ' +
      'flexible, an exact match for your 6-mo goal. Utilities mostly included (water, garbage, gas — you only ' +
      'pay electricity + internet).\n' +
      '⚠️ HIGH DEMAND: 53 contacts in 10 days on market — this one is moving fast, so reach out TODAY if it ' +
      'interests you (it may be gone soon).\n' +
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
    status: 'Ruled out', // user-ruled-out 2026-07-16 — 12-mo lease only, doesn't fit the 6-mo goal (baked from the PC overlay)
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
    comments: [
      { id: 'c1784243892732', text: 'Only 1 year lease term is allowed.\nHuge community. Parking is kind of tight. \n4.4/5 among 175 google reviews and 1.9/5among  yelp reviews', ts: '2026-07-16T23:18:12.732Z' },
    ],

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
    incomeRestricted: false,
    rating: 4,
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
    status: 'Gone', // user-marked 2026-07-16 — "1 bed no longer available" (baked from the PC overlay)
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
    comments: [
      { id: 'c1784087385247', text: '3/5 rating among 50 reviews\n1 bed no longer available', ts: '2026-07-15T03:49:45.247Z' },
    ],

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
    incomeRestricted: false,
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
    comments: [
      { id: 'c1784330680270', text: 'It seems not available?\nParking is tight. Old building. \nPrivate owner. Can\'t find review for this one', ts: '2026-07-17T23:24:40.270Z' },
    ],

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
    incomeRestricted: false,
    rating: 3,
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
    incomeRestricted: false,
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
    incomeRestricted: false,
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
    incomeRestricted: false,
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
    // Source is apartments.com (not Zillow). PHOTO BACKFILLED 2026-07-16: apartments.com 403s server-side
    // image fetches (even with a browser UA + Referer), so the photo is pulled via the in-app BROWSER —
    // navigate to the image URL (making it same-origin), fetch it, re-encode to WebP on a canvas, and POST
    // the bytes to a localhost catcher. Tracked row = the "Matches" 1x1 ($2,425).
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
    comments: [
      { id: 'c1784194018212', text: 'Check if this is still available? \nEnvironment looks okayish. Limited parking spots + street parking\n2-3/5 rating among 5 reviews', ts: '2026-07-16T09:26:58.212Z' },
    ],

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
    incomeRestricted: false,
    rating: 3,
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
      'won\'t get it — ask.',
    image: 'img/a17.webp', // backfilled 2026-07-16 via the in-app browser (apartments.com 403s server-side fetches)
    sourceUrl: 'https://www.apartments.com/verandas-apartments-menlo-park-ca/e7kcxrp/',
  },
  {
    // a18 — 1300 Hoover St, APT 2, Menlo Park. Rooftop geocode via US Census (2026-07-01).
    // ✅ Reads LEGIT — a Zillow homedetails unit listed by a named, 5★-reviewed agent (Tim Proschold,
    // Luxuriant Realty). Small garden-style 1BR with a STATED 6-MONTH lease (your exact target).
    id: 'a18',
    status: 'Gone', // user-marked 2026-07-15 — "No longer available" (baked from the PC overlay)
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
    comments: [
      { id: 'c1784087732291', text: 'No longer available', ts: '2026-07-15T03:55:32.291Z' },
    ],

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
    incomeRestricted: false,
    rating: 4,
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
    status: 'Gone', // user-marked 2026-07-17 — Blueground/Avalon, income-restricted for short-term + 1BR unavailable (baked from the PC overlay)
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
    comments: [
      { id: 'c1784331365391', text: 'The real company is Avalon. \nThe real leasing company is Avalon. \nContact blueground directly for short term lease, but it\'s income restricted\n4/5 rating among 400 google reviews.', ts: '2026-07-17T23:36:05.391Z' },
    ],

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
    incomeRestricted: false,
    rating: 4,
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
  {
    // a20 — Hillsdale Garden, San Mateo (Northeast Hillsdale). Rooftop geocode via Nominatim
    // (2026-07-10, "3500, Edison Street, San Mateo, 94403"). ✅ Reads LEGIT — a Zillow "Verified Source"
    // (green check) Greystar-managed community with a real 5-unit table + floor plans. ⚠️ KEY GATE: this is
    // an INCOME-RESTRICTED (affordable) property — you must income-QUALIFY to rent (see notes). Tracked row =
    // Unit 313677B, the cheapest + roomiest 1BR (782 sqft, $2,965 all-in, avail Aug 3).
    id: 'a20',
    status: 'Gone', // user-marked 2026-07-15 — income-restricted, skipping (baked from the PC overlay)
    title: 'Hillsdale Garden 1BR (income-restricted) — San Mateo',
    address: '3500 Edison St, San Mateo, CA 94403',
    neighborhood: 'Northeast Hillsdale',
    city: 'San Mateo',
    lat: 37.533875,
    lng: -122.299351,

    beds: 1,
    baths: 1,
    sqft: 782, // Unit 313677B (and 25192B) — the two roomiest 1BRs; Unit 46248D is smaller at 676 sqft
    floor: '',

    rent: 2965, // Unit 313677B "Total monthly price" — INCLUDES base rent + all mandatory monthly fees (transparent all-in; see notes)
    parkingCost: null, // no paid parking option — the listing states Parking: None (see amen.parking)
    petRent: 50, // "Monthly dog rent $50" / "Monthly cat rent $50"
    utilitiesIncluded: null, // not stated
    utilitiesEstimate: null,

    deposit: null, // unit security deposit not stated (pet deposit is $500 per pet)
    appFee: null, // not stated
    brokerFee: null,

    leaseTermMonths: null, // a menu of terms (see min/max)
    minLeaseMonths: 6, // "Lease terms: 6, 7, 8, 9, 10, 11, 12, 13, 14, 15" — explicit 6-mo option, a direct fit for your goal
    maxLeaseMonths: 15,
    availableDate: '2026-08-03', // Unit 313677B (Unit 25192B is the same $2,965 but avail Aug 16)
    availability: 'unknown', // date above wins for display
    furnished: false, // unfurnished (note: an OPTIONAL "Furniture Rental Partnership With Cort" is offered)

    petPolicy: 'Allowed', // Dogs + Cats allowed ($50/mo + $500 deposit each); dog BREED restrictions apply (see notes)
    listingType: 'Property mgmt', // Greystar (the largest US apartment manager), Zillow "Verified Source", (415) 936-1214
    contact: { company: 'Greystar', name: '', phone: '(415) 936-1214', email: '', website: '' }, // Verified Source; local 415 number
    comments: [
      { id: 'c1784087116024', text: 'Income restricted', ts: '2026-07-15T03:45:16.024Z' },
    ],

    laundry: 'on-site', // "Shared: On-site Laundry Facilities" — not in-unit
    amen: {
      parking: false, // listing explicitly states "Parking: None" — no on-site parking (drives a "no parking" flag; mitigated by Walk Score 90)
      woodenFloor: true, // "Flooring: Hardwood"
      balcony: null, // not stated in the captured unit features — ask
      gym: true, // "Fitness Center"
    },
    amenities: ['Total price incl. all mandatory fees', 'Swimming pool', 'Spa', 'Fitness center', 'Bocce ball court', 'Playground', 'Picnic area', 'Dog park', 'Hardwood floors', 'On-site resident services', 'Optional Cort furniture rental', 'Newly renovated (select units)'],

    dateSeen: '2026-07-10',
    daysOnMarket: null,
    marketRent: 3100, // Est. — San Mateo 1BR comp; $2,965 all-in (fees included) is at/slightly under market for the size + amenities

    expertRating: 4, // CONDITIONAL 4 — genuinely strong IF two gates clear: (1) you income-QUALIFY and (2) you're OK with NO on-site parking. Upside: a roomy 782 sqft 1BR, explicit 6-mo lease, resort amenities (pool/spa/gym/dog park/bocce), Greystar-managed + Verified, transparent all-in pricing, Walk Score 90. Held from 5 by the income gate, no parking, shared (not in-unit) laundry, and only 1 bath even on the 2BRs
    scamRisk: false,
    incomeRestricted: true, // affordable/AMI property — must income-qualify (the red flag; details in notes)
    rating: 2,
    notes:
      '⚠️ READ FIRST — INCOME-RESTRICTED (affordable) HOUSING: this is a real, well-run community, but you must ' +
      'INCOME-QUALIFY to rent it. For affordable housing that almost always means a MAXIMUM income cap (your ' +
      'household must earn UNDER a limit tied to Area Median Income), and Greystar "may have additional ' +
      'eligibility criteria." As a founder with variable income this can cut both ways — you might be over the ' +
      'cap, or you might qualify. Use the listing\'s "Check income qualification" tool BEFORE you invest any time; ' +
      'if you don\'t qualify, skip it.\n' +
      '✅ Otherwise LEGITIMATE — a Zillow "Verified Source" (green check) Greystar-managed community in Northeast ' +
      'Hillsdale, San Mateo, (415) 936-1214, with a real 5-unit table, floor plans, and resort-style amenities: ' +
      'swimming pool, spa, fitness center, bocce court, dog park, playground, picnic area, on-site resident ' +
      'services. 🟢 STANDOUT FITS: an explicit SIX-MONTH lease option (6–15 mo menu — a direct match for your ' +
      'goal), a roomy 782 sqft 1BR (one of the largest on your list), hardwood floors, pet-friendly, Walk Score ' +
      '90 (Very Walkable). 💡 PRICING IS TRANSPARENT: the $2,965 is the "Total monthly price" — it already ' +
      'includes base rent + all mandatory monthly fees (most listings quote base-only), so it\'s a cleaner ' +
      'apples-to-apples number than it looks.\n' +
      'Confirm before signing: (1) 🚗 NO PARKING — the listing states "Parking: None"; there is no on-site ' +
      'parking, so you\'d rely on street parking (the card shows a no-parking flag). Walk Score 90 helps, but ' +
      'confirm your options if you have a car. (2) LAUNDRY is shared/on-site, NOT in-unit. (3) PETS — cats + dogs ' +
      'OK ($50/mo + $500 deposit each), but DOG BREED restrictions apply (Rottweiler, doberman, pit bull, ' +
      'staffordshire terrier, chow, presa canaria, akita, alaskan malamute, wolf hybrid, or mixes). (4) The 2BR ' +
      'units are 2bd/1BA only — one bathroom. (5) Deposit + utilities not stated — ask move-in costs and what ' +
      'utilities you pay. (6) UNIT CHOICE — 5 units: 1BRs at $2,965 (782 sqft, Aug 3 / Aug 16) or $3,159 ' +
      '(676 sqft, Aug 9); 2BR/1BAs at $3,389 (955 sqft, Aug 15 / Sep 30). This row tracks the cheapest+biggest ' +
      '1BR — tell me if you want a different one.',
    image: 'img/a20.webp',
    sourceUrl: 'https://www.zillow.com/apartments/san-mateo-ca/hillsdale-garden/5Zc8my/',
  },
  {
    // a21 — Private furnished 1BR suite, San Carlos (address UNDISCLOSED). APPROXIMATE geocode = the
    // San Carlos 94070 city/ZIP centroid (Nominatim, 2026-07-10) because the listing withholds the exact
    // address ("shared upon scheduling") — distance ranking is area-level, not rooftop. ✅ Reads LEGIT (NOT
    // a scam): priced AT/ABOVE market (scams bait below), specific grounded copy + real photos (a dog in the
    // shots), real Zillow metadata (zpid, 2 days on market, "last checked 4h ago"), private owner Edrica O.
    // It's a private upstairs in-law/ADU suite — SINGLE-OCCUPANT only, kitchenette (not a full kitchen).
    id: 'a21',
    status: 'New',
    title: 'Furnished 1BR Suite (single-occupant) — San Carlos',
    address: 'Undisclosed address, San Carlos, CA 94070 (shared after you schedule a tour)',
    neighborhood: '', // ~1 mi from downtown San Carlos / walk to Caltrain (no named neighborhood given)
    city: 'San Carlos',
    lat: 37.504936, // ⚠️ APPROXIMATE — San Carlos 94070 centroid; exact address is undisclosed
    lng: -122.261823,

    beds: 1,
    baths: 1,
    sqft: 800,
    floor: 'Upstairs', // "private upstairs 1-bedroom suite" with its own separate entrance

    rent: 3000, // "$3,000/mo" — furnished + ALL utilities + internet included (see notes); highest raw rent on your list
    parkingCost: null, // off-street parking included
    petRent: null, // n/a — no pets
    utilitiesIncluded: true, // "Utilities: all inclusive (electricity, gas, water, garbage) Free Internet" — a genuine plus
    utilitiesEstimate: null,

    deposit: null, // not stated ("Contact manager for more details")
    appFee: null, // not stated
    brokerFee: null,

    leaseTermMonths: null, // "Lease term: 1 Month" + "short term rental open to negotiate" — month-to-month/flexible
    minLeaseMonths: 1, // maximally flexible; a 6-mo stay is easily negotiable
    maxLeaseMonths: null, // open-ended / negotiable
    availableDate: '2026-09-20', // "Available Sun Sep 20 2026"
    availability: 'unknown', // date above wins for display
    furnished: true, // "Fully Furnished" / "Furnished: Yes"

    petPolicy: 'No pets', // "No pets" chip + "Pets allowed: No" — explicit (note: owner's own dog appears in photos)
    listingType: 'Landlord', // "Listed by property owner — Edrica O." (private owner, not a mgmt company)
    contact: { company: '', name: 'Edrica O.', phone: '', email: '', website: '' }, // private owner — inquire via Zillow
    comments: [
      { id: 'c1784088539286', text: 'Single occupant', ts: '2026-07-15T04:08:59.286Z' },
    ],

    laundry: 'in-unit', // "In unit laundry" chip + "Laundry: In Unit" + Washer/Dryer in appliances
    amen: {
      parking: true, // "Off street parking"
      woodenFloor: true, // "Flooring: Hardwood" + natural wood finishes
      balcony: null, // not mentioned — ask
      gym: false, // private in-law suite in a home — no community gym
    },
    amenities: ['Fully furnished', 'ALL utilities included (elec/gas/water/garbage)', 'Free internet', 'Private separate entrance', 'In-unit washer/dryer', 'Off-street parking', 'Heat pump + central heating', 'Window-unit A/C', 'Vaulted ceilings', 'Natural wood finishes + large windows', 'Rain shower + heated bidet toilet', 'Kitchenette (2-burner stove, under-counter fridge — no oven)', 'Walk to Caltrain · ~1 mi to downtown San Carlos'],

    dateSeen: '2026-07-10',
    daysOnMarket: 2, // "2 days on Zillow" · 4 contacts · listing updated Jul 8, 2026 — fresh + actively maintained
    marketRent: null, // deliberately null — a furnished, all-utilities-included single-occupant suite has no clean unfurnished comp (like a19); the key point is $3,000 is AT/ABOVE market here, i.e. NOT a bait price

    expertRating: 4, // strong FIT for a SOLO short stay: fully furnished + ALL utilities + free internet + flexible month-to-month + in-unit W/D + off-street parking + private entrance + walk to Caltrain + high-end bath, and reads legit; held from 5 by the SINGLE-OCCUPANT cap, KITCHENETTE-only (no oven), no pets, top-of-list $3,000, and the undisclosed address (area pin only)
    scamRisk: false,
    incomeRestricted: false,
    rating: 2,
    notes:
      '✅ Reads LEGITIMATE (I do NOT think this is a scam) — a private upstairs 1-bedroom in-law/ADU suite with ' +
      'its own separate entrance, listed by owner Edrica O. on a real Zillow home-detail page (2 days on market, ' +
      '4 contacts, last checked 4h ago). The usual scam tells are ABSENT: it\'s priced AT/ABOVE market (~$3,000, ' +
      'not a cheap bait), the copy is specific and grounded (heated bidet, 2-burner kitchenette, single occupant, ' +
      'the owner\'s dog in the photos), and the photos are one consistent real space. 🟢 GENUINE STRENGTHS for a ' +
      'short stay: FULLY FURNISHED, ALL utilities included (electricity, gas, water, garbage) + FREE internet, ' +
      'month-to-month / "short term open to negotiate" (your 6-mo goal fits easily), in-unit W/D, off-street ' +
      'parking, a private entrance, heat pump, and a high-end bathroom (rain shower + heated bidet) — walkable to ' +
      'Caltrain, ~1 mi from downtown San Carlos.\n' +
      'Know what this IS before you get attached: (1) 👤 SINGLE-OCCUPANT ONLY — explicitly "best suited for one ' +
      'occupant"; if you need room for a partner/guest, this is out. (2) 🍳 KITCHENETTE, not a full kitchen — a ' +
      '2-burner electric stove, sink, and an UNDER-COUNTER fridge, NO oven; fine for light cooking, limiting if ' +
      'you cook seriously. (3) NO PETS, NO smoking. (4) 💲 $3,000 is the highest raw rent on your list — but it ' +
      'bundles all utilities + internet + furniture, so vs an unfurnished unit where you\'d add those, the ' +
      'effective gap is smaller; I left market-rent "—" (no clean furnished comp), so don\'t read a flag into it. ' +
      '(5) 📍 ADDRESS IS UNDISCLOSED — the map pin is the San Carlos AREA (94070 centroid), not the exact ' +
      'building, so the distance number is approximate; the owner shares the address after you schedule.\n' +
      '🔒 Because it\'s a private owner with a withheld address, do the normal prudence: tour in person, confirm ' +
      'it\'s really their property, and NEVER wire a deposit before you\'ve seen it and signed a lease. (This is ' +
      'standard caution for any by-owner listing, not a red flag specific to this one.)',
    image: 'img/a21.webp',
    sourceUrl: 'https://www.zillow.com/homedetails/San-Carlos-CA-94070/15550757_zpid/',
  },
  {
    // a22 — South Mary Place Apartments, Sunnyvale. Rooftop geocode via Nominatim (2026-07-10,
    // "437, South Mary Avenue, Sunnyvale, 94086" — "apartments" match). ✅ Reads LEGIT — a Zillow
    // "Verified Source" (green check) managed community with a real unit table, floor plan, 8 photos, named
    // leasing agents, and an online portal. Tracked row = Unit 22 (the only listed unit: 1BR, 600 sqft, $2,355).
    id: 'a22',
    status: 'New',
    title: 'South Mary Place 1BR — Sunnyvale',
    address: '437 S Mary Ave, Sunnyvale, CA 94086',
    neighborhood: '',
    city: 'Sunnyvale',
    lat: 37.374724,
    lng: -122.048387,

    beds: 1,
    baths: 1,
    sqft: 600, // Unit 22
    floor: '',

    rent: 2355, // Unit 22 base rent (fees may apply); modestly under market for Sunnyvale (see marketRent)
    parkingCost: null, // covered parking included
    petRent: null, // pet-friendly (dogs + cats) but pet rent/deposit not captured — ask
    utilitiesIncluded: false, // only HOT WATER is included in rent; you pay gas heat + electric + the rest (like a18's "only garbage")
    utilitiesEstimate: null,

    deposit: null, // not stated
    appFee: null, // not stated
    brokerFee: null,

    leaseTermMonths: null, // offers both terms (see min/max)
    minLeaseMonths: 6, // "Lease terms: One year, Six months" — explicit 6-mo option, a direct fit for your goal
    maxLeaseMonths: 12,
    availableDate: '2026-07-15', // Unit 22 available Jul 15
    availability: 'unknown', // date above wins for display
    furnished: false,

    petPolicy: 'Allowed', // "Pet Friendly - Dogs and Cats are allowed"
    listingType: 'Property mgmt', // managed community, Zillow "Verified Source", (669) 322-2815 (local South Bay area code)
    contact: { company: 'South Mary Place Apartments', name: 'Leeonna Colter / Josie Hernandez', phone: '(669) 322-2815', email: '', website: '' }, // Verified Source; local 669 number
    comments: [],

    laundry: 'on-site', // "Laundry: Shared" — not in-unit
    amen: {
      parking: true, // "Covered Parking"
      woodenFloor: true, // "Flooring: Carpet, Laminate, Vinyl" — laminate is wood-style (per a16/a14 handling)
      balcony: null, // not mentioned — ask
      gym: false, // building amenities captured (pool, gazebo, storage, portal) but NO fitness center
    },
    amenities: ['Remodeled units', 'Updated appliances + granite/quartz counters', 'Double-pane windows', 'Dishwasher', 'Microwave', 'Swimming pool', 'Gazebo', 'Storage space', 'Covered parking', 'Hot water included', 'Online rent + maintenance portal', 'Ceiling fans (no A/C)', '$1,000 lease-completion bonus (see notes)'],

    dateSeen: '2026-07-10',
    daysOnMarket: null,
    marketRent: 2700, // Est. — Sunnyvale 1BR comp (Google/Caltrain-adjacent) for an older remodeled ~600 sqft unit; $2,355 is modestly under market (a genuine value, not a bait)

    expertRating: 4, // strong practical VALUE + FIT: explicit 6-mo lease (your goal), modestly under-market $2,355 in pricey Sunnyvale, remodeled w/ granite/quartz + double-pane, covered parking, pool, storage, pet-friendly, prime Google/Caltrain/VTA location, $1k lease-completion bonus; held from 5 by shared (not in-unit) laundry, ceiling-fan-only cooling (no A/C), no gym, basic 600 sqft w/ carpet/vinyl
    scamRisk: false,
    incomeRestricted: false,
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — a Zillow "Verified Source" (green check) managed community (South Mary Place) with ' +
      'a real unit table, floor plan, 8 photos, named leasing agents (Leeonna Colter / Josie Hernandez), an ' +
      'online rent + maintenance portal, and a LOCAL (669) South Bay number — the opposite of the a1/a2 scam ' +
      'pattern. 🟢 STANDOUT FITS: an explicit SIX-MONTH lease option (a direct match for your goal) and a ' +
      'modestly UNDER-MARKET $2,355 in pricey, Google/Caltrain/VTA-adjacent Sunnyvale — a genuine value. Units ' +
      'are remodeled (updated appliances, kitchen cabinets, granite/quartz counters, double-pane windows), with ' +
      'covered parking, a pool, a gazebo, and storage space; pet-friendly (dogs + cats). 🎁 SPECIAL OFFER: ' +
      '"$1,000 bonus once you complete your lease term" — nice, but note it pays out only AFTER you finish the ' +
      'term (subject to terms); confirm whether a 6-mo term qualifies or only the 12-mo.\n' +
      'Confirm before signing: (1) LAUNDRY is shared/on-site, NOT in-unit. (2) COOLING is a ceiling fan only — ' +
      'there is NO A/C (heat is gas); ask if that matters to you in a Sunnyvale summer. (3) UTILITIES — only HOT ' +
      'WATER is included; you pay gas heat + electric + the rest, so budget those on top of $2,355. (4) No gym. ' +
      '(5) Basic finishes for the size (600 sqft, carpet/laminate/vinyl). (6) Deposit, application fee, and pet ' +
      'rent/deposit are not stated — ask for exact move-in + monthly pet costs. (7) Office is appointment-based ' +
      'on weekends (Mon–Fri 9–5; Sat/Sun by appointment) — plan a tour accordingly.',
    image: 'img/a22.webp',
    sourceUrl: 'https://www.zillow.com/apartments/sunnyvale-ca/south-mary-place-apartments/5j4SxB/',
  },
  {
    // a23 — Station 245, Mountain View (Old Mountain View). Rooftop geocode via Nominatim (2026-07-10,
    // "245, Bush Street, Mountain View, 94041" — house match). ✅ Reads LEGIT — a Zillow "Verified Source"
    // (green check) managed community (Rutherford Management Company) with a real unit row. Tracked = the
    // 1X1 (1BR, 620 sqft, $2,350, available Now). Photo pulled at _1152 (higher-res than the _384 you gave).
    id: 'a23',
    status: 'New',
    title: 'Station 245 1BR — Mountain View',
    address: '245 Bush St, Mountain View, CA 94041',
    neighborhood: 'Old Mountain View',
    city: 'Mountain View',
    lat: 37.391881,
    lng: -122.075878,

    beds: 1,
    baths: 1,
    sqft: 620, // Unit 1X1
    floor: '',

    rent: 2350, // Unit 1X1 base rent (fees may apply); well under market for Old Mountain View (see marketRent)
    parkingCost: null, // carport parking included
    petRent: null, // pet-friendly (dogs + cats, 2 each) but pet rent/deposit not stated — ask
    utilitiesIncluded: null, // not stated
    utilitiesEstimate: null,

    deposit: null, // not stated
    appFee: null, // not stated
    brokerFee: null,

    leaseTermMonths: null, // a wide menu of terms (see min/max)
    minLeaseMonths: 3, // "Lease terms: 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 months" — as short as 3 mo; the 6-mo you want is squarely in range
    maxLeaseMonths: 12,
    availableDate: '', // "Available Now"
    availability: 'now', // Unit 1X1 available Now
    furnished: false,

    petPolicy: 'Allowed', // Dogs Allowed (2) + Cats Allowed (2)
    listingType: 'Property mgmt', // Rutherford Management Company (Leasing Agent), Zillow "Verified Source"
    contact: { company: 'Rutherford Management Company', name: 'Leasing Agent', phone: '', email: '', website: '' }, // Verified Source; no phone published — inquire via Zillow
    comments: [],

    laundry: 'on-site', // "Laundry: Shared" — not in-unit
    amen: {
      parking: true, // carport parking (Unit Features: Parking)
      woodenFloor: true, // "all homes include wood-style flooring"
      balcony: null, // not mentioned — ask
      gym: false, // building amenities captured (pool, shared laundry) but NO fitness center
    },
    amenities: ['Wood-style flooring', 'Swimming pool', 'Carport parking', 'Generous storage', 'In-home heater (no A/C)', 'Stainless-steel appliances (select units)', 'Walk to downtown MV / Castro St / Caltrain', 'Easy access to US-101 + SR-82'],

    dateSeen: '2026-07-10',
    daysOnMarket: null,
    marketRent: 2850, // Est. — Old Mountain View 1BR comp (prime walkable location near downtown + Caltrain); $2,350 is well under market (a genuine value — the "why" is the older/basic complex, not a bait)

    expertRating: 4, // one of your best VALUE + FLEXIBILITY picks: an exceptionally wide 3–12 mo lease menu (your 6-mo goal fits easily, even shorter possible), well under-market $2,350 in prime Old Mountain View (walk to downtown/Castro St/Caltrain), wood-style floors, pool, carport parking, storage, pet-friendly, available Now; held from 5 by shared (not in-unit) laundry, wall/in-home heat + NO A/C, carport (not garage), basic older complex, small 620 sqft
    scamRisk: false,
    incomeRestricted: false,
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — a Zillow "Verified Source" (green check) managed community (Station 245, run by ' +
      'Rutherford Management Company) with a real unit row — the opposite of the a1/a2 scam pattern. 🟢 TWO BIG ' +
      'WINS FOR YOU: (a) an exceptionally FLEXIBLE lease — they list 3, 4, 5, 6, 7, 8, 9, 10, 11, and 12-month ' +
      'terms, so your 6-mo goal fits with zero negotiation (and you could even go shorter); (b) it\'s WELL UNDER ' +
      'MARKET at $2,350 for a 620 sqft 1BR in prime OLD MOUNTAIN VIEW — a walkable neighborhood near downtown ' +
      'MV, Castro St dining, and Caltrain, with easy US-101/SR-82 access. Wood-style flooring throughout, a ' +
      'swimming pool, carport parking, generous storage, pet-friendly (dogs + cats, 2 each), available NOW. The ' +
      'card shows a mild "rent well below market — verify why" info flag; the honest "why" here is simply that ' +
      'it\'s an older, basic complex (see caveats), NOT a bait — the price is real.\n' +
      'Confirm before signing: (1) LAUNDRY is shared/on-site, NOT in-unit. (2) HEAT/COOLING — "in-home heaters" ' +
      '(likely wall heaters) and NO A/C mentioned; ask about summer cooling. (3) PARKING is a CARPORT (covered ' +
      'space, not a garage) — confirm it\'s included + assigned. (4) STAINLESS appliances are "select units" ' +
      'only — confirm the actual unit you\'d get. (5) Basic older complex, small 620 sqft — value + location, ' +
      'not luxury. (6) Deposit, application fee, utilities, and pet rent/deposit are not stated — ask for exact ' +
      'move-in + monthly costs.',
    image: 'img/a23.webp',
    sourceUrl: 'https://www.zillow.com/apartments/mountain-view-ca/station-245/5ZtKYB/',
  },
  {
    // a24 — Belmont Family Apartments, Belmont (Central). Rooftop geocode via Nominatim (2026-07-10,
    // "803, Belmont Avenue, Belmont, 94002"). ✅ Reads LEGIT — a Zillow "Verified Source" (green check)
    // managed community. ⚠️ TWO HARD GATES: (1) INCOME-RESTRICTED affordable housing (must income-qualify,
    // like a20); (2) BRAND-NEW, UNDER CONSTRUCTION — the description says it opens **Summer 2026** (units show
    // "Now" but it's pre-leasing, not move-in-ready). Also NO PETS + no stated lease term. Photo pulled at
    // _1152 (higher-res than the _576 you gave). Tracked = the 1BR (540 sqft, $2,278 — all 5 shown units).
    id: 'a24',
    status: 'Ruled out', // user-ruled-out 2026-07-16 — income-restricted eligibility gate (baked from the PC overlay)
    title: 'Belmont Family Apts 1BR (income-restricted) — Belmont',
    address: '803 Belmont Ave, Belmont, CA 94002',
    neighborhood: 'Central',
    city: 'Belmont',
    lat: 37.527063,
    lng: -122.285525,

    beds: 1,
    baths: 1,
    sqft: 540, // all 5 listed 1BR units (310/408/403/303/406) are 540 sqft @ $2,278
    floor: '',

    rent: 2278, // all listed 1BR units $2,278 (an AMI-set affordable rent, not a market rent — see marketRent)
    parkingCost: null, // parking lot + EV spaces — no separate charge stated
    petRent: null, // n/a — no pets
    utilitiesIncluded: null, // not stated
    utilitiesEstimate: null,

    deposit: null, // not stated
    appFee: null, // not stated
    brokerFee: null,

    leaseTermMonths: null, // NO lease terms shown — affordable housing is typically 12-mo (fires the "confirm 6-mo" flag)
    minLeaseMonths: null,
    maxLeaseMonths: null,
    availableDate: '', // units say "Now" but the building is UNDER CONSTRUCTION, opening Summer 2026 — not move-in-ready
    availability: 'unknown', // deliberately not 'now' — pre-leasing an unbuilt community; the notes carry the real timing
    furnished: false,

    petPolicy: 'No pets', // "Dogs are not allowed" + "Cats are not allowed" — both explicit
    listingType: 'Property mgmt', // Belmont Family Apartments Asset Management, Zillow "Verified Source", (646) 791-3446
    contact: { company: 'Belmont Family Apartments (Asset Mgmt)', name: '', phone: '(646) 791-3446', email: '', website: '' }, // Verified Source; note: 646 = a NYC area code (out-of-state affordable-housing owner — common, not a red flag given Verified Source)
    comments: [
      { id: 'c1784194144364', text: 'Nice location. Next to a square.', ts: '2026-07-16T09:29:04.364Z' },
    ],

    laundry: 'on-site', // "Shared: Communal Laundry Room" — not in-unit
    amen: {
      parking: true, // parking lot + EV parking spaces
      woodenFloor: true, // "Vinyl Plank Flooring Throughout" — wood-look LVP (like a14's wood-vinyl)
      balcony: null, // not mentioned — ask
      gym: true, // "Fitness Center"
    },
    amenities: ['Brand-new construction (opens Summer 2026)', 'Central A/C + heat', 'Vinyl plank flooring', 'Clubhouse', 'Fitness center', 'Lobby lounge', 'Communal office space', 'Homework room', 'BBQ common area', 'Playground', 'EV parking spaces', 'Parking lot'],

    dateSeen: '2026-07-10',
    daysOnMarket: null,
    marketRent: null, // deliberately null — affordable-housing rent is set by an AMI formula, not the open market, so a "market" comp would be apples-to-oranges (the low rent is the program, gated behind income-qualifying — not a market deal)

    expertRating: 3, // the BUILDING is genuinely nice — brand-new, central A/C (rare on your list!), clubhouse/gym/lounge, contemporary, and cheap. But for a SOLO, FLEXIBLE 6-MONTH stay it's a weak fit: (1) income-restricted (must qualify), (2) NOT OPEN YET (under construction, Summer 2026), (3) NO pets, (4) no stated lease term (affordable = usually 12-mo, not 6), (5) family-oriented (playground/homework room) + likely a lottery/waitlist application. Rating reflects FIT, not build quality
    scamRisk: false,
    incomeRestricted: true, // affordable/AMI property — must income-qualify (the red flag; details in notes)
    rating: 4,
    notes:
      '⚠️ READ FIRST — this has TWO hard gates that make it a weak fit for your solo, flexible 6-month search, ' +
      'even though the building itself is nice: (A) INCOME-RESTRICTED affordable housing — you must ' +
      'income-QUALIFY (an affordable/AMI program usually caps your MAX income; "may have additional eligibility ' +
      'criteria"). (B) NOT OPEN YET — it\'s "currently under construction and anticipated to open Summer 2026"; ' +
      'the units show "Now" but that\'s PRE-LEASING an unbuilt community, so real move-in timing + a likely ' +
      'lottery/waitlist application are unknowns. Use their site/leasing office to check eligibility + the actual ' +
      'open date BEFORE investing time.\n' +
      '✅ Otherwise LEGITIMATE — a Zillow "Verified Source" (green check) community (Belmont Family Apartments, ' +
      'Central Belmont). The build is a real plus: brand-new contemporary interiors, 🟢 CENTRAL A/C + heat (rare ' +
      'on your list — most of your others have wall heat / no A/C), vinyl-plank floors, a clubhouse (Zillow: <11% ' +
      'of Belmont buildings have one), fitness center, lobby lounge, communal office space, BBQ area, playground, ' +
      'and EV parking — at a low $2,278 for a 540 sqft 1BR. (I left market-rent blank on purpose: affordable rent ' +
      'is set by an AMI formula, not the open market, so it isn\'t a "market deal" — it\'s a program price gated ' +
      'behind qualifying.)\n' +
      'Confirm before you invest time: (1) LEASE — no term is stated; affordable housing is usually 12-mo, so ' +
      'confirm whether a 6-mo term is even possible (the card shows the amber "confirm they\'ll do 6 mo" flag). ' +
      '(2) 🐾 NO PETS — dogs AND cats disallowed (dealbreaker if you have one). (3) FAMILY-ORIENTED — it\'s ' +
      '"Belmont FAMILY Apartments" with a playground + homework room; the unit is fine solo, but the community ' +
      'is aimed at families. (4) LAUNDRY is shared/communal, NOT in-unit. (5) Small 540 sqft. (6) Deposit, ' +
      'application fee, utilities not stated. (7) Contact is a NYC (646) number — an out-of-state affordable ' +
      'housing owner (common; not a red flag given Verified Source), but confirm the local Belmont leasing path.',
    image: 'img/a24.webp',
    sourceUrl: 'https://www.zillow.com/apartments/belmont-ca/belmont-family-apartments/9NGwRq/',
  },
  {
    // a25 — 432 Lincoln Cir, Millbrae. Rooftop geocode via Nominatim (2026-07-10, "432, Lincoln Circle,
    // Millbrae, 94030"). Source is CRAIGSLIST (by-owner) — so triaged carefully, and it reads clearly LEGIT
    // (NOT a scam): FULL street address + real map pin + a real photo of the actual building, price is
    // fair/at-market (not a cheap bait), grounded specific copy (2nd-floor corner unit, extra storage in
    // the laundry room), and a standard small-landlord application (income/credit/refs, tour by appt — no
    // up-front fee, no wire-money, no off-platform push). Photo pulled at 1200x900 (first .jpg on the list).
    id: 'a25',
    status: 'Gone', // user-marked 2026-07-17 — "someone paid security deposit," likely no longer available (baked from the PC overlay)
    title: 'Bright 1BR (2nd-floor, balcony) — Millbrae',
    address: '432 Lincoln Cir, Millbrae, CA 94030',
    neighborhood: '', // across from Central Park & Rec Center, near Richmond Dr (no named neighborhood)
    city: 'Millbrae',
    lat: 37.600618,
    lng: -122.400416,

    beds: 1,
    baths: 1,
    sqft: 675,
    floor: '2nd floor', // "located on the 2nd floor, at the corner of the building" — corner unit, lots of light

    rent: 2450, // "$2,450/mo"; fair-to-slightly-under market for Millbrae (see marketRent)
    parkingCost: null, // "1 covered parking space" included (carport)
    petRent: null, // n/a — no pets
    utilitiesIncluded: true, // "We pay for water and garbage" — WATER + GARBAGE included; tenant pays gas/electric/cable/internet (see notes)
    utilitiesEstimate: null,

    deposit: 2450, // "1st month $2,450 plus $2,450 security deposit" — equal deposit
    appFee: null, // credit report required but no fee amount stated
    brokerFee: null,

    leaseTermMonths: null, // "Contract is month to month, by default, but can be modified based on your needs"
    minLeaseMonths: 1, // month-to-month by default — maximally flexible; a 6-mo term is explicitly negotiable
    maxLeaseMonths: null, // modifiable / open-ended
    availableDate: '', // "available now"
    availability: 'now',
    furnished: false,

    petPolicy: 'No pets', // "No pets, no smoking of any kind, no drugs, no vaping, no sublease" — explicit
    listingType: 'Landlord', // craigslist by-owner; no company/name published — contact via the CL email relay
    contact: { company: '', name: '', phone: '', email: '', website: '' }, // no contact published — email via craigslist to set up an appointment
    comments: [
      { id: 'c1784330653219', text: 'Someone paid security deposit. so likely no longer available', ts: '2026-07-17T23:24:13.219Z' },
    ],

    laundry: 'on-site', // "laundry in bldg" / "laundry in the building" (+ an extra storage closet in the laundry room) — not in-unit
    amen: {
      parking: true, // "1 covered parking space" / carport
      woodenFloor: null, // flooring not described (granite counters are, floors aren't) — ask
      balcony: true, // "a balcony off the living room"
      gym: false, // small apartment building — no building gym (the "Recreation Center" across the street is a public park facility, not a building amenity)
    },
    amenities: ['Private balcony (off living room)', '1 covered parking space', 'Granite countertops', 'Lots of closet space + extra storage in laundry room', 'Water + garbage included', 'Heater', 'Across from Central Park + Rec Center', 'Near BART · 101 · downtown Millbrae · SFO'],

    dateSeen: '2026-07-10',
    daysOnMarket: null, // craigslist doesn't surface a days-on-market count
    marketRent: 2700, // Est. — Millbrae 1BR comp (BART + SFO-adjacent Peninsula city); $2,450 is fair, modestly under market — reinforces this is NOT a cheap-bait scam

    expertRating: 4, // strong, flexible FIT: reads clearly legit + full address, month-to-month (modifiable — fits your 6-mo goal), fair/under-market $2,450, a private balcony, 1 covered parking space, granite counters, water+garbage included, corner unit w/ lots of light, and a prime location (across from Central Park, near BART/101/downtown Millbrae, minutes to SFO); held from 5 by shared (not in-unit) laundry, NO pets, heater-only (no A/C), and standard by-owner/craigslist verify-in-person caution
    scamRisk: false,
    incomeRestricted: false, // market-rate by-owner rental — no income cap
    rating: 4,
    notes:
      '✅ Reads LEGITIMATE (I do NOT think this is a scam), despite being a by-owner CRAIGSLIST post — which I ' +
      'triaged carefully. The scam tells are ABSENT and the legit signals are strong: it gives a FULL street ' +
      'address (432 Lincoln Cir) with a real map pin + a photo of the actual building; the price ($2,450) is ' +
      'fair/at-market for Millbrae, NOT a cheap bait; the copy is specific and grounded (2nd-floor corner unit, ' +
      'across from Central Park, granite counters, extra storage in the laundry room, 1 covered space); and the ' +
      'application is a standard small-landlord flow (proof of income, credit report, verifiable references, 3× ' +
      'income, valid ID, tour by appointment) with NO up-front holding fee, NO wire-money ask, and NO ' +
      'off-platform push. 🟢 GOOD FITS FOR YOU: MONTH-TO-MONTH by default and explicitly "can be modified based ' +
      'on your needs" (so a 6-mo term is negotiable), a private BALCONY off the living room, 1 COVERED parking ' +
      'space, granite counters, water + garbage included, and a prime spot — across from Central Park, near BART ' +
      '+ 101 + downtown Millbrae, minutes to SFO. Occupancy up to 3, so fine solo.\n' +
      'Confirm before signing: (1) UTILITIES — water + garbage are included, but YOU pay gas + electric + cable ' +
      '+ internet (heat is a gas/electric heater), so budget those on top of $2,450. (2) NO PETS (and no ' +
      'smoking/vaping/subletting). (3) LAUNDRY is in-building/shared, NOT in-unit. (4) Heater only — no A/C ' +
      'mentioned. (5) Move-in = $2,450 first month + an equal $2,450 deposit; no application fee is stated ' +
      '(they ask for a credit report). (6) 🔒 BY-OWNER PRUDENCE (standard for any craigslist listing, not a red ' +
      'flag specific to this one): tour in person, confirm the landlord actually controls the unit, and never ' +
      'wire a deposit before you\'ve seen it and signed a lease.',
    image: 'img/a25.jpg',
    sourceUrl: 'https://www.craigslist.org/view/d/millbrae-bedroom-apartment-for-rent-2450/jT6US1kCMBURYGH6tuLhSX',
  },
  {
    // a26 — Peninsula Pines Apartments, South San Francisco (Orange Park). FIRST listing captured via the
    // in-app BROWSER rather than a screenshot (2026-07-16) — so the whole page was read, incl. the fee tabs,
    // FAQ, and the published neighborhood rent averages. Photo also pulled through the browser (apartments.com
    // 403s server-side image fetches). Rooftop geocode via Nominatim; lat/lng = midpoint of the 842/858 range.
    // ✅ LEGIT — apartments.com "Verified Listing" (CoStar), Property Manager on Site, 4.0/5 (n=5).
    // Tracked = The Bishop Pine / Unit 836-D — the only EXACT-1BR plan and the cheapest plan meeting 1+ bd.
    id: 'a26',
    status: 'New',
    title: 'Peninsula Pines 1BR — South San Francisco',
    address: '842-858 Antoinette Ln, South San Francisco, CA 94080',
    neighborhood: 'Orange Park',
    city: 'South San Francisco',
    lat: 37.655286,
    lng: -122.43273,

    beds: 1,
    baths: 1,
    sqft: 650, // The Bishop Pine / Unit 836-D
    floor: '', // not stated — and the building is a tagged "Walk-Up" (3 stories), so the unit's level matters; ask

    rent: 2803, // Unit 836-D BASE rent. NOT confirmed to be the 6-mo price, and excludes required move-in/out charges (see notes)
    parkingCost: null, // Parking fees tab says only "Covered" with NO price; FAQ: "Contact this property for details" — cost unknown, NOT confirmed included
    petRent: 65, // DOG rate (worst case). Cats are $35/mo. Deposits: dog $500, cat $300 (1) / $400 (2). Plus a $25/animal ANNUAL pet-screening fee
    utilitiesIncluded: false, // FAQ verbatim: "Utilities are not included in rent." — fires the budget-extra flag
    utilitiesEstimate: null, // no number published; the base-rent asterisk mentions "variable or usage-based fees" (RUBS-style passthrough)

    deposit: null, // "Varies by unit" — genuinely unknown, and the page concedes further unnamed required move-in charges
    appFee: 50, // "$50 Per APPLICANT" (not per application) — 2 adults = $100
    brokerFee: null, // not stated (direct property-manager listing; the Required Fees tab lists no broker fee)

    leaseTermMonths: null, // a wide menu (see min/max) — but NO term-based pricing is published (see notes)
    minLeaseMonths: 3, // "Lease Options: 3 - 13 Month Leases" — your 6-mo goal sits squarely inside
    maxLeaseMonths: 13,
    availableDate: '2026-08-23', // Unit 836-D — 38 days out; the ONLY 1BR unit listed (see notes)
    availability: 'unknown', // the valid date above wins for display
    furnished: false,

    petPolicy: 'Allowed', // Dogs + Cats — BUT dogs have a hard 30 lb weight limit (see notes)
    listingType: 'Property mgmt', // apartments.com "Verified Listing" (CoStar); Property Manager on Site
    contact: { company: 'Peninsula Pines Apartments', name: '', phone: '(415) 993-7697', email: '', website: '' },
    comments: [
      { id: 'c1784330621190', text: 'The landlord doesn\'t allow any families or friends to use amenities. \nParking is extremely limited -- no more parking after 3 pm', ts: '2026-07-17T23:23:41.190Z' },
    ],

    laundry: 'on-site', // FAQ verbatim: "does not provide in-unit laundry, on-site laundry facilities are available for shared resident use"
    amen: {
      parking: true, // covered parking exists ("Covered") — but cost/assignment unstated; treat as present, not free
      woodenFloor: null, // unknown for THIS unit: Apartment Features say "Carpet" + blurb says "berber-style carpeting"; the "wood-look flooring" text describes a 2BR TOWNHOUSE tour, not the 1BR
      balcony: true, // "Balcony" in both Highlights and Apartment Features
      gym: true, // "Fitness Center"
    },
    amenities: ['Gas fireplace', 'Balcony', 'Covered parking (cost unstated)', 'Fitness center', 'Spa', 'Clubhouse', 'Cabana', 'Gated', 'Grill/BBQ', 'Playground', 'Storage space', 'Dishwasher', 'Microwave', 'Disposal', 'Crown molding', 'High-speed internet ready', 'Cable ready', 'Smoke Free (building-wide policy)', 'Walk-up — 3 stories, no elevator', '7 Matterport 3D tours'],

    dateSeen: '2026-07-16',
    daysOnMarket: null,
    marketRent: 2581, // The page's OWN published "Orange Park" 1BR average (the building's actual neighborhood). Fires the over-market warn (~$222 / +8.6%). Deliberate — see notes for why this comp over the $3,262 city figure, and for the dissenting view.

    expertRating: 3, // The 4-rated siblings (a22, a23) earn it by pairing a flexible short lease WITH a price advantage. Peninsula Pines nails the lease half (3-13 mo is arguably the best menu on your list) and INVERTS the price half: $2,803 is 8.6% ABOVE its own neighborhood's 1BR average, utilities excluded, no in-unit laundry, 1964 walk-up. Good building, wrong side of the price line.
    scamRisk: false,
    incomeRestricted: false,
    rating: 2,
    notes:
      '✅ LEGITIMATE — an apartments.com "Verified Listing" (CoStar) with a Property Manager on Site, 74 photos, ' +
      '7 Matterport 3D tours, and a real per-unit table. Captured by reading the LIVE page (not a screenshot), so ' +
      'the fee tabs + FAQ below are verbatim. 🟢 THE REAL STRENGTH: a 3-13 MONTH lease menu — your 6-mo goal fits ' +
      'with zero negotiation, arguably the best lease flexibility on your list. Nice building for the money: gas ' +
      'fireplace, balcony, covered parking, fitness center, spa, clubhouse, cabana, gated, grill, storage, ' +
      'dishwasher, smoke-free. Walk 10 min to Kaiser, 1 min to shopping; BART 1.1 mi, SFO 5.1 mi.\n' +
      '💲 THE PRICE IS THE PROBLEM — and the page proves it against ITSELF. It publishes its own neighborhood ' +
      'averages, and this property prices ABOVE the Orange Park average at EVERY bed count (studio +2.0%, 1BR ' +
      '+8.6%, 2BR +4.7%, 3BR +10.5%) while looking "cheap" against the wider SSF city average only because that ' +
      'city figure is inflated by newer East-of-101 biotech stock. So I benchmarked against Orange Park ($2,581 ' +
      '1BR avg) — the card\'s "~$222 over market" flag is real, not an artifact. Worse: your tracked 1BR is the ' +
      'WORST-VALUE plan in the building ($4.31/sqft vs the 900 sqft 2BR at $3.58). Counterpoint, in fairness: an ' +
      'unadjusted neighborhood mean ignores this property\'s amenity bundle, so a fair "adjusted" comp might be ' +
      '~$2,730 (which would fire no flag) — i.e. you may simply be paying a real premium for the pool/spa/gym. ' +
      'And note there are NO rent specials ("not currently offering any"), so the premium is deliberate, not stale.\n' +
      '⚠️ Things the listing does NOT tell you (ask before you spend the $50): (1) 🎯 THE PRICE MAY NOT BE THE ' +
      '6-MONTH PRICE — they publish a 3-13 mo menu but NO term-based pricing; short terms usually carry a ' +
      'premium, so confirm what a 6-mo term actually costs. This is the single biggest unknown, since the lease ' +
      'flexibility is the whole reason this listing fits you. (2) 💸 HIDDEN MOVE-IN/OUT COST — the deposit ' +
      '"Varies by unit" AND the fine print concedes "required charges due at or prior to move-in or at move-out" ' +
      'that it never names; on a 6-mo stay those amortize over 6 months, not 12, so they bite twice as hard. ' +
      'Utilities are NOT included either. The $50 app fee is PER APPLICANT — and you must pay it before you can ' +
      'learn the real move-in cost. (3) 📅 ONE UNIT, 38 DAYS OUT — Unit 836-D is the ONLY 1BR listed in a ' +
      '210-unit building, available Aug 23. If it goes, this listing is dead, not delayed; and you\'d wait ~5.5 ' +
      'weeks (~20% of a 6-mo stay) before the clock starts. 💡 Live alternative: the Monterey Pine 2BR, $3,224, ' +
      '900 sqft, available NOW — +$421/mo for +250 sqft and an extra room, 5 weeks sooner, and it\'s the only ' +
      'plan priced UNDER the neighborhood average.\n' +
      'Also confirm: (4) 🐕 DOGS HAVE A HARD 30 LB LIMIT (the page contradicts itself — Pets tab says ' +
      '"Restrictions: None", the FAQ says breed/weight restrictions may apply). Dog $65/mo + $500 dep; cat ' +
      '$35/mo + $300; plus a $25/animal ANNUAL screening fee. (5) LAUNDRY is shared/on-site, NOT in-unit. ' +
      '(6) 🪜 "Walk-Up" is a tagged fact — 3 stories, no elevator, and 836-D\'s floor is unpublished; on a ' +
      'short stay you haul in and out twice as often. (7) 🚗 PARKING is "Covered" but with NO price and "contact ' +
      'for details" — do not assume it\'s free/assigned. The page implies car-dependence (Drivability 90 vs ' +
      'Transit 50, and BART is quoted as a 2-min DRIVE, not a walk). (8) 🔥 NO heating or A/C appears anywhere ' +
      'in Apartment Features — only the gas fireplace. An Aug 23 start on a 6-mo term runs through late ' +
      'February, and utilities are on you; ask what actually heats the unit. (9) The 4.0 rating is only 5 ' +
      'reviews on 210 units, and bimodal (3x5-star + 1x1-star) — thin signal. (10) Building is 1964.',
    // EXTERIOR shot (user preference: show the building, not the interior). NOTE apartments.com's
    // "building-photo.jpg" filename is a generic bucket, NOT an exterior marker — 34 of the 35
    // "building-photo" hashes on this page are interiors. Had to eyeball a contact sheet to find a real
    // one. This shot also visually confirms the carports ("Parking: Covered"). Carries a RealPage watermark
    // (kept intact — it's the property's own marketing photo).
    image: 'img/a26.webp',
    sourceUrl: 'https://www.apartments.com/peninsula-pines-apartments-south-san-francisco-ca/f19cymv/',
  },
  {
    // a27 — Cozy 2BR/1BA ADU, San Mateo (West Hillsdale / Laurelwood). Source = CRAIGSLIST by-owner ADU,
    // triaged carefully and reads clearly LEGIT (NOT a scam): at/near-market price (not a cheap bait),
    // grounded specific copy, and 5 REAL, CONSISTENT remodel photos that MATCH the description exactly
    // (stainless kitchen + stacked in-unit W/D, marble walk-in shower + LED mirror, wood-look-floor rooms +
    // closet) — the opposite of scraped stock. Geocode = the craigslist map pin (37.531936,-122.308480,
    // accuracy 20 ≈ street-level fuzz) — APPROXIMATE, since ADUs list a general area, not a house number.
    // ⚠️ NO EXTERIOR PHOTO exists (owner shot only the unit — it's attached to their home); hero = the
    // kitchen (the most informative interior). Craigslist images fetch fine server-side (unlike apartments.com).
    id: 'a27',
    status: 'New',
    title: 'Remodeled ADU (2BR/office) — San Mateo',
    address: 'W Hillsdale Blvd area (Laurelwood), San Mateo, CA 94403 (exact address shared on inquiry)',
    neighborhood: 'Laurelwood',
    city: 'San Mateo',
    lat: 37.531936, // ⚠️ APPROXIMATE — the craigslist pin (accuracy 20), not a rooftop; exact address withheld
    lng: -122.30848,

    beds: 2, // a "2BR" but 550 sqft — one room is smaller, "could be used as an office" (effectively 1BR + den)
    baths: 1,
    sqft: 550,
    floor: '', // ground-level ADU attached to the main house, private backyard entrance

    rent: 2600, // "$2,600/month"; at/near market for a small San Mateo ADU (see marketRent)
    parkingCost: null, // street parking only — no dedicated/paid space
    petRent: null, // pets not mentioned
    utilitiesIncluded: false, // "Utilities (electric/water/garbage) split by headcount" — you pay a SHARE (unusual; see notes) → budget-extra flag
    utilitiesEstimate: null,

    deposit: 2600, // "Deposit: $2,600" — equal to one month
    appFee: null, // "Application required (credit score + payroll info)" — no fee amount stated
    brokerFee: null,

    leaseTermMonths: null, // NO lease term stated ("rent period: monthly" is the rent cadence, not the term) → amber "confirm 6-mo" flag
    minLeaseMonths: null,
    maxLeaseMonths: null,
    availableDate: '', // "available now"
    availability: 'now',
    furnished: false,

    petPolicy: 'Unknown', // not stated — ADUs often no-pets; confirm
    listingType: 'Landlord', // by-owner ADU; the owner lives in the attached main house (contact via the CL email relay)
    contact: { company: '', name: '', phone: '', email: '', website: '' }, // no name/phone published — email via craigslist
    comments: [],

    laundry: 'in-unit', // photo shows a stacked washer/dryer INSIDE the unit + description says "in-unit laundry" (the CL category line "laundry in bldg" is overridden by the photo)
    amen: {
      parking: false, // street parking only — no dedicated space (drives the "No parking" flag)
      woodenFloor: true, // light wood-look plank flooring throughout the photos
      balcony: null, // not mentioned (has a private backyard entrance, not a balcony) — ask
      gym: false, // private ADU — no gym
    },
    amenities: ['Fully remodeled', 'Stainless steel appliances', 'In-unit stacked washer/dryer', 'Walk-in shower + LED mirror', 'Recessed LED lighting', 'Wood-look floors', 'Private backyard entrance', '2nd room usable as office (WFH)', 'Fast Wi-Fi available', 'Near CSM · Hillsdale + Laurelwood shops · Hwy 92/101'],

    dateSeen: '2026-07-21',
    daysOnMarket: 8, // "Posted 8 days ago"
    marketRent: 2700, // Est. — small San Mateo ADU/1BR comp; $2,600 is at/near market (a fair price, NOT a cheap-bait — reinforces it's not a scam)

    expertRating: 3, // solid but CONSTRAINED: legit + fully remodeled + a genuine 2nd room usable as a home office (real plus for a founder) + IN-UNIT laundry + available now + central San Mateo (CSM, 92/101). Held down by: TINY 550 sqft, NO parking (street only), utilities SPLIT BY HEADCOUNT (unpredictable), "some noise from main house", NO stated lease term, at-market (not a deal), and a general-area address
    scamRisk: false,
    incomeRestricted: false,
    rating: 0,
    notes:
      '✅ Reads LEGITIMATE (I do NOT think this is a scam), despite being a by-owner CRAIGSLIST ADU — which I ' +
      'triaged carefully. The scam tells are ABSENT and the legit signals are strong: the price ($2,600) is ' +
      'at/near market for a small San Mateo ADU (NOT a cheap bait); the copy is specific and grounded; and — the ' +
      'clincher — its 5 photos are REAL and CONSISTENT and MATCH the description exactly (a remodeled stainless ' +
      'kitchen with a stacked in-unit washer/dryer, a marble walk-in shower with an LED mirror, and wood-look ' +
      'floored rooms with a closet), not the scraped luxury-stock a scam reuses. Screening is a standard ' +
      'owner flow (credit score + payroll, email your headcount/occupation/move-in date) with NO up-front fee, ' +
      'NO wire-money ask, and NO off-platform push. 🟢 WHAT\'S GOOD FOR YOU: fully remodeled + move-in-ready, a ' +
      'genuine SECOND ROOM you can use as a home OFFICE (nice for a founder), IN-UNIT laundry (rare on your ' +
      'list), available now, and a central San Mateo spot near the College of San Mateo, Hillsdale + Laurelwood ' +
      'shopping, and Hwy 92/101.\n' +
      'Know what this IS before you get attached: (1) 📐 TINY — 550 sqft for a "2BR"; the second bedroom is a ' +
      'small office/den, so treat it as a 1BR-plus-nook, not two real bedrooms. (2) 🚗 NO PARKING — street only ' +
      '("plenty of street parking," but nothing dedicated); the card shows a No-parking flag. (3) 💡 UTILITIES ' +
      'ARE SPLIT BY HEADCOUNT — you pay a SHARE of electric/water/garbage based on total occupants across the ' +
      'ADU + main house, which is unusual and can be unpredictable; ask exactly how it\'s calculated and for a ' +
      'typical monthly. (4) 🔊 SHARED LOT — it\'s attached to the owner\'s house and the post says you "must be ' +
      'okay with some noise from the main house"; you\'ll be living beside your landlord. (5) 📅 NO LEASE TERM ' +
      'stated — confirm they\'ll do your ~6-month term (the card shows the amber "confirm 6-mo" flag). (6) 💲 ' +
      '$2,600 is at market, not a deal; move-in = first month + an equal $2,600 deposit. (7) 📍 ADDRESS is a ' +
      'general-area pin (W Hillsdale/Laurelwood) — the map distance is approximate; the exact address comes on ' +
      'inquiry. (8) 📷 No exterior photo in the listing (all 5 are interiors of the unit) — the card hero is the ' +
      'kitchen. (9) 🔒 BY-OWNER PRUDENCE (standard for any craigslist listing, not a red flag specific to this ' +
      'one): tour in person, confirm the owner actually controls the property, and never wire a deposit before ' +
      'you\'ve seen it and signed a lease.',
    image: 'img/a27.jpg',
    sourceUrl: 'https://www.craigslist.org/view/d/san-mateo-cozy-2br-1ba-adu/rn88b7TxE5hpkAPZwnSSnF',
  },
  {
    // a28 — 1450 Laurel St #4, San Carlos (downtown). Rooftop geocode via Nominatim (2026-07-21,
    // "1450, Laurel Street, San Carlos, 94070"). ✅ Reads LEGIT — a real Zillow home-detail listing (zpid)
    // by a "Verified Source" management company (The Housing Guild), full street address, 9 real photos
    // (incl. TWO exterior shots + a floor plan) that match the copy, at-market price. Hero = the EXTERIOR
    // front shot (user preference). Zillow CDN fetches server-side (no browser-capture needed).
    id: 'a28',
    status: 'New',
    title: 'Renovated 1BR (downtown, walk 94) — San Carlos',
    address: '1450 Laurel St APT 4, San Carlos, CA 94070',
    neighborhood: 'Downtown',
    city: 'San Carlos',
    lat: 37.496418,
    lng: -122.249123,

    beds: 1,
    baths: 1,
    sqft: 600,
    floor: '', // the building is a 2-story small multiplex (unit #4); the unit's level isn't stated — ask

    rent: 2895, // "$2,895/mo"; at/near market for downtown San Carlos, pricey per foot at 600 sqft (~$4.83/sqft)
    parkingCost: null, // "dedicated carport parking spot" included
    petRent: null, // not stated
    utilitiesIncluded: null, // not stated — ask
    utilitiesEstimate: null,

    deposit: null, // not stated
    appFee: null, // not stated
    brokerFee: null,

    leaseTermMonths: null, // no lease term stated → amber "confirm they'll do a 6-mo term" flag
    minLeaseMonths: null,
    maxLeaseMonths: null,
    availableDate: '', // "Available now"
    availability: 'now',
    furnished: false, // "Unit will be delivered vacant" (any staging is virtual)

    petPolicy: 'Unknown', // not stated — ask
    listingType: 'Property mgmt', // The Housing Guild, Zillow "Verified Source", (415) 419-8279
    contact: { company: 'The Housing Guild', name: '', phone: '(415) 419-8279', email: '', website: '' }, // Verified Source; 415 = SF-area mgmt co (manages regionally)
    comments: [],

    laundry: 'on-site', // "Laundry on site" / "on-site laundry" — not in-unit
    amen: {
      parking: true, // "dedicated carport parking spot" (visible in the exterior photos)
      woodenFloor: true, // "engineered hardwood floors throughout"
      balcony: null, // not mentioned — ask
      gym: false, // small multiplex — no gym
    },
    amenities: ['Fully renovated', 'Granite counters + eat-in bar', 'Full-size range + fridge', 'Dishwasher', 'Renovated bath (tile shower/tub)', 'Engineered hardwood floors', 'Dedicated carport parking', 'On-site laundry', 'Walk Score 94 (Walker’s Paradise)', 'Steps to Laurel St + El Camino + Caltrain', 'Across from Trader Joe’s + Walgreens'],

    dateSeen: '2026-07-21',
    daysOnMarket: 1, // "1 day on Zillow" · 24 contacts — fresh + high early interest (acts fast)
    marketRent: 2900, // Est. — downtown San Carlos 1BR comp (prime, Walk Score 94, renovated); $2,895 is right at market (not a deal, not a bait)

    expertRating: 4, // genuinely appealing + LEGIT: fully renovated (engineered hardwood, granite, tile bath), DEDICATED carport parking, an ELITE walkable downtown San Carlos location (Walk Score 94, steps to Caltrain + Trader Joe's), Verified-Source management, real exterior/interior photos + a floor plan; held from 5 by the AT-MARKET (not a deal) $2,895 for a small 600 sqft unit, ON-SITE (not in-unit) laundry, and no stated lease term
    scamRisk: false,
    incomeRestricted: false,
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — a real Zillow home-detail listing (zpid, 1 day on market, 24 contacts) by a ' +
      '"Verified Source" management company (The Housing Guild, (415) 419-8279), with a FULL street address, 9 ' +
      'real photos (including TWO exterior shots of the green two-story building + a floor plan), and grounded ' +
      'copy that matches the photos — the opposite of the a1/a2 scam pattern. 🟢 THE DRAW: a fully RENOVATED 1BR ' +
      '(engineered hardwood throughout, granite counters + eat-in bar, full-size range/fridge + dishwasher, a ' +
      'tiled renovated bath) with a DEDICATED CARPORT spot, in an ELITE walkable spot — Walk Score 94 ("Walker\'s ' +
      'Paradise"), literally steps to Laurel St dining/nightlife, across from Trader Joe\'s + Walgreens, and a ' +
      'few blocks to the Caltrain station. If you want a car-optional downtown lifestyle, this is one of the ' +
      'best-located units on your list.\n' +
      '⚠️ ACT FAST: 24 contacts on day one — high demand; call today if it interests you.\n' +
      'Confirm before signing: (1) 💲 PRICE — $2,895 for a small 600 sqft 1BR is right AT market (~$4.83/sqft), ' +
      'not a deal; you\'re paying for the location + reno, not a bargain. (2) LAUNDRY is ON-SITE/shared, NOT ' +
      'in-unit. (3) 📅 NO LEASE TERM stated — confirm they\'ll do your ~6-month term (the card shows the amber ' +
      '"confirm 6-mo" flag). (4) Deposit, application fee, utilities, and pet policy are NOT stated — ask for ' +
      'exact move-in + monthly costs and whether pets are allowed. (5) The unit\'s floor isn\'t stated (2-story ' +
      'building) — ask if #4 is upstairs or down. (6) It\'s a management-company relet, so expect standard ' +
      'screening (credit + income); tour in person before you commit.',
    image: 'img/a28.webp',
    sourceUrl: 'https://www.zillow.com/homedetails/1450-Laurel-St-APT-4-San-Carlos-CA-94070/444584983_zpid/',
  },
];
