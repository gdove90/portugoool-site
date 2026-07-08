import { Product, ALL_SIZES } from "./types";

// ─────────────────────────────────────────────────────────────
// Mock product catalog.
// This is the launch seed data. It mirrors the Supabase `products`
// table exactly — when you're ready, replace `getProducts()` /
// `getProductBySlug()` with Supabase queries and nothing else changes.
//
// Image paths point at /public/products/*.svg placeholders.
// Replace each SVG with a real product photo (same filename, or update
// the path here) when photography is ready.
// ─────────────────────────────────────────────────────────────

const JERSEY_FABRIC =
  "150 GSM performance polyester (92–100% poly, up to 8% elastane). Moisture-wicking, sublimation-friendly, silky smooth hand feel.";
const CASUAL_FABRIC =
  "190 GSM soft-touch cotton-poly blend. DTG/DTF print compatible with a relaxed streetwear drape.";

const JERSEY_CARE =
  "Machine wash cold, inside out. No bleach. Hang dry. Do not iron the print.";
const CASUAL_CARE =
  "Machine wash cold with like colors. Tumble dry low. Do not iron the print.";

export const products: Product[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Red Match Day Shirt",
    slug: "red-match-day",
    description:
      "Lightweight, smooth, and built for the moment. A breathable performance-style shirt made for match day, watch parties, and every goal celebration.",
    priceCents: 4500,
    compareAtPriceCents: 5500,
    color: "Deep Red",
    colorHex: "#C1121F",
    fabric: JERSEY_FABRIC,
    fit: "Athletic fit. True to size. Size up for a relaxed feel.",
    careInstructions: JERSEY_CARE,
    images: [
      { src: "/products/red-match-day.svg", alt: "Red Match Day Shirt — front" },
      { src: "/products/red-match-day-back.svg", alt: "Red Match Day Shirt — back" },
    ],
    sizes: ALL_SIZES,
    isActive: true,
    isLimitedDrop: true,
    inventoryDisplayCount: 40,
    customNameAvailable: true,
    customNumberAvailable: true,
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "Black GOOOOOL Shirt",
    slug: "black-goool",
    description:
      "The sound of the goal, printed in gold. Silky performance fabric that keeps up from kickoff to full time.",
    priceCents: 4500,
    compareAtPriceCents: null,
    color: "Black",
    colorHex: "#0A0A0A",
    fabric: JERSEY_FABRIC,
    fit: "Athletic fit. True to size. Size up for a relaxed feel.",
    careInstructions: JERSEY_CARE,
    images: [
      { src: "/products/black-goool.svg", alt: "Black GOOOOOL Shirt — front" },
    ],
    sizes: ALL_SIZES,
    isActive: true,
    isLimitedDrop: true,
    inventoryDisplayCount: 60,
    customNameAvailable: true,
    customNumberAvailable: true,
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    name: "White Celebration Shirt",
    slug: "white-celebration",
    description:
      "Clean, bright, and made to be seen. A crisp match-day shirt for the moment the whole room erupts.",
    priceCents: 4500,
    compareAtPriceCents: null,
    color: "White",
    colorHex: "#FFFFFF",
    fabric: JERSEY_FABRIC,
    fit: "Athletic fit. True to size. Size up for a relaxed feel.",
    careInstructions: JERSEY_CARE,
    images: [
      { src: "/products/white-celebration.svg", alt: "White Celebration Shirt — front" },
    ],
    sizes: ALL_SIZES,
    isActive: true,
    isLimitedDrop: false,
    inventoryDisplayCount: null,
    customNameAvailable: true,
    customNumberAvailable: true,
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    name: "Green Nation Shirt",
    slug: "green-nation",
    description:
      "Dark green, gold detail, zero noise. A premium everyday shirt with match-day blood.",
    priceCents: 4200,
    compareAtPriceCents: null,
    color: "Dark Green",
    colorHex: "#0B3D2E",
    fabric: CASUAL_FABRIC,
    fit: "Relaxed streetwear fit. Between sizes? Stay true.",
    careInstructions: CASUAL_CARE,
    images: [
      { src: "/products/green-nation.svg", alt: "Green Nation Shirt — front" },
    ],
    sizes: ALL_SIZES,
    isActive: true,
    isLimitedDrop: false,
    inventoryDisplayCount: null,
    customNameAvailable: true,
    customNumberAvailable: true,
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    name: "Gold Voice Shirt",
    slug: "gold-voice",
    description:
      "For the loudest voice in the room. Gold-accent performance shirt, light enough to wear until the final whistle.",
    priceCents: 4800,
    compareAtPriceCents: 5800,
    color: "Gold",
    colorHex: "#C9A227",
    fabric: JERSEY_FABRIC,
    fit: "Athletic fit. True to size. Size up for a relaxed feel.",
    careInstructions: JERSEY_CARE,
    images: [
      { src: "/products/gold-voice.svg", alt: "Gold Voice Shirt — front" },
    ],
    sizes: ALL_SIZES,
    isActive: true,
    isLimitedDrop: true,
    inventoryDisplayCount: 25,
    customNameAvailable: true,
    customNumberAvailable: true,
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    name: "Stadium Smoke Shirt",
    slug: "stadium-smoke",
    description:
      "Soft grey, heavy presence. A relaxed streetwear shirt inspired by flare smoke over a full stadium.",
    priceCents: 4200,
    compareAtPriceCents: null,
    color: "Smoke Grey",
    colorHex: "#9CA3AF",
    fabric: CASUAL_FABRIC,
    fit: "Relaxed streetwear fit. Between sizes? Stay true.",
    careInstructions: CASUAL_CARE,
    images: [
      { src: "/products/stadium-smoke.svg", alt: "Stadium Smoke Shirt — front" },
    ],
    sizes: ALL_SIZES,
    isActive: true,
    isLimitedDrop: false,
    inventoryDisplayCount: null,
    customNameAvailable: true,
    customNumberAvailable: true,
  },
];

// ── Data access (swap these for Supabase queries later) ───────

export function getProducts(): Product[] {
  return products.filter((p) => p.isActive);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug && p.isActive);
}

export function getLimitedDropProducts(): Product[] {
  return products.filter((p) => p.isActive && p.isLimitedDrop);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id && p.isActive);
}
