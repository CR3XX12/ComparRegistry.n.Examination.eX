import { formatMessage, type Dictionary } from "@/i18n";
import type { TrademarkSearchResult } from "@/types/trademark";

interface ResultsTableProps {
  results: TrademarkSearchResult[];
  content: Dictionary["results"];
}

function getScoreTone(score: number): string {
  if (score >= 85) {
    return "high";
  }

  if (score >= 60) {
    return "medium";
  }

  return "low";
}

function getRecordSummary(result: TrademarkSearchResult, content: Dictionary["results"]): string {
  if (!result.applicationType && !result.markType && !result.filingDate) {
    return content.recordSummary.missingGoodsServices;
  }

  const applicationTypes: Record<string, string> = content.recordSummary.applicationTypes;
  const markTypes: Record<string, string> = content.recordSummary.markTypes;
  const summaryParts = [
    result.applicationType
      ? (applicationTypes[result.applicationType] ?? result.applicationType)
      : undefined,
    result.markType ? (markTypes[result.markType] ?? result.markType) : undefined,
    result.filingDate ? `${content.recordSummary.filingDate}: ${result.filingDate}` : undefined,
    content.recordSummary.missingGoodsServices
  ].filter(Boolean);

  return summaryParts.join(". ");
}

export function ResultsTable({ results, content }: ResultsTableProps) {
  if (results.length === 0) {
    return (
      <section className="empty-state">
        <h2>{content.emptyTitle}</h2>
        <p>{content.emptyDescription}</p>
      </section>
    );
  }

  return (
    <section className="results-section" aria-live="polite">
      <div className="section-heading">
        <div>
          <h2>{content.title}</h2>
          <p>{formatMessage(content.count, { count: results.length })}</p>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{content.columns.rank}</th>
              <th>{content.columns.trademark}</th>
              <th>{content.columns.score}</th>
              <th>{content.columns.niceClass}</th>
              <th>{content.columns.status}</th>
              <th>{content.columns.owner}</th>
              <th>{content.columns.numbers}</th>
              <th>{content.columns.why}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={`${result.expedienteNumber}-${result.name}`}>
                <td className="rank">#{result.rank}</td>
                <td>
                  <strong>{result.name}</strong>
                  <span>{getRecordSummary(result, content)}</span>
                </td>
                <td>
                  <div className={`score-badge ${getScoreTone(result.finalScore)}`}>
                    {result.finalScore}
                  </div>
                  <div className="score-bar" aria-hidden="true">
                    <span style={{ width: `${result.finalScore}%` }} />
                  </div>
                  <small>
                    {content.scoreNameLabel}: {result.nameSimilarityScore}
                  </small>
                </td>
                <td>{result.niceClass > 0 ? result.niceClass : content.notProvided}</td>
                <td>
                  <span className="status">{content.statuses[result.status]}</span>
                </td>
                <td>{result.owner}</td>
                <td>
                  <span>
                    {content.expedientePrefix} {result.expedienteNumber}
                  </span>
                  <span>
                    {content.registrationPrefix}{" "}
                    {result.registrationNumber ?? content.registrationUnavailable}
                  </span>
                </td>
                <td>
                  {formatMessage(
                    content.explanations[result.explanation.key],
                    result.explanation.values ?? {}
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
