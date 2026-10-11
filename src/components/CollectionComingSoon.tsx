
import { InterfaceIcon } from "@/v84/InterfaceIcon";
import Image from "next/image";
import Link from "next/link";
import styles from "./CollectionComingSoon.module.css";

type Props = {
  collection: string;
  audience: string;
  image: string;
  imageAlt: string;
};

export default function CollectionComingSoon({ collection, audience, image, imageAlt }: Props) {
  return (
    <section className={styles.hero} aria-labelledby="collection-title">
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" className={styles.photo} />
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.content}>
        <p className={styles.eyebrow}>GOOOL ATHLETICS / {audience}</p>
        <p className={styles.status}>Coming soon</p>
        <h1 id="collection-title">
          <span className={styles.intro}>The</span>
          <span className={styles.name}>{collection}</span>
          <span className={styles.collection}>Collection.</span>
        </h1>
        <p className={styles.copy}>A new rhythm.</p>
        <div className={styles.actions}>
          <a href="#footer-signup" className="btn white">Join the list <InterfaceIcon name="arrow-up-right" /></a>
          <Link href="/men" className="btn outline">Explore men <InterfaceIcon name="arrow-up-right" /></Link>
        </div>
      </div>
      <p className={styles.signature}>ROOTED IN FUTBOL. MADE FOR YOUR EVERYDAY.</p>
    </section>
  );
}
