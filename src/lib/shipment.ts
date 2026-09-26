import { createHash } from "crypto";
import type { ShipmentRow } from "./orders-store";

export function trackingNumbers(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter((n): n is string =>
    typeof n === "string" && n.trim().length > 0 && n.length <= 200).map(n => n.trim()))] : [];
}

export function shipmentIdentity(shipment: ShipmentRow): string {
  // Ignore callback status/array order: one physical tracking group gets one notice.
  return createHash("sha256").update(JSON.stringify([
    shipment.order_id, trackingNumbers(shipment.tracking_numbers).sort(),
  ])).digest("hex");
}

export function shipmentRowId(shipment: ShipmentRow): string {
  const status = shipment.status.toLowerCase() === "success" ? "shipped" : shipment.status.toLowerCase();
  const hash = createHash("sha256").update(JSON.stringify([
    shipmentIdentity(shipment), status,
    // Without tracking, keep distinct callback details rather than collapse packages.
    shipment.tracking_numbers.length ? null : shipment.line_items,
  ])).digest("hex");
  return `${hash.slice(0,8)}-${hash.slice(8,12)}-5${hash.slice(13,16)}-a${hash.slice(17,20)}-${hash.slice(20,32)}`;
}

export function hasShipped(shipment: ShipmentRow): boolean {
  return ["success", "shipped"].includes(shipment.status.toLowerCase()) && trackingNumbers(shipment.tracking_numbers).length > 0;
}
