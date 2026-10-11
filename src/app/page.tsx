import type { Metadata } from "next";
import Editorial from "@/v84/Editorial";
import { BRAND_SEARCH_TITLE, BRAND_SEARCH_DESCRIPTION } from "@/v84/brand-metadata";
export const metadata: Metadata = { title: { absolute: BRAND_SEARCH_TITLE }, description: BRAND_SEARCH_DESCRIPTION, alternates: { canonical: "/" } };
export default function Home() { return <Editorial route="home" />; }
