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
