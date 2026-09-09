"use client";

import { FormEvent } from "react";

interface SearchPanelProps {
  query: string;
  onQueryChange: (value: string) => void;
  onAnalyze: () => void;
}

export function SearchPanel({ query, onQueryChange, onAnalyze }: SearchPanelProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAnalyze();
  }

  return (
    <form className="search-panel" onSubmit={handleSubmit}>
      <label htmlFor="trademark-search">Trademark name</label>
      <div className="search-row">
        <input
          id="trademark-search"
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Try NIKE, NIKKE, PUMA..."
          autoComplete="off"
        />
        <button type="submit">Analyze</button>
      </div>
    </form>
  );
}
