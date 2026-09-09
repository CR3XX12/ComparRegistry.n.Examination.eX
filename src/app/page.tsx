"use client";

import { useMemo, useState } from "react";
import { ResultsTable } from "@/components/ResultsTable";
import { SearchPanel } from "@/components/SearchPanel";
import { mockTrademarks } from "@/data/trademarks";
import { analyzeTrademarkSimilarity } from "@/lib/similarity";

export default function Home() {
  const [query, setQuery] = useState("NIKE");
  const [submittedQuery, setSubmittedQuery] = useState("NIKE");

  const results = useMemo(
    () => analyzeTrademarkSimilarity(submittedQuery, mockTrademarks),
    [submittedQuery]
  );

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Mock-data prototype</p>
          <h1>Trademark Similarity Analyzer</h1>
          <p>
            A first-pass product prototype for ranking similar trademarks so reviewers can
            filter possible conflicts faster and understand why each record surfaced.
          </p>
        </div>
        <SearchPanel
          query={query}
          onQueryChange={setQuery}
          onAnalyze={() => setSubmittedQuery(query)}
        />
      </section>

      <ResultsTable results={results} />

      <section className="limitations">
        <h2>Prototype Limitations</h2>
        <ul>
          <li>This does not connect to IMPI, MARCia, or Acervo yet.</li>
          <li>This does not provide legal conclusions.</li>
          <li>This does not analyze logos yet.</li>
          <li>This currently uses mock data.</li>
          <li>The goal is to validate the expected output and workflow.</li>
        </ul>
      </section>
    </main>
  );
}
