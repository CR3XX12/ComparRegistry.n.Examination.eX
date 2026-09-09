# Trademark Similarity Analyzer

A small TypeScript/Next.js prototype for ranking mock trademark records by name similarity. It uses local mock data only and does not connect to any government database or external API.

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Then open `http://localhost:3000`.

## First Files To Edit

- `src/data/trademarks.ts` changes the mock trademark records.
- `src/lib/similarity.ts` changes scoring, ranking, and explanations.
- `src/app/page.tsx` changes the main app UI.

## Prototype Notes

This is a workflow validation prototype. It does not provide legal conclusions, does not analyze logos, and does not connect to IMPI, MARCia, Acervo, or any other live trademark database.
