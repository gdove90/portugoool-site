import { pageMetadata } from "@/lib/page-metadata";
import CollectionComingSoon from "@/components/CollectionComingSoon";
import { TEMPO_COLLECTION_COMING_SOON } from "@/lib/collection-launch";
import Editorial from "@/v84/Editorial";

export const metadata = TEMPO_COLLECTION_COMING_SOON
  ? pageMetadata("/women", "Tempo Women's Collection - Coming Soon", "The Tempo Collection by GOOOL Athletics. Women's athletic wear, coming soon. A new rhythm.")
  : pageMetadata("/women", "Women's Athletic Wear | Tempo Collection", "Discover the Tempo Collection by GOOOL Athletics. A new rhythm.");

export default function Page() {
  if (TEMPO_COLLECTION_COMING_SOON) {
    return <CollectionComingSoon collection="Tempo" audience="Women" image="/v84/assets/women.png" imageAlt="Woman in black athleticwear against warm stone" />;
  }
  return <Editorial route="women" />;
}
