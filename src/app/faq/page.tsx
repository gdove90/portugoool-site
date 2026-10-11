import { pageMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import { FAQ_ITEMS } from "@/lib/faq";
import { Strike } from "@/v84/Brand";
export const metadata = pageMetadata("/faq", "FAQ", "Find answers about GOOOL sizing, delivery, customs and final-sale terms. Get support for your order.");
export default function FAQ() { return <article className="support"><h1>A few answers.</h1>{FAQ_ITEMS.map(item => <details className="product-detail" key={item.question}><summary>{item.question}<Strike /></summary><div>{item.answer}</div></details>)}<p><Link className="text-link nav-underline" href="/contact">Contact &amp; support</Link></p></article>; }
