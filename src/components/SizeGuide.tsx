import { sizeChartFor, inches } from "@/lib/size-charts";

// Collapsed by default and built on <details>/<summary> so it costs no
// JavaScript, works before hydration, and is keyboard and screen-reader
// accessible without any ARIA of our own.
//
// Say what we have and nothing about what we do not. A blank whose
// maker publishes no sleeve length simply shows no sleeve column: the
// absence is invisible unless we point at it, and pointing at it only
// plants a doubt the shopper did not arrive with.
//
// The doubled "around" column exists because every figure a garment
// manufacturer publishes is a HALF chest, measured flat pit to pit.
// Shoppers measure themselves around. Showing only the flat figure is
// how someone decides a 21in chest cannot possibly fit them and orders
// two sizes up.
export default function SizeGuide({ productId }: { productId: string }) {
  const chart = sizeChartFor(productId);
  if (!chart) return null;

  const hasSleeve = chart.rows.some((r) => r.sleeveIn != null);

  return (
    <details className="group border-t border-ink/10 py-4">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-ink marker:hidden">
        {/* The prompt lives in the summary, not under it, so it is visible
            while the guide is closed - which is the only moment it can
            change anyone's mind. It also doubles the click target. */}
        <span>
          <span className="block text-sm font-semibold">
            Between sizes?
          </span>
          <span className="mt-0.5 block text-xs font-normal leading-relaxed text-ink/55">
            Measure a tee you already like across the chest, and match the
            flat figure.
          </span>
        </span>
        <span
          aria-hidden
          className="mt-0.5 shrink-0 text-ink/40 transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>

      <div className="mt-4">
        <p className="text-xs text-ink/50">{chart.blank}</p>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink/15 text-left">
                <th className="py-2 pr-3 font-semibold text-ink">Size</th>
                <th className="py-2 pr-3 font-semibold text-ink">
                  Chest, flat
                  <span className="block text-[11px] font-normal text-ink/45">
                    pit to pit
                  </span>
                </th>
                <th className="py-2 pr-3 font-semibold text-ink">
                  Chest, around
                  <span className="block text-[11px] font-normal text-ink/45">
                    measure yourself
                  </span>
                </th>
                <th className="py-2 pr-3 font-semibold text-ink">
                  Length
                  <span className="block text-[11px] font-normal text-ink/45">
                    shoulder to hem
                  </span>
                </th>
                {hasSleeve && (
                  <th className="py-2 font-semibold text-ink">Sleeve</th>
                )}
              </tr>
            </thead>
            <tbody>
              {chart.rows.map((r) => (
                <tr key={r.size} className="border-b border-ink/10 last:border-0">
                  <td className="py-2 pr-3 font-semibold text-ink">{r.size}</td>
                  <td className="py-2 pr-3 text-ink/70">{inches(r.chestIn)}&quot;</td>
                  <td className="py-2 pr-3 text-ink/70">{inches(r.chestIn * 2)}&quot;</td>
                  <td className="py-2 pr-3 text-ink/70">{inches(r.lengthIn)}&quot;</td>
                  {hasSleeve && (
                    <td className="py-2 text-ink/70">
                      {r.sleeveIn != null ? `${inches(r.sleeveIn)}"` : "—"}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {chart.note && (
          <p className="mt-3 text-xs leading-relaxed text-ink/60">{chart.note}</p>
        )}

        <p className="mt-3 text-[11px] leading-relaxed text-ink/45">
          Measured flat in inches, so allow a little variation between
          garments.
        </p>
      </div>
    </details>
  );
}
