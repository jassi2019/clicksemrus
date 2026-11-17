type Fact = { stat: string; fact: string };

/**
 * "By the numbers" cornerstone fact strip (GEO item #7). Each fact is a quotable, honest one-liner
 * framed as an industry norm. Wrapped in semantic markup (<dl>) so AI engines can extract each fact.
 */
export default function FactStrip({
  items,
  title = "By the numbers",
  note,
}: {
  items: readonly Fact[];
  title?: string;
  note?: string;
}) {
  return (
    <section className="container-x py-12 md:py-16" aria-label={title}>
      <p className="eyebrow">{title}</p>
      <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {items.map((f) => (
          <div key={f.stat + f.fact.slice(0, 16)} className="card !transform-none p-5 h-full flex flex-col">
            <dt className="font-display text-2xl md:text-3xl font-extrabold gradient-text">{f.stat}</dt>
            <dd className="text-sm text-muted mt-2 leading-relaxed">{f.fact}</dd>
          </div>
        ))}
      </dl>
      {note && <p className="text-xs text-muted mt-4 max-w-2xl">{note}</p>}
    </section>
  );
}
