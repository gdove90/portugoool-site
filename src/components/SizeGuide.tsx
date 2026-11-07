"use client";

import { useId, useState } from "react";
import Link from "next/link";
import FitDetails from "./FitDetails";
import { formatMeasurement, sizeGuideFor, sizeGuideHref, type MeasurementUnit } from "@/lib/size-guide";

export default function SizeGuide({ productId, showGuideLink = true, showMeasuringInstructions = true }: { productId: string; showGuideLink?: boolean; showMeasuringInstructions?: boolean }) {
  const [unit, setUnit] = useState<MeasurementUnit>("in");
  const id = useId();
  const guide = sizeGuideFor(productId);
  if (!guide) return null;

  return (
    <section className="size-guide-content" aria-labelledby={`${id}-title`} data-size-guide={productId}>
      <div className="size-guide-intro">
        <h2 id={`${id}-title`}>{guide.title}</h2>
        <FitDetails facts={guide.fitFacts} fallbackFit={guide.fit} />
        {!guide.fitFacts && <p className="size-guide-fabric">{guide.blank}</p>}
      </div>
      {showMeasuringInstructions && <div className="size-guide-measuring">
        <h3>How to measure</h3>
        <p>{guide.instructions}</p>
      </div>}
      {guide.rows.length > 0 && (
        <>
          {guide.fitFacts && <p className="size-guide-measurement-basis">The table below measures the garment laid flat and unstretched. Widths are edge to edge, not measurements around your body.</p>}
          <div className="size-guide-table-heading">
            <p>{guide.headwear ? "Fit range" : "Garment measurements"}</p>
            <div className="size-guide-units" role="group" aria-label="Measurement units">
              {(["in", "cm"] as const).map(value => (
                <button key={value} type="button" aria-pressed={unit === value} onClick={() => setUnit(value)}>
                  {value === "in" ? "Inches" : "Centimeters"}
                </button>
              ))}
            </div>
          </div>
          <div className="size-guide-table-scroll" role="region" aria-label={`${guide.title} measurement table`} tabIndex={0}>
            <table className="size-guide-table">
              <caption className="sr-only">{guide.title}: {guide.headwear ? "head circumference" : "flat, unstretched garment measurements"} in {unit === "in" ? "inches" : "centimeters"}</caption>
              <thead><tr>
                <th scope="col">Size</th>
                {guide.columns.map(column => <th scope="col" key={column.key}>{column.label}<span>{column.method}</span><span>({unit})</span></th>)}
              </tr></thead>
              <tbody>
                {guide.rows.map(row => <tr key={row.size}>
                  <th scope="row">{row.size}</th>
                  {row.values.map((value, index) => <td key={guide.columns[index].key}>{formatMeasurement(value, unit)}</td>)}
                </tr>)}
              </tbody>
            </table>
          </div>
          <p className="size-guide-tolerance">
            {guide.headwear ? "Approximate adult fit range. Adjust the closure to suit your head." : guide.toleranceIn ? `Measurements may vary by up to ${formatMeasurement(guide.toleranceIn, unit)} ${unit} between garments.` : "Allow for slight measurement variation between garments."}
          </p>
        </>
      )}
      {guide.bodyReference && <div className="size-guide-body-reference">
        <h3>Body size reference</h3>
        <p>{guide.bodyReference.instructions}</p>
        <div className="size-guide-table-scroll" role="region" aria-label={`${guide.title} body size reference`} tabIndex={0}>
          <table className="size-guide-table">
            <caption className="sr-only">{guide.title}: body circumference ranges in {unit === "in" ? "inches" : "centimeters"}</caption>
            <thead><tr><th scope="col">Size</th><th scope="col">U.S. size</th>{guide.bodyReference.columns.map(column => <th scope="col" key={column.key}>{column.label}<span>{column.method}</span><span>({unit})</span></th>)}</tr></thead>
            <tbody>{guide.bodyReference.rows.map(row => <tr key={row.size}><th scope="row">{row.size}</th><td>{row.usSize}</td>{row.values.map((value,index) => <td key={guide.bodyReference!.columns[index].key}>{formatMeasurement(value,unit)}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p className="size-guide-fabric">These ranges measure your body. U.S. sizes are a reference for this style; use each product&apos;s own guide.</p>
      </div>}
      {guide.note && <p>{guide.note}</p>}
      {showGuideLink && <Link href={sizeGuideHref(productId)} className="size-guide-link">All size guides</Link>}
    </section>
  );
}
