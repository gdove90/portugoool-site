import {
  chronologicalEvents,
  eventsHaveComparableTimes,
  formatTimestamp,
  locationLabel,
  safeCarrierUrl,
  statusLabel,
  type TrackingPackage,
} from "@/lib/carrier-tracking/presentation";
import { Strike } from "@/v84/Brand";

function ReportedTime({ value }: { value: string | null }) {
  const label = formatTimestamp(value);
  return label ? <time dateTime={value ?? undefined}>{label}</time> : <>Time unavailable</>;
}

export default function ShipmentTracking({ packages, loading, available }: {
  packages: TrackingPackage[];
  loading: boolean;
  available: boolean;
}) {
  return (
    <div className="help-shipment-tracking">
      <p className="help-copy">
        Each package has its own carrier history. Scans are reported events; updates depend on the carrier.
      </p>
      {loading && <p role="status" className="help-copy">Checking saved carrier updates…</p>}
      {!loading && !available && (
        <p role="status" className="help-copy">
          Carrier history is unavailable here right now. Your order status is still shown; use an official carrier link below for available updates.
        </p>
      )}
      {packages.length === 0 && (
        <p className="help-copy">
          No package tracking numbers have been supplied yet.
        </p>
      )}
      {packages.map((pkg, index) => {
        const events = chronologicalEvents(pkg.events);
        const latest = events[events.length - 1];
        const latestLocation = latest ? locationLabel(latest.location) : null;
        const comparableTimes = eventsHaveComparableTimes(events);
        const deliveredAfterReturn = pkg.status === "delivered" && events.some(event => event.status === "return_to_sender");
        const isLabel = ["pre_transit", "label_created"].includes(pkg.status) || pkg.detail === "label_created";
        const carrierUrl = safeCarrierUrl(pkg.carrier, pkg.trackingNumber, pkg.carrierUrl);
        const eta = formatTimestamp(pkg.estimatedDelivery);
        return (
          <article key={pkg.id} className="help-package">
            <h3 className="help-eyebrow">Package {index + 1}{pkg.carrier ? ` · ${pkg.carrier}` : ""}</h3>
            <p className="help-subheading">{deliveredAfterReturn ? "Delivery reported after return-to-sender scan" : statusLabel(pkg.status, pkg.detail, pkg.carrier)}</p>
            <p className="help-copy">Tracking number: {pkg.trackingNumber}</p>
            {isLabel && (
              <p className="help-copy">
                A label has been created. This does not confirm that the carrier has received the package.
              </p>
            )}
            {latest && (
              <div className="help-carrier-event">
                <p className="help-track-step-title">{comparableTimes ? "Last reported carrier event" : "Carrier event report"}</p>
                <p>{latest.message?.replace(/\s*\u2014\s*/g, ": ") || statusLabel(latest.status, latest.detail, pkg.carrier)}</p>
                {latestLocation && (
                  <p>Reported event location: {latestLocation}</p>
                )}
                <p><ReportedTime value={latest.occurredAt} /></p>
              </div>
            )}
            {eta && <p className="help-copy"><strong>Carrier estimated delivery:</strong> <time dateTime={pkg.estimatedDelivery ?? undefined}>{eta}</time></p>}
            {pkg.stale && (
              <p className="help-copy">
                These are the last saved carrier updates. Check the carrier website for newer information.
              </p>
            )}
            {events.length > 0 ? (
              <details className="help-disclosure help-carrier-history">
                <summary>Carrier event history ({events.length}) <Strike /></summary>
                {!comparableTimes && <p className="help-copy">Event order may differ where timestamps or time zones cannot be compared.</p>}
                <ol>
                  {events.map(event => {
                    const location = locationLabel(event.location);
                    return (
                      <li key={event.id}>
                        <p className="help-track-step-title">{event.message?.replace(/\s*\u2014\s*/g, ": ") || statusLabel(event.status, event.detail, pkg.carrier)}</p>
                        {location && <p>Event location: {location}</p>}
                        <p><ReportedTime value={event.occurredAt} /></p>
                      </li>
                    );
                  })}
                </ol>
              </details>
            ) : (
              <p className="help-copy">
                No carrier scans are available here yet. A tracking number alone does not confirm carrier acceptance.
              </p>
            )}
            {pkg.updatedAt && <p className="help-copy">Carrier update: <ReportedTime value={pkg.updatedAt} /></p>}
            {pkg.lastSyncedAt && <p className="help-copy">Last synchronized: <ReportedTime value={pkg.lastSyncedAt} /></p>}
            {carrierUrl && (
              <a href={carrierUrl} target="_blank" rel="noopener noreferrer" className="help-link help-carrier-link">
                View on carrier website<span className="sr-only"> for package {index + 1} (opens in a new tab)</span>
              </a>
            )}
          </article>
        );
      })}
    </div>
  );
}
