import Script from "next/script";
import { jsonLd } from "@/lib/seo";

function hashJsonLd(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash.toString(36);
}

export function JsonLd({ value }: { value: unknown }) {
  const content = jsonLd(value);
  return <Script id={`json-ld-${hashJsonLd(content)}`} type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: content }} />;
}
