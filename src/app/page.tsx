"use client";

import { useEffect, useMemo, useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ResultsTable } from "@/components/ResultsTable";
import { SearchPanel } from "@/components/SearchPanel";
import impiSample from "@/data/generated/impi-sample.json";
import { dictionaries, formatMessage, type Language } from "@/i18n";
import { analyzeTrademarkSimilarity } from "@/lib/similarity";
import type { TrademarkRecord } from "@/types/trademark";

const impiTrademarkRecords = impiSample.records as TrademarkRecord[];
const LANGUAGE_STORAGE_KEY = "trademark-language";

function isSupportedLanguage(value: string | null): value is Language {
  return value === "en" || value === "es";
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [hasLoadedStoredLanguage, setHasLoadedStoredLanguage] = useState(false);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const content = dictionaries[language];

  const results = useMemo(
    () => analyzeTrademarkSimilarity(submittedQuery, impiTrademarkRecords),
    [submittedQuery]
  );

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (isSupportedLanguage(storedLanguage)) {
      setLanguage(storedLanguage);
    }

    setHasLoadedStoredLanguage(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = content.home.title;

    if (hasLoadedStoredLanguage) {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [content.home.title, hasLoadedStoredLanguage, language]);

  return (
    <main>
      <LanguageToggle
        language={language}
        labels={content.language}
        onLanguageChange={setLanguage}
      />

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{content.home.eyebrow}</p>
          <h1>{content.home.title}</h1>
          <p>{content.home.intro}</p>
          <p className="source-note">
            {formatMessage(content.home.sourceNote, {
              reportId: impiSample.source.reportId,
              sampledRecordCount: impiSample.source.sampledRecordCount,
              rawRecordCount: impiSample.source.rawRecordCount
            })}
          </p>
        </div>
        <SearchPanel
          query={query}
          content={content.search}
          onQueryChange={setQuery}
          onAnalyze={() => setSubmittedQuery(query)}
        />
      </section>

      <ResultsTable results={results} content={content.results} />

      <section className="limitations">
        <h2>{content.home.limitationsTitle}</h2>
        <ul>
          {content.home.limitations.map((limitation) => (
            <li key={limitation}>{limitation}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
