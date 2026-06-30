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
    // a1 — Mountain View 1BR @ 416 Tyrella Ave. Coords are the exact-house geocode
    // (Nominatim, 2026-06-29). ⚠️ Strong rental-scam signals — see notes.
    id: 'a1',
    status: 'New',
    title: 'Vacant Clean 1BR Flat — Mountain View',
    address: '416 Tyrella Ave, Mountain View, CA 94043',
    neighborhood: '',
    city: 'Mountain View',
    lat: 37.401794,
    lng: -122.0637335,

    beds: 1,
    baths: 1,
    sqft: 515,
    floor: '',

    rent: 1560,
    parkingCost: null, // street parking only — no paid/dedicated spot
    petRent: null,
    utilitiesIncluded: null, // not stated
    utilitiesEstimate: null,

    deposit: null, // not stated
    appFee: 29, // "Application Processing fee $29" (+ a separate $85 reservation fee — see notes)
    brokerFee: null, // "Authorized Broker" named but no fee amount given

    leaseTermMonths: null, // "rent period: monthly" is the pay cycle, not the lease term
    minLeaseMonths: null,
    maxLeaseMonths: null,
    availableDate: '', // listed "Vacant" = available now (open houses 6/29–7/1); no fixed future date
    furnished: false, // photos show an empty unit

    petPolicy: 'Allowed', // cats OK + dogs OK
    listingType: 'Broker',

    laundry: 'in-unit', // w/d in unit
    amen: {
      parking: false, // street parking only — no dedicated/off-street spot
      gym: null,
    },
    amenities: ['Street parking', 'Air conditioning', 'EV charging', 'Pets OK (cats & dogs)'],

    dateSeen: '2026-06-29',
    daysOnMarket: null,
    marketRent: 2700, // Est. — typical MV 94043 1BR comp; rent is ~$1,140/mo (≈42%) under it

    expertRating: 1,
    rating: 0,
    notes:
      '⚠️ LIKELY SCAM — do NOT send money or personal info before an in-person tour and a verified owner/agent.\n' +
      'Red flags: (1) $1,560 is ~40%+ below market for a Mountain View 1BR — classic bait price. ' +
      '(2) Asks you to "send your phone number over." (3) An $85 "reservation fee" + $29 app fee up front — never pay to hold a unit you have not seen. ' +
      '(4) Generic luxury copy ("penthouse", "absolute luxury") that contradicts the plain, empty photos. ' +
      '(5) DRE license numbers are malformed (CA licenses are 8 digits; "01.88.73 21" / "01 52.21 60" are not valid formats).\n' +
      'Listed by: Golden Gate Rental Properties Group. Broker named: Marchus R Sterling. ' +
      'Open houses: Mon 2026-06-29, Tue 06-30, Wed 07-01. Verify the listing agent against the CA DRE site and confirm the owner actually controls this unit before any payment.',
    image: 'img/a1.jpg',
    sourceUrl:
      'https://www.craigslist.org/view/d/mountain-view-vacant-clean-one-bedroom/koJbzuTnbaSaNqQM6hvziW',
  },
  {
    // a2 — Palo Alto 1BR cottage @ 762 Hamilton Ave. Coords are the exact-building geocode
    // (Nominatim, 2026-06-30; OSM places it in Crescent Park, not "downtown" as the ad claims).
    // ⚠️ Same likely-scam pattern as a1 — see notes. Note: the 9-mo lease DOES fit the target.
    id: 'a2',
    status: 'New',
    title: 'Palo Alto 1BR Cottage — 9-mo Lease',
    address: '762 Hamilton Ave, Palo Alto, CA 94301',
    neighborhood: 'Crescent Park',
    city: 'Palo Alto',
    lat: 37.4506296,
    lng: -122.1545224,

    beds: 1,
    baths: 1,
    sqft: null, // not stated
    floor: '',

    rent: 1400,
    parkingCost: null, // off-street parking included
    petRent: null,
    utilitiesIncluded: null,
    utilitiesEstimate: null,

    deposit: null, // not stated (a $200 "admin/holding fee" is named instead — see notes)
    appFee: 35, // "Refundable $35 app" (note: app fees are normally non-refundable)
    brokerFee: null,

    leaseTermMonths: 9, // "9-month lease available" — fits the 6–12 mo target
    minLeaseMonths: null,
    maxLeaseMonths: null,
    availableDate: '', // "available now"; no fixed future date
    furnished: false, // photos show an empty house; describes "stainless appliances, updated kitchen"

    petPolicy: 'Allowed', // cats OK + dogs OK
    listingType: 'Landlord', // copy says "the owner anticipates future personal use" → private owner

    laundry: 'in-unit', // w/d in unit
    amen: {
      parking: true, // off-street parking (dedicated) — contrast with a1's street-only
      gym: null,
    },
    amenities: ['Off-street parking', 'Hardwood floors', 'Detached cottage (house)'],

    dateSeen: '2026-06-30',
    daysOnMarket: 0, // posted ~2 hours ago
    marketRent: 3000, // Est. — Palo Alto 94301 1BR comp; rent is ~$1,600/mo (≈53%) under it

    expertRating: 1,
    rating: 0,
    notes:
      '⚠️ LIKELY SCAM — do NOT send money or personal info before an in-person tour and a verified owner.\n' +
      'Red flags: (1) $1,400 for a 1BR house in 94301 (one of the priciest ZIPs in the US) is ~50%+ below market — classic bait price. ' +
      '(2) Asks you to "send your phone number to schedule a viewing." (3) A $200 "admin/holding fee" up front — never pay to hold a place you have not seen/verified. ' +
      '(4) The "owner needs it back later, so only a 9-month lease" story is a common scam script that conveniently matches a short-term searcher. ' +
      '(5) Photos look like a real for-sale/rental cottage (house number visible) — often scraped to dress up a fake post.\n' +
      'On the upside the 9-mo term genuinely fits a 6–12 mo plan — which is exactly why this bait is tempting. ' +
      'Reverse-image-search the photos, confirm the real owner/manager controls 762 Hamilton Ave, and tour in person before any payment.',
    image: 'img/a2.jpg',
    sourceUrl:
      'https://www.craigslist.org/view/d/palo-alto-1br-1ba-palo-alto-ca-mohouse/uy7WEqxhpr7pDp89mDu27R',
  },
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

    leaseTermMonths: null, // not stated — likely a standard 12-mo; confirm they'll do ≤12
    minLeaseMonths: null,
    maxLeaseMonths: null,
    availableDate: '2026-08-01', // body: "available around August 1st" (the sidebar's "Jul 1" conflicts — see notes)
    furnished: false,

    petPolicy: 'Cats only', // cats OK; no dogs mentioned
    listingType: 'Landlord', // small 7-unit complex, "email Chris" — reads as a private owner/manager

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
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — none of the a1/a2 scam tells. Priced at/near market (~$2,290 vs ~$2,500 est. comp), ' +
      'specific grounded description (granite, hardwood, carport, on-site laundry), standard terms ' +
      '(rent + an equal $2,290 deposit + a credit report), and contact via the craigslist email relay — no ' +
      '"send your phone number," no up-front holding fee.\n' +
      'Confirm before signing: (1) lease term is not stated — likely a standard 12-mo, so check they will do ≤12 for a 6–12 mo plan. ' +
      '(2) Available date conflicts: sidebar says "Jul 1," body says "around Aug 1." (3) Laundry is on-site, NOT in-unit. ' +
      '(4) No A/C (ceiling fans only). (5) Cats OK but no dogs. (6) Address is "Cedar near Cherry" with no house number, so the map pin is approximate. ' +
      'Standard due diligence still applies: tour in person and verify "Chris" manages the unit before paying anything.',
    image: '', // no photo provided in the listing/by you — card shows the placeholder; send an image link to add one
    sourceUrl:
      'https://www.craigslist.org/view/d/san-carlos-beautiful-bed-bath-apartment/uajPQJhUrdfmNkTknHYMDi',
  },
];
