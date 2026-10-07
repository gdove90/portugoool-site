import type { Metadata } from "next";
import CollectionComingSoon from "@/components/CollectionComingSoon";
import { TEMPO_COLLECTION_COMING_SOON } from "@/lib/collection-launch";
import Editorial from "@/v84/Editorial";

export const metadata: Metadata = TEMPO_COLLECTION_COMING_SOON
  ? {
      title: "Tempo Women's Collection - Coming Soon",
      description: "The Tempo Collection by GOOOL Athletics. Women's athleticwear, coming soon. A new rhythm.",
      alternates: { canonical: "/women" },
      openGraph: {
        title: "The Tempo Collection - Coming Soon",
        description: "Women's athleticwear by GOOOL Athletics. A new rhythm.",
        url: "/women",
      },
    }
  : { title: "Women", alternates: { canonical: "/women" } };

export default function Page() {
  if (TEMPO_COLLECTION_COMING_SOON) {
    return <CollectionComingSoon collection="Tempo" audience="Women" image="/v84/assets/women.png" imageAlt="Woman in black athleticwear against warm stone" />;
  }
  return <Editorial route="women" />;
}
