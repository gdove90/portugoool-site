import type { Metadata } from "next";
import Editorial from "@/v84/Editorial";
import { BRAND_SEARCH_TITLE, BRAND_SEARCH_DESCRIPTION } from "@/v84/brand-metadata";
export const metadata: Metadata = { title: { absolute: BRAND_SEARCH_TITLE }, description: BRAND_SEARCH_DESCRIPTION, alternates: { canonical: "/" } };
export default function Home() { return <><Editorial route="home" /><section className="collective-home"><p className="eyebrow">THE LIFESTYLE DIVISION</p><h2>The Goal Collective.</h2><p>Elevated everyday wear and athleisure from the GOAL world. A relaxed approach to life off duty.</p><a className="text-link" href="/the-goal-collective">Explore the Collective →</a></section></>; }
