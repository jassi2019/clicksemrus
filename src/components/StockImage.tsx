import Image from "next/image";
import { stockPhoto } from "@/lib/stockImage";

/**
 * Server component: a relevant photo for the given query (Pexels), with credit.
 * Renders nothing when no API key is configured, so layouts can keep their illustration fallback.
 */
export default async function StockImage({ query, index = 0, className = "", sizes = "(min-width: 1024px) 520px, 100vw", priority = false, aspect = "aspect-[4/3]", rounded = "rounded-3xl" }: {
  query: string;
  index?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  aspect?: string;
  rounded?: string;
}) {
  const p = await stockPhoto(query, { index });
  if (!p) return null;
  return (
    <figure className={`relative overflow-hidden ${rounded} ${aspect} shadow-[0_30px_60px_-28px_rgba(10,10,30,.45)] ${className}`}>
      <Image src={p.url} alt={p.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      <figcaption className="absolute bottom-2 right-3 text-[10px] text-white/80 bg-black/35 backdrop-blur px-2 py-0.5 rounded-full">
        Photo: <a href={p.creditUrl} target="_blank" rel="noopener noreferrer" className="underline">{p.credit}</a>
      </figcaption>
    </figure>
  );
}
