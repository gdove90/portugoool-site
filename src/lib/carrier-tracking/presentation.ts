// Shared, browser-safe view models. No credentials or provider requests belong here.
export interface TrackingLocation {
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
}

export interface TrackingEvent {
  id: string;
  status: string;
  detail: string | null;
  message: string | null;
  occurredAt: string | null;
  location: TrackingLocation | null;
}

export interface TrackingPackage {
  id: string;
  carrier: string | null;
  trackingNumber: string;
  carrierUrl: string | null;
  status: string;
  detail: string | null;
  events: TrackingEvent[];
  estimatedDelivery: string | null;
  updatedAt: string | null;
  lastSyncedAt: string | null;
  stale: boolean;
}

export interface TrackingDetails {
  available: boolean;
  packages: TrackingPackage[];
  reason?: string;
}

export interface LegacyTrackingShipment {
  carrier: string | null;
  trackingNumbers: string[];
  trackingUrls: string[];
}

export type KnownCarrier = "USPS" | "UPS" | "FedEx" | "DHLExpress" | "DHLGlobalMail";

export function normalizeCarrier(value: string | null | undefined): KnownCarrier | null {
  const key = (value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (["usps", "unitedstatespostalservice", "uspostalservice"].includes(key)) return "USPS";
  if (["ups", "unitedparcelservice"].includes(key)) return "UPS";
  if (["fedex", "federalexpress"].includes(key)) return "FedEx";
  if (["dhl", "dhlexpress"].includes(key)) return "DHLExpress";
  if (["dhlglobalmail", "dhlecommerce", "dhlecommerceus"].includes(key)) return "DHLGlobalMail";
  return null;
}

const CARRIER_HOSTS: Record<KnownCarrier, readonly string[]> = {
  USPS: ["tools.usps.com", "www.usps.com", "usps.com"],
  UPS: ["www.ups.com", "ups.com"],
  FedEx: ["www.fedex.com", "fedex.com"],
  DHLExpress: ["www.dhl.com", "dhl.com"],
  DHLGlobalMail: ["www.dhl.com", "dhl.com", "webtrack.dhlglobalmail.com"],
};

export function validateCarrierUrl(carrier: string | null, candidate: string | null | undefined): string | null {
  const known = normalizeCarrier(carrier);
  if (!known || !candidate || candidate.length > 2048) return null;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:" || url.username || url.password || url.port ||
        !CARRIER_HOSTS[known].includes(url.hostname.toLowerCase())) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function safeCarrierUrl(carrier: string | null, trackingNumber: string, supplied?: string | null): string | null {
  const known = normalizeCarrier(carrier);
  const number = trackingNumber.trim();
  if (!known || !number || number.length > 200 || /[\u0000-\u001f\u007f]/.test(number)) return null;
  // Generate canonical links with only the tracking identifier. Supplier query
  // strings are never passed through, even when their official host is valid.
  if (supplied) validateCarrierUrl(carrier, supplied);
  const encoded = encodeURIComponent(number);
  if (known === "USPS") return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encoded}`;
  if (known === "UPS") return `https://www.ups.com/track?tracknum=${encoded}`;
  if (known === "FedEx") return `https://www.fedex.com/fedextrack/?trknbr=${encoded}`;
  return `https://www.dhl.com/global-en/home/tracking.html?tracking-id=${encoded}`;
}

export function statusLabel(status: string, detail: string | null, carrier: string | null): string {
  const state = status.toLowerCase();
  const specific = (detail ?? "").toLowerCase();
  if (["pre_transit", "label_created"].includes(state) || specific === "label_created") {
    return `Label created — ${normalizeCarrier(carrier) ?? "carrier"} awaiting package`;
  }
  if (state === "accepted" || ["accepted", "arrived_at_facility"].includes(specific) && state === "in_transit") {
    return specific === "arrived_at_facility" ? "In transit" : "Accepted by carrier";
  }
  const labels: Record<string, string> = {
    in_transit: "In transit",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered",
    available_for_pickup: "Available for pickup",
    pickup_available: "Available for pickup",
    return_to_sender: "Returning to sender",
    returned: "Returned to sender",
    failure: "Delivery exception",
    error: "Tracking information unavailable",
    exception: "Delivery exception",
    delayed: "Carrier-reported delay",
    cancelled: "Tracking cancelled",
    unknown: "Carrier status unavailable",
    pending: "Carrier history pending",
    unsupported: "Carrier history unavailable",
  };
  if (["delayed", "weather_delay"].includes(specific)) return "Carrier-reported delay";
  return labels[state] ?? "Carrier status unavailable";
}

export function locationLabel(location: TrackingLocation | null): string | null {
  if (!location) return null;
  const parts = [location.city, location.state, location.postalCode, location.country]
    .filter((part): part is string => Boolean(part?.trim()));
  return parts.length ? parts.join(", ") : null;
}

export function formatTimestamp(value: string | null): string | null {
  if (!value || value.length > 100) return null;
  // Retain the carrier's reported wall time and offset instead of silently
  // displaying it in the viewer's or server's local timezone.
  const match = /^(\d{4}-\d{2}-\d{2})(?:T| )(\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)(Z|[+-]\d{2}:?\d{2})?$/.exec(value);
  if (match) {
    const [, day, time, offset] = match;
    const zone = !offset ? "time zone not supplied" : offset === "Z" ? "UTC" : `UTC${offset.length === 5 ? `${offset.slice(0, 3)}:${offset.slice(3)}` : offset}`;
    return `${day} ${time} (${zone})`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value} (date only; time zone not supplied)`;
  return null;
}

export function chronologicalEvents(events: TrackingEvent[]): TrackingEvent[] {
  // ISO wall times compare within a carrier's unspecified zone. Offset-bearing
  // times can be ordered as instants. Unknown times retain their provider order.
  if (!eventsHaveComparableTimes(events)) return [...events];
  return events.map((event, index) => ({ event, index })).sort((a, b) => {
    const left = a.event.occurredAt;
    const right = b.event.occurredAt;
    if (!left || !right) return a.index - b.index;
    const withZone = /(?:Z|[+-]\d{2}:?\d{2})$/;
    if (withZone.test(left) && withZone.test(right)) {
      const delta = Date.parse(left) - Date.parse(right);
      if (Number.isFinite(delta) && delta !== 0) return delta;
    } else if (!withZone.test(left) && !withZone.test(right)) {
      return left.localeCompare(right) || a.index - b.index;
    }
    return a.index - b.index;
  }).map(({ event }) => event);
}

export function eventsHaveComparableTimes(events: TrackingEvent[]): boolean {
  const withZone = /(?:Z|[+-]\d{2}:?\d{2})$/;
  return events.length > 0 && events.every(event => Boolean(formatTimestamp(event.occurredAt))) &&
    (events.every(event => withZone.test(event.occurredAt ?? "")) ||
      events.every(event => !withZone.test(event.occurredAt ?? "")));
}

export function uniqueShipmentPackages(shipments: LegacyTrackingShipment[]): TrackingPackage[] {
  const packages = new Map<string, TrackingPackage>();
  for (const shipment of shipments) {
    for (const number of shipment.trackingNumbers) {
      if (typeof number !== "string" || !number.trim() || number.length > 200) continue;
      const trackingNumber = number.replace(/\s/g, "").toUpperCase();
      const carrier = normalizeCarrier(shipment.carrier) ?? shipment.carrier;
      const key = `${(carrier ?? "").toLowerCase()}:${trackingNumber.toUpperCase()}`;
      if (packages.has(key)) continue;
      packages.set(key, {
        id: key, carrier, trackingNumber,
        carrierUrl: safeCarrierUrl(carrier, trackingNumber),
        status: "pending", detail: null, events: [], estimatedDelivery: null,
        updatedAt: null, lastSyncedAt: null, stale: false,
      });
    }
  }
  return [...packages.values()];
}
