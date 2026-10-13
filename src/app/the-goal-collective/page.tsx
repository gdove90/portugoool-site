import Link from "next/link";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("/the-goal-collective", "The Goal Collective", "The lifestyle division of GOAL Brand Group. Independent. Futbol inspired. On the pitch, off the clock.");
export default function Collective() {
  return <article className="collective-page">
    <header><p className="eyebrow">GOAL BRAND GROUP · LIFESTYLE</p><h1>The Goal<br /><em>Collective.</em></h1></header>
    <section className="collective-intro"><h2>A bigger circle.<br />Same mindset.</h2><div><p>The Goal Collective is our lifestyle division. Everyday pieces, shaped by people pursuing their goals, becoming the best version of themselves, and growing together.</p><p>GOAL Athletics is our home for technical performance apparel and training equipment. The Collective carries that feeling into the rest of your day.</p></div></section>
    <section className="collective-selections"><div><p className="eyebrow">01 / MEN</p><h2>Beyond training.</h2><p>A new everyday collection is taking shape.</p></div><div><p className="eyebrow">02 / WOMEN</p><h2>Move your way.</h2><p>Our women’s lifestyle collection is in development.</p></div></section>
    <footer><p>First looks. New pieces. The next chapter.</p><Link className="btn" href="/gate">Get launch updates</Link></footer>
  </article>;
}
