import { Product, SHIRT_SIZES, JERSEY_SIZES, OVERSIZED_TEE_SIZES, ONE_SIZE, ProductCategory } from "./types";
import { tempoHidden } from "./collection-launch";

// ─────────────────────────────────────────────────────────────
// Launch catalog · Drop Version I.
// Mirrors the Supabase `products` table exactly (same UUIDs as the
// seed migration). Swap `getProducts()` / `getProductBySlug()` for
// Supabase queries later and nothing else changes.
//
// Image paths point at /public/products/*.svg placeholders · replace
// each SVG with a real product photo when photography is ready.
// ─────────────────────────────────────────────────────────────

const JERSEY_FABRIC =
  "Lightweight performance knit. 100% recycled polyester. Moisture-wicking and breathable with a silky smooth finish, printed edge to edge.";
const CASUAL_FABRIC =
  "Soft 100% ring-spun cotton staple tee. Lightweight and breathable. Holds color, holds shape, and feels broken-in from day one.";
const HEAVY_FABRIC =
  "Heavyweight garment-dyed 100% cotton. Oversized cut with real weight and structure.";

const JERSEY_CARE =
  "Machine wash cold, inside out. No bleach. Hang dry. Do not iron the print.";
const CASUAL_CARE =
  "Machine wash cold with like colors. Tumble dry low. Do not iron the print.";
const ACCESSORY_CARE = "Spot clean or hand wash cold. Lay flat to dry.";

const JERSEY_FIT = "Athletic fit. True to size. Size up for a relaxed feel.";
const CASUAL_FIT = "Relaxed fit. Between sizes? Stay true.";
const OVERSIZED_FIT = "Oversized fit. Drops loose on purpose. Size down for a standard fit.";

const PERF_FABRIC =
  "Moisture-wicking 100% polyester performance knit. Lightweight, breathable, DTF printed.";
const PERF_FIT = "Athletic cut. True to size.";
// Shared guidance for both launch tees made on the Sport-Tek ST720.
// Owner fit feedback: XL is comfortable; L would give a snugger fit (2026-09-26).
const ST720_FIT = "True to size for a comfortable athletic fit. Prefer a snugger, leaner fit? Consider one size down and check the size guide before ordering.";
const PERF_CARE = "Machine wash cold. Tumble dry low. Do not iron the print.";

const CUSTOMIZATION_PRICE = 1500; // $15 name/number add-on (jerseys only)

// Shared drop settings per collection drop.
const DROP_I = {
  isLimitedDrop: true,
  dropVersion: "I",
  dropLimit: 500,
};
const DROP_II = {
  isLimitedDrop: false,
  dropVersion: "II", // collection identity only, no scarcity claims (POD)
  dropLimit: null,
};

export const products: Product[] = [
  // ── Performance Jersey Collection ───────────────────────────
  {
    id: "10000000-0000-4000-8000-000000000001",
    name: "Home Red Jersey",
    slug: "home-red-jersey",
    description:
      "The one you wear when it matters. Silky, breathable performance knit made for the moment it goes in.",
    priceCents: 6100,
    compareAtPriceCents: null,
    color: "Deep Red",
    colorHex: "#C1121F",
    fabric: JERSEY_FABRIC,
    fit: JERSEY_FIT,
    careInstructions: JERSEY_CARE,
    images: [
      { src: "/products/home-red-jersey.webp", alt: "Home Red Jersey · front, on model" },
      { src: "/products/home-red-jersey-back.webp", alt: "Home Red Jersey · back, ready for custom name and number" },
    ],
    sizes: JERSEY_SIZES,
    category: "jersey",
    supplierType: "printful",
    isActive: false,
    ...DROP_I,
    dropSoldCount: 212,
    customNameAvailable: true,
    customNumberAvailable: true,
    customizationPriceCents: CUSTOMIZATION_PRICE,
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    name: "Away White Jersey",
    slug: "away-white-jersey",
    description:
      "Clean and loud at the same time. A crisp away-style jersey that shows up in every crowd photo.",
    priceCents: 6100,
    compareAtPriceCents: null,
    color: "White",
    colorHex: "#FFFFFF",
    fabric: JERSEY_FABRIC,
    fit: JERSEY_FIT,
    careInstructions: JERSEY_CARE,
    images: [
      { src: "/products/away-white-jersey.webp", alt: "Away White Jersey · front, on model" },
      { src: "/products/away-white-jersey-back.webp", alt: "Away White Jersey · back, ready for custom name and number" },
    ],
    sizes: JERSEY_SIZES,
    category: "jersey",
    supplierType: "printful",
    isActive: false,
    ...DROP_I,
    dropSoldCount: 148,
    customNameAvailable: true,
    customNumberAvailable: true,
    customizationPriceCents: CUSTOMIZATION_PRICE,
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    name: "Blackout Edition Jersey",
    slug: "blackout-edition-jersey",
    description:
      "All black, gold detail, zero apologies. The limited edition for fans who don't need to be told the score.",
    priceCents: 6100,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#0A0A0A",
    fabric: JERSEY_FABRIC,
    fit: JERSEY_FIT,
    careInstructions: JERSEY_CARE,
    images: [
      { src: "/products/blackout-edition-jersey.webp", alt: "Blackout Edition Jersey · front, on model" },
      { src: "/products/blackout-edition-jersey-back.webp", alt: "Blackout Edition Jersey · back, ready for custom name and number" },
    ],
    sizes: JERSEY_SIZES,
    category: "jersey",
    supplierType: "printful",
    isActive: false,
    ...DROP_I,
    dropSoldCount: 373,
    customNameAvailable: true,
    customNumberAvailable: true,
    customizationPriceCents: CUSTOMIZATION_PRICE,
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    name: "Emerald Edition Jersey",
    slug: "emerald-edition-jersey",
    description:
      "Deep green with gold accents. A nation's color, cut for match day and everything after.",
    priceCents: 6100,
    compareAtPriceCents: null,
    color: "Emerald Green",
    colorHex: "#0B3D2E",
    fabric: JERSEY_FABRIC,
    fit: JERSEY_FIT,
    careInstructions: JERSEY_CARE,
    images: [
      { src: "/products/emerald-edition-jersey.webp", alt: "Emerald Edition Jersey · front, on model" },
      { src: "/products/emerald-edition-jersey-back.webp", alt: "Emerald Edition Jersey · back, ready for custom name and number" },
    ],
    sizes: JERSEY_SIZES,
    category: "jersey",
    supplierType: "printful",
    isActive: false,
    ...DROP_I,
    dropSoldCount: 84,
    customNameAvailable: true,
    customNumberAvailable: true,
    customizationPriceCents: CUSTOMIZATION_PRICE,
  },


  // == ENGOOOLAND - The England Collection / Drop 02 ==========
  {
    id: "10000000-0000-4000-8000-000000000005",
    name: "ENGOOOLAND Home White Jersey",
    slug: "engoooland-home-white-jersey",
    description:
      "The scream, embedded. Crisp white with the red and navy sash. Chapter two starts loud.",
    priceCents: 6500,
    compareAtPriceCents: null,
    color: "White",
    colorHex: "#FFFFFF",
    fabric: JERSEY_FABRIC,
    fit: JERSEY_FIT,
    careInstructions: JERSEY_CARE,
    images: [
      { src: "/products/engoooland-home-white-jersey.webp", alt: "ENGOOOLAND Home White Jersey · front, on model" },
      { src: "/products/engoooland-home-white-jersey-ghost.webp", alt: "ENGOOOLAND jersey · exact fit, front view" },
      { src: "/products/engoooland-home-white-jersey-back.webp", alt: "ENGOOOLAND Home White Jersey · back, ready for custom name and number" },
    ],
    sizes: JERSEY_SIZES,
    category: "jersey",
    supplierType: "printful",
    isActive: false,
    ...DROP_II,
    dropSoldCount: 0,
    customNameAvailable: true,
    customNumberAvailable: true,
    customizationPriceCents: CUSTOMIZATION_PRICE,
  },
  {
    id: "10000000-0000-4000-8000-000000000006",
    name: "ENGOOOLAND Away Red Jersey",
    slug: "engoooland-away-red-jersey",
    description:
      "Deep red with white and navy movement. For the away days and the loud ends.",
    priceCents: 6500,
    compareAtPriceCents: null,
    color: "Deep Red",
    colorHex: "#C1121F",
    fabric: JERSEY_FABRIC,
    fit: JERSEY_FIT,
    careInstructions: JERSEY_CARE,
    images: [
      { src: "/products/engoooland-away-red-jersey.webp", alt: "ENGOOOLAND Away Red Jersey · front, on model" },
      { src: "/products/engoooland-away-red-jersey-ghost.webp", alt: "ENGOOOLAND jersey · exact fit, front view" },
      { src: "/products/engoooland-away-red-jersey-back.webp", alt: "ENGOOOLAND Away Red Jersey · back, ready for custom name and number" },
    ],
    sizes: JERSEY_SIZES,
    category: "jersey",
    supplierType: "printful",
    isActive: false,
    ...DROP_II,
    dropSoldCount: 0,
    customNameAvailable: true,
    customNumberAvailable: true,
    customizationPriceCents: CUSTOMIZATION_PRICE,
  },
  {
    id: "10000000-0000-4000-8000-000000000007",
    name: "ENGOOOLAND Navy Jersey",
    slug: "engoooland-navy-jersey",
    description:
      "England Navy with the red-white sash and a gold pinline. Quiet colour, loud intent.",
    priceCents: 6500,
    compareAtPriceCents: null,
    color: "England Navy",
    colorHex: "#0A1F3C",
    fabric: JERSEY_FABRIC,
    fit: JERSEY_FIT,
    careInstructions: JERSEY_CARE,
    images: [
      { src: "/products/engoooland-navy-jersey.webp", alt: "ENGOOOLAND Navy Jersey · front, on model" },
      { src: "/products/engoooland-navy-jersey-ghost.webp", alt: "ENGOOOLAND jersey · exact fit, front view" },
      { src: "/products/engoooland-navy-jersey-back.webp", alt: "ENGOOOLAND Navy Jersey · back, ready for custom name and number" },
    ],
    sizes: JERSEY_SIZES,
    category: "jersey",
    supplierType: "printful",
    isActive: false,
    ...DROP_II,
    dropSoldCount: 0,
    customNameAvailable: true,
    customNumberAvailable: true,
    customizationPriceCents: CUSTOMIZATION_PRICE,
  },

  // ── Casual Shirt Collection ─────────────────────────────────
  {
    id: "20000000-0000-4000-8000-000000000001",
    name: "PORTUGOOOL Brush Script Tee",
    slug: "brush-script-tee",
    description:
      "The brand name in one loud stroke. Soft, heavy, and easy to live in.",
    priceCents: 2300,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#0A0A0A",
    fabric: CASUAL_FABRIC,
    fit: CASUAL_FIT,
    careInstructions: CASUAL_CARE,
    images: [
      { src: "/products/brush-script-tee.webp", alt: "PORTUGOOOL Brush Script Tee · front" },
      { src: "/products/brush-script-tee-back.webp", alt: "PORTUGOOOL Brush Script Tee · back" },
    ],
    sizes: SHIRT_SIZES,
    category: "casual",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    name: "GOOOOOOOL!!! Tee",
    slug: "goool-tee",
    description:
      "The whole moment in one word. Wear the celebration.",
    priceCents: 2300,
    compareAtPriceCents: null,
    color: "Deep Red",
    colorHex: "#C1121F",
    fabric: CASUAL_FABRIC,
    fit: CASUAL_FIT,
    careInstructions: CASUAL_CARE,
    images: [
      { src: "/products/goool-tee.webp", alt: "GOOOOOOOL!!! Tee · front" },
      { src: "/products/goool-tee-back.webp", alt: "GOOOOOOOL!!! Tee · back" },
    ],
    sizes: SHIRT_SIZES,
    category: "casual",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "20000000-0000-4000-8000-000000000003",
    name: "Vamos Portugooool Tee",
    slug: "vamos-tee",
    description:
      "For the ones who start the chant. Soft-touch blend built for watch parties.",
    priceCents: 2300,
    compareAtPriceCents: null,
    color: "Emerald Green",
    colorHex: "#0B3D2E",
    fabric: CASUAL_FABRIC,
    fit: CASUAL_FIT,
    careInstructions: CASUAL_CARE,
    images: [
      { src: "/products/vamos-tee.webp", alt: "Vamos Portugooool Tee · front" },
      { src: "/products/vamos-tee-back.webp", alt: "Vamos Portugooool Tee · back" },
    ],
    sizes: SHIRT_SIZES,
    category: "casual",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "20000000-0000-4000-8000-000000000004",
    name: "From Lisbon to the World Tee",
    slug: "lisbon-to-the-world-tee",
    description:
      "One city, every living room, every corner bar. This one travels.",
    priceCents: 2300,
    compareAtPriceCents: null,
    color: "White",
    colorHex: "#FFFFFF",
    fabric: CASUAL_FABRIC,
    fit: CASUAL_FIT,
    careInstructions: CASUAL_CARE,
    images: [
      { src: "/products/lisbon-to-the-world-tee.webp", alt: "From Lisbon to the World Tee · front" },
      { src: "/products/lisbon-to-the-world-tee-back.webp", alt: "From Lisbon to the World Tee · back" },
    ],
    sizes: SHIRT_SIZES,
    category: "casual",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "20000000-0000-4000-8000-000000000005",
    name: "Match Day Tee",
    slug: "match-day-tee",
    description:
      "Some days are just different. Dress accordingly.",
    priceCents: 2300,
    compareAtPriceCents: null,
    color: "Smoke Grey",
    colorHex: "#9CA3AF",
    fabric: CASUAL_FABRIC,
    fit: CASUAL_FIT,
    careInstructions: CASUAL_CARE,
    images: [
      { src: "/products/match-day-tee.webp", alt: "Match Day Tee · front" },
      { src: "/products/match-day-tee-back.webp", alt: "Match Day Tee · back" },
    ],
    sizes: SHIRT_SIZES,
    category: "casual",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "20000000-0000-4000-8000-000000000006",
    name: "We Don't Whisper Goals Tee",
    slug: "we-dont-whisper-goals-tee",
    description:
      "Heavyweight, oversized, and honest about who you are during a match.",
    priceCents: 3300,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#0A0A0A",
    fabric: HEAVY_FABRIC,
    fit: OVERSIZED_FIT,
    careInstructions: CASUAL_CARE,
    images: [
      { src: "/products/we-dont-whisper-goals-tee.webp", alt: "We Don't Whisper Goals Tee · front" },
      { src: "/products/we-dont-whisper-goals-tee-back.webp", alt: "We Don't Whisper Goals Tee · back" },
    ],
    sizes: SHIRT_SIZES,
    category: "casual",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },


  // == England Collection casual tees (Drop 02) ===============
  {
    id: "20000000-0000-4000-8000-000000000007",
    name: "ENGOOOLAND Echo Hero Tee",
    slug: "engoooland-echo-hero-tee",
    description:
      "The Echo, oversized, in red and navy. Chapter two on a clean white staple.",
    priceCents: 2300,
    compareAtPriceCents: null,
    color: "White",
    colorHex: "#FFFFFF",
    fabric: CASUAL_FABRIC,
    fit: CASUAL_FIT,
    careInstructions: CASUAL_CARE,
    images: [
      { src: "/products/engoooland-echo-hero-tee.webp", alt: "ENGOOOLAND Echo Hero Tee · front" },
      { src: "/products/engoooland-echo-hero-tee-back.webp", alt: "ENGOOOLAND Echo Hero Tee · back" },
    ],
    sizes: SHIRT_SIZES,
    category: "casual",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: "II",
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "20000000-0000-4000-8000-000000000008",
    name: "From London to the World Tee",
    slug: "london-to-the-world-tee",
    description:
      "One city, every corner bar. The London mirror of a Lisbon classic.",
    priceCents: 2300,
    compareAtPriceCents: null,
    color: "England Navy",
    colorHex: "#0A1F3C",
    fabric: CASUAL_FABRIC,
    fit: CASUAL_FIT,
    careInstructions: CASUAL_CARE,
    images: [
      { src: "/products/london-to-the-world-tee.webp", alt: "From London to the World Tee · front" },
      { src: "/products/london-to-the-world-tee-back.webp", alt: "From London to the World Tee · back" },
    ],
    sizes: SHIRT_SIZES,
    category: "casual",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: "II",
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "20000000-0000-4000-8000-000000000009",
    name: "Made for the Moment Tee",
    slug: "made-for-the-moment-tee",
    description:
      "The tagline, front and center. Deep red, built for the second it goes in.",
    priceCents: 2300,
    compareAtPriceCents: null,
    color: "Deep Red",
    colorHex: "#C1121F",
    fabric: CASUAL_FABRIC,
    fit: CASUAL_FIT,
    careInstructions: CASUAL_CARE,
    images: [
      { src: "/products/made-for-the-moment-tee.webp", alt: "Made for the Moment Tee · front" },
      { src: "/products/made-for-the-moment-tee-back.webp", alt: "Made for the Moment Tee · back" },
    ],
    sizes: SHIRT_SIZES,
    category: "casual",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: "II",
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "20000000-0000-4000-8000-000000000010",
    name: "ENGOOOLAND Roar Tee",
    slug: "engoooland-roar-tee",
    description:
      "Echo badge at the breast, the moment stacked beneath. Navy, understated, ready.",
    priceCents: 2300,
    compareAtPriceCents: null,
    color: "England Navy",
    colorHex: "#0A1F3C",
    fabric: CASUAL_FABRIC,
    fit: CASUAL_FIT,
    careInstructions: CASUAL_CARE,
    images: [
      { src: "/products/engoooland-roar-tee.webp", alt: "ENGOOOLAND Roar Tee · front" },
      { src: "/products/engoooland-roar-tee-back.webp", alt: "ENGOOOLAND Roar Tee · back" },
    ],
    sizes: SHIRT_SIZES,
    category: "casual",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: "II",
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },


  // == GOL House Line - performance tees (Printify/SwiftPOD) ==
  {
    id: "40000000-0000-4000-8000-000000000007",
    name: "GOL Clean Sheet Tee",
    slug: "gol-clean-sheet-tee",
    description:
      "The mark in ink on clean white. Performance fabric, daylight energy.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "White",
    colorHex: "#FFFFFF",
    fabric: PERF_FABRIC,
    fit: PERF_FIT,
    careInstructions: PERF_CARE,
    images: [
      { src: "/products/gol-clean-sheet-tee.webp", alt: "GOL Clean Sheet Tee · front" },
      { src: "/products/gol-clean-sheet-tee-alt.webp", alt: "GOL Clean Sheet Tee · detail" },
    ],
    sizes: SHIRT_SIZES,
    category: "casual",
    supplierType: "printify",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "40000000-0000-4000-8000-000000000008",
    name: "GOL Gold Standard Tee",
    slug: "gol-gold-standard-tee",
    description:
      "Gold on black with a tonal slash. The house look, built to move.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#0A0A0A",
    fabric: PERF_FABRIC,
    fit: PERF_FIT,
    careInstructions: PERF_CARE,
    images: [
      { src: "/products/gol-gold-standard-tee.webp", alt: "GOL Gold Standard Tee · front" },
      { src: "/products/gol-gold-standard-tee-alt.webp", alt: "GOL Gold Standard Tee · detail" },
    ],
    sizes: SHIRT_SIZES,
    category: "casual",
    supplierType: "printify",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "40000000-0000-4000-8000-000000000009",
    name: "GOL Concrete Tee",
    slug: "gol-concrete-grey-tee",
    description:
      "The slash oversized, the mark up top. Street energy on performance poly.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Sport Grey",
    colorHex: "#9CA3AF",
    fabric: PERF_FABRIC,
    fit: PERF_FIT,
    careInstructions: PERF_CARE,
    images: [
      { src: "/products/gol-concrete-grey-tee.webp", alt: "GOL Concrete Tee · front" },
      { src: "/products/gol-concrete-grey-tee-alt.webp", alt: "GOL Concrete Tee · detail" },
    ],
    sizes: SHIRT_SIZES,
    category: "casual",
    supplierType: "printify",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "40000000-0000-4000-8000-000000000010",
    name: "GOL Concrete White Tee",
    slug: "gol-concrete-white-tee",
    description:
      "Ink slash shoulder to hip, gold lockup. The loud one in white.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "White",
    colorHex: "#FFFFFF",
    fabric: PERF_FABRIC,
    fit: PERF_FIT,
    careInstructions: PERF_CARE,
    images: [
      { src: "/products/gol-concrete-white-tee.webp", alt: "GOL Concrete White Tee · front" },
      { src: "/products/gol-concrete-white-tee-alt.webp", alt: "GOL Concrete White Tee · detail" },
    ],
    sizes: SHIRT_SIZES,
    category: "casual",
    supplierType: "printify",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "40000000-0000-4000-8000-000000000011",
    name: "GOL Concrete Black Tee",
    slug: "gol-concrete-black-tee",
    description:
      "Paper slash, gold mark. Blackout energy for the performance line.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#0A0A0A",
    fabric: PERF_FABRIC,
    fit: PERF_FIT,
    careInstructions: PERF_CARE,
    images: [
      { src: "/products/gol-concrete-black-tee.webp", alt: "GOL Concrete Black Tee · front" },
      { src: "/products/gol-concrete-black-tee-alt.webp", alt: "GOL Concrete Black Tee · detail" },
    ],
    sizes: SHIRT_SIZES,
    category: "casual",
    supplierType: "printify",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },

  // ── Crest V2 T-Shirt Line (AA 1301GD, Printful DTF) ─────────
  {
    id: "60000000-0000-4000-8000-000000000003",
    name: "GOOOL Crest Statement Tee · Cream",
    slug: "crest-statement-tee-cream",
    description:
      "The crest at full volume. One design, worn loud on cream.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Faded Cream",
    colorHex: "#FFF9E9",
    fabric: HEAVY_FABRIC,
    fit: OVERSIZED_FIT,
    careInstructions: CASUAL_CARE,
    images: [
      { src: "/products/crest-statement-tee-cream.webp", alt: "GOOOL Crest Statement Tee · Cream · front" },
      { src: "/products/crest-statement-tee-cream-back.webp", alt: "GOOOL Crest Statement Tee · Cream · back" },
    ],
    sizes: SHIRT_SIZES,
    category: "tshirt",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "60000000-0000-4000-8000-000000000004",
    name: "GOOOL Crest Statement Tee · Faded Black",
    slug: "crest-statement-tee-faded-black",
    description:
      "The crest at full volume, reversed in white on faded black.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Faded Black",
    colorHex: "#55565A",
    fabric: HEAVY_FABRIC,
    fit: OVERSIZED_FIT,
    careInstructions: CASUAL_CARE,
    images: [
      { src: "/products/crest-statement-tee-faded-black.webp", alt: "GOOOL Crest Statement Tee · Faded Black · front" },
      { src: "/products/crest-statement-tee-faded-black-back.webp", alt: "GOOOL Crest Statement Tee · Faded Black · back" },
    ],
    sizes: SHIRT_SIZES,
    category: "tshirt",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "60000000-0000-4000-8000-000000000005",
    name: "GOOOL Crest Statement Tee · Faded Navy",
    slug: "crest-statement-tee-faded-navy",
    description:
      "The crest at full volume on dusty navy. The quiet-loud one.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Faded Navy",
    colorHex: "#4F5C71",
    fabric: HEAVY_FABRIC,
    fit: OVERSIZED_FIT,
    careInstructions: CASUAL_CARE,
    images: [
      { src: "/products/crest-statement-tee-faded-navy.webp", alt: "GOOOL Crest Statement Tee · Faded Navy · front" },
      { src: "/products/crest-statement-tee-faded-navy-back.webp", alt: "GOOOL Crest Statement Tee · Faded Navy · back" },
    ],
    sizes: SHIRT_SIZES,
    category: "tshirt",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },

  // ── GOOOL Oval Mark Oversized Tee (AS Colour 5082, Printful DTF) ──
  {
    id: "60000000-0000-4000-8000-000000000007",
    name: "GOOOL Oval Mark Oversized Tee",
    slug: "goool-oval-tee",
    description:
      "The GOOOL Oval Mark Oversized Tee brings professional soccer identity into a heavyweight streetwear silhouette. Made from garment dyed cotton with a structured boxy fit, dropped shoulders, and wide neck ribbing, it is designed to feel substantial while maintaining an easy everyday drape. The front carries the GOOOL oval wordmark, while a smaller G mark sits beneath the back collar like the finishing detail on a professional training kit.",
    priceCents: 3800,
    compareAtPriceCents: null,
    color: "Faded Cream",
    colorHex: "#FFF9E9",
    fabric:
      "100% carded cotton. Heavyweight 240 GSM (7.1 oz) fabric. Garment dyed and preshrunk.",
    fit: "Boxy oversized fit with dropped shoulders, wide sleeves, and wide neck ribbing. Longer casual length.",
    careInstructions:
      "Machine wash cold and inside out on a gentle cycle with mild detergent, with similar colors. Non-chlorine bleach only when necessary. No fabric softener. Tumble dry low or hang dry. Cool iron inside out when necessary · never directly over the decoration. Do not dry clean.",
    images: [
      { src: "/products/goool-oval-tee-cream.webp", alt: "GOOOL faded cream oversized t-shirt front view" },
      { src: "/products/goool-oval-tee-cream-back.webp", alt: "GOOOL faded cream oversized t-shirt back view" },
    ],
    sizes: OVERSIZED_TEE_SIZES,
    category: "tshirt",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
    colorVariants: [
      {
        name: "Faded Cream",
        supplierColor: "Faded Bone",
        hex: "#FFF9E9",
        skuFragment: "CREAM",
        images: [
          { src: "/products/goool-oval-tee-cream.webp", alt: "GOOOL faded cream oversized t-shirt front view" },
          { src: "/products/goool-oval-tee-cream-back.webp", alt: "GOOOL faded cream oversized t-shirt back view" },
          { src: "/products/goool-oval-tee-cream-detail-fit.webp", alt: "Oversized boxy fit detail, faded cream tee" },
          { src: "/products/goool-oval-tee-cream-detail-collar.webp", alt: "Wide neck ribbing and fabric detail, faded cream tee" },
        ],
      },
      {
        name: "Washed Charcoal",
        supplierColor: "Faded Black",
        hex: "#55565A",
        skuFragment: "CHARCOAL",
        images: [
          { src: "/products/goool-oval-tee-charcoal.webp", alt: "GOOOL washed charcoal oversized t-shirt front view" },
          { src: "/products/goool-oval-tee-charcoal-back.webp", alt: "GOOOL washed charcoal oversized t-shirt back view" },
          { src: "/products/goool-oval-tee-charcoal-detail-fit.webp", alt: "Oversized boxy fit detail, washed charcoal tee" },
          { src: "/products/goool-oval-tee-charcoal-detail-collar.webp", alt: "Wide neck ribbing and fabric detail, washed charcoal tee" },
        ],
      },
      {
        name: "Dusty Navy",
        supplierColor: "Faded Indigo",
        hex: "#4F5C71",
        skuFragment: "NAVY",
        images: [
          { src: "/products/goool-oval-tee-navy.webp", alt: "GOOOL dusty navy oversized t-shirt front view" },
          { src: "/products/goool-oval-tee-navy-back.webp", alt: "GOOOL dusty navy oversized t-shirt back view" },
          { src: "/products/goool-oval-tee-navy-detail-fit.webp", alt: "Oversized boxy fit detail, dusty navy tee" },
          { src: "/products/goool-oval-tee-navy-detail-collar.webp", alt: "Wide neck ribbing and fabric detail, dusty navy tee" },
        ],
      },
    ],
    fitNote:
      "Boxy oversized fit with dropped shoulders. Choose your normal size for the intended oversized silhouette. Size down for a closer fit.",
    sizeGuide: {
      unit: "in",
      measurements: [
        { label: "Length", values: { S: 27.76, M: 29.13, L: 30.51, XL: 31.89, XXL: 33.27 } },
        { label: "Width", values: { S: 20.08, M: 21.65, L: 23.23, XL: 24.8, XXL: 26.38 } },
        { label: "Sleeve Length", values: { S: 9.06, M: 9.45, L: 9.45, XL: 10.24, XXL: 10.63 } },
      ],
    },
  },

  // ── Accessory Collection ────────────────────────────────────
  {
    id: "30000000-0000-4000-8000-000000000001",
    name: "Supporters Scarf",
    slug: "supporters-scarf",
    description:
      "Double-sided knit scarf. Raise it at kickoff, wear it home after.",
    priceCents: 2800,
    compareAtPriceCents: null,
    color: "Red / Green",
    colorHex: "#C1121F",
    fabric: "Double-sided acrylic knit with fringed ends. Stadium-weight.",
    fit: "One size · 145 × 18 cm.",
    careInstructions: ACCESSORY_CARE,
    images: [
      { src: "/products/supporters-scarf.svg", alt: "Supporters Scarf" },
    ],
    sizes: ONE_SIZE,
    category: "accessory",
    supplierType: "unassigned",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "30000000-0000-4000-8000-000000000002",
    name: "GOOOOOL Cap",
    slug: "goool-cap",
    description:
      "Low-profile cap with the sound of victory stitched on the front.",
    priceCents: 2900,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#0A0A0A",
    fabric: "Brushed cotton twill, embroidered front, adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: ACCESSORY_CARE,
    images: [{ src: "/products/goool-cap.svg", alt: "GOOOOOL Cap" }],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "30000000-0000-4000-8000-000000000003",
    name: "Sticker Pack",
    slug: "sticker-pack",
    description:
      "Six die-cut stickers. Laptops, bottles, and anything else that needs more noise.",
    priceCents: 1000,
    compareAtPriceCents: null,
    color: "Multi",
    colorHex: "#C9A227",
    fabric: "Kiss-cut matte vinyl sticker sheet. Six designs on one sheet.",
    fit: "One sheet · 5.83″ × 8.27″ · six stickers.",
    careInstructions: "Peel and place once.",
    images: [{ src: "/products/sticker-pack.svg", alt: "Sticker Pack · six die-cut stickers" }],
    sizes: ONE_SIZE,
    category: "accessory",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "30000000-0000-4000-8000-000000000004",
    name: "Terrace Flag",
    slug: "terrace-flag",
    description:
      "90 × 150 cm of pure celebration. For balconies, backyards, and full-time whistles.",
    priceCents: 2400,
    compareAtPriceCents: null,
    color: "Red / Green / Gold",
    colorHex: "#0B3D2E",
    fabric: "Lightweight knitted polyester with reinforced grommets.",
    fit: "One size · 90 × 150 cm.",
    careInstructions: ACCESSORY_CARE,
    images: [{ src: "/products/terrace-flag.svg", alt: "Terrace Flag" }],
    sizes: ONE_SIZE,
    category: "accessory",
    supplierType: "unassigned",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },

  // == GOL caps (Printful embroidery, Yupoong 6245CM) =========
  {
    id: "50000000-0000-4000-8000-000000000001",
    name: "GOL Cap Black",
    slug: "gol-cap-black",
    description:
      "Gold GOL, stitched. Low-profile classic cap, adjustable strap.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#0A0A0A",
    fabric: "Brushed cotton twill, embroidered GOL mark, adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/gol-cap-black.webp", alt: "GOL Cap Black · front" },
      { src: "/products/gol-cap-black-alt.webp", alt: "GOL Cap Black · angle" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000002",
    name: "GOL Cap White",
    slug: "gol-cap-white",
    description:
      "Ink GOL, stitched clean on white. Low-profile classic cap, adjustable strap.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "White",
    colorHex: "#FFFFFF",
    fabric: "Brushed cotton twill, embroidered GOL mark, adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/gol-cap-white.webp", alt: "GOL Cap White · front" },
      { src: "/products/gol-cap-white-alt.webp", alt: "GOL Cap White · angle" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000003",
    name: "GOOOL Cap Black",
    slug: "goool-cap-black",
    description:
      "The house wordmark in gold thread. The Sound of Victory. on the side.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#0A0A0A",
    fabric: "Brushed cotton twill, embroidered GOOOL wordmark, adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-cap-black.webp", alt: "GOOOL Cap Black · front angle" },
      { src: "/products/goool-cap-black-alt.webp", alt: "GOOOL Cap Black · front" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000004",
    name: "GOOOL Cap White",
    slug: "goool-cap-white",
    description:
      "GOOOL stitched in ink on white. The Sound of Victory. on the side.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "White",
    colorHex: "#FFFFFF",
    fabric: "Brushed cotton twill, embroidered GOOOL wordmark, adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-cap-white.webp", alt: "GOOOL Cap White · front angle" },
      { src: "/products/goool-cap-white-alt.webp", alt: "GOOOL Cap White · front" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000005",
    name: "GOOOL England Cap",
    slug: "goool-england-cap",
    description:
      "Red, white, and navy. GOOOL in navy thread, England in red, the cross on the shield. Part of The England Drop.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Red / White",
    colorHex: "#C1121F",
    fabric: "Structured 5-panel trucker, embroidered front panel, mesh back, snapback.",
    fit: "One size · snapback.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-england-cap.webp", alt: "GOOOL England Cap · front" },
      { src: "/products/goool-england-cap-alt.webp", alt: "GOOOL England Cap · angle" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: "II",
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000006",
    name: "GOOOL England Cap White",
    slug: "goool-england-cap-white",
    description:
      "White crown, navy GOOOL, England red. The cross on the side, GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "White",
    colorHex: "#FFFFFF",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-england-cap-white.webp", alt: "GOOOL England Cap White · front" },
      { src: "/products/goool-england-cap-white-alt.webp", alt: "GOOOL England Cap White · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: "II",
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000007",
    name: "GOOOL England Cap Navy",
    slug: "goool-england-cap-navy",
    description:
      "England navy, white GOOOL, red England. The cross on the side, GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Navy",
    colorHex: "#0A1F3C",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-england-cap-navy.webp", alt: "GOOOL England Cap Navy · front" },
      { src: "/products/goool-england-cap-navy-alt.webp", alt: "GOOOL England Cap Navy · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: "II",
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000008",
    name: "GOOOL England Cap Red",
    slug: "goool-england-cap-red",
    description:
      "Deep red, white GOOOL. The cross on the side, GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Red",
    colorHex: "#9E1B32",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-england-cap-red.webp", alt: "GOOOL England Cap Red · front" },
      { src: "/products/goool-england-cap-red-alt.webp", alt: "GOOOL England Cap Red · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: "II",
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000009",
    name: "GOOOL Argentina Cap White",
    slug: "goool-argentina-cap-white",
    description:
      "White crown, navy GOOOL, celeste Argentina. The flag shield on the side, GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "White",
    colorHex: "#FFFFFF",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-argentina-cap-white.webp", alt: "GOOOL Argentina Cap White · front" },
      { src: "/products/goool-argentina-cap-white-alt.webp", alt: "GOOOL Argentina Cap White · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000010",
    name: "GOOOL Argentina Cap Sky Blue",
    slug: "goool-argentina-cap-sky",
    description:
      "Celeste, white GOOOL. The flag shield on the side, GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Sky Blue",
    colorHex: "#75AADB",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-argentina-cap-sky.webp", alt: "GOOOL Argentina Cap Sky Blue · front" },
      { src: "/products/goool-argentina-cap-sky-alt.webp", alt: "GOOOL Argentina Cap Sky Blue · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },

  // == Country caps wave 2 (Yupoong 6245CM via Printful) ======
  {
    id: "50000000-0000-4000-8000-000000000011",
    name: "GOOOL Italy Cap Navy",
    slug: "goool-italy-cap-navy",
    description:
      "Azzurri navy, white GOOOL, green Italy. The tricolore shield on the side, GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Navy",
    colorHex: "#0A1F3C",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-italy-cap-navy.webp", alt: "GOOOL Italy Cap Navy · front" },
      { src: "/products/goool-italy-cap-navy-alt.webp", alt: "GOOOL Italy Cap Navy · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000012",
    name: "GOOOL Italy Cap White",
    slug: "goool-italy-cap-white",
    description:
      "White crown, navy GOOOL, green Italy. The tricolore shield on the side, GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "White",
    colorHex: "#FFFFFF",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-italy-cap-white.webp", alt: "GOOOL Italy Cap White · front" },
      { src: "/products/goool-italy-cap-white-alt.webp", alt: "GOOOL Italy Cap White · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000013",
    name: "GOOOL Netherlands Cap Navy",
    slug: "goool-netherlands-cap-navy",
    description:
      "Navy crown, white GOOOL, Oranje accent. The flag shield on the side, GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Navy",
    colorHex: "#0A1F3C",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-netherlands-cap-navy.webp", alt: "GOOOL Netherlands Cap Navy · front" },
      { src: "/products/goool-netherlands-cap-navy-alt.webp", alt: "GOOOL Netherlands Cap Navy · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000024",
    name: "GOOOL Netherlands Cap White",
    slug: "goool-netherlands-cap-white",
    description:
      "White crown, navy GOOOL, Oranje accent. The flag shield on the side, GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "White",
    colorHex: "#FFFFFF",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-netherlands-cap-white.webp", alt: "GOOOL Netherlands Cap White · front" },
      { src: "/products/goool-netherlands-cap-white-alt.webp", alt: "GOOOL Netherlands Cap White · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000014",
    name: "GOOOL Germany Cap Black",
    slug: "goool-germany-cap-black",
    description:
      "Black crown, white GOOOL, red Germany. The flag shield on the side, GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#0A0A0A",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-germany-cap-black.webp", alt: "GOOOL Germany Cap Black · front" },
      { src: "/products/goool-germany-cap-black-alt.webp", alt: "GOOOL Germany Cap Black · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000015",
    name: "GOOOL Germany Cap White",
    slug: "goool-germany-cap-white",
    description:
      "White crown, black GOOOL, red Germany. The flag shield on the side, GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "White",
    colorHex: "#FFFFFF",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-germany-cap-white.webp", alt: "GOOOL Germany Cap White · front" },
      { src: "/products/goool-germany-cap-white-alt.webp", alt: "GOOOL Germany Cap White · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000016",
    name: "GOOOL Belgium Cap Red",
    slug: "goool-belgium-cap-red",
    description:
      "Deep red, gold GOOOL, black Belgium. The flag shield on the side, gold GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Red",
    colorHex: "#9E1B32",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-belgium-cap-red.webp", alt: "GOOOL Belgium Cap Red · front" },
      { src: "/products/goool-belgium-cap-red-alt.webp", alt: "GOOOL Belgium Cap Red · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000017",
    name: "GOOOL Belgium Cap Black",
    slug: "goool-belgium-cap-black",
    description:
      "Black crown, gold GOOOL, red Belgium. The flag shield on the side, gold GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#0A0A0A",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-belgium-cap-black.webp", alt: "GOOOL Belgium Cap Black · front" },
      { src: "/products/goool-belgium-cap-black-alt.webp", alt: "GOOOL Belgium Cap Black · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000018",
    name: "GOOOL Norway Cap Navy",
    slug: "goool-norway-cap-navy",
    description:
      "Navy crown, white GOOOL, red Norway. The Nordic cross shield on the side, GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Navy",
    colorHex: "#0A1F3C",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-norway-cap-navy.webp", alt: "GOOOL Norway Cap Navy · front" },
      { src: "/products/goool-norway-cap-navy-alt.webp", alt: "GOOOL Norway Cap Navy · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000019",
    name: "GOOOL Norway Cap Red",
    slug: "goool-norway-cap-red",
    description:
      "Deep red, white GOOOL. The Nordic cross shield on the side, GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Red",
    colorHex: "#9E1B32",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-norway-cap-red.webp", alt: "GOOOL Norway Cap Red · front" },
      { src: "/products/goool-norway-cap-red-alt.webp", alt: "GOOOL Norway Cap Red · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000020",
    name: "GOOOL Spain Cap Black",
    slug: "goool-spain-cap-black",
    description:
      "Black crown, gold GOOOL, red Spain. The rojigualda shield on the side, gold GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#0A0A0A",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-spain-cap-black.webp", alt: "GOOOL Spain Cap Black · front" },
      { src: "/products/goool-spain-cap-black-alt.webp", alt: "GOOOL Spain Cap Black · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000021",
    name: "GOOOL Spain Cap Red",
    slug: "goool-spain-cap-red",
    description:
      "Deep red, gold GOOOL. The rojigualda shield on the side, gold GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Red",
    colorHex: "#9E1B32",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-spain-cap-red.webp", alt: "GOOOL Spain Cap Red · front" },
      { src: "/products/goool-spain-cap-red-alt.webp", alt: "GOOOL Spain Cap Red · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000022",
    name: "GOOOL France Cap Navy",
    slug: "goool-france-cap-navy",
    description:
      "Navy crown, white GOOOL, red France. The tricolore shield on the side, GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "Navy",
    colorHex: "#0A1F3C",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-france-cap-navy.webp", alt: "GOOOL France Cap Navy · front" },
      { src: "/products/goool-france-cap-navy-alt.webp", alt: "GOOOL France Cap Navy · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "50000000-0000-4000-8000-000000000023",
    name: "GOOOL France Cap White",
    slug: "goool-france-cap-white",
    description:
      "White crown, navy GOOOL, red France. The tricolore shield on the side, GOOOL on the back.",
    priceCents: 3500,
    compareAtPriceCents: null,
    color: "White",
    colorHex: "#FFFFFF",
    fabric: "Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.",
    fit: "One size · adjustable.",
    careInstructions: "Spot clean or hand wash cold. Lay flat to dry.",
    images: [
      { src: "/products/goool-france-cap-white.webp", alt: "GOOOL France Cap White · front" },
      { src: "/products/goool-france-cap-white-alt.webp", alt: "GOOOL France Cap White · side crest" },
    ],
    sizes: ONE_SIZE,
    category: "hat",
    supplierType: "printful",
    isActive: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },

  // == First Capsule (Apliiq) ==
  {
    id: "70000000-0000-4000-8000-000000000001",
    name: "GOOOL Core Badge Tee",
    slug: "goool-performance-tee",
    description:
      "Lightweight training tee. GOOOL crest centered on the chest, athletic fit, taped neck.",
    priceCents: 3800,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#0A0A0A",
    // Sport-Tek ST720. The supplier defines PosiCharge as "durable,
    // eco-friendly fabric that resists fading and maintains color", so the
    // claim is attributed and not upgraded: resists fading, not never fades.
    //
    // Shares a blank with the Matchday Tee. This line owns
    // weight and colour; that one owns the neck, the label and the sleeve.
    // Lightness and wicking were drafted here and moved there to keep the
    // split clean.
    fabric:
      "3.8 oz, 100% recycled polyester performance knit. Light, quick-drying and cool against the skin, with colour locked into the fibre so it resists fading and holds its depth, which counts for most on the black.",
    fit: ST720_FIT,
    careInstructions: "Machine wash cold, inside out. Tumble dry low. Skip the fabric softener, it coats the fibres and reduces wicking. Do not iron directly on the print.",
    images: [
      {
        src: "/products/GOOOL_STD_PERFORMANCE_BLACK_FRONT.webp",
        alt: "GOOOL Core Badge Tee in black, front view",
      },
      {
        src: "/products/GOOOL_STD_PERFORMANCE_BLACK_BACK.webp",
        alt: "GOOOL Core Badge Tee in black, back view",
      },
    ],
    // Colorways mirror the saved Apliiq designs
    // (Black 6098962, White 6099046, True Royal 6099129).
    colorVariants: [
      {
        name: "Black",
        supplierColor: "Black",
        hex: "#373737",
        skuFragment: "BLACK",
        images: [
          {
            src: "/products/GOOOL_STD_PERFORMANCE_BLACK_FRONT.webp",
            alt: "GOOOL Core Badge Tee in black, front view",
          },
          {
            src: "/products/GOOOL_STD_PERFORMANCE_BLACK_BACK.webp",
            alt: "GOOOL Core Badge Tee in black, back view",
          },
        ],
      },
      {
        name: "White",
        supplierColor: "White",
        hex: "#F4F4F4",
        skuFragment: "WHITE",
        images: [
          {
            src: "/products/GOOOL_STD_PERFORMANCE_WHITE_FRONT.webp",
            alt: "GOOOL Core Badge Tee in white, front view",
          },
          {
            src: "/products/GOOOL_STD_PERFORMANCE_WHITE_BACK.webp",
            alt: "GOOOL Core Badge Tee in white, back view",
          },
        ],
      },
      {
        name: "True Royal",
        supplierColor: "true royal",
        hex: "#3249A6",
        skuFragment: "TRUE_ROYAL",
        images: [
          {
            src: "/products/GOOOL_STD_PERFORMANCE_ROYAL_FRONT.webp",
            alt: "GOOOL Core Badge Tee in true royal, front view",
          },
          {
            src: "/products/GOOOL_STD_PERFORMANCE_ROYAL_BACK.webp",
            alt: "GOOOL Core Badge Tee in true royal, back view",
          },
        ],
      },
    ],
    // Garment made in Ethiopia (Apliiq record); decorated at Apliiq's US
    // facilities (LA/Philadelphia) - so Printed in the USA, never Made in.
    originLabel: "Printed in the USA",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "tshirt",
    supplierType: "apliiq",
    isActive: false,
    availableForSale: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "70000000-0000-4000-8000-000000000002",
    name: "GOOOL Core Hoodie · Red",
    slug: "goool-heavyweight-hoodie",
    // Two rows on the shop, one per print colour (owner, 2026-09-24): this
    // one is the 4a set (red centre dash on the front lockup, red club band
    // low on the back); ...0006 below is the 4b Club Blue set. Same blank,
    // same placements, same price. The slug keeps the original hoodie URL.
    // The wordmark-only version (Apliiq 6098974 / 6099064) came off the
    // site the same day; those designs are not deleted.
    description:
      "The full GOOOL Athletics lockup across the chest and the red club band low across the back, where the hood can't cover it. Heavyweight fleece in black, bone or grey heather, with a kangaroo pocket and a generous cut. Built for off the pitch: the layer you pull on after, and keep on.",
    priceCents: 7800,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#1E1E1E",
    // Independent IND4000, from the POD Sample Specification Packet:
    // "10 oz (330 gsm) 3-end fleece; Black 70% cotton / 30% polyester;
    // 100% cotton face yarn; generous fit"; hood/drawcord/eyelet line from
    // Apliiq's IND4000 features list read 2026-09-24. Bone's and Grey
    // Heather's blends are documented nowhere, so the fabric line states
    // Black's blend only. Do not extend it to the other colours.
    fabric:
      "10 oz heavyweight 3-end fleece in 70% cotton and 30% polyester, with ring-spun cotton for a smooth print surface. Fleece-lined hood with a cotton drawcord through nickel eyelets, and a tear-away label. Cut generous, so all that weight has room to hang.",
    fit: "Generous fit with 1x1 ribbed cuffs. True to size for room to layer. Size down for a more snug fit.",
    careInstructions: "Machine wash cold, inside out, with like colours. Tumble dry low. Do not bleach. Do not iron directly on the print.",
    images: [
      {
        src: "/products/GOOOL_STD_HOODIE_BLACK_RED_FRONT.webp",
        alt: "GOOOL Core Hoodie · Red in black, front view",
      },
      {
        src: "/products/GOOOL_STD_HOODIE_BLACK_RED_BACK.webp",
        alt: "GOOOL Core Hoodie · Red in black, back view",
      },
    ],
    // Remade 2026-09-24 with the 3010 tee print sets (owner decision,
    // designs/00_asset-library/CORE-HOODIE-REMAKE-DECISION.md). Front: the
    // GOOOL Athletics lockup 11.10 x 4.59 in, top 3.00 in below the hood
    // seam. Back: the club band 12.00 x 2.00 in on the back hem, bottom
    // edge on the bottom of Apliiq's back print area. Both DTF. One saved
    // Apliiq design per colour; ids and per-size SKUs live in fulfillment.ts.
    colorVariants: [
      {
        name: "Black",
        supplierColor: "Black",
        hex: "#1E1E1E",
        skuFragment: "BLACK",
        images: [
          {
            src: "/products/GOOOL_STD_HOODIE_BLACK_RED_FRONT.webp",
            alt: "GOOOL Core Hoodie · Red in black, front view",
          },
          {
            src: "/products/GOOOL_STD_HOODIE_BLACK_RED_BACK.webp",
            alt: "GOOOL Core Hoodie · Red in black, back view",
          },
        ],
      },
      {
        name: "Bone",
        supplierColor: "Bone",
        hex: "#CFCAC7",
        skuFragment: "BONE",
        images: [
          {
            src: "/products/GOOOL_STD_HOODIE_BONE_RED_FRONT.webp",
            alt: "GOOOL Core Hoodie · Red in bone, front view",
          },
          {
            src: "/products/GOOOL_STD_HOODIE_BONE_RED_BACK.webp",
            alt: "GOOOL Core Hoodie · Red in bone, back view",
          },
        ],
      },
      // Grey Heather: Apliiq stores #F4F4F4 for this swatch and renders the
      // garment near-white; the blank photographs as a light heather. The
      // site hex is a compromise the owner may adjust. Club Blue set uses
      // the True Royal #1F4FB5 front on heather (handoff).
      {
        name: "Grey Heather",
        supplierColor: "Grey Heather",
        hex: "#D9D9D9",
        skuFragment: "GREYHEATHER",
        images: [
          {
            src: "/products/GOOOL_STD_HOODIE_GREYHEATHER_RED_FRONT.webp",
            alt: "GOOOL Core Hoodie · Red in grey heather, front view",
          },
          {
            src: "/products/GOOOL_STD_HOODIE_GREYHEATHER_RED_BACK.webp",
            alt: "GOOOL Core Hoodie · Red in grey heather, back view",
          },
        ],
      },
    ],
    // Garment made in China (Apliiq record); decorated at Apliiq's US
    // facilities (LA/Philadelphia) - so Printed in the USA, never Made in.
    originLabel: "Printed in the USA",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "hoodie",
    supplierType: "apliiq",
    isActive: false,
    availableForSale: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "70000000-0000-4000-8000-000000000006",
    name: "GOOOL Core Hoodie · Club Blue",
    slug: "goool-heavyweight-hoodie-blue",
    // The 4b set: GOOOL and ATHLETICS in Club Blue #3D6CC4 on the front
    // (Natural dashes on black, ink dashes on bone and heather; True Royal
    // #1F4FB5 lockup on heather so it reads), Club Blue band with natural
    // lettering low on the back. Its own row by owner decision 2026-09-24.
    description:
      "The full GOOOL Athletics lockup in club blue across the chest and the blue club band low across the back, where the hood can't cover it. Heavyweight fleece in black, bone or grey heather, with a kangaroo pocket and a generous cut. Built for off the pitch: the layer you pull on after, and keep on.",
    priceCents: 7800,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#1E1E1E",
    // Independent IND4000, from the POD Sample Specification Packet:
    // "10 oz (330 gsm) 3-end fleece; Black 70% cotton / 30% polyester;
    // 100% cotton face yarn; generous fit"; hood/drawcord/eyelet line from
    // Apliiq's IND4000 features list read 2026-09-24. Bone's and Grey
    // Heather's blends are documented nowhere, so the fabric line states
    // Black's blend only. Do not extend it to the other colours.
    fabric:
      "10 oz heavyweight 3-end fleece in 70% cotton and 30% polyester, with ring-spun cotton for a smooth print surface. Fleece-lined hood with a cotton drawcord through nickel eyelets, and a tear-away label. Cut generous, so all that weight has room to hang.",
    fit: "Generous fit with 1x1 ribbed cuffs. True to size for room to layer. Size down for a more snug fit.",
    careInstructions: "Machine wash cold, inside out, with like colours. Tumble dry low. Do not bleach. Do not iron directly on the print.",
    images: [
      {
        src: "/products/GOOOL_STD_HOODIE_BLACK_BLUE_FRONT.webp",
        alt: "GOOOL Core Hoodie · Club Blue in black, front view",
      },
      {
        src: "/products/GOOOL_STD_HOODIE_BLACK_BLUE_BACK.webp",
        alt: "GOOOL Core Hoodie · Club Blue in black, back view",
      },
    ],
    // Remade 2026-09-24 with the 3010 tee print sets (owner decision,
    // designs/00_asset-library/CORE-HOODIE-REMAKE-DECISION.md). Front: the
    // GOOOL Athletics lockup 11.10 x 4.59 in, top 3.00 in below the hood
    // seam. Back: the club band 12.00 x 2.00 in on the back hem, bottom
    // edge on the bottom of Apliiq's back print area. Both DTF. One saved
    // Apliiq design per colour; ids and per-size SKUs live in fulfillment.ts.
    colorVariants: [
      {
        name: "Black",
        supplierColor: "Black",
        hex: "#1E1E1E",
        skuFragment: "BLACK",
        images: [
          {
            src: "/products/GOOOL_STD_HOODIE_BLACK_BLUE_FRONT.webp",
            alt: "GOOOL Core Hoodie · Club Blue in black, front view",
          },
          {
            src: "/products/GOOOL_STD_HOODIE_BLACK_BLUE_BACK.webp",
            alt: "GOOOL Core Hoodie · Club Blue in black, back view",
          },
        ],
      },
      {
        name: "Bone",
        supplierColor: "Bone",
        hex: "#CFCAC7",
        skuFragment: "BONE",
        images: [
          {
            src: "/products/GOOOL_STD_HOODIE_BONE_BLUE_FRONT.webp",
            alt: "GOOOL Core Hoodie · Club Blue in bone, front view",
          },
          {
            src: "/products/GOOOL_STD_HOODIE_BONE_BLUE_BACK.webp",
            alt: "GOOOL Core Hoodie · Club Blue in bone, back view",
          },
        ],
      },
      // Grey Heather: Apliiq stores #F4F4F4 for this swatch and renders the
      // garment near-white; the blank photographs as a light heather. The
      // site hex is a compromise the owner may adjust. Club Blue set uses
      // the True Royal #1F4FB5 front on heather (handoff).
      {
        name: "Grey Heather",
        supplierColor: "Grey Heather",
        hex: "#D9D9D9",
        skuFragment: "GREYHEATHER",
        images: [
          {
            src: "/products/GOOOL_STD_HOODIE_GREYHEATHER_BLUE_FRONT.webp",
            alt: "GOOOL Core Hoodie · Club Blue in grey heather, front view",
          },
          {
            src: "/products/GOOOL_STD_HOODIE_GREYHEATHER_BLUE_BACK.webp",
            alt: "GOOOL Core Hoodie · Club Blue in grey heather, back view",
          },
        ],
      },
    ],
    // Garment made in China (Apliiq record); decorated at Apliiq's US
    // facilities (LA/Philadelphia) - so Printed in the USA, never Made in.
    originLabel: "Printed in the USA",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "hoodie",
    supplierType: "apliiq",
    isActive: false,
    availableForSale: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "70000000-0000-4000-8000-000000000003",
    name: "GOOOL Terrace Tee · Red",
    slug: "goool-heavyweight-casual-tee",
    // Two rows on the shop, one per print colour (owner, 2026-09-24): this
    // one is the 4a set (red centre dash on the front lockup, red club band
    // on the back); ...0005 below is the 4b Club Blue set. Same blank, same
    // placements, same price. The slug keeps the original casual-tee URL.
    description:
      "The wordmark, worn plainly, now with the full GOOOL Athletics lockup across the chest and the red club band across the back. Heavyweight combed cotton in black or natural. Built for off the pitch: the one you reach for every day, and keep reaching for.",
    priceCents: 3800,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#111111",
    // Bella+Canvas 3010, from Apliiq's own listing read 2026-09-23: "6 oz
    // heavyweight fabric, Airlume combed cotton, Relaxed modern fit, Drop
    // shoulder design, Double-needle neck stitching, Side seamed
    // construction, Pre-shrunk for consistency, Tear away label". "Combed"
    // is stated by the supplier for this blank, which is why it can be
    // said here when it was cut from the 4810GD copy as unsupported.
    fabric:
      "6 oz, 100% combed ring-spun cotton, pre-shrunk. Combed means the short fibres are carded out before spinning, which is why the surface reads smooth rather than fuzzy and why the print sits flat on it. Heavy enough that the cloth does the hanging, so the shirt keeps its own line.",
    fit:
      "Relaxed modern fit with a drop shoulder, side-seamed so it keeps its shape instead of twisting. True to size for a roomy fit. Size down for a more snug fit.",
    // No garment-dye warning: the 3010 is not garment-dyed, so the 4810GD's
    // "releases a little colour at first" line would have been false here.
    careInstructions: "Machine wash cold, inside out, with like colours. Tumble dry low. Do not iron directly on the print.",
    images: [
        {
          src: "/products/GOOOL_STD_CASUAL_3010_BLACK_RED_FRONT.webp",
          alt: "GOOOL Terrace Tee · Red in black, front view",
        },
        {
          src: "/products/GOOOL_STD_CASUAL_3010_BLACK_RED_BACK.webp",
          alt: "GOOOL Terrace Tee · Red in black, back view",
        },
      ],
    // Rebuilt on the Bella+Canvas 3010 on 2026-09-23/24 (owner decision,
    // designs/00_asset-library/CASUAL-TEE-3010-DECISION.md). Front: the
    // full GOOOL Athletics lockup 11.10 x 4.59 in, top 3.00 in below the
    // collar seam. Back: the 2l yoke band 12.00 x 2.00 in, top 1.50 in
    // below the back collar seam. Both DTF. Each colour is its own Apliiq
    // saved design; ids and per-size SKUs live in fulfillment.ts.
    colorVariants: [
      {
        name: "Black",
        supplierColor: "black",
        hex: "#111111",
        skuFragment: "BLACK",
        images: [
          {
            src: "/products/GOOOL_STD_CASUAL_3010_BLACK_RED_FRONT.webp",
            alt: "GOOOL Terrace Tee · Red in black, front view",
          },
          {
            src: "/products/GOOOL_STD_CASUAL_3010_BLACK_RED_BACK.webp",
            alt: "GOOOL Terrace Tee · Red in black, back view",
          },
        ],
      },
      // Natural · red band (4a-N): renders added 2026-09-24; Apliiq design
      // 6120889 (owner-saved the same day), mapped in fulfillment.ts.
      {
        name: "Natural",
        supplierColor: "Natural",
        hex: "#E8E2D3",
        skuFragment: "NATURAL",
        images: [
          {
            src: "/products/GOOOL_STD_CASUAL_3010_NATURAL_RED_FRONT.webp",
            alt: "GOOOL Terrace Tee · Red in natural, front view",
          },
          {
            src: "/products/GOOOL_STD_CASUAL_3010_NATURAL_RED_BACK.webp",
            alt: "GOOOL Terrace Tee · Red in natural, back view",
          },
        ],
      },
    ],
    // Garment: Bella+Canvas 3010 (imported blank per the supplier's
    // records); decorated at Apliiq's US facilities - Printed in the USA,
    // never Made in.
    originLabel: "Printed in the USA",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "tshirt",
    supplierType: "apliiq",
    isActive: false,
    // Purchasing opened by the owner on 2026-09-24 ("ensure all new
    // products are able to be purchased"): both colours map to saved
    // Apliiq designs (Black 6120860, Natural 6120889) and the products
    // row for this id exists in Supabase.
    availableForSale: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "70000000-0000-4000-8000-000000000005",
    name: "GOOOL Terrace Tee · Club Blue",
    slug: "goool-heavyweight-casual-tee-blue",
    // The 4b set: GOOOL and ATHLETICS in Club Blue #3D6CC4 on the front
    // (ink dashes on natural, natural dashes on black), Club Blue band with
    // natural lettering on the back. Its own row on the shop by owner
    // decision 2026-09-24 (the handoff's "band selector on one product"
    // alternative was not taken).
    description:
      "The wordmark, worn plainly, now with the full GOOOL Athletics lockup in club blue across the chest and the blue club band across the back. Heavyweight combed cotton in natural or black. Built for off the pitch: the one you reach for every day, and keep reaching for.",
    priceCents: 3800,
    compareAtPriceCents: null,
    color: "Natural",
    colorHex: "#E8E2D3",
    // Bella+Canvas 3010, from Apliiq's own listing read 2026-09-23: "6 oz
    // heavyweight fabric, Airlume combed cotton, Relaxed modern fit, Drop
    // shoulder design, Double-needle neck stitching, Side seamed
    // construction, Pre-shrunk for consistency, Tear away label". "Combed"
    // is stated by the supplier for this blank, which is why it can be
    // said here when it was cut from the 4810GD copy as unsupported.
    fabric:
      "6 oz, 100% combed ring-spun cotton, pre-shrunk. Combed means the short fibres are carded out before spinning, which is why the surface reads smooth rather than fuzzy and why the print sits flat on it. Heavy enough that the cloth does the hanging, so the shirt keeps its own line.",
    fit:
      "Relaxed modern fit with a drop shoulder, side-seamed so it keeps its shape instead of twisting. True to size for a roomy fit. Size down for a more snug fit.",
    // No garment-dye warning: the 3010 is not garment-dyed, so the 4810GD's
    // "releases a little colour at first" line would have been false here.
    careInstructions: "Machine wash cold, inside out, with like colours. Tumble dry low. Do not iron directly on the print.",
    images: [
        {
          src: "/products/GOOOL_STD_CASUAL_3010_NATURAL_BLUE_FRONT.webp",
          alt: "GOOOL Terrace Tee · Club Blue in natural, front view",
        },
        {
          src: "/products/GOOOL_STD_CASUAL_3010_NATURAL_BLUE_BACK.webp",
          alt: "GOOOL Terrace Tee · Club Blue in natural, back view",
        },
      ],
    // Same placements as the red set: front lockup 11.10 x 4.59 in, top
    // 3.00 in below the collar seam; back band 12.00 x 2.00 in, top 1.50 in
    // below the back collar seam. Both DTF.
    colorVariants: [
      {
        name: "Natural",
        supplierColor: "Natural",
        hex: "#E8E2D3",
        skuFragment: "NATURAL",
        images: [
          {
            src: "/products/GOOOL_STD_CASUAL_3010_NATURAL_BLUE_FRONT.webp",
            alt: "GOOOL Terrace Tee · Club Blue in natural, front view",
          },
          {
            src: "/products/GOOOL_STD_CASUAL_3010_NATURAL_BLUE_BACK.webp",
            alt: "GOOOL Terrace Tee · Club Blue in natural, back view",
          },
        ],
      },
      // Black · Club Blue (4b black): Apliiq design 6120898, built to the
      // handoff spec on 2026-09-24 and mapped in fulfillment.ts; renders
      // supplied by the owner the same night.
      {
        name: "Black",
        supplierColor: "black",
        hex: "#111111",
        skuFragment: "BLACK",
        images: [
          {
            src: "/products/GOOOL_STD_CASUAL_3010_BLACK_BLUE_FRONT.webp",
            alt: "GOOOL Terrace Tee · Club Blue in black, front view",
          },
          {
            src: "/products/GOOOL_STD_CASUAL_3010_BLACK_BLUE_BACK.webp",
            alt: "GOOOL Terrace Tee · Club Blue in black, back view",
          },
        ],
      },
    ],
    // Garment: Bella+Canvas 3010 (imported blank per the supplier's
    // records); decorated at Apliiq's US facilities - Printed in the USA,
    // never Made in.
    originLabel: "Printed in the USA",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "tshirt",
    supplierType: "apliiq",
    isActive: false,
    // Purchasing opened by the owner on 2026-09-24 ("open all four ...
    // there should be no shirt not available for sale unless I say so").
    // Both colours map to saved Apliiq designs (Natural 6120887, Black
    // 6120898). The Supabase products row for this id is created on
    // demand by the order store (ensureProductRow) until migration 0034
    // has been applied.
    availableForSale: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "70000000-0000-4000-8000-000000000004",
    name: "GOOOL Touchline Cap",
    slug: "goool-touchline-cap",
    description:
      "Structured five-panel cap in black and natural. Flat-embroidered GOOOL wordmark on the front panel, curved visor, adjustable snap.",
    // $48, not $36: the embroidered cap costs $29.88/unit on Apliiq's dropship
    // rate (blank $14.06 + flat embroidery), the highest decoration cost in the
    // catalog. At $36 that was a 17% margin - the only product under the floor.
    // $48 puts it at 38% without depending on the VIP subscription.
    priceCents: 3200,
    compareAtPriceCents: null,
    color: "Black/Natural",
    colorHex: "#E4DFC9",
    // OTTO 31-069. This cap owns the buckram explanation.
    // "Collapse" is deliberate: the care line on this same product already
    // warns that a machine wash "will collapse the structured front panel",
    // so it is this brand's own word for the failure mode.
    fabric:
      "65% polyester, 35% cotton twill over a firm buckram front. Buckram is the stiffener behind the front panel, and it is what holds the crown up instead of letting it collapse.",
    fit:
      "Adjustable · One Size. Structured mid-profile crown, slightly curved visor, plastic snap at the back.",
    careInstructions: "Spot clean with cool water and a soft cloth. Do not machine wash or tumble dry, it will collapse the structured front panel. Air dry only.",
    images: [
      {
        src: "/products/GOOOL_STD_TOUCHLINE_CAP_FRONT.webp",
        alt: "GOOOL Touchline Cap in black and natural, front view",
      },
      {
        src: "/products/GOOOL_STD_TOUCHLINE_CAP_BACK.webp",
        alt: "GOOOL Touchline Cap in black and natural, back view",
      },
    ],
    sizes: ["OS"],
    category: "hat",
    supplierType: "apliiq",
    isActive: false,
    availableForSale: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },

  // == GOOOL Athletics (Coming Soon; owner-authorized 30% modeled margin) ==
  // Cost model: designs/18_launch_operations/PRICING-25-PERCENT.json.
  // The MODEL in that file is still the authority (2.9% + $0.30 card
  // fee, 5% reprint reserve, $3 label budget, $1/item fulfillment, size
  // surcharge on the worst size). Its PRICES are superseded: the owner
  // raised the floor from 25% to 30% of the worst-size landed cost on
  // 2026-09-22 and every product was recomputed against fresh Apliiq
  // dropship quotes read that day. Price = lowest value ending in 8 at
  // or above (landed + 0.30) / 0.621.
  //
  // The single biggest lever here is the $3 label budget, which that
  // file itself flags as an unverified contingency. It is ~8 points on
  // a $38 tee. Drop the label program and the floors fall roughly one
  // step: crewneck $98, performance tee $48, badge tee $38.
  // Cotton Modern Sport is archived for a performance-only launch.
  // Saved-design garment/print costs are verified; labeling, shipping and
  // sample approval remain launch gates. Pricing does not authorize sales.
  // Keep supplierType unassigned and availableForSale false until readiness
  // is verified. Gallery images remain disclosed concept renders.
  {
    id: "80000000-0000-4000-8000-000000000001",
    name: "GOOOL Athletics Modern Sport Tee",
    slug: "goool-athletics-modern-sport-tee",
    description:
      "Bold, forward-leaning GOOOL in white across the chest, a red underline, and widely spaced ATHLETICS beneath. Small white GOOOL Athletics mark at the upper back. Solid black crewneck.",
    // Archived (isActive false), but priced on the same basis as the
    // rest so it is correct if it is ever revived. The $64 it carried
    // until 2026-09-22 was never a considered price: this cotton
    // version was archived in favour of the ST720 performance twin, so
    // PRICING-25-PERCENT.json skips it and nothing ever repriced it.
    // Quote $24.48, worst-size landed $30.48, floor $49.57 -> $58.
    priceCents: 5800,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#0A0A0A",
    fabric: "Cotton crewneck tee, opaque, rib collar.",
    fit: "Relaxed body with a moderate dropped shoulder.",
    careInstructions: "Machine wash cold, inside out, with like colours. Tumble dry low. Do not bleach. Do not iron directly on the print.",
    images: [
      {
        src: "/products/GOOOL_STD_MODERN_SPORT_FRONT.webp",
        alt: "GOOOL Athletics Modern Sport Tee in black, front view",
      },
      {
        src: "/products/GOOOL_STD_MODERN_SPORT_BACK.webp",
        alt: "GOOOL Athletics Modern Sport Tee in black, back view",
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "tshirt",
    supplierType: "unassigned",
    isActive: false,
    availableForSale: true,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "80000000-0000-4000-8000-000000000002",
    name: "GOOOL Athletics Varsity Tee",
    slug: "goool-athletics-varsity-tee",
    description:
      "Garment-dyed heavyweight tee in washed black or washed navy. Arched collegiate GOOOL in warm ivory with a dark red outline, ATHLETICS below between short rules, across the chest.",
    priceCents: 4800,
    compareAtPriceCents: null,
    color: "Washed Black",
    colorHex: "#262626",
    // Bella+Canvas 4810GD. This line used to defer to the Casual Wordmark
    // Tee ("the same ... as the Casual Wordmark Tee"), which shared the
    // blank and owned the garment-dye explanation. That tee was retired on
    // 2026-09-23, so the reference would have sent customers looking for a
    // product that no longer exists; the line now stands on its own.
    //
    // Two things were drafted and cut. "18 singles" is in the spec, but a
    // yarn count means nothing to a customer and explaining it ("a thick
    // yarn") is imported textile knowledge the packet does not state, and
    // the count runs backwards from intuition. Same test that cut "combed".
    // "Made in Nicaragua" is documented, but originLabel in types.ts is a
    // typed field with two permitted values under the FTC all-or-virtually-
    // all standard, and it says origin is never inferred. Country of origin
    // does not go in free text. Side-seaming is real and lives in the fit
    // row directly beneath this one, so it is not repeated here.
    fabric:
      "6.5 oz garment-dyed ring-spun cotton. Heavy enough that the cloth does the hanging, so the shirt keeps its own line rather than following whatever is underneath it.",
    // Bella+Canvas 4810GD. The
    // spec says "relaxed fit; semi-dropped shoulder; side-seamed", so
    // that is what this says. It read "moderate dropped shoulder"
    // before, which was nobody's word for it.
    fit:
      "Relaxed body with a semi-dropped shoulder, side-seamed so it keeps its shape instead of hanging straight.",
    careInstructions: "Machine wash cold, inside out, with like colours. Garment-dyed fabric releases a little colour at first, so wash separately for the first few washes. Tumble dry low. Do not iron directly on the print.",
    images: [
      {
        src: "/products/GOOOL_STD_VARSITY_FRONT.webp",
        alt: "GOOOL Athletics Varsity Tee in washed black, front view",
      },
      {
        src: "/products/GOOOL_STD_VARSITY_BACK.webp",
        alt: "GOOOL Athletics Varsity Tee in washed black, back view",
      },
    ],
    // Colorways mirror the saved Apliiq designs (Washed Black 6114178, Washed
    // Navy 6114196) - front print only, 12.5in GA-02-F (scaled up from 11in
    // 2026-09-21; 14in was tested and rejected for crowding the sleeve
    // seams). The back mark (GA-02-B) was dropped 2026-09-21: on this blank,
    // Back Box 1 starts too low to reach the site's concept placement, so
    // the owner chose to cut the back print rather than ship a mismatched
    // garment. 6112032 (front+back) and 6113914/6113912 (front-only, 11in)
    // are superseded and marked VOID in Apliiq.
    colorVariants: [
      {
        name: "Washed Black",
        supplierColor: "Washed Black",
        hex: "#262626",
        skuFragment: "WBLACK",
        images: [
          {
            src: "/products/GOOOL_STD_VARSITY_FRONT.webp",
            alt: "GOOOL Athletics Varsity Tee in washed black, front view",
          },
          {
            src: "/products/GOOOL_STD_VARSITY_BACK.webp",
            alt: "GOOOL Athletics Varsity Tee in washed black, back view",
          },
        ],
      },
      {
        name: "Washed Navy",
        supplierColor: "Washed Navy",
        hex: "#414C67",
        skuFragment: "WNAVY",
        images: [
          {
            src: "/products/GOOOL_STD_VARSITY_WASHED_NAVY_FRONT.webp",
            alt: "GOOOL Athletics Varsity Tee in washed navy, front view",
          },
          {
            src: "/products/GOOOL_STD_VARSITY_WASHED_NAVY_BACK.webp",
            alt: "GOOOL Athletics Varsity Tee in washed navy, back view",
          },
        ],
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "tshirt",
    supplierType: "unassigned",
    // Retired from the website on 2026-09-24 (owner): the Core Capsule
    // launches on Friday 2026-09-25 with the new uploads only. The Apliiq
    // saved designs stay on the account; the fulfillment mapping is kept
    // for the record. Route 301s to /shop in src/middleware.ts.
    isActive: false,
    availableForSale: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "80000000-0000-4000-8000-000000000003",
    // RETIRED 2026-09-22, print defect. Measured at the actual 3.5in
    // print width, the narrow stroke of the "I" in ATHLETICS is about
    // 1.19mm. Apliiq's transfer guidance asks for 2mm minimum, so the
    // letter is liable to break up or close in on the press. That is a
    // fault in the artwork, not the render, and no customer order
    // should reach it: isActive false takes it out of every listing and
    // availableForSale false refuses a purchase even by direct id.
    // Revive only with corrected artwork that passes the 2mm check at
    // actual size AND a physical proof.
    name: "GOOOL Athletics Minimal Club Tee",
    slug: "goool-athletics-minimal-club-tee",
    description:
      "Natural cream heavyweight tee. GOOOL Athletics badge at the left chest, full GOOOL ATHLETICS with a red underline across the upper back.",
    priceCents: 4800,
    compareAtPriceCents: null,
    color: "Natural",
    colorHex: "#E5E5DD",
    fabric: "Cotton crewneck tee, natural cream, opaque, rib collar.",
    fit: "Relaxed body with a moderate dropped shoulder.",
    careInstructions: "Machine wash cold, inside out, with like colours. Tumble dry low. Do not bleach. Do not iron directly on the print.",
    images: [
      {
        src: "/products/GOOOL_STD_MINIMAL_CLUB_FRONT.webp",
        alt: "GOOOL Athletics Minimal Club Tee in natural cream, front view",
      },
      {
        src: "/products/GOOOL_STD_MINIMAL_CLUB_BACK.webp",
        alt: "GOOOL Athletics Minimal Club Tee in natural cream, back view",
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "tshirt",
    supplierType: "unassigned",
    isActive: false,
    availableForSale: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  // Circular-logo family (designs/16_goool_athletics/circular_logo/,
  // 2026-09-20): twelve archived options; only GA-CIRCLE-08 and
  // GA-CIRCLE-09 were designated for the site. Both blanks are now
  // verified with the supplier: Comfort Colors C1717 Ivory, and AS
  // Colour 5150 Made Crew in Athletic Heather (that blank offers no
  // color literally named "gray heather"; Athletic Heather is its only
  // heather gray and the owner approved it on 2026-09-21, so the
  // "Gray Heather" strings below stay as descriptive site copy).
  // Sales opened 2026-09-22. Note that neither of these two has been
  // printed physically: the only samples received were the Performance
  // Badge Tee and the original Casual Wordmark. A customer order is
  // now the first physical proof of these marks.
  {
    id: "80000000-0000-4000-8000-000000000004",
    name: "GOOOL Athletics Circular Badge Tee",
    slug: "goool-athletics-circular-badge-tee",
    description:
      "Ivory heavyweight tee. Navy circular GOOOL Athletics badge at the left chest, the letters themselves forming the ring.",
    priceCents: 4800,
    compareAtPriceCents: null,
    color: "Ivory",
    colorHex: "#E9E1D7",
    // Comfort Colors C1717, from the supplier's own listing:
    // apliiq.com/customize/mens/tshirts/Comfort-Colors-Heavyweight-T-Shirt,
    // retrieved 2026-09-23. Material "100% cotton"; features list "soft
    // ring-spun cotton", "garment-dyed finish", "heavyweight cotton build",
    // "durable rib collar", "shoulder twill tape". No oz figure is
    // published for this blank, so none is quoted - "heavyweight" is the
    // supplier's own word, not ours.
    //
    // What stood here before was "Premium heavyweight cotton crewneck tee,
    // ivory" - a human-written line with nothing behind it, on a product
    // whose own care copy already warned that garment-dyed fabric releases
    // colour. The care copy was ahead of the fabric copy.
    // Comfort Colors C1717, from the supplier listing retrieved 2026-09-23:
    // 100% cotton, "soft ring-spun cotton", "garment-dyed finish",
    // "heavyweight cotton build", "shoulder twill tape".
    //
    // No ounce figure appears here because the supplier publishes none for
    // this blank. Rather than borrow the 4810GD's 6.5 oz or infer one from
    // the word heavyweight, the line says whose word "heavyweight" is.
    //
    // "Durable rib collar" is in the spec and is deliberately not used: it
    // is the supplier rating their own part, which is the shape of claim
    // that got "Premium Quality" removed from the benefit bar. The tape
    // claim is kept to what a shoulder tape actually does, stabilise the
    // seam under load. It does not promise the collar will never slacken.
    fabric:
      "Ring-spun cotton, garment-dyed and heavyweight. Twill tape runs along both shoulder seams and takes the weight the stitching would otherwise carry alone, so the shoulders do not pull out of line.",
    // The supplier flags this blank as running big, with a wide boxy 90s
    // cut, and recommends sizing down for a closer fit. All sales are
    // final, so that belongs on the product page and not only in the
    // size chart. Three other products share the old wording - this
    // change is deliberately scoped to the C1717 alone.
    // Comfort Colors C1717. The supplier documents a relaxed everyday
    // fit, a wide boxy cut and a recommendation to size down. It does
    // NOT document a shoulder drop, and this line used to claim one,
    // inherited from a string four products shared across three blanks.
    fit:
      "Relaxed everyday fit, cut wide and boxy in the throwback 90s way. It runs big: size down for a more snug fit.",
    careInstructions: "Machine wash cold, inside out, with like colours. Garment-dyed fabric releases a little colour at first, so wash separately for the first few washes. Tumble dry low. Do not iron directly on the print.",
    images: [
      {
        src: "/products/GOOOL_STD_CIRCULAR_BADGE_FRONT.webp",
        alt: "GOOOL Athletics Circular Badge Tee in ivory, front view",
      },
      {
        src: "/products/GOOOL_STD_CIRCULAR_BADGE_BACK.webp",
        alt: "GOOOL Athletics Circular Badge Tee in ivory, back view",
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "tshirt",
    supplierType: "unassigned",
    // Retired from the website on 2026-09-24 (owner): the Core Capsule
    // launches on Friday 2026-09-25 with the new uploads only. The Apliiq
    // saved designs stay on the account; the fulfillment mapping is kept
    // for the record. Route 301s to /shop in src/middleware.ts.
    isActive: false,
    availableForSale: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "80000000-0000-4000-8000-000000000005",
    name: "GOOOL Athletics Circular Center Crewneck",
    slug: "goool-athletics-circular-center-crewneck",
    description:
      "Gray heather French terry crewneck. Forest green circular GOOOL Athletics mark centered on the upper chest, the letters themselves forming the ring.",
    priceCents: 8800,
    compareAtPriceCents: null,
    color: "Gray Heather",
    colorHex: "#B2B2B2",
    // AS Colour 5150 Made Crew. The weight here did NOT come from this
    // repo, and that matters: 0028_goool_athletics_circular.sql:33 had
    // deferred it ("Blank and fabric weight are confirmed at sample
    // approval"), and package 13 contains two figures that look like
    // answers but are not - an "approximately 200-240 GSM" RFQ target, and
    // a "6.5 oz/yd2 ... ring-spun" boilerplate block copied byte-identical
    // into all 14 package folders. Neither describes this blank.
    //
    // 14.7 oz is read off the supplier's own listing for the blank:
    // apliiq.com/customize/mens/sweatshirts/Made-Crew, retrieved
    // 2026-09-23, which states "heavyweight, 14.7 oz fabric", "100% cotton
    // french terry", drop shoulder, inset sleeve, preshrunk. This is the
    // heaviest piece in the range.
    // AS Colour 5150, supplier listing retrieved 2026-09-23: "heavyweight,
    // 14.7 oz fabric", 100% cotton French terry, preshrunk.
    //
    // "The heaviest piece in the range" is arithmetic, not a boast: 14.7
    // against 10 (IND4000), 6.5 (4810GD) and 3.8 (ST720). The C1717 has no
    // published figure, but it is a tee and cannot outweigh a French terry
    // crew. Re-check this sentence if a heavier piece is ever added.
    fabric:
      "14.7 oz 100% cotton French terry, the heaviest piece in the range. You feel the weight land on the shoulders going on. Preshrunk, so the fit you buy is the fit you keep.",
    fit:
      "Relaxed crewneck fit with a drop shoulder and inset sleeve. Ribbed collar, cuffs and hem.",
    careInstructions: "Machine wash cold, inside out, with like colours. Tumble dry low or lay flat to keep the shape. Do not bleach. Do not iron directly on the print.",
    images: [
      {
        src: "/products/GOOOL_STD_CIRCULAR_CREWNECK_FRONT.webp",
        alt: "GOOOL Athletics Circular Center Crewneck in gray heather, front view",
      },
      {
        src: "/products/GOOOL_STD_CIRCULAR_CREWNECK_BACK.webp",
        alt: "GOOOL Athletics Circular Center Crewneck in gray heather, back view",
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "hoodie",
    supplierType: "unassigned",
    // Retired from the website on 2026-09-24 (owner): the Core Capsule
    // launches on Friday 2026-09-25 with the new uploads only. The Apliiq
    // saved designs stay on the account; the fulfillment mapping is kept
    // for the record. Route 301s to /shop in src/middleware.ts.
    isActive: false,
    availableForSale: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  // Modern Sport is performance-only for launch; cotton remains archived.
  // Back print V6 (2026-09-25): the 3.25 in back failed Apliiq's 2 mm
  // minimum when measured (ATHLETICS gaps 1.45 mm), so the back is now
  // 5.00 x 1.812 in with wider spacing; smallest stroke 3.03 mm, smallest
  // gap 2.58 mm. Front GA-01-F v3 at 11 x 3.72 in is unchanged. White
  // colourway added with ink versions of the same files. Package,
  // measurements and Apliiq steps: designs/31_matchday-tee-v6-all-colours-2026-09-25/.
  // Back renders are V6; fronts stay V3. All images remain concept renders.
  {
    id: "80000000-0000-4000-8000-000000000006",
    name: "GOOOL Matchday Tee",
    slug: "goool-athletics-modern-sport-performance-tee",
    // Welcome Email 2 describes a tri-blend and is gated on this value:
    // it flips to "BC3413" in the same commit that swaps the blank.
    blank: "ST720",
    description:
      "Performance training tee in black, true royal or white. GOOOL with a red underline and spaced ATHLETICS across the chest, GOOOL Athletics mark at the upper back.",
    priceCents: 3800,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#0A0A0A",
    // Same blank as the Core Badge Tee - Sport-Tek ST720, see
    // fulfillment.ts - so it carries the supplier's spec, not a vaguer
    // paraphrase of it.
    // Sport-Tek ST720, the same blank as the Core Badge Tee, so the
    // subjects are split rather than the wording varied. Taped neck,
    // tear-away removable label and set-in sleeves are all in the packet
    // and the supplier listing; "full range of motion" is the supplier's
    // own phrase for the lightweight construction.
    fabric:
      "3.8 oz is not much shirt, and that is the point. The same recycled polyester as the Core Badge Tee, taped at the neck with a label that tears out, so nothing sits raw against your skin. Set-in sleeves follow the line of the shoulder and leave the arm its full range.",
    fit: ST720_FIT,
    careInstructions: "Machine wash cold, inside out. Tumble dry low. Skip the fabric softener, it coats the fibres and reduces wicking. Do not iron directly on the print.",
    images: [
      {
        src: "/products/GOOOL_MODERN_PERFORMANCE_FRONT_V3.png",
        alt: "GOOOL Matchday Tee in black, front view with the white GOOOL wordmark, red underline and ATHLETICS",
      },
      {
        src: "/products/GOOOL_MODERN_PERFORMANCE_BACK_DETAIL_V6.png",
        alt: "Close-up concept of the Matchday Tee's white upper-back GOOOL Athletics print",
        caption: "Back print detail - concept render. Not a photograph of a manufactured sample.",
      },
    ],
    // Second colourway approved by the owner 2026-09-21. True Royal is a
    // stock ST720 colour (Apliiq colour 371, #2e48b6) on the SAME blank as
    // Black, with the SAME artwork files at the same sizes, so the two
    // colourways differ only in garment colour.
    colorVariants: [
      {
        name: "Black",
        supplierColor: "Black",
        hex: "#373737",
        skuFragment: "BLACK",
        images: [
          {
            src: "/products/GOOOL_MODERN_PERFORMANCE_FRONT_V3.png",
            alt: "GOOOL Matchday Tee in black, front view with the white GOOOL wordmark, red underline and ATHLETICS",
          },
          {
            src: "/products/GOOOL_MODERN_PERFORMANCE_BACK_DETAIL_V6.png",
            alt: "Close-up concept of the Matchday Tee's white upper-back GOOOL Athletics print, black garment",
            caption: "Back print detail - concept render. Not a photograph of a manufactured sample.",
          },
        ],
      },
      {
        name: "True Royal",
        supplierColor: "true royal",
        // Sampled from Apliiq's OWN rendered garment for saved design
        // 6113361, not from their swatch hex. Their API reports the
        // swatch as #2E48B6, but the rendered garment body measures
        // #354CAA - softer and less saturated. The render is what
        // actually ships, so it governs both this swatch and the imagery.
        hex: "#354CAA",
        skuFragment: "ROYAL",
        images: [
          {
            src: "/products/GOOOL_MODERN_PERFORMANCE_ROYAL_FRONT_V3.png",
            alt: "GOOOL Matchday Tee in true royal blue, front view with the white GOOOL wordmark, red underline and ATHLETICS",
          },
          {
            src: "/products/GOOOL_MODERN_PERFORMANCE_ROYAL_BACK_DETAIL_V6.png",
            alt: "Close-up concept of the Matchday Tee's white upper-back GOOOL Athletics print, true royal blue garment",
            caption: "Back print detail - concept render. Not a photograph of a manufactured sample.",
          },
        ],
      },
      // Third colourway from the 2026-09-25 package: ink versions of the
      // same two files on the white ST720. Apliiq saved design 6136511
      // (fulfillment.ts) since 2026-09-25, so it sells like the others.
      // Hex sampled from the lit body of Apliiq's own mockup render for
      // that design (their swatch is a flat #FFFFFF; the garment reads
      // #E7E7E7), so the swatch matches what ships.
      {
        name: "White",
        supplierColor: "white",
        hex: "#E7E7E7",
        skuFragment: "WHITE",
        images: [
          {
            src: "/products/GOOOL_MODERN_PERFORMANCE_WHITE_FRONT_V3.png",
            alt: "GOOOL Matchday Tee in white, front view with the black GOOOL wordmark, red underline and ATHLETICS",
          },
          {
            src: "/products/GOOOL_MODERN_PERFORMANCE_WHITE_BACK_DETAIL_V6.png",
            alt: "Close-up concept of the Matchday Tee's black upper-back GOOOL Athletics print, white garment",
            caption: "Back print detail - concept render. Not a photograph of a manufactured sample.",
          },
        ],
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "tshirt",
    supplierType: "unassigned",
    isActive: false,
    availableForSale: false,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  // ── Embroidered caps on the OTTO 31-069, added 2026-09-22 ──────────
  // Same blank and the same decoration route as the Touchline Cap, so the
  // cost structure is identical: Apliiq charges a flat $11 dropship fee on
  // embroidery regardless of stitch count until 15,000.
  //
  // Both marks were rebuilt to clear Apliiq's PUBLISHED embroidery limits,
  // not a guessed minimum: 2mm smallest detail, and 1/4in (6.35mm) letter
  // height below which they call text "not acceptable" and will neither
  // remake nor refund. See designs/23_cap-embroidery-2026-09-22/.
  {
    id: "80000000-0000-4000-8000-000000000007",
    name: "GOOOL Athletics Badge Cap",
    slug: "goool-athletics-badge-cap",
    description:
      "Structured five-panel cap in black and natural. The circular GOOOL Athletics badge embroidered on the front panel, curved visor, adjustable snap.",
    // $48 matches the Touchline Cap and lands on the same economics:
    // dropship $29.88 leaves 37.8% gross before payment fees and shipping.
    priceCents: 3200,
    compareAtPriceCents: null,
    color: "Black/Natural",
    colorHex: "#E4DFC9",
    // OTTO 31-069, described by the packet as a "structured seamless
    // five-panel mid-profile cap". This cap owns the seamless front,
    // because of the three marks this is the one where a seam would show
    // worst: it is a closed ring.
    fabric:
      "No seam runs through the front panel, which matters more here than on most caps: this badge is a ring, and a seam crossing a ring shows. The embroidery lands on one unbroken piece of 65/35 twill, which is the difference between a mark that sits flat and a mark that fights a seam.",
    fit:
      "Adjustable · One Size. Structured mid-profile crown, slightly curved visor, plastic snap at the back.",
    careInstructions: "Spot clean with cool water and a soft cloth. Do not machine wash or tumble dry, it will collapse the structured front panel. Air dry only.",
    images: [
      {
        src: "/products/GOOOL_STD_BADGE_CAP_FRONT.webp",
        alt: "GOOOL Athletics Badge Cap in black and natural, front view",
      },
      {
        src: "/products/GOOOL_STD_BADGE_CAP_BACK.webp",
        alt: "GOOOL Athletics Badge Cap in black and natural, back view",
      },
    ],
    sizes: ["OS"],
    category: "hat",
    supplierType: "apliiq",
    isActive: false,
    availableForSale: false, // migration 0033 applied 2026-09-23; the
    // products row exists, so order_items.product_id satisfies its FK.
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "80000000-0000-4000-8000-000000000008",
    name: "GOOOL Athletics Stacked Cap",
    slug: "goool-athletics-stacked-cap",
    description:
      "Structured five-panel cap in black and natural. GOOOL over a red rule with ATHLETICS beneath, embroidered across the front panel, curved visor, adjustable snap.",
    // Also $48, to hold one price across the cap line. Be aware this one
    // is the thinnest product in the catalog: at 22,313 stitches its
    // dropship is $33.08, leaving 31.1% gross before fees and shipping.
    priceCents: 3200,
    compareAtPriceCents: null,
    color: "Black/Natural",
    colorHex: "#E4DFC9",
    // OTTO 31-069. Buckram belongs to the Touchline Cap and the seamless
    // front to the Badge Cap, so this one owns the cloth itself. Defining
    // the weave is the same move as defining buckram and face yarn.
    // Everything else true of this blank is already in the fit row.
    fabric:
      "65% polyester, 35% cotton twill. Twill is the diagonal weave you can see close up in the cloth, and it is what gives a cap enough body to hold a stitched mark without the fabric going soft around it.",
    fit:
      "Adjustable · One Size. Structured mid-profile crown, slightly curved visor, plastic snap at the back.",
    careInstructions: "Spot clean with cool water and a soft cloth. Do not machine wash or tumble dry, it will collapse the structured front panel. Air dry only.",
    images: [
      {
        src: "/products/GOOOL_STD_ATHLETICS_CAP_FRONT.webp",
        alt: "GOOOL Athletics Stacked Cap in black and natural, front view",
      },
      {
        src: "/products/GOOOL_STD_ATHLETICS_CAP_BACK.webp",
        alt: "GOOOL Athletics Stacked Cap in black and natural, back view",
      },
    ],
    sizes: ["OS"],
    category: "hat",
    supplierType: "apliiq",
    isActive: false,
    availableForSale: false, // migration 0033 applied 2026-09-23; the
    // products row exists, so order_items.product_id satisfies its FK.
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  // == GOAL Athletics hats (owner upload 2026-10-14) ==
  // OTTO 31-069 Natural caps saved on Apliiq by the owner 2026-10-14; one
  // Apliiq design per colourway, mapped in fulfillment.ts. Visible but not
  // purchasable until checkout is verified separately (owner brief).
  {
    id: "80000000-0000-4000-8000-000000000009",
    name: "GA Matchday Cap",
    slug: "goal-athletics-monogram-cap",
    description:
      "Structured five-panel cap with a natural front and a coloured visor. GA monogram embroidered on the front panel, adjustable snap.",
    priceCents: 3200,
    compareAtPriceCents: null,
    color: "Black/Natural",
    colorHex: "#111111",
    fabric:
      "65% polyester, 35% cotton twill over a firm buckram front. Buckram is the stiffener behind the front panel, and it is what holds the crown up instead of letting it collapse.",
    fit:
      "Adjustable · One Size. Structured mid-profile crown, slightly curved visor, plastic snap at the back.",
    careInstructions: "Spot clean with cool water and a soft cloth. Do not machine wash or tumble dry, it will collapse the structured front panel. Air dry only.",
    images: [
      {
        src: "/products/goal-monogram-cap-black-catalog-product-front-20261022.webp",
        alt: "GA Matchday Cap in Black/Natural, front view: natural crown with the black GA monogram embroidered on the front panel and a black visor",
      },
      {
        src: "/products/goal-monogram-cap-black-catalog-model-front-20261022.webp",
        alt: "Model facing forward wearing the Black/Natural GA Matchday Cap with a charcoal tee, black shorts and white sneakers",
      },
      {
        src: "/products/goal-monogram-cap-black-catalog-model-three-quarter-20261022.webp",
        alt: "Same model in a three-quarter turn, showing the black GA monogram on the natural front panel of the cap",
      },
      {
        src: "/products/goal-monogram-cap-black-catalog-model-side-20261022.webp",
        alt: "Same model turned to the side, showing the black visor and crown profile of the cap",
      },
    ],
    colorVariants: [
      {
        name: "Black/Natural",
        supplierColor: "Black/Natural",
        hex: "#111111",
        skuFragment: "BLACK",
        // Black/Natural shows the owner's four catalog photos (2026-10-22),
        // product shot first; it is the card's default colourway, so the
        // product shot is also the catalog card. Its Apliiq render was
        // retired. Records: designs/49_ga-matchday-cap-black-photos-2026-10-22/
        // and docs/catalog/ga-matchday-cap-black-20261022.json.
        images: [
          {
            src: "/products/goal-monogram-cap-black-catalog-product-front-20261022.webp",
            alt: "GA Matchday Cap in Black/Natural, front view: natural crown with the black GA monogram embroidered on the front panel and a black visor",
          },
          {
            src: "/products/goal-monogram-cap-black-catalog-model-front-20261022.webp",
            alt: "Model facing forward wearing the Black/Natural GA Matchday Cap with a charcoal tee, black shorts and white sneakers",
          },
          {
            src: "/products/goal-monogram-cap-black-catalog-model-three-quarter-20261022.webp",
            alt: "Same model in a three-quarter turn, showing the black GA monogram on the natural front panel of the cap",
          },
          {
            src: "/products/goal-monogram-cap-black-catalog-model-side-20261022.webp",
            alt: "Same model turned to the side, showing the black visor and crown profile of the cap",
          },
        ],
      },
      {
        name: "Red/Natural",
        supplierColor: "Red/Natural",
        hex: "#C8102E",
        skuFragment: "RED",
        // Red/Natural shows the owner's four catalog photos (2026-10-22);
        // its Apliiq render was retired from public/products. Records:
        // designs/46_ga-matchday-cap-red-photos-2026-10-22/ and
        // docs/catalog/ga-matchday-cap-red-20261022.json.
        images: [
          {
            src: "/products/goal-monogram-cap-red-catalog-product-front-20261022.webp",
            alt: "GA Matchday Cap in Red/Natural, front view: natural crown with the red GA monogram embroidered on the front panel and a red visor",
          },
          {
            src: "/products/goal-monogram-cap-red-catalog-model-front-20261022.webp",
            alt: "Model facing forward wearing the Red/Natural GA Matchday Cap with a grey tee, black shorts and white sneakers",
          },
          {
            src: "/products/goal-monogram-cap-red-catalog-model-three-quarter-20261022.webp",
            alt: "Same model in a three-quarter turn, showing the red GA monogram on the natural front panel of the cap",
          },
          {
            src: "/products/goal-monogram-cap-red-catalog-model-side-20261022.webp",
            alt: "Same model turned to the side, showing the red visor and crown profile of the cap",
          },
        ],
      },
      {
        name: "Royal/Natural",
        supplierColor: "Royal/Natural",
        hex: "#1F2F6B",
        skuFragment: "ROYAL",
        // Royal/Natural shows the owner's four catalog photos (2026-10-22),
        // product shot first; its Apliiq render was retired. Records:
        // designs/47_ga-matchday-cap-royal-photos-2026-10-22/ and
        // docs/catalog/ga-matchday-cap-royal-20261022.json.
        images: [
          {
            src: "/products/goal-monogram-cap-royal-catalog-product-front-20261022.webp",
            alt: "GA Matchday Cap in Royal/Natural, front view: natural crown with the royal blue GA monogram embroidered on the front panel and a royal blue visor",
          },
          {
            src: "/products/goal-monogram-cap-royal-catalog-model-front-20261022.webp",
            alt: "Model facing forward wearing the Royal/Natural GA Matchday Cap with a charcoal tee, black shorts and white sneakers",
          },
          {
            src: "/products/goal-monogram-cap-royal-catalog-model-three-quarter-20261022.webp",
            alt: "Same model in a three-quarter turn, showing the royal blue GA monogram on the natural front panel of the cap",
          },
          {
            src: "/products/goal-monogram-cap-royal-catalog-model-side-20261022.webp",
            alt: "Same model turned to the side, showing the royal blue visor and crown profile of the cap",
          },
        ],
      },
      {
        name: "Dark Green/Natural",
        supplierColor: "Dark Green/Natural",
        hex: "#0B3D2E",
        skuFragment: "GREEN",
        // Dark Green/Natural shows the owner's four catalog photos
        // (2026-10-22), product shot first; its Apliiq render was retired.
        // Records: designs/48_ga-matchday-cap-dark-green-photos-2026-10-22/
        // and docs/catalog/ga-matchday-cap-dark-green-20261022.json.
        images: [
          {
            src: "/products/goal-monogram-cap-dark-green-catalog-product-front-20261022.webp",
            alt: "GA Matchday Cap in Dark Green/Natural, front view: natural crown with the dark green GA monogram embroidered on the front panel and a dark green visor",
          },
          {
            src: "/products/goal-monogram-cap-dark-green-catalog-model-front-20261022.webp",
            alt: "Model facing forward wearing the Dark Green/Natural GA Matchday Cap with a charcoal tee, black shorts and white sneakers",
          },
          {
            src: "/products/goal-monogram-cap-dark-green-catalog-model-three-quarter-20261022.webp",
            alt: "Same model in a three-quarter turn, showing the dark green GA monogram on the natural front panel of the cap",
          },
          {
            src: "/products/goal-monogram-cap-dark-green-catalog-model-side-20261022.webp",
            alt: "Same model turned to the side, showing the dark green visor and crown profile of the cap",
          },
        ],
      },
    ],
    sizes: ["OS"],
    category: "hat",
    supplierType: "apliiq",
    isActive: true,
    // On sale since 2026-10-23 (owner: every listed product is live, nothing
    // is coming soon).
    availableForSale: true,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "80000000-0000-4000-8000-000000000010",
    name: "Stacked Stadium Cap",
    slug: "goal-athletics-wordmark-cap",
    description:
      "Structured five-panel cap with a natural front and a coloured visor. GOAL ATHLETICS wordmark with bar embroidered on the front panel, adjustable snap.",
    priceCents: 3200,
    compareAtPriceCents: null,
    color: "Black/Natural",
    colorHex: "#111111",
    fabric:
      "65% polyester, 35% cotton twill over a firm buckram front. Buckram is the stiffener behind the front panel, and it is what holds the crown up instead of letting it collapse.",
    fit:
      "Adjustable · One Size. Structured mid-profile crown, slightly curved visor, plastic snap at the back.",
    careInstructions: "Spot clean with cool water and a soft cloth. Do not machine wash or tumble dry, it will collapse the structured front panel. Air dry only.",
    images: [
      {
        src: "/products/goal-wordmark-cap-black-catalog-product-front-20261022.webp",
        alt: "Stacked Stadium Cap in Black/Natural, front view: natural crown with the black GOAL ATHLETICS wordmark and bar embroidered on the front panel and a black visor",
      },
      {
        src: "/products/goal-wordmark-cap-black-catalog-model-front-20261022.webp",
        alt: "Model facing the camera wearing the Black/Natural Stacked Stadium Cap with a charcoal tee, head and shoulders",
      },
      {
        src: "/products/goal-wordmark-cap-black-catalog-model-three-quarter-20261022.webp",
        alt: "Same model in a three-quarter turn, showing the GOAL ATHLETICS wordmark on the natural front panel and the black visor",
      },
      {
        src: "/products/goal-wordmark-cap-black-catalog-model-side-20261022.webp",
        alt: "Same model turned the other way, showing the wordmark on the front panel and the profile of the black visor",
      },
    ],
    colorVariants: [
      {
        name: "Black/Natural",
        supplierColor: "Black/Natural",
        hex: "#111111",
        skuFragment: "BLACK",
        // Black/Natural shows the owner's four catalog photos (2026-10-22),
        // product shot first; it is the card's default colourway, so the
        // product shot is also the catalog card. Its Apliiq render was
        // retired. Records: designs/50_stacked-stadium-cap-black-photos-2026-10-22/
        // and docs/catalog/stacked-stadium-cap-black-20261022.json.
        images: [
          {
            src: "/products/goal-wordmark-cap-black-catalog-product-front-20261022.webp",
            alt: "Stacked Stadium Cap in Black/Natural, front view: natural crown with the black GOAL ATHLETICS wordmark and bar embroidered on the front panel and a black visor",
          },
          {
            src: "/products/goal-wordmark-cap-black-catalog-model-front-20261022.webp",
            alt: "Model facing the camera wearing the Black/Natural Stacked Stadium Cap with a charcoal tee, head and shoulders",
          },
          {
            src: "/products/goal-wordmark-cap-black-catalog-model-three-quarter-20261022.webp",
            alt: "Same model in a three-quarter turn, showing the GOAL ATHLETICS wordmark on the natural front panel and the black visor",
          },
          {
            src: "/products/goal-wordmark-cap-black-catalog-model-side-20261022.webp",
            alt: "Same model turned the other way, showing the wordmark on the front panel and the profile of the black visor",
          },
        ],
      },
      {
        name: "Red/Natural",
        supplierColor: "Red/Natural",
        hex: "#C8102E",
        skuFragment: "RED",
        // Red/Natural shows the owner's four catalog photos (2026-10-22),
        // product shot first; its Apliiq render was retired. Records:
        // designs/52_stacked-stadium-cap-red-photos-2026-10-22/ and
        // docs/catalog/stacked-stadium-cap-red-20261022.json.
        images: [
          {
            src: "/products/goal-wordmark-cap-red-catalog-product-front-20261022.webp",
            alt: "Stacked Stadium Cap in Red/Natural, front view: natural crown with the red GOAL ATHLETICS wordmark and bar embroidered on the front panel and a red visor",
          },
          {
            src: "/products/goal-wordmark-cap-red-catalog-model-front-20261022.webp",
            alt: "Model facing the camera wearing the Red/Natural Stacked Stadium Cap with a charcoal tee, head and shoulders",
          },
          {
            src: "/products/goal-wordmark-cap-red-catalog-model-three-quarter-20261022.webp",
            alt: "Same model in a three-quarter turn, showing the red wordmark on the natural front panel and the red visor",
          },
          {
            src: "/products/goal-wordmark-cap-red-catalog-model-side-20261022.webp",
            alt: "Same model turned the other way, showing the wordmark on the front panel and the profile of the red visor",
          },
        ],
      },
      {
        name: "Royal/Natural",
        supplierColor: "Royal/Natural",
        hex: "#1F2F6B",
        skuFragment: "ROYAL",
        // Royal/Natural shows the owner's four catalog photos (2026-10-22),
        // product shot first; its Apliiq render was retired. Records:
        // designs/51_stacked-stadium-cap-royal-photos-2026-10-22/ and
        // docs/catalog/stacked-stadium-cap-royal-20261022.json.
        images: [
          {
            src: "/products/goal-wordmark-cap-royal-catalog-product-front-20261022.webp",
            alt: "Stacked Stadium Cap in Royal/Natural, front view: natural crown with the royal blue GOAL ATHLETICS wordmark and bar embroidered on the front panel and a royal blue visor",
          },
          {
            src: "/products/goal-wordmark-cap-royal-catalog-model-front-20261022.webp",
            alt: "Model facing the camera wearing the Royal/Natural Stacked Stadium Cap with a charcoal tee, head and shoulders",
          },
          {
            src: "/products/goal-wordmark-cap-royal-catalog-model-three-quarter-20261022.webp",
            alt: "Same model in a three-quarter turn, showing the royal blue wordmark on the natural front panel and the royal blue visor",
          },
          {
            src: "/products/goal-wordmark-cap-royal-catalog-model-side-20261022.webp",
            alt: "Same model turned the other way, showing the wordmark on the front panel and the profile of the royal blue visor",
          },
        ],
      },
      {
        name: "Dark Green/Natural",
        supplierColor: "Dark Green/Natural",
        hex: "#0B3D2E",
        skuFragment: "GREEN",
        // Dark Green/Natural shows the owner's four catalog photos (2026-10-22),
        // product shot first; the earlier image, which showed the supplier's
        // sticker on the visor, was retired. Records:
        // designs/60_stacked-stadium-cap-dark-green-photos-2026-10-22/ and
        // docs/catalog/stacked-stadium-cap-dark-green-20261022.json.
        images: [
          {
            src: "/products/goal-wordmark-cap-dark-green-catalog-product-front-20261022.webp",
            alt: "Stacked Stadium Cap in Dark Green/Natural, front view: natural crown with the dark green GOAL ATHLETICS wordmark and bar embroidered on the front panel and a dark green visor",
          },
          {
            src: "/products/goal-wordmark-cap-dark-green-catalog-model-front-20261022.webp",
            alt: "Model facing the camera wearing the Dark Green/Natural Stacked Stadium Cap with a charcoal tee, head and shoulders",
          },
          {
            src: "/products/goal-wordmark-cap-dark-green-catalog-model-three-quarter-20261022.webp",
            alt: "Same model in a three-quarter turn, showing the dark green wordmark on the natural front panel and the dark green visor",
          },
          {
            src: "/products/goal-wordmark-cap-dark-green-catalog-model-side-20261022.webp",
            alt: "Same model turned the other way, showing the wordmark on the front panel and the profile of the dark green visor",
          },
        ],
      },
    ],
    sizes: ["OS"],
    category: "hat",
    supplierType: "apliiq",
    isActive: true,
    // On sale since 2026-10-23: the owner chose this cap for the first live
    // order through the automatic Apliiq path.
    availableForSale: true,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  // == end GOAL Athletics hats ==
  // == GOAL Athletics ST720 GA tees (owner handoff 2026-10-14) ==
  // Sport-Tek ST720, DTF transfer. Twelve Apliiq designs saved 2026-10-14,
  // mapped in fulfillment.ts. Hidden (isActive false) and priced at 0 until
  // the owner sets the price: designs/26_st720-ga-tee-2026-10-14/.
  // Images are Apliiq's renders of the saved designs.
  {
    id: "80000000-0000-4000-8000-000000000011",
    name: "GOAL Athletics Warm-Up Tee",
    slug: "goal-athletics-ga-minimal-tee",
    blank: "ST720",
    description:
      "Lightweight performance tee. GA monogram centred on the chest, stacked GOAL ATHLETICS lockup across the upper back.",
    priceCents: 3800,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#373737",
    fabric:
      "3.8 oz recycled polyester performance knit. Taped at the neck with a label that tears out, so nothing sits raw against your skin. Set-in sleeves follow the line of the shoulder and leave the arm its full range.",
    fit: ST720_FIT,
    careInstructions: "Machine wash cold, inside out. Tumble dry low. Skip the fabric softener, it coats the fibres and reduces wicking. Do not iron directly on the print.",
    images: [
      {
        src: "/products/goal-ga-minimal-black-catalog-product-front-20261022.webp",
        alt: "Warm-Up Tee in black, product front with the white and red GA monogram centred on the chest",
      },
      {
        src: "/products/goal-ga-minimal-black-catalog-product-back-20261022.webp",
        alt: "Warm-Up Tee in black, product back with the white stacked GOAL ATHLETICS lockup and red bar across the upper back",
      },
    ],
    colorVariants: [
      {
        name: "Black",
        supplierColor: "Black",
        hex: "#373737",
        skuFragment: "BLACK",
        // Black leads with the owner's product front and back (2026-10-22),
        // which also serve as the catalog card; the Apliiq renders were
        // retired. Records: designs/53_ga-minimal-tee-black-product-shots-
        // 2026-10-22/ and docs/catalog/ga-minimal-tee-black-product-20261022.json.
        images: [
          {
            src: "/products/goal-ga-minimal-black-catalog-product-front-20261022.webp",
            alt: "Warm-Up Tee in black, product front with the white and red GA monogram centred on the chest",
          },
          {
            src: "/products/goal-ga-minimal-black-catalog-product-back-20261022.webp",
            alt: "Warm-Up Tee in black, product back with the white stacked GOAL ATHLETICS lockup and red bar across the upper back",
          },
          {
            src: "/products/goal-ga-minimal-black-catalog-model-front-20261015.webp",
            alt: "Model facing forward in the black Warm-Up Tee with the white and red GA monogram centred on the chest, black shorts and white sneakers",
          },
          {
            src: "/products/goal-ga-minimal-black-catalog-model-front-quarter-20261015.webp",
            alt: "Same model in a front quarter turn, black Warm-Up Tee with the white and red GA monogram on the chest",
          },
          {
            src: "/products/goal-ga-minimal-black-catalog-model-rear-20261015.webp",
            alt: "Same model from behind in the black Warm-Up Tee, white GOAL ATHLETICS lockup with a red bar across the upper back",
          },
          {
            src: "/products/goal-ga-minimal-black-catalog-model-rear-quarter-20261015.webp",
            alt: "Same model in a back quarter turn, showing the white and red GOAL ATHLETICS lockup on the black tee",
          },
        ],
      },
      {
        name: "True Royal",
        supplierColor: "true royal",
        hex: "#354CAA",
        skuFragment: "ROYAL",
        // True Royal leads with the owner's product front and back
        // (2026-10-22); the Apliiq renders were retired. Records:
        // designs/54_ga-minimal-tee-true-royal-product-shots-2026-10-22/ and
        // docs/catalog/ga-minimal-tee-true-royal-product-20261022.json.
        images: [
          {
            src: "/products/goal-ga-minimal-true-royal-catalog-product-front-20261022.webp",
            alt: "Warm-Up Tee in True Royal, product front with the cream GA monogram centred on the chest",
          },
          {
            src: "/products/goal-ga-minimal-true-royal-catalog-product-back-20261022.webp",
            alt: "Warm-Up Tee in True Royal, product back with the cream stacked GOAL ATHLETICS lockup across the upper back",
          },
          {
            src: "/products/goal-ga-minimal-true-royal-catalog-model-front-20261015.webp",
            alt: "Model facing forward in the True Royal Warm-Up Tee with the cream GA monogram centred on the chest, black shorts and white sneakers",
          },
          {
            src: "/products/goal-ga-minimal-true-royal-catalog-model-front-quarter-20261015.webp",
            alt: "Same model in a front quarter turn, True Royal Warm-Up Tee with the cream GA monogram on the chest",
          },
          {
            src: "/products/goal-ga-minimal-true-royal-catalog-model-rear-20261015.webp",
            alt: "Same model from behind in the True Royal Warm-Up Tee, cream GOAL ATHLETICS lockup across the upper back",
          },
          {
            src: "/products/goal-ga-minimal-true-royal-catalog-model-rear-quarter-20261015.webp",
            alt: "Same model in a back quarter turn, showing the cream GOAL ATHLETICS lockup on the True Royal tee",
          },
        ],
      },
      {
        name: "White · Black-Red",
        supplierColor: "white",
        hex: "#E7E7E7",
        skuFragment: "WHITE-BLACKRED",
        images: [
          {
            src: "/products/goal-ga-minimal-white-black-red-catalog-product-front-20261014.webp",
            alt: "White Warm-Up Tee, product front with black and red GA monogram",
          },
          {
            src: "/products/goal-ga-minimal-white-black-red-catalog-product-back-20261014.webp",
            alt: "White Warm-Up Tee, product back with black GOAL ATHLETICS lettering and red bar",
          },
          {
            src: "/products/goal-ga-minimal-white-black-red-catalog-model-front-20261014.webp",
            alt: "Model standing front-on in the white Warm-Up Tee, plain black shorts and white socks",
          },
          {
            src: "/products/goal-ga-minimal-white-black-red-catalog-model-three-quarter-20261014.webp",
            alt: "Same model in a standing three-quarter view of the white Warm-Up Tee, black shorts and white socks",
          },
          {
            src: "/products/goal-ga-minimal-white-black-red-catalog-model-rear-20261014.webp",
            alt: "Same model standing rear-on in the white Warm-Up Tee, showing the black and red back design",
          },
        ],
      },
      {
        name: "True Red",
        supplierColor: "True Red",
        hex: "#C8102E",
        skuFragment: "RED",
        // True Red leads with the owner's product front and back
        // (2026-10-22); the Apliiq renders were retired. Records:
        // designs/55_ga-minimal-tee-true-red-product-shots-2026-10-22/ and
        // docs/catalog/ga-minimal-tee-true-red-product-20261022.json.
        images: [
          {
            src: "/products/goal-ga-minimal-true-red-catalog-product-front-20261022.webp",
            alt: "Warm-Up Tee in True Red, product front with the white GA monogram centred on the chest",
          },
          {
            src: "/products/goal-ga-minimal-true-red-catalog-product-back-20261022.webp",
            alt: "Warm-Up Tee in True Red, product back with the white stacked GOAL ATHLETICS lockup across the upper back",
          },
          {
            src: "/products/goal-ga-minimal-true-red-catalog-model-front-20261015.webp",
            alt: "Model facing forward in the True Red Warm-Up Tee with the white GA monogram centred on the chest, black shorts and white sneakers",
          },
          {
            src: "/products/goal-ga-minimal-true-red-catalog-model-front-quarter-20261015.webp",
            alt: "Same model in a front quarter turn, True Red Warm-Up Tee with the white GA monogram on the chest",
          },
          {
            src: "/products/goal-ga-minimal-true-red-catalog-model-rear-20261015.webp",
            alt: "Same model from behind in the True Red Warm-Up Tee, white GOAL ATHLETICS lockup across the upper back",
          },
          {
            src: "/products/goal-ga-minimal-true-red-catalog-model-rear-quarter-20261015.webp",
            alt: "Same model in a back quarter turn, showing the white GOAL ATHLETICS lockup on the True Red tee",
          },
        ],
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "tshirt",
    supplierType: "apliiq",
    isActive: true,
    availableForSale: true,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  {
    id: "80000000-0000-4000-8000-000000000012",
    name: "GOAL Athletics Match Day Tee",
    slug: "goal-athletics-ga-big-tee",
    blank: "ST720",
    description:
      "Lightweight performance tee. GA monogram and GOAL ATHLETICS lockup across the chest, clean back.",
    priceCents: 3800,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#373737",
    fabric:
      "3.8 oz recycled polyester performance knit. Taped at the neck with a label that tears out, so nothing sits raw against your skin. Set-in sleeves follow the line of the shoulder and leave the arm its full range.",
    fit: ST720_FIT,
    careInstructions: "Machine wash cold, inside out. Tumble dry low. Skip the fabric softener, it coats the fibres and reduces wicking. Do not iron directly on the print.",
    images: [
      {
        src: "/products/goal-ga-big-tee-black-catalog-product-front-20261022.webp",
        alt: "Match Day Tee in Black, product front with the white and red GA monogram and GOAL ATHLETICS lockup across the chest",
      },
    ],
    colorVariants: [
      {
        name: "Black",
        supplierColor: "Black",
        hex: "#373737",
        skuFragment: "BLACK",
        // Every colourway leads with the owner's product front (2026-10-22),
        // lifted off its white render background onto the studio backdrop;
        // the Apliiq front renders were retired. Records:
        // designs/57_ga-big-tee-product-fronts-2026-10-22/ and
        // docs/catalog/ga-big-tee-product-fronts-20261022.json.
        images: [
          {
            src: "/products/goal-ga-big-tee-black-catalog-product-front-20261022.webp",
            alt: "Match Day Tee in Black, product front with the white and red GA monogram and GOAL ATHLETICS lockup across the chest",
          },
          {
            src: "/products/goal-ga-big-tee-black-catalog-model-front-20261020.webp",
            alt: "Model facing forward in the black Match Day Tee with the white and red GA monogram and GOAL ATHLETICS lockup across the chest, black shorts and white sneakers",
          },
          {
            src: "/products/goal-ga-big-tee-black-catalog-model-three-quarter-20261020.webp",
            alt: "Same model in a three-quarter turn, black Match Day Tee with the white and red GA and GOAL ATHLETICS lockup on the chest",
          },
          {
            src: "/products/goal-ga-big-tee-black-catalog-model-rear-20261020.webp",
            alt: "Same model from behind in the black Match Day Tee, clean back with no print",
          },
        ],
      },
      {
        name: "True Royal",
        supplierColor: "true royal",
        hex: "#354CAA",
        skuFragment: "ROYAL",
        images: [
          {
            src: "/products/goal-ga-big-tee-true-royal-catalog-product-front-20261022.webp",
            alt: "Match Day Tee in True Royal, product front with the cream GA monogram and GOAL ATHLETICS lockup across the chest",
          },
          {
            src: "/products/goal-ga-big-tee-true-royal-catalog-model-front-20261020.webp",
            alt: "Model facing forward in the true royal Match Day Tee with the cream GA monogram and GOAL ATHLETICS lockup across the chest, black shorts and white sneakers",
          },
          {
            src: "/products/goal-ga-big-tee-true-royal-catalog-model-three-quarter-20261020.webp",
            alt: "Same model in a three-quarter turn, true royal Match Day Tee with the cream GA and GOAL ATHLETICS lockup on the chest",
          },
          {
            src: "/products/goal-ga-big-tee-true-royal-catalog-model-rear-20261020.webp",
            alt: "Same model from behind in the true royal Match Day Tee, clean back with no print",
          },
        ],
      },
      {
        name: "White · Black-Red",
        supplierColor: "white",
        hex: "#E7E7E7",
        skuFragment: "WHITE-BLACKRED",
        images: [
          {
            src: "/products/goal-ga-big-tee-white-black-red-catalog-product-front-20261022.webp",
            alt: "Match Day Tee in White · Black-Red, product front with the black and red GA monogram and GOAL ATHLETICS lockup across the chest",
          },
          {
            src: "/products/goal-ga-big-tee-white-black-red-catalog-model-front-20261020.webp",
            alt: "Model facing forward in the white Match Day Tee with the black and red GA monogram and GOAL ATHLETICS lockup across the chest, black shorts and white sneakers",
          },
          {
            src: "/products/goal-ga-big-tee-white-black-red-catalog-model-three-quarter-20261020.webp",
            alt: "Same model in a three-quarter turn, white Match Day Tee with the black and red GA and GOAL ATHLETICS lockup on the chest",
          },
          {
            src: "/products/goal-ga-big-tee-white-black-red-catalog-model-rear-20261020.webp",
            alt: "Same model from behind in the white Match Day Tee, clean back with no print",
          },
        ],
      },
      {
        name: "True Red",
        supplierColor: "True Red",
        hex: "#C8102E",
        skuFragment: "RED",
        images: [
          {
            src: "/products/goal-ga-big-tee-true-red-catalog-product-front-20261022.webp",
            alt: "Match Day Tee in True Red, product front with the white GA monogram and GOAL ATHLETICS lockup across the chest",
          },
          {
            src: "/products/goal-ga-big-tee-true-red-catalog-model-front-20261020.webp",
            alt: "Model facing forward in the true red Match Day Tee with the white GA monogram and GOAL ATHLETICS lockup across the chest, black shorts and white sneakers",
          },
          {
            src: "/products/goal-ga-big-tee-true-red-catalog-model-three-quarter-20261020.webp",
            alt: "Same model in a three-quarter turn, true red Match Day Tee with the white GA and GOAL ATHLETICS lockup on the chest",
          },
          {
            src: "/products/goal-ga-big-tee-true-red-catalog-model-rear-20261020.webp",
            alt: "Same model from behind in the true red Match Day Tee, clean back with no print",
          },
        ],
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "tshirt",
    supplierType: "apliiq",
    isActive: true,
    availableForSale: true,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  // == end GOAL Athletics ST720 GA tees ==
  // == GOAL Athletics GA Minimal Shorts (owner proof 2026-10-14) ==
  // AS Colour 5620 active shorts, DTF transfer: GA 3.00 x 2.70 in on the
  // wearer's left leg (Apliiq zone Front Bottom Left), no back print.
  // Three Apliiq designs saved 2026-10-14, mapped in fulfillment.ts. On sale
  // at $32 by owner decision 2026-10-14. Sizes map to waist sizes
  // by owner decision 2026-10-14: S=30, M=32, L=34, XL=36, XXL=38 (40 unused).
  // The Vertical style is not built: every 5620 zone is 4 x 4 in.
  // Every colourway shows the owner's catalog photos (2026-10-22): the
  // product shot first (Black's is also the collection card), then the model
  // front and the print detail, brought to the 2:3 frame of
  // MODEL-PHOTO-FRAME-STANDARD.md. The Apliiq renders left public/products
  // (they stay in the designs folder). Records:
  // designs/28_as5620-goal-shorts-2026-10-14/ and
  // docs/catalog/ga-minimal-shorts-*-20261022.json.
  {
    id: "80000000-0000-4000-8000-000000000013",
    name: "GOAL Athletics Core Shorts",
    slug: "goal-athletics-ga-minimal-shorts",
    blank: "AS5620",
    description:
      "Lightweight active shorts. GA monogram on the left leg just above the hem, clean back.",
    priceCents: 4500,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#242424",
    fabric:
      "Lightweight 125 gsm fabric, 93% recycled polyester and 7% spandex, so the shorts stretch with every stride.",
    fit:
      "Elastic waist with an outside drawcord, two side pockets, a zip back pocket and split sides. Full length 17.7 in on a size S.",
    fitNote: "Sized by waist: S is a 30, M a 32, L a 34, XL a 36 and XXL a 38.",
    careInstructions: "Machine wash cold, inside out. Hang to dry. Do not iron directly on the print.",
    images: [
      {
        src: "/products/goal-ga-minimal-shorts-black-catalog-product-front-20261022.webp",
        alt: "Core Shorts in black, product front with the white and red GA monogram on the left leg above the hem, drawcord waist and side pockets",
      },
      {
        src: "/products/goal-ga-minimal-shorts-black-catalog-model-front-20261022.webp",
        alt: "Model facing forward in the black Core Shorts with the white and red GA monogram on the left leg above the hem, white socks and white sneakers",
      },
      {
        src: "/products/goal-ga-minimal-shorts-black-catalog-print-detail-20261022.webp",
        alt: "Close-up of the white and red GA monogram on the left leg of the black Core Shorts, just above the hem, with the drawcord waist and side pocket",
      },
    ],
    colorVariants: [
      {
        name: "Black",
        supplierColor: "Black",
        hex: "#242424",
        skuFragment: "BLACK",
        images: [
          {
            src: "/products/goal-ga-minimal-shorts-black-catalog-product-front-20261022.webp",
            alt: "Core Shorts in black, product front with the white and red GA monogram on the left leg above the hem, drawcord waist and side pockets",
          },
          {
            src: "/products/goal-ga-minimal-shorts-black-catalog-model-front-20261022.webp",
            alt: "Model facing forward in the black Core Shorts with the white and red GA monogram on the left leg above the hem, white socks and white sneakers",
          },
          {
            src: "/products/goal-ga-minimal-shorts-black-catalog-print-detail-20261022.webp",
            alt: "Close-up of the white and red GA monogram on the left leg of the black Core Shorts, just above the hem, with the drawcord waist and side pocket",
          },
        ],
      },
      {
        name: "Ink Blue",
        supplierColor: "Ink Blue",
        hex: "#1F1F2B",
        skuFragment: "INK-BLUE",
        images: [
          {
            src: "/products/goal-ga-minimal-shorts-ink-blue-catalog-product-front-20261022.webp",
            alt: "Core Shorts in Ink Blue, product front with the cream GA monogram on the left leg above the hem, drawcord waist and side pockets",
          },
          {
            src: "/products/goal-ga-minimal-shorts-ink-blue-catalog-model-front-20261022.webp",
            alt: "Model facing forward in the Ink Blue Core Shorts with the cream GA monogram on the left leg above the hem, white socks and white sneakers",
          },
          {
            src: "/products/goal-ga-minimal-shorts-ink-blue-catalog-print-detail-20261022.webp",
            alt: "Close-up of the cream GA monogram on the left leg of the Ink Blue Core Shorts, just above the hem, with the drawcord waist and side pocket",
          },
        ],
      },
      {
        name: "Shadow",
        supplierColor: "Shadow",
        hex: "#DBDBDB",
        skuFragment: "SHADOW",
        images: [
          {
            src: "/products/goal-ga-minimal-shorts-shadow-catalog-product-front-20261022.webp",
            alt: "Core Shorts in Shadow, product front with the black and red GA monogram on the left leg above the hem, drawcord waist and side pockets",
          },
          {
            src: "/products/goal-ga-minimal-shorts-shadow-catalog-model-front-20261022.webp",
            alt: "Model facing forward in the Shadow Core Shorts with the black and red GA monogram on the left leg above the hem, white socks and white sneakers",
          },
          {
            src: "/products/goal-ga-minimal-shorts-shadow-catalog-print-detail-20261022.webp",
            alt: "Close-up of the black and red GA monogram on the left leg of the Shadow Core Shorts, just above the hem",
          },
        ],
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "shorts",
    supplierType: "apliiq",
    isActive: true,
    availableForSale: true,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  // == end GOAL Athletics GA Minimal Shorts ==
  // == GOAL Athletics Heritage Hoodie (Apliiq designs read 2026-10-22) ==
  // Independent IND4000 heavyweight hoodie, DTF transfer. Four saved designs
  // (Black 6210750, Grey Heather 6210742, Bone 6210734, Navy 6210732), two
  // artworks each: the GA monogram 4.00 x 3.61 in centred on the chest and a
  // 2.00 x 1.80 in GA monogram on the outer left sleeve above the cuff;
  // white/red on Black, black/red on Grey Heather and Bone, cream on Navy.
  // Each gallery shows the owner's product shot and three model photos
  // (2026-10-22), framed 2:3. Apliiq's front and sleeve-side renders were
  // taken off the site on the owner's word; they are kept in
  // designs/58_heritage-hoodie-ind4000-2026-10-22/retired-render/.
  // Live and for sale at $78 (the owner's hoodie price, set 2026-10-22) on
  // the owner's instruction 2026-10-22. Record:
  // designs/58_heritage-hoodie-ind4000-2026-10-22/.
  // Apliiq offers the blank XS to 5XL; the site sells S to XXL on every
  // garment, as the Core Hoodie rows above did on this blank.
  {
    id: "80000000-0000-4000-8000-000000000014",
    name: "GOAL Athletics Heritage Hoodie",
    slug: "goal-athletics-heritage-hoodie",
    blank: "IND4000",
    description:
      "Heavyweight fleece hoodie. GA monogram centred on the chest, small GA monogram on the left sleeve above the cuff, kangaroo pocket and a generous cut.",
    priceCents: 7800,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#1E1E1E",
    // IND4000 fabric, fit and care carried over from the Core Hoodie rows
    // (same blank, same Apliiq record). Black's blend is the only one
    // documented, so the fabric line states Black's blend only. Do not
    // extend it to Grey Heather, Bone or Navy.
    fabric:
      "10 oz heavyweight 3-end fleece in 70% cotton and 30% polyester, with ring-spun cotton for a smooth print surface. Fleece-lined hood with a cotton drawcord through nickel eyelets, and a tear-away label. Cut generous, so all that weight has room to hang.",
    fit: "Generous fit with 1x1 ribbed cuffs. True to size for room to layer. Size down for a more snug fit.",
    careInstructions: "Machine wash cold, inside out, with like colours. Tumble dry low. Do not bleach. Do not iron directly on the print.",
    images: [
      {
        src: "/products/goal-heritage-hoodie-black-catalog-product-front-20261022.webp",
        alt: "GOAL Athletics Heritage Hoodie in Black, product front with the white and red GA monogram centred on the chest and the small GA monogram on the left sleeve above the cuff",
      },
    ],
    // Swatches: Black, Grey Heather and Bone reuse the hexes the Core Hoodie
    // rows settled on for this blank; Navy is the garment body sampled from
    // Apliiq's own saved-design thumbnail (#2A3043, the Lockup Hoodie grid
    // tile, which is four times the size of the list tile).
    colorVariants: [
      {
        name: "Black",
        supplierColor: "Black",
        hex: "#1E1E1E",
        skuFragment: "BLACK",
        // The owner's product shot and model photos (2026-10-22).
        images: [
          {
            src: "/products/goal-heritage-hoodie-black-catalog-product-front-20261022.webp",
            alt: "GOAL Athletics Heritage Hoodie in Black, product front with the white and red GA monogram centred on the chest and the small GA monogram on the left sleeve above the cuff",
          },
          {
            src: "/products/goal-heritage-hoodie-black-catalog-model-front-20261022.webp",
            alt: "Model facing forward in the Black Heritage Hoodie with the white and red GA monogram on the chest, black shorts and white sneakers",
          },
          {
            src: "/products/goal-heritage-hoodie-black-catalog-model-quarter-left-20261022.webp",
            alt: "Same model turned to the left in the Black Heritage Hoodie, white and red GA monogram on the chest and the left sleeve",
          },
          {
            src: "/products/goal-heritage-hoodie-black-catalog-model-quarter-right-20261022.webp",
            alt: "Same model turned to the right in the Black Heritage Hoodie, white and red GA monogram on the chest",
          },
        ],
      },
      {
        name: "Grey Heather",
        supplierColor: "Grey Heather",
        hex: "#D9D9D9",
        skuFragment: "GREYHEATHER",
        // The owner's product shot and model photos (2026-10-22).
        images: [
          {
            src: "/products/goal-heritage-hoodie-grey-heather-catalog-product-front-20261022.webp",
            alt: "GOAL Athletics Heritage Hoodie in Grey Heather, product front with the black and red GA monogram centred on the chest and the small GA monogram on the left sleeve above the cuff",
          },
          {
            src: "/products/goal-heritage-hoodie-grey-heather-catalog-model-front-20261022.webp",
            alt: "Model facing forward in the Grey Heather Heritage Hoodie with the black and red GA monogram on the chest and on the left sleeve, black shorts and white sneakers",
          },
          {
            src: "/products/goal-heritage-hoodie-grey-heather-catalog-model-quarter-left-20261022.webp",
            alt: "Same model turned to the left in the Grey Heather Heritage Hoodie, GA monogram on the chest and the left sleeve",
          },
          {
            src: "/products/goal-heritage-hoodie-grey-heather-catalog-model-quarter-right-20261022.webp",
            alt: "Same model turned to the right in the Grey Heather Heritage Hoodie, GA monogram on the chest and the left sleeve",
          },
        ],
      },
      {
        name: "Bone",
        supplierColor: "Bone",
        hex: "#CFCAC7",
        skuFragment: "BONE",
        // The owner's product shot and model photos (2026-10-22).
        images: [
          {
            src: "/products/goal-heritage-hoodie-bone-catalog-product-front-20261022.webp",
            alt: "GOAL Athletics Heritage Hoodie in Bone, product front with the black and red GA monogram centred on the chest and the small GA monogram on the left sleeve above the cuff",
          },
          {
            src: "/products/goal-heritage-hoodie-bone-catalog-model-front-20261022.webp",
            alt: "Model facing forward in the Bone Heritage Hoodie with the black and red GA monogram on the chest, black shorts and white sneakers",
          },
          {
            src: "/products/goal-heritage-hoodie-bone-catalog-model-quarter-left-20261022.webp",
            alt: "Same model turned to the left in the Bone Heritage Hoodie, black and red GA monogram on the chest and the left sleeve",
          },
          {
            src: "/products/goal-heritage-hoodie-bone-catalog-model-quarter-right-20261022.webp",
            alt: "Same model turned to the right in the Bone Heritage Hoodie, black and red GA monogram on the chest",
          },
        ],
      },
      {
        name: "Navy",
        supplierColor: "Navy",
        hex: "#2A3043",
        skuFragment: "NAVY",
        // The owner's product shot and model photos (2026-10-22).
        images: [
          {
            src: "/products/goal-heritage-hoodie-navy-catalog-product-front-20261022.webp",
            alt: "GOAL Athletics Heritage Hoodie in Navy, product front with the cream GA monogram centred on the chest and the small cream GA monogram on the left sleeve above the cuff",
          },
          {
            src: "/products/goal-heritage-hoodie-navy-catalog-model-front-20261022.webp",
            alt: "Model facing forward in the Navy Heritage Hoodie with the cream GA monogram on the chest and on the left sleeve, black shorts and white sneakers",
          },
          {
            src: "/products/goal-heritage-hoodie-navy-catalog-model-quarter-left-20261022.webp",
            alt: "Same model turned to the left in the Navy Heritage Hoodie, cream GA monogram on the chest and the left sleeve",
          },
          {
            src: "/products/goal-heritage-hoodie-navy-catalog-model-quarter-right-20261022.webp",
            alt: "Same model turned to the right in the Navy Heritage Hoodie, cream GA monogram on the chest and the left sleeve",
          },
        ],
      },
    ],
    // Garment made in China (Apliiq's IND4000 record, as for the Core
    // Hoodie); decorated at Apliiq's US facilities, so Printed in the USA.
    originLabel: "Printed in the USA",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "hoodie",
    supplierType: "apliiq",
    isActive: true,
    availableForSale: true,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  // == end GOAL Athletics Heritage Hoodie ==
  // == GOAL Athletics Lockup Hoodie (Apliiq designs read 2026-10-22) ==
  // Independent IND4000 heavyweight hoodie, DTF transfer. Four saved designs
  // (Black 6206733, Grey Heather 6206746, Bone 6206741, Navy 6206737): the
  // GA monogram and GOAL ATHLETICS lockup, 10.00 x 2.67 in across the chest,
  // as on the GA Big Tee; white/red on Black, black/red on Grey Heather and
  // Bone, cream on Navy; no back print. Every colour shows the owner's
  // product shot and model photos (2026-10-22), framed 2:3; Apliiq's renders
  // are kept in designs/59_lockup-hoodie-ind4000-2026-10-22/retired-render/.
  // Live and for sale at $78 (owner's hoodie price) on the owner's
  // instruction 2026-10-22. Record:
  // designs/59_lockup-hoodie-ind4000-2026-10-22/. Same blank as the Heritage
  // row, so the same fabric, fit, care, origin, sizes (S to XXL of Apliiq's
  // XS to 5XL) and swatches.
  {
    id: "80000000-0000-4000-8000-000000000015",
    name: "GOAL Athletics Core Hoodie",
    slug: "goal-athletics-lockup-hoodie",
    blank: "IND4000",
    description:
      "Heavyweight fleece hoodie. GA monogram and GOAL ATHLETICS lockup across the chest, kangaroo pocket and a generous cut.",
    priceCents: 7800,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#1E1E1E",
    fabric:
      "10 oz heavyweight 3-end fleece in 70% cotton and 30% polyester, with ring-spun cotton for a smooth print surface. Fleece-lined hood with a cotton drawcord through nickel eyelets, and a tear-away label. Cut generous, so all that weight has room to hang.",
    fit: "Generous fit with 1x1 ribbed cuffs. True to size for room to layer. Size down for a more snug fit.",
    careInstructions: "Machine wash cold, inside out, with like colours. Tumble dry low. Do not bleach. Do not iron directly on the print.",
    images: [
      {
        src: "/products/goal-lockup-hoodie-black-catalog-product-front-20261022.webp",
        alt: "GOAL Athletics Core Hoodie in Black, product front with the white and red GA monogram and GOAL ATHLETICS lockup across the chest",
      },
    ],
    colorVariants: [
      {
        name: "Black",
        supplierColor: "Black",
        hex: "#1E1E1E",
        skuFragment: "BLACK",
        // The owner's product shot and model photos (2026-10-22).
        images: [
          {
            src: "/products/goal-lockup-hoodie-black-catalog-product-front-20261022.webp",
            alt: "GOAL Athletics Core Hoodie in Black, product front with the white and red GA monogram and GOAL ATHLETICS lockup across the chest",
          },
          {
            src: "/products/goal-lockup-hoodie-black-catalog-model-front-20261022.webp",
            alt: "Model facing forward in the Black Core Hoodie with the white and red GA monogram and GOAL ATHLETICS lockup across the chest, black shorts and white sneakers",
          },
          {
            src: "/products/goal-lockup-hoodie-black-catalog-model-quarter-left-20261022.webp",
            alt: "Same model turned to the left in the Black Core Hoodie, white and red GOAL ATHLETICS lockup across the chest",
          },
          {
            src: "/products/goal-lockup-hoodie-black-catalog-model-quarter-right-20261022.webp",
            alt: "Same model turned to the right in the Black Core Hoodie, white and red GOAL ATHLETICS lockup across the chest",
          },
        ],
      },
      {
        name: "Grey Heather",
        supplierColor: "Grey Heather",
        hex: "#D9D9D9",
        skuFragment: "GREYHEATHER",
        // The owner's product shot and model photos (2026-10-22).
        images: [
          {
            src: "/products/goal-lockup-hoodie-grey-heather-catalog-product-front-20261022.webp",
            alt: "GOAL Athletics Core Hoodie in Grey Heather, product front with the black and red GA monogram and GOAL ATHLETICS lockup across the chest",
          },
          {
            src: "/products/goal-lockup-hoodie-grey-heather-catalog-model-front-20261022.webp",
            alt: "Model facing forward in the Grey Heather Core Hoodie with the black and red GA monogram and GOAL ATHLETICS lockup across the chest, black shorts and white sneakers",
          },
          {
            src: "/products/goal-lockup-hoodie-grey-heather-catalog-model-quarter-left-20261022.webp",
            alt: "Same model turned to the left in the Grey Heather Core Hoodie, black and red GOAL ATHLETICS lockup across the chest",
          },
          {
            src: "/products/goal-lockup-hoodie-grey-heather-catalog-model-quarter-right-20261022.webp",
            alt: "Same model turned to the right in the Grey Heather Core Hoodie, black and red GOAL ATHLETICS lockup across the chest",
          },
        ],
      },
      {
        name: "Bone",
        supplierColor: "Bone",
        hex: "#CFCAC7",
        skuFragment: "BONE",
        // The owner's product shot and model photos (2026-10-22).
        images: [
          {
            src: "/products/goal-lockup-hoodie-bone-catalog-product-front-20261022.webp",
            alt: "GOAL Athletics Core Hoodie in Bone, product front with the black and red GA monogram and GOAL ATHLETICS lockup across the chest",
          },
          {
            src: "/products/goal-lockup-hoodie-bone-catalog-model-front-20261022.webp",
            alt: "Model facing forward in the Bone Core Hoodie with the black and red GA monogram and GOAL ATHLETICS lockup across the chest, black shorts and white sneakers",
          },
          {
            src: "/products/goal-lockup-hoodie-bone-catalog-model-quarter-left-20261022.webp",
            alt: "Same model turned to the left in the Bone Core Hoodie, black and red GOAL ATHLETICS lockup across the chest",
          },
          {
            src: "/products/goal-lockup-hoodie-bone-catalog-model-quarter-right-20261022.webp",
            alt: "Same model turned to the right in the Bone Core Hoodie, black and red GOAL ATHLETICS lockup across the chest",
          },
        ],
      },
      {
        name: "Navy",
        supplierColor: "Navy",
        hex: "#2A3043",
        skuFragment: "NAVY",
        // The owner's product shot and model photos (2026-10-22).
        images: [
          {
            src: "/products/goal-lockup-hoodie-navy-catalog-product-front-20261022.webp",
            alt: "GOAL Athletics Core Hoodie in Navy, product front with the cream GA monogram and GOAL ATHLETICS lockup across the chest",
          },
          {
            src: "/products/goal-lockup-hoodie-navy-catalog-model-front-20261022.webp",
            alt: "Model facing forward in the Navy Core Hoodie with the cream GA monogram and GOAL ATHLETICS lockup across the chest, black shorts and white sneakers",
          },
          {
            src: "/products/goal-lockup-hoodie-navy-catalog-model-quarter-left-20261022.webp",
            alt: "Same model turned to the left in the Navy Core Hoodie, cream GOAL ATHLETICS lockup across the chest",
          },
          {
            src: "/products/goal-lockup-hoodie-navy-catalog-model-quarter-right-20261022.webp",
            alt: "Same model turned to the right in the Navy Core Hoodie, cream GOAL ATHLETICS lockup across the chest",
          },
        ],
      },
    ],
    originLabel: "Printed in the USA",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "hoodie",
    supplierType: "apliiq",
    isActive: true,
    availableForSale: true,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  // == end GOAL Athletics Lockup Hoodie ==
  // == GOAL Athletics Core Everyday Raincoat (Apliiq designs read 2026-10-26) ==
  // Waterproof shell jacket (supplier blank J333), DTF transfer. Three saved
  // designs on the account, titled "core everyday raincoat" by the owner
  // (Black 6240401, True Navy 6240414, Dark Grey Heather 6240424), two
  // artworks each, front only, back blank: the GA monogram 3.00 x 2.70 in on
  // the wearer's left chest and the GOAL ATHLETICS wordmark 3.50 x 1.07 in on
  // the wearer's right chest; white/red on Black, cream on True Navy, solid
  // black on Dark Grey Heather. Private label inside the neck. Every gallery
  // shows Apliiq's own front render on the studio backdrop (2:3) until the
  // owner supplies photos; no physical sample exists yet.
  // Price $98 (owner decision 2026-10-26, under the $100 line). On the VIP
  // cost basis (dropship quote $64.58 x 0.8, XXL +$2.00, +$1 fulfilment,
  // $11.80 absorbed shipping, card fees and 5% reserve) that is about a 26%
  // contribution on M and 24% on XXL; the formal 25% model's floor is $106.
  // Live and for sale on the owner's instruction 2026-10-26, men's section.
  // Record:
  // designs/61_core-everyday-raincoat-j333-2026-10-26/.
  // Apliiq offers the blank XS to 4XL; the site sells S to XXL as on every
  // garment.
  {
    id: "80000000-0000-4000-8000-000000000016",
    name: "GOAL Athletics Core Everyday Raincoat",
    slug: "goal-athletics-core-everyday-raincoat",
    blank: "J333",
    description:
      "Fully seam-sealed waterproof shell with a zip-off hood. GA monogram on the left chest, GOAL ATHLETICS wordmark on the right, waterproof zips, front zip pockets and a drawcord hem. Folds into its own pouch.",
    priceCents: 9800,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#151515",
    // Fabric and care from the blank's spec sheet (2026-10-26); the shell is
    // the supplier's "5000MM waterproof, 3000G/M2 breathability" rating.
    fabric:
      "100% polyester waterproof shell, fully seam sealed, rated 5,000 mm waterproof and 3,000 g/m² breathable. Mesh-lined body and hood, waterproof contrast zips, zip-off hood, adjustable hook-and-loop cuffs and an open hem with a locking drawcord. Comes with a drawstring carry pouch.",
    fit: "Regular fit with room to layer over a hoodie. True to size.",
    careInstructions: "Machine wash cold. Do not bleach. Cool iron if needed. Do not dry clean.",
    images: [
      {
        src: "/products/goal-core-everyday-raincoat-black-catalog-product-front-20261026.webp",
        alt: "GOAL Athletics Core Everyday Raincoat in Black, product front with the white and red GA monogram on the left chest and the white and red GOAL ATHLETICS wordmark on the right chest, hood up",
      },
    ],
    // Swatches sampled from the garment body of Apliiq's own renders
    // (2026-10-26). Owner product shots replaced those renders at the same
    // front paths later that day (revision owner-front-20261026).
    colorVariants: [
      {
        name: "Black",
        supplierColor: "Black",
        hex: "#151515",
        skuFragment: "BLACK",
        images: [
          {
            src: "/products/goal-core-everyday-raincoat-black-catalog-product-front-20261026.webp",
            alt: "GOAL Athletics Core Everyday Raincoat in Black, product front with the white and red GA monogram on the left chest and the white and red GOAL ATHLETICS wordmark on the right chest, hood up",
          },
          {
            src: "/products/goal-core-everyday-raincoat-black-catalog-product-back-20261026.webp",
            alt: "GOAL Athletics Core Everyday Raincoat in Black, product back, plain with the hood down",
          },
        ],
      },
      {
        name: "True Navy",
        supplierColor: "True Navy",
        hex: "#374252",
        skuFragment: "TRUENAVY",
        images: [
          {
            src: "/products/goal-core-everyday-raincoat-true-navy-catalog-product-front-20261026.webp",
            alt: "GOAL Athletics Core Everyday Raincoat in True Navy, product front with the cream GA monogram on the left chest and the cream GOAL ATHLETICS wordmark on the right chest, hood up",
          },
          {
            src: "/products/goal-core-everyday-raincoat-true-navy-catalog-product-back-20261026.webp",
            alt: "GOAL Athletics Core Everyday Raincoat in True Navy, product back, plain with the hood down",
          },
        ],
      },
      {
        name: "Dark Grey Heather",
        supplierColor: "Dark Grey Heather",
        hex: "#626561",
        skuFragment: "DARKGREYHEATHER",
        images: [
          {
            src: "/products/goal-core-everyday-raincoat-dark-grey-heather-catalog-product-front-20261026.webp",
            alt: "GOAL Athletics Core Everyday Raincoat in Dark Grey Heather, product front with the black GA monogram on the left chest and the black GOAL ATHLETICS wordmark on the right chest, hood up",
          },
          {
            src: "/products/goal-core-everyday-raincoat-dark-grey-heather-catalog-product-back-20261026.webp",
            alt: "GOAL Athletics Core Everyday Raincoat in Dark Grey Heather, product back, plain with the hood down",
          },
        ],
      },
    ],
    // Garment made in Bangladesh (Apliiq's J333 record); decorated at
    // Apliiq's US facilities, so Printed in the USA.
    originLabel: "Printed in the USA",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "jacket",
    supplierType: "apliiq",
    isActive: true,
    availableForSale: true,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  // == end GOAL Athletics Core Everyday Raincoat ==
  // == GOAL Athletics Core Quarter Zip (built 2026-10-26) ==
  // Tapstitch designs 1564299910617194496 Black (2026-10-26, owner-directed
  // crest placement), 1564523403115982848 White and 1564524205054324736 Dark Gray
  // (same day, owner: three colours): the V1.3 horizontal lockup 4.00 x
  // 1.07 in on the wearer's left chest, level with the bottom of the zip
  // placket, about half an inch clear of the zip. Tapstitch MT0063 runs S
  // to 4XL; the site sells S to XXL (owner: nothing above 2XL). Quote
  // $15.98 a unit ($12.99 blank + $2.99 print) plus about $5 shipping: the
  // 25% model's floor is $41; priced $48 (model price, not owner-set).
  // Tapstitch has no order API: lines are placed by hand from the alert
  // email (fulfillment-submit.ts) and shipped with the manual-shipped ops
  // action. Images are Tapstitch's mockups on the studio backdrop.
  {
    id: "80000000-0000-4000-8000-000000000023",
    name: "GOAL Athletics Core Quarter Zip",
    slug: "goal-athletics-core-quarter-zip",
    blank: "MT0063",
    description:
      "Lightweight quarter zip with the GOAL ATHLETICS lockup worn like a crest on the left chest. Stand collar, reflective hits, clean back.",
    priceCents: 4800,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#171717",
    fabric: "Lightweight 230 gsm performance knit with stretch; wicks and dries fast.",
    fit: "Regular athletic fit through the body with a stand collar and quarter zip. True to size.",
    careInstructions: "Machine wash cold with like colours. Do not bleach. Tumble dry low. Do not iron directly on the print.",
    images: [
      {
        src: "/products/goal-core-quarter-zip-black-catalog-product-front-20261026.webp",
        alt: "Core Quarter Zip in Black, product front with the white and red GOAL ATHLETICS lockup on the left chest beside the zip",
      },
    ],
    colorVariants: [
      {
        name: "Black",
        supplierColor: "Black",
        hex: "#171717",
        skuFragment: "BLACK",
        images: [
          {
            src: "/products/goal-core-quarter-zip-black-catalog-product-front-20261026.webp",
            alt: "Core Quarter Zip in Black, product front with the white and red GOAL ATHLETICS lockup on the left chest beside the zip",
          },
        ],
      },
      {
        name: "White",
        supplierColor: "White",
        hex: "#F4F3F1",
        skuFragment: "WHITE",
        images: [
          {
            src: "/products/goal-core-quarter-zip-white-catalog-product-front-20261026.webp",
            alt: "Core Quarter Zip in White, product front with the black and red GOAL ATHLETICS lockup on the left chest beside the zip",
          },
        ],
      },
      {
        name: "Dark Gray",
        supplierColor: "Dark Gray",
        hex: "#3F4545",
        skuFragment: "DARKGRAY",
        images: [
          {
            src: "/products/goal-core-quarter-zip-dark-gray-catalog-product-front-20261026.webp",
            alt: "Core Quarter Zip in Dark Gray, product front with the white and red GOAL ATHLETICS lockup on the left chest beside the zip",
          },
        ],
      },
    ],
    originLabel: "Printed in the USA",
    disclosure: "Ships from our overseas partner: allow 10 to 17 days.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "pullover",
    supplierType: "tapstitch",
    isActive: true,
    availableForSale: true,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  // == end GOAL Athletics Core Quarter Zip ==
  // == TEMPO Core Training Tee (built 2026-10-26) ==
  // Apliiq designs 6241853 Black, 6241860 White, 6241864 Iron Grey (rebuilt
  // 2026-10-26 at the owner's smallest size; 6240566/70/71 renamed delete):
  // the V1.3 GA monogram 2.00 x 1.80 in at the top of the wearer's left
  // chest print area, art centre 4 in from centre front (Apliiq's box
  // starts about 4 in below the collar on this blank). Apliiq quote $14.59 (XXL +$2): the 25% model's floor is $32;
  // priced $38 to sit with the men's tees. Images are Apliiq's renders on
  // the studio backdrop; no owner photos or sample yet. Record:
  // designs/62_tempo-collection-proofs-2026-10-26/.
  {
    id: "80000000-0000-4000-8000-000000000017",
    name: "TEMPO Core Training Tee",
    slug: "tempo-core-training-tee",
    blank: "LST350",
    description:
      "Women's performance tee with the GA monogram on the left chest. Lightweight, moisture-wicking polyester that holds its colour and its print, wash after wash.",
    priceCents: 3800,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#141414",
    fabric:
      "3.8 oz 100% polyester interlock, moisture-wicking, with a colour-locking finish so the fabric and the print stay sharp. Women's cut.",
    fit: "Women's cut, easy through the body. True to size.",
    careInstructions: "Machine wash cold with like colours. Do not bleach. Tumble dry low. Do not iron directly on the print.",
    images: [
      {
        src: "/products/tempo-core-training-tee-black-catalog-product-front-20261026.webp",
        alt: "TEMPO Core Training Tee in Black, product front with the white and red GA monogram on the left chest",
      },
    ],
    colorVariants: [
      {
        name: "Black",
        supplierColor: "Black",
        hex: "#141414",
        skuFragment: "BLACK",
        images: [
          {
            src: "/products/tempo-core-training-tee-black-catalog-product-front-20261026.webp",
            alt: "TEMPO Core Training Tee in Black, product front with the white and red GA monogram on the left chest",
          },
        ],
      },
      {
        name: "White",
        supplierColor: "White",
        hex: "#F3F3F1",
        skuFragment: "WHITE",
        images: [
          {
            src: "/products/tempo-core-training-tee-white-catalog-product-front-20261026.webp",
            alt: "TEMPO Core Training Tee in White, product front with the black and red GA monogram on the left chest",
          },
        ],
      },
      {
        name: "Iron Grey",
        supplierColor: "Iron Grey",
        hex: "#4B4F54",
        skuFragment: "IRONGREY",
        images: [
          {
            src: "/products/tempo-core-training-tee-iron-grey-catalog-product-front-20261026.webp",
            alt: "TEMPO Core Training Tee in Iron Grey, product front with the black GA monogram on the left chest",
          },
        ],
      },
    ],
    originLabel: "Printed in the USA",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "tshirt",
    supplierType: "apliiq",
    isActive: true,
    availableForSale: true,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  // == end TEMPO Core Training Tee ==
  // == TEMPO Quarter Zip (built 2026-10-26) ==
  // Tapstitch designs 1564321596708188160 Black, 1564322937081917440 White,
  // 1564323621013516288 Light Purple: the V1.3 GA monogram 2.00 x 1.80 in
  // (resized in place 2026-10-26, was 3.00 in) on the wearer's left chest,
  // centred 4 in from the zip, top 3 in below the collar. Tapstitch sells S to XL only. Quote $11.98 a unit plus
  // about $5 shipping: the 25% model's floor is $32; priced $44. Tapstitch
  // orders are placed by hand (see fulfillment-submit.ts) until an API is
  // connected. Images are Tapstitch's mockups. Record:
  // designs/62_tempo-collection-proofs-2026-10-26/.
  {
    id: "80000000-0000-4000-8000-000000000018",
    name: "TEMPO Quarter Zip",
    slug: "tempo-quarter-zip",
    blank: "WT0092",
    description:
      "Women's stretch quarter zip with the GA monogram on the left chest, a mock neck and thumbholes. The warm-up layer that goes from the car to the pitch.",
    priceCents: 4400,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#141414",
    fabric:
      "91% polyester, 9% spandex, 165 gsm. Four-way stretch, mock neck, quarter zip and thumbhole cuffs.",
    fit: "Close, body-skimming fit. Size up for room to layer.",
    careInstructions: "Machine wash cold on a gentle cycle. Do not bleach. Tumble dry low. Cool iron, avoiding the print. Do not dry clean.",
    images: [
      {
        src: "/products/tempo-quarter-zip-black-catalog-product-front-20261026.webp",
        alt: "TEMPO Quarter Zip in Black, product front with the white and red GA monogram on the left chest beside the zip",
      },
    ],
    colorVariants: [
      {
        name: "Black",
        supplierColor: "Black",
        hex: "#141414",
        skuFragment: "BLACK",
        images: [
          {
            src: "/products/tempo-quarter-zip-black-catalog-product-front-20261026.webp",
            alt: "TEMPO Quarter Zip in Black, product front with the white and red GA monogram on the left chest beside the zip",
          },
        ],
      },
      {
        name: "White",
        supplierColor: "White",
        hex: "#F7F7F5",
        skuFragment: "WHITE",
        images: [
          {
            src: "/products/tempo-quarter-zip-white-catalog-product-front-20261026.webp",
            alt: "TEMPO Quarter Zip in White, product front with the black and red GA monogram on the left chest beside the zip",
          },
        ],
      },
      {
        name: "Light Purple",
        supplierColor: "Light Purple",
        hex: "#C8B9DE",
        skuFragment: "LIGHTPURPLE",
        images: [
          {
            src: "/products/tempo-quarter-zip-light-purple-catalog-product-front-20261026.webp",
            alt: "TEMPO Quarter Zip in Light Purple, product front with the black GA monogram on the left chest beside the zip",
          },
        ],
      },
    ],
    originLabel: "Printed in the USA",
    disclosure: "Ships from our overseas partner: allow 10 to 17 days.",
    sizes: ["S", "M", "L", "XL"],
    category: "pullover",
    supplierType: "tapstitch",
    isActive: true,
    availableForSale: true,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  // == end TEMPO Quarter Zip ==
  // == TEMPO Training Pants (built 2026-10-26, rebuilt twice the same day) ==
  // Apliiq designs 6241817 Deep Red/White, 6241833 True Navy/White,
  // 6241843 Black/White: GA monogram 2.00 x 1.80 in at the top of the
  // wearer's LEFT front hip print box (Apliiq's box, about 9 in below the
  // waist; the brief asks 8.50 in) and the GOAL ATHLETICS wordmark
  // 4.00 x 1.22 in in the back RIGHT hip box, so the two marks sit on
  // opposite sides (owner, 2026-10-26: the second build had both on the
  // back of one leg; those designs, 6240609/610/611, are gone). The brief's
  // Black/Black is a separate Apliiq listing; Black/White was built from
  // this one. Apliiq quote $41.98 (XXL +$2): 25% model floor $72, priced
  // $72. Images: Apliiq's front and back renders on the studio backdrop.
  // Record: designs/62_tempo-collection-proofs-2026-10-26/.
  {
    id: "80000000-0000-4000-8000-000000000019",
    name: "TEMPO Training Pants",
    slug: "tempo-training-pants",
    blank: "LPST800",
    description:
      "Women's travel pant in recycled polyester with the GA monogram on the left thigh and the GOAL ATHLETICS wordmark on the back of the right leg. Drawcord waist, side pockets, tapered leg with zips at the ankle.",
    priceCents: 7200,
    compareAtPriceCents: null,
    color: "Black/White",
    colorHex: "#141414",
    fabric:
      "100% recycled polyester, moisture-wicking. Drawcord waist, side slash pockets, colourblock side panel, tapered leg with extended side zippers.",
    fit: "Women's cut, tapered through the leg. True to size; the drawcord waist gives room.",
    careInstructions: "Machine wash cold with like colours. Do not bleach. Tumble dry low. Do not iron directly on the print.",
    images: [
      {
        src: "/products/tempo-training-pants-black-white-catalog-product-front-20261026.webp",
        alt: "TEMPO Training Pants in Black/White, product front with the white and red GA monogram on the left thigh",
      },
      {
        src: "/products/tempo-training-pants-black-white-catalog-product-back-20261026.webp",
        alt: "TEMPO Training Pants in Black/White, product back with the white and red GOAL ATHLETICS wordmark on the right hip",
      },
    ],
    colorVariants: [
      {
        name: "Black/White",
        supplierColor: "Black/White",
        hex: "#141414",
        skuFragment: "BLACKWHITE",
        images: [
          {
            src: "/products/tempo-training-pants-black-white-catalog-product-front-20261026.webp",
            alt: "TEMPO Training Pants in Black/White, product front with the white and red GA monogram on the left thigh",
          },
          {
            src: "/products/tempo-training-pants-black-white-catalog-product-back-20261026.webp",
            alt: "TEMPO Training Pants in Black/White, product back with the white and red GOAL ATHLETICS wordmark on the right hip",
          },
        ],
      },
      {
        name: "True Navy/White",
        supplierColor: "True Navy/White",
        hex: "#1E2846",
        skuFragment: "TRUENAVYWHITE",
        images: [
          {
            src: "/products/tempo-training-pants-true-navy-white-catalog-product-front-20261026.webp",
            alt: "TEMPO Training Pants in True Navy/White, product front with the cream GA monogram on the left thigh",
          },
          {
            src: "/products/tempo-training-pants-true-navy-white-catalog-product-back-20261026.webp",
            alt: "TEMPO Training Pants in True Navy/White, product back with the cream GOAL ATHLETICS wordmark on the right hip",
          },
        ],
      },
      {
        name: "Deep Red/White",
        supplierColor: "Deep Red/White",
        hex: "#8E1B2A",
        skuFragment: "DEEPREDWHITE",
        images: [
          {
            src: "/products/tempo-training-pants-deep-red-white-catalog-product-front-20261026.webp",
            alt: "TEMPO Training Pants in Deep Red/White, product front with the white GA monogram on the left thigh",
          },
          {
            src: "/products/tempo-training-pants-deep-red-white-catalog-product-back-20261026.webp",
            alt: "TEMPO Training Pants in Deep Red/White, product back with the white GOAL ATHLETICS wordmark on the right hip",
          },
        ],
      },
    ],
    originLabel: "Printed in the USA",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "pants",
    supplierType: "apliiq",
    isActive: true,
    availableForSale: true,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  // == end TEMPO Training Pants ==
  // == TEMPO Training Shorts (built 2026-10-26) ==
  // Apliiq designs 6240613 Black, 6240615 Iron Grey, 6240616 True Navy on
  // the Sport-Tek LST485 ladies repeat short: the V1.3 GA monogram at
  // 2.00 x 1.80 in filling the wearer's left leg print box (2 x 2 in, the
  // only box on the blank), the size the 2026-10-26 design update accepted.
  // Apliiq quote $23.99 (XXL +$2): 25% model floor $46, priced $48 (model
  // price, not owner-set). Images are Apliiq's renders on the studio
  // backdrop. Record: designs/62_tempo-collection-proofs-2026-10-26/.
  {
    id: "80000000-0000-4000-8000-000000000022",
    name: "TEMPO Training Shorts",
    slug: "tempo-training-shorts",
    blank: "LST485",
    description:
      "Women's lightweight stretch short with the GA monogram on the left leg above the hem. Wide flat waistband, curved hem, clean back.",
    priceCents: 4800,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#252525",
    fabric: "86% polyester, 14% spandex. Lightweight four-way stretch that moves with every stride.",
    fit: "Women's cut with a wide, flat waistband and a curved hem. True to size.",
    careInstructions: "Machine wash cold with like colours. Do not bleach. Tumble dry low. Do not iron directly on the print.",
    images: [
      {
        src: "/products/tempo-training-shorts-black-catalog-product-front-20261026.webp",
        alt: "TEMPO Training Shorts in Black, product front with the white and red GA monogram on the left leg above the hem",
      },
    ],
    colorVariants: [
      {
        name: "Black",
        supplierColor: "Black",
        hex: "#252525",
        skuFragment: "BLACK",
        images: [
          {
            src: "/products/tempo-training-shorts-black-catalog-product-front-20261026.webp",
            alt: "TEMPO Training Shorts in Black, product front with the white and red GA monogram on the left leg above the hem",
          },
        ],
      },
      {
        name: "Iron Grey",
        supplierColor: "Iron Grey",
        hex: "#5F5F5F",
        skuFragment: "IRONGREY",
        images: [
          {
            src: "/products/tempo-training-shorts-iron-grey-catalog-product-front-20261026.webp",
            alt: "TEMPO Training Shorts in Iron Grey, product front with the black GA monogram on the left leg above the hem",
          },
        ],
      },
      {
        name: "True Navy",
        supplierColor: "True Navy",
        hex: "#202030",
        skuFragment: "TRUENAVY",
        images: [
          {
            src: "/products/tempo-training-shorts-true-navy-catalog-product-front-20261026.webp",
            alt: "TEMPO Training Shorts in True Navy, product front with the cream GA monogram on the left leg above the hem",
          },
        ],
      },
    ],
    originLabel: "Printed in the USA",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "shorts",
    supplierType: "apliiq",
    isActive: true,
    availableForSale: true,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  // == end TEMPO Training Shorts ==
  // == TEMPO Warmup Hoodie (built 2026-10-26) ==
  // Apliiq designs 6241875 Black, 6241879 Vintage White, 6241888 Navy
  // (rebuilt 2026-10-26 at the owner's smallest size; 6240580/81/82 renamed
  // delete): the V1.3 GA monogram 2.00 x 1.80 in centred on the chest, top
  // 3 in below the hood seam. Apliiq quote $37.28 (XXL +$2): 25% model floor $65,
  // priced $68. Images are Apliiq's renders on the studio backdrop. Record:
  // designs/62_tempo-collection-proofs-2026-10-26/.
  {
    id: "80000000-0000-4000-8000-000000000020",
    name: "TEMPO Warmup Hoodie",
    slug: "tempo-warmup-hoodie",
    blank: "7519",
    description:
      "Women's classic fleece hoodie with the GA monogram centred on the chest. Mid-length, soft-brushed inside, no drawcord to fuss with.",
    priceCents: 6800,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#161616",
    fabric:
      "8 oz combed and ring-spun cotton and polyester fleece (52/48), brushed inside. Women's mid-length cut with semi-set-in sleeves and a lined hood.",
    fit: "Women's fit, true to size, mid-length in the body.",
    careInstructions: "Machine wash cold, inside out, with like colours. Do not bleach. Tumble dry low. Do not iron directly on the print.",
    images: [
      {
        src: "/products/tempo-warmup-hoodie-black-catalog-product-front-20261026.webp",
        alt: "TEMPO Warmup Hoodie in Black, product front with the white and red GA monogram centred on the chest",
      },
    ],
    colorVariants: [
      {
        name: "Black",
        supplierColor: "Black",
        hex: "#161616",
        skuFragment: "BLACK",
        images: [
          {
            src: "/products/tempo-warmup-hoodie-black-catalog-product-front-20261026.webp",
            alt: "TEMPO Warmup Hoodie in Black, product front with the white and red GA monogram centred on the chest",
          },
        ],
      },
      {
        name: "Vintage White",
        supplierColor: "Vintage White",
        hex: "#ECE5D6",
        skuFragment: "VINTAGEWHITE",
        images: [
          {
            src: "/products/tempo-warmup-hoodie-vintage-white-catalog-product-front-20261026.webp",
            alt: "TEMPO Warmup Hoodie in Vintage White, product front with the black and red GA monogram centred on the chest",
          },
        ],
      },
      {
        name: "Navy",
        supplierColor: "Navy",
        hex: "#222B45",
        skuFragment: "NAVY",
        images: [
          {
            src: "/products/tempo-warmup-hoodie-navy-catalog-product-front-20261026.webp",
            alt: "TEMPO Warmup Hoodie in Navy, product front with the cream GA monogram centred on the chest",
          },
        ],
      },
    ],
    originLabel: "Printed in the USA",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "hoodie",
    supplierType: "apliiq",
    isActive: true,
    availableForSale: true,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  // == end TEMPO Warmup Hoodie ==
  // == TEMPO Training Tee (built 2026-10-26) ==
  // Tapstitch designs 1564324134866087936 White, 1564325002000687104 Red,
  // 1564325488367988736 Purple: the V1.3 horizontal lockup 6.00 x 1.60 in
  // (resized in place 2026-10-26, was 7.00 in) centred on the chest, top
  // 3 in below the collar. Quote $9.98 a unit plus
  // about $5 shipping: 25% model floor $29; priced $34. Tapstitch orders
  // are placed by hand until an API is connected. Images are Tapstitch's
  // mockups. Record: designs/62_tempo-collection-proofs-2026-10-26/.
  {
    id: "80000000-0000-4000-8000-000000000021",
    name: "TEMPO Training Tee",
    slug: "tempo-training-tee",
    blank: "WT0216",
    description:
      "Women's lightweight training tee with the GA and GOAL ATHLETICS lockup across the chest. Featherweight polyester for the session itself.",
    priceCents: 3400,
    compareAtPriceCents: null,
    color: "White",
    colorHex: "#F7F7F5",
    fabric:
      "100% polyester, 130 gsm. Light, quick-drying and smooth against the skin.",
    fit: "Regular women's fit that sits closer to the body than the Core tees. Between sizes, go up.",
    careInstructions: "Machine wash cold on a gentle cycle. Do not bleach. Tumble dry low. Cool iron, avoiding the print. Do not dry clean.",
    images: [
      {
        src: "/products/tempo-training-tee-white-catalog-product-front-20261026.webp",
        alt: "TEMPO Training Tee in White, product front with the black and red GA and GOAL ATHLETICS lockup across the chest",
      },
    ],
    colorVariants: [
      {
        name: "White",
        supplierColor: "White",
        hex: "#F7F7F5",
        skuFragment: "WHITE",
        images: [
          {
            src: "/products/tempo-training-tee-white-catalog-product-front-20261026.webp",
            alt: "TEMPO Training Tee in White, product front with the black and red GA and GOAL ATHLETICS lockup across the chest",
          },
        ],
      },
      {
        name: "Red",
        supplierColor: "Red",
        hex: "#C3132B",
        skuFragment: "RED",
        images: [
          {
            src: "/products/tempo-training-tee-red-catalog-product-front-20261026.webp",
            alt: "TEMPO Training Tee in Red, product front with the white GA and GOAL ATHLETICS lockup across the chest",
          },
        ],
      },
      {
        name: "Purple",
        supplierColor: "Purple",
        hex: "#6B3F99",
        skuFragment: "PURPLE",
        images: [
          {
            src: "/products/tempo-training-tee-purple-catalog-product-front-20261026.webp",
            alt: "TEMPO Training Tee in Purple, product front with the black GA and GOAL ATHLETICS lockup across the chest",
          },
        ],
      },
    ],
    originLabel: "Printed in the USA",
    disclosure: "Ships from our overseas partner: allow 10 to 17 days.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "tshirt",
    supplierType: "tapstitch",
    isActive: true,
    availableForSale: true,
    isLimitedDrop: false,
    dropVersion: null,
    dropLimit: null,
    dropSoldCount: 0,
    customNameAvailable: false,
    customNumberAvailable: false,
    customizationPriceCents: 0,
  },
  // == end TEMPO Training Tee ==
];

// ── Data access (swap these for Supabase queries later) ───────

// A gated collection (TEMPO while it is coming soon) is active in the
// catalog but invisible to the public: every reader drops it unless the
// caller asks for it with includeTempo, which only the owner's pages and
// the order records of already-placed orders do.
export interface CatalogRead {
  includeTempo?: boolean;
}

function visible(p: Product, opts?: CatalogRead): boolean {
  return p.isActive && (opts?.includeTempo === true || !tempoHidden(p.id));
}

export function getProducts(opts?: CatalogRead): Product[] {
  return products.filter((p) => visible(p, opts));
}

export function getProductBySlug(slug: string, opts?: CatalogRead): Product | undefined {
  return products.find((p) => p.slug === slug && visible(p, opts));
}

export function getProductById(id: string, opts?: CatalogRead): Product | undefined {
  return products.find((p) => p.id === id && visible(p, opts));
}

export function getLimitedDropProducts(): Product[] {
  return products.filter((p) => visible(p) && p.isLimitedDrop);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => visible(p) && p.category === category);
}

export function getJerseysByDrop(version: string): Product[] {
  return products.filter(
    (p) => p.isActive && p.category === "jersey" && p.dropVersion === version
  );
}
