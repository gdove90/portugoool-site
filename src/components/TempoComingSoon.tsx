
import Image from "next/image";
import styles from "./CollectionComingSoon.module.css";

type Props = {
  collection: string;
  audience: string;
  image: string;
  imageAlt: string;
};

// No buttons (owner, 2026-10-26): status, title, line and signature only.
export default function TempoComingSoon({ collection, audience, image, imageAlt }: Props) {
  return (
    <section className={styles.hero} aria-labelledby="collection-title">
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" className={styles.photo} />
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.content}>
        <p className={styles.status}>Coming soon</p>
        <h1 id="collection-title">
          <span className={styles.intro}>The</span>
          <span className={styles.name}>{collection}</span>
          <span className={styles.collection}>Collection.</span>
        </h1>
        <p className={styles.copy}>A new rhythm.</p>
      </div>
      <p className={styles.signature}>WOMEN’S PERFORMANCE ATHLETICWEAR.</p>
    </section>
  );
}
