"use client";

import { FormEvent } from "react";
import type { Dictionary } from "@/i18n";

interface SearchPanelProps {
  query: string;
  content: Dictionary["search"];
  onQueryChange: (value: string) => void;
  onAnalyze: () => void;
}

export function SearchPanel({ query, content, onQueryChange, onAnalyze }: SearchPanelProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAnalyze();
  }

  return (
    <form className="search-panel" onSubmit={handleSubmit}>
      <label htmlFor="trademark-search">{content.label}</label>
      <div className="search-row">
        <input
          id="trademark-search"
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={content.placeholder}
          autoComplete="off"
        />
        <button type="submit">{content.submit}</button>
      </div>
    </form>
  );
}
