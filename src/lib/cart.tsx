"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CartItem, MAX_LINE_QUANTITY } from "./types";
import { getProductById } from "./products";

// ─────────────────────────────────────────────────────────────
// Minimal cart: React context + localStorage persistence.
// No accounts, no server state — checkout hands off to Stripe.
// ─────────────────────────────────────────────────────────────

// v2 (2026-09-21): makeKey now includes color. A v1 key was
// productId+size+customName+customNumber only, so two colorways in the same
// size collapsed onto one cart line (the second "add" just bumped quantity
// on the first color instead of adding its own line). Bumping the storage
// key so a v1 cart in a returning visitor's browser is dropped rather than
// read back with colorless keys that would no longer match anything.
const STORAGE_KEY = "portugooool-cart-v2";

/** Something changed under a saved cart while the visitor was away. */
export interface CartNotice {
  name: string;
  /** Present when the price moved; absent when the line was dropped. */
  fromCents?: number;
  toCents?: number;
  removed?: boolean;
}

interface CartContextValue {
  items: CartItem[];
  /** Changes applied to a restored cart. Surface these, never swallow them. */
  notices: CartNotice[];
  dismissNotices: () => void;
  addItem: (item: Omit<CartItem, "key">) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotalCents: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function makeKey(item: Omit<CartItem, "key">): string {
  return [
    item.productId,
    item.color,
    item.size,
    item.customName ?? "",
    item.customNumber ?? "",
  ].join("|");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [notices, setNotices] = useState<CartNotice[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage, then RECONCILE against the catalogue.
  //
  // A cart line stored the price captured when it was added, while
  // /api/checkout looks the price up server-side at session creation.
  // So a visitor who added something, left, and came back was shown the
  // old price and charged the current one, silently. That is not
  // hypothetical: every price in this catalogue moved on 2026-09-22.
  //
  // The server price stays authoritative - that is what stops a client
  // spoofing a total. This just makes the cart agree with it before the
  // customer commits, and says so out loud rather than quietly editing
  // the number under them.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as CartItem[];
        const found: CartNotice[] = [];
        const reconciled = stored.flatMap((item): CartItem[] => {
          const product = getProductById(item.productId);
          if (!product) {
            // Retired or archived. Checkout would refuse it anyway.
            found.push({ name: item.name, removed: true });
            return [];
          }
          const customised = Boolean(item.customName || item.customNumber);
          const current =
            product.priceCents + (customised ? product.customizationPriceCents : 0);
          if (current !== item.unitPriceCents) {
            found.push({ name: product.name, fromCents: item.unitPriceCents, toCents: current });
          }
          return [
            {
              ...item,
              name: product.name,
              unitPriceCents: current,
              quantity: Math.max(1, Math.min(MAX_LINE_QUANTITY, Math.floor(item.quantity))),
            },
          ];
        });
        setItems(reconciled);
        setNotices(found);
      }
    } catch {
      // Corrupt/blocked storage — start with an empty cart.
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration, so we don't wipe a saved cart).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable — cart still works for the session.
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "key">) => {
    const key = makeKey(item);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        // Cap here too: adding 6 to an existing 6 must not build a line
        // of 12 that checkout would silently cut back to 10.
        return prev.map((i) =>
          i.key === key
            ? { ...i, quantity: Math.min(MAX_LINE_QUANTITY, i.quantity + item.quantity) }
            : i
        );
      }
      return [...prev, { ...item, key, quantity: Math.min(MAX_LINE_QUANTITY, item.quantity) }];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    // Clamped to the same ceiling the checkout enforces (MAX_LINE_QUANTITY),
    // so the cart can never show a number that will not be ordered.
    const next = Math.min(MAX_LINE_QUANTITY, Math.floor(quantity));
    setItems((prev) =>
      next <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, quantity: next } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const dismissNotices = useCallback(() => setNotices([]), []);

  const { count, subtotalCents } = useMemo(() => {
    let count = 0;
    let subtotalCents = 0;
    for (const i of items) {
      count += i.quantity;
      subtotalCents += i.unitPriceCents * i.quantity;
    }
    return { count, subtotalCents };
  }, [items]);

  const value = useMemo(
    () => ({ items, notices, dismissNotices, addItem, removeItem, updateQuantity, clear, count, subtotalCents }),
    [items, notices, dismissNotices, addItem, removeItem, updateQuantity, clear, count, subtotalCents]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
