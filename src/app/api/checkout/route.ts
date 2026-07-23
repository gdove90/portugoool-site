import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductById } from "@/lib/products";
import { Size, isSoldOut } from "@/lib/types";

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
          "Checkout isn't live yet — we're putting the finishing touches on the drop. Join the email list to hear the moment it opens.",
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
    const quantity = Math.max(1, Math.min(10, Math.floor(item.quantity)));

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

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "PT", "GB"],
      },
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
