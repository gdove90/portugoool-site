import type { FitFact } from "@/lib/womens-fit";

export default function FitDetails({ facts, fallbackFit }: { facts?: FitFact[]; fallbackFit: string }) {
  if (!facts?.length) return <p>{fallbackFit}</p>;
  return <dl className="fit-facts" aria-label="Fit and sizing details">
    {facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
  </dl>;
}
