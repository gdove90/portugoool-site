import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductById } from "@/lib/products";
import { resolveApliiqSku } from "@/lib/fulfillment";
import { Size, isSoldOut, isAvailableForSale, hasPrice, MAX_LINE_QUANTITY } from "@/lib/types";

// ─────────────────────────────────────────────────────────────
// Stripe Checkout handoff.
//
// TODO before launch:
//   1. Create a Stripe account for GOOOL (separate from any other
//      business) and put STRIPE_SECRET_KEY in .env.local / Netlify env.
//   2. Add a webhook endpoint (checkout.session.completed) that writes
//      the order + order_items rows to Supabase using the service role
//      key, then triggers the Resend confirmation email.
//   3. Replace mock catalog lookups with Supabase product queries so
//      prices can never be spoofed from the client.
//
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
    if (!Array.isArray(items) || items.length === 0) throw new Error();
  } catch {
    return NextResponse.json({ error: "Invalid cart." }, { status: 400 });
  }

  // Build line items with server-side prices only.
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product) {
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
      color = variant.name;
    }
    const quantity = Math.max(1, Math.min(MAX_LINE_QUANTITY, Math.floor(item.quantity)));

    // Customization only counts when the product actually allows it.
    const customName = product.customNameAvailable
      ? item.customName?.trim().slice(0, 12) || null
      : null;
    const customNumber = product.customNumberAvailable
      ? item.customNumber?.trim().slice(0, 2) || null
      : null;
    const hasCustomization = Boolean(customName || customNumber);

    const descriptionParts = [`Size ${item.size}`, color];
    if (customName) descriptionParts.push(`Name: ${customName}`);
    if (customNumber) descriptionParts.push(`Number: ${customNumber}`);

    lineItems.push({
      quantity,
      price_data: {
        currency: "usd",
        unit_amount:
          product.priceCents +
          (hasCustomization ? product.customizationPriceCents : 0),
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
  const compactItems = [];
  for (const item of items) {
    const product = getProductById(item.productId)!;
    const color = product.colorVariants
      ? product.colorVariants.find((v) => v.name === item.color)!.name
      : product.color;
    const customName = product.customNameAvailable
      ? item.customName?.trim().slice(0, 12) || undefined
      : undefined;
    const customNumber = product.customNumberAvailable
      ? item.customNumber?.trim().slice(0, 2) || undefined
      : undefined;
    const hasCustomization = Boolean(customName || customNumber);
    const unitCents =
      product.priceCents + (hasCustomization ? product.customizationPriceCents : 0);

    // A variant we cannot fulfill must never be sold: fail before payment.
    const mapping = resolveApliiqSku(item.productId, color, item.size);
    if (!mapping) {
      return NextResponse.json(
        { error: `${product.name} in ${color} (${item.size}) can't be ordered right now.` },
        { status: 400 }
      );
    }

    compactItems.push({
      p: item.productId,
      c: color,
      s: item.size,
      q: Math.max(1, Math.min(MAX_LINE_QUANTITY, Math.floor(item.quantity))),
      u: unitCents,
      k: mapping.sku,
      a: mapping.apliiqProductId,
      ...(customName ? { n: customName } : {}),
      ...(customNumber ? { m: customNumber } : {}),
    });
  }
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
      metadata,
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
