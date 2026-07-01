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

    leaseTermMonths: null, // not stated — likely a standard 12-mo community lease; confirm they'll do ≤12
    minLeaseMonths: null,
    maxLeaseMonths: null,
    availableDate: '2026-05-15', // "Available Mid-May 2026" (rolling-availability community — a past date just means "ask about current openings")
    furnished: false,

    petPolicy: 'Allowed', // cats + dogs OK, up to 2 pets, breed restrictions, refundable pet deposit
    listingType: 'Property mgmt', // Apartment Management Consultants (AMC-CA Inc), CA BRE #01525033

    amen: {
      parking: true, // assigned parking + carport (dedicated)
      gym: null,
    },
    amenities: ['Hardwood floor', 'Assigned carport', 'Fully equipped kitchen', 'BBQ/picnic area', 'Courtyard', 'Water & trash included'],

    dateSeen: '2026-06-30',
    daysOnMarket: null,
    marketRent: 2500, // Est. — MV 1BR comp; $2,199–2,315 is at/slightly under market (fairly priced, not scam-cheap)

    expertRating: 4,
    rating: 0,
    notes:
      '✅ Looks LEGITIMATE — real managed community (Woodside Place; OSM confirms the building), run by ' +
      'Apartment Management Consultants (AMC-CA Inc) with a valid 8-digit CA BRE #01525033 — the opposite of a1/a2. ' +
      'Market-rate price, professional leasing flow (tour link, 3× income requirement, Equal Housing), building number matches the photo.\n' +
      'Confirm before signing: (1) PRICE — advertised $2,199 but the body lists current rent $2,305–$2,315/mo; budget ~$2,310, not $2,199. ' +
      '(2) Utilities — water & trash included, but YOU pay PG&E (electric + gas) on top. (3) Laundry is on-site, NOT in-unit. ' +
      '(4) Lease term not stated — likely a standard 12-mo; confirm they will do a 6–12 mo term. ' +
      '(5) "Available Mid-May 2026" has passed — it\'s a rolling-availability community, so just ask what\'s open now. ' +
      '(6) Up to 2 pets w/ breed restrictions + a refundable pet deposit.',
    image: 'img/a4.jpg',
    sourceUrl:
      'https://www.craigslist.org/view/d/mountain-view-convenient-location/eSvSAk7oVas4GQwv5h9Qpw',
  },
  {
    // a5 — "Bright top-floor 1BR" in San Mateo (Hillsdale area). No street address — coords are the
    // Hillsdale Caltrain approx anchor. ⚠️ SUSPICIOUS — same AI-luxury-copy fingerprint as a1. See notes.
    id: 'a5',
    status: 'New',
    title: 'Top-Floor 1BR Condo — San Mateo',
    address: 'Hillsdale area, San Mateo, CA 94403 (no exact address given)',
    neighborhood: 'Hillsdale',
    city: 'San Mateo',
    lat: 37.5416853,
    lng: -122.300998,

    beds: 1,
    baths: 1,
    sqft: 840,
    floor: 'Top floor',
    laundry: 'in-unit', // "w/d in unit"

    rent: 2200,
    parkingCost: null, // "attached garage" claimed (photo shows open carports though)
    petRent: null,
    utilitiesIncluded: null,
    utilitiesEstimate: null,

    deposit: null,
    appFee: null,
    brokerFee: null,

    leaseTermMonths: null,
    minLeaseMonths: null,
    maxLeaseMonths: null,
    availableDate: '',
    furnished: true, // "furnished" (attribute) — but verify; scam listings over-claim

    petPolicy: 'Allowed', // cats + dogs OK
    listingType: 'Unknown', // no manager/owner/broker or license named

    amen: {
      parking: true, // attached garage / carport
      gym: null, // "gym and clubhouse" only in the (suspect) prose, not a structured attribute
    },
    amenities: ['Air conditioning', 'Wheelchair accessible', 'Pool/tennis/gym/clubhouse (per listing)'],

    dateSeen: '2026-06-30',
    daysOnMarket: 26, // "posted 26 days ago" — a real underpriced unit usually rents faster
    marketRent: 2900, // Est. — a furnished 840sqft SM 1BR condo w/ garage+pool+gym should be ~$3,000+; $2,200 is well under

    expertRating: 2,
    rating: 0,
    notes:
      '⚠️ LIKELY SCAM — verify hard before any contact/payment. Less blatant than a1/a2 (no upfront fee / "send your number" in the shown text — but the post was truncated), yet it carries the key fingerprints:\n' +
      '(1) The description is the SAME AI-generated luxury copy as the a1 scam — "Sunlight pours through tall windows, illuminating vaulted ceilings…", "a sliding barn door reveals the office/nursery." ' +
      '(2) Mismatched hero photo: the lead image is a pool-table rec room, and other shots look like assembled/scraped stock. ' +
      '(3) Underpriced for what\'s described — a FURNISHED 840sqft 1BR condo w/ attached garage + pool/tennis/gym near Hillsdale would rent ~$3,000+, not $2,200 (~25% under). ' +
      '(4) No street address — only a general-area circle on the map. (5) Up 26 days — genuine bargains rent fast.\n' +
      'Before anything: reverse-image-search the photos, demand the exact unit address + an in-person tour, and never wire a deposit/"hold" before seeing it and verifying the owner.',
    image: 'img/a5.jpg',
    sourceUrl:
      'https://www.craigslist.org/view/d/san-mateo-bright-top-floor-unit-at-the/qpxCrp5FHR9T2ziVK51aJz',
  },
];
