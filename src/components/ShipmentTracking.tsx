import {
  chronologicalEvents,
  eventsHaveComparableTimes,
  formatTimestamp,
  locationLabel,
  safeCarrierUrl,
  statusLabel,
  type TrackingPackage,
} from "@/lib/carrier-tracking/presentation";

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
    <section aria-labelledby="shipment-progress-title" className="flex min-w-0 flex-col gap-4">
      <h2 id="shipment-progress-title" className="font-display text-[26px] uppercase leading-tight">Shipment progress</h2>
      <p className="text-base leading-relaxed text-ink/70">
        Each package has its own carrier history. Scans are reported events; updates depend on the carrier.
      </p>
      {loading && <p role="status" className="text-base text-ink/70">Checking saved carrier updates…</p>}
      {!loading && !available && (
        <p role="status" className="text-base leading-relaxed text-ink/70">
          Carrier history is unavailable here right now. Your order status is still shown; use an official carrier link below for available updates.
        </p>
      )}
      {packages.length === 0 && (
        <p className="border-t border-ink/10 py-[18px] text-base text-ink/70">
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
          <article key={pkg.id} className="min-w-0 border border-ink/15 bg-paper p-[18px] sm:p-6">
            <h3 className="text-lg font-bold">Package {index + 1}{pkg.carrier ? ` · ${pkg.carrier}` : ""}</h3>
            <p className="mt-1 break-all text-base text-ink/70">Tracking number: {pkg.trackingNumber}</p>
            <p className="mt-4 text-lg font-bold">{deliveredAfterReturn ? "Delivery reported after return-to-sender scan" : statusLabel(pkg.status, pkg.detail, pkg.carrier)}</p>
            {isLabel && (
              <p className="mt-2 text-base leading-relaxed text-ink/70">
                A label has been created. This does not confirm that the carrier has received the package.
              </p>
            )}
            {latest && (
              <div className="mt-4 border-t border-ink/10 pt-4 text-base leading-relaxed">
                <p className="font-semibold">{comparableTimes ? "Last reported carrier event" : "Carrier event report"}</p>
                <p className="text-ink/70">{latest.message || statusLabel(latest.status, latest.detail, pkg.carrier)}</p>
                {latestLocation && (
                  <p className="text-ink/70">Reported event location: {latestLocation}</p>
                )}
                <p className="text-ink/70"><ReportedTime value={latest.occurredAt} /></p>
              </div>
            )}
            {eta && <p className="mt-4 text-base"><span className="font-semibold">Carrier estimated delivery:</span> <time dateTime={pkg.estimatedDelivery ?? undefined}>{eta}</time></p>}
            {pkg.stale && (
              <p className="mt-4 bg-smoke p-3 text-base leading-relaxed text-ink/70">
                These are the last saved carrier updates. Check the carrier website for newer information.
              </p>
            )}
            {events.length > 0 ? (
              <details className="mt-4 border-t border-ink/10 pt-2" open>
                <summary className="min-h-[44px] cursor-pointer py-3 text-base font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
                  Carrier event history ({events.length})
                </summary>
                {!comparableTimes && <p className="mb-4 text-base text-ink/70">Event order may differ where timestamps or time zones cannot be compared.</p>}
                <ol className="pl-4">
                  {events.map(event => {
                    const location = locationLabel(event.location);
                    return (
                      <li key={event.id} className="border-l border-ink/20 pb-5 pl-4 text-base leading-relaxed last:pb-0">
                        <p className="font-semibold">{event.message || statusLabel(event.status, event.detail, pkg.carrier)}</p>
                        {location && <p className="text-ink/70">Event location: {location}</p>}
                        <p className="text-ink/70"><ReportedTime value={event.occurredAt} /></p>
                      </li>
                    );
                  })}
                </ol>
              </details>
            ) : (
              <p className="mt-4 text-base leading-relaxed text-ink/70">
                No carrier scans are available here yet. A tracking number alone does not confirm carrier acceptance.
              </p>
            )}
            {pkg.updatedAt && <p className="mt-4 text-sm leading-relaxed text-ink/70">Carrier update: <ReportedTime value={pkg.updatedAt} /></p>}
            {pkg.lastSyncedAt && <p className="mt-1 text-sm leading-relaxed text-ink/70">Last synchronized: <ReportedTime value={pkg.lastSyncedAt} /></p>}
            {carrierUrl && (
              <a href={carrierUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-[44px] items-center text-base font-bold text-ink underline underline-offset-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
                View on carrier website<span className="sr-only"> for package {index + 1} (opens in a new tab)</span>
              </a>
            )}
          </article>
        );
      })}
    </section>
  );
}
