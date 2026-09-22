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
import { CartItem } from "./types";

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

interface CartContextValue {
  items: CartItem[];
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
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
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
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, key }];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, quantity } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

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
    () => ({ items, addItem, removeItem, updateQuantity, clear, count, subtotalCents }),
    [items, addItem, removeItem, updateQuantity, clear, count, subtotalCents]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
