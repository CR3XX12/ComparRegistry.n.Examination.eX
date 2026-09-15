"use client";

import { useMemo, useState } from "react";
import { ResultsTable } from "@/components/ResultsTable";
import { SearchPanel } from "@/components/SearchPanel";
import impiSample from "@/data/generated/impi-sample.json";
import { analyzeTrademarkSimilarity } from "@/lib/similarity";
import type { TrademarkRecord } from "@/types/trademark";

const impiTrademarkRecords = impiSample.records as TrademarkRecord[];

export default function Home() {
  const [query, setQuery] = useState("ADBAC");
  const [submittedQuery, setSubmittedQuery] = useState("ADBAC");

  const results = useMemo(
    () => analyzeTrademarkSimilarity(submittedQuery, impiTrademarkRecords),
    [submittedQuery]
  );

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">IMPI open-data sample</p>
          <h1>Trademark Similarity Analyzer</h1>
          <p>
            A first-pass product prototype for ranking similar trademarks from an official
            IMPI open-data sample so reviewers can filter possible conflicts faster.
          </p>
          <p className="source-note">
            Source report {impiSample.source.reportId}: {impiSample.source.sampledRecordCount} imported
            records from {impiSample.source.rawRecordCount} monthly records.
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
          <li>This uses a local sample imported from IMPI Datos Abiertos, not a live connection.</li>
          <li>This does not query MARCia or Acervo in real time yet.</li>
          <li>This does not provide legal conclusions.</li>
          <li>This does not analyze logos yet.</li>
          <li>The inspected XML sample does not include Nice class, registration number, or goods/services text.</li>
          <li>The goal is to validate the expected output and workflow.</li>
        </ul>
      </section>
    </main>
  );
}
