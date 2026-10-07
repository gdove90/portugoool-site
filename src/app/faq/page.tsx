import type { Metadata } from "next";
import Link from "next/link";
import { FAQ_ITEMS } from "@/lib/faq";
import { Strike } from "@/v84/Brand";
export const metadata: Metadata = { title: "FAQ", alternates: { canonical: "/faq" } };
export default function FAQ() { return <article className="support"><h1>A few answers.</h1>{FAQ_ITEMS.map(item => <details className="product-detail" key={item.question}><summary>{item.question}<Strike /></summary><div>{item.answer}</div></details>)}<p><Link className="text-link nav-underline" href="/contact">Contact &amp; support</Link></p></article>; }
