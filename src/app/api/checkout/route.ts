import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductById } from "@/lib/products";
import { resolveApliiqSku } from "@/lib/fulfillment";
import { Size, isSoldOut, isAvailableForSale, hasPrice, MAX_LINE_QUANTITY } from "@/lib/types";

// ─────────────────────────────────────────────────────────────
// Stripe Checkout handoff.
//
// Catalog prices are the server-side source of truth.
// Security note: prices are ALWAYS looked up server-side by productId.
// The client only sends ids, sizes, quantities, and customization text.
// ─────────────────────────────────────────────────────────────

interface CheckoutItemPayload {
  productId: string;
  size: Size;
  color: string;
  quantity: number;
  customName: string | null;
  customNumber: string | null;
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  // Placeholder mode: no Stripe key configured yet.
  if (!secretKey || secretKey.startsWith("sk_test_xxx")) {
    return NextResponse.json(
      {
        error:
          "Checkout isn't live yet. We're putting the finishing touches on the drop, so join the email list to hear the moment it opens.",
      },
      { status: 503 }
    );
  }

  let items: CheckoutItemPayload[];
  try {
    const body = await req.json();
    items = body.items;
    if (!Array.isArray(items) || items.length === 0 || items.length > 50) throw new Error();
    for (const item of items) {
      if (!item || typeof item !== "object" || Array.isArray(item) ||
          typeof item.productId !== "string" || typeof item.size !== "string" ||
          typeof item.color !== "string" || !Number.isInteger(item.quantity) ||
          item.quantity < 1 || item.quantity > MAX_LINE_QUANTITY ||
          (item.customName != null && typeof item.customName !== "string") ||
          (item.customNumber != null && typeof item.customNumber !== "string")) throw new Error();
    }
  } catch {
    return NextResponse.json({ error: "Invalid cart." }, { status: 400 });
  }

  // Build line items with server-side prices only.
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const compactItems = [];
  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "A product in your cart is no longer available." },
        { status: 400 }
      );
    }
    // Controlled-testing exception to Coming Soon: only when BOTH the
    // Stripe key is a TEST key (sk_test_) and CHECKOUT_TEST_MODE=true.
    // Real (live) keys can never use this path, the whole site sits
    // behind the preview cookie anyway, and test-mode payments cannot
    // charge money. Remove CHECKOUT_TEST_MODE after verification.
    const testCheckout =
      secretKey.startsWith("sk_test_") && process.env.CHECKOUT_TEST_MODE === "true";
    if (!isAvailableForSale(product) && !testCheckout) {
      return NextResponse.json(
        { error: `${product.name} is coming soon and cannot be purchased yet.` },
        { status: 400 }
      );
    }
    // No retail price yet: refused even under the controlled-testing
    // exception, so a $0 line can never be handed to Stripe.
    if (!hasPrice(product)) {
      return NextResponse.json(
        { error: `${product.name} is not priced yet and cannot be purchased.` },
        { status: 400 }
      );
    }
    if (isSoldOut(product)) {
      return NextResponse.json(
        { error: `${product.name} is no longer available.` },
        { status: 400 }
      );
    }
    if (!product.sizes.includes(item.size)) {
      return NextResponse.json({ error: "Invalid size." }, { status: 400 });
    }

    // Variant products: the color must be one of the product's colorways;
    // single-color products always use their own color.
    let color = product.color;
    if (product.colorVariants) {
      const variant = product.colorVariants.find((v) => v.name === item.color);
      if (!variant) {
        return NextResponse.json({ error: "Invalid color." }, { status: 400 });
      }
      // A colourway the product page shows as coming soon must not be
      // orderable through a crafted request either.
      if (variant.comingSoon) {
        return NextResponse.json(
          { error: `${variant.name} is coming soon and can't be ordered yet.` },
          { status: 400 },
        );
      }
      color = variant.name;
    }
    const quantity = item.quantity;

    // Customization only counts when the product actually allows it.
    const customName = product.customNameAvailable
      ? item.customName?.trim().slice(0, 12) || null
      : null;
    const customNumber = product.customNumberAvailable
      ? item.customNumber?.trim().slice(0, 2) || null
      : null;
    const hasCustomization = Boolean(customName || customNumber);

    const mapping = resolveApliiqSku(product.id, color, item.size);
    if (!mapping) return NextResponse.json(
      { error: "This product variant cannot be ordered right now." }, { status: 400 });
    const unitCents = product.priceCents + (hasCustomization ? product.customizationPriceCents : 0);
    compactItems.push({ p: product.id, c: color, s: item.size, q: quantity,
      u: unitCents, k: mapping.sku, a: mapping.apliiqProductId,
      ...(customName ? { n: customName } : {}), ...(customNumber ? { m: customNumber } : {}) });

    const descriptionParts = [`Size ${item.size}`, color];
    if (customName) descriptionParts.push(`Name: ${customName}`);
    if (customNumber) descriptionParts.push(`Number: ${customNumber}`);

    lineItems.push({
      quantity,
      price_data: {
        currency: "usd",
        unit_amount: unitCents,
        product_data: {
          name: hasCustomization
            ? `${product.name} (customized)`
            : product.name,
          description: descriptionParts.join(" · "),
          // Metadata rides along so the webhook can build order_items rows.
          metadata: {
            product_id: product.id,
            size: item.size,
            color,
            custom_name: customName ?? "",
            custom_number: customNumber ?? "",
          },
        },
      },
    });
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;

  // Shipping is a deliberate business decision, never an accident:
  // without a configured Stripe shipping rate we refuse checkout
  // instead of quietly giving free shipping. Set STRIPE_SHIPPING_RATE_ID
  // (a shr_… rate created in the Stripe dashboard) to open this path.
  const shippingRateId = process.env.STRIPE_SHIPPING_RATE_ID;
  if (!shippingRateId) {
    return NextResponse.json(
      { error: "Checkout isn't live yet: shipping rates are still being configured." },
      { status: 503 }
    );
  }

  // Immutable purchase snapshot for the payment webhook, chunked to
  // respect Stripe's 500-char metadata value limit. Prices AND Apliiq
  // fulfillment SKUs are resolved NOW, at checkout creation, and ride
  // with the session: later catalog edits can never change what a
  // completed payment fulfills — including delayed payments and
  // webhook retries. Metadata is set server-side, so it is not
  // client-tamperable.
  const itemsJson = JSON.stringify(compactItems);
  const metadata: Record<string, string> = {};
  for (let i = 0; i * 450 < itemsJson.length; i++) {
    metadata[`items_${i}`] = itemsJson.slice(i * 450, (i + 1) * 450);
  }
  if (Object.keys(metadata).length > 40) {
    return NextResponse.json(
      { error: "Cart is too large for a single checkout. Please split it up." },
      { status: 400 }
    );
  }

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "PT", "GB"],
      },
      shipping_options: [{ shipping_rate: shippingRateId }],
      // One approved rate; country-specific delivery estimates are stated below.
      custom_text: {
        shipping_address: {
          message:
            "Delivery is 7 to 12 business days in the US. Canada, the UK and Portugal take about 3 to 5 weeks, and your country may charge import duty or VAT on arrival.",
        },
      },
      metadata,
      // Stripe validates the individual first-order codes issued by lib/discount.
      allow_promotion_codes: true,
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      // Customer email is collected by Stripe Checkout itself.
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}
