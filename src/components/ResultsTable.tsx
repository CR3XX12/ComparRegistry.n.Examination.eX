import type { TrademarkSearchResult } from "@/types/trademark";

interface ResultsTableProps {
  results: TrademarkSearchResult[];
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

export function ResultsTable({ results }: ResultsTableProps) {
  if (results.length === 0) {
    return (
      <section className="empty-state">
        <h2>Start with a trademark name</h2>
        <p>Enter a denomination to see ranked mock records and similarity explanations.</p>
      </section>
    );
  }

  return (
    <section className="results-section" aria-live="polite">
      <div className="section-heading">
        <div>
          <h2>Ranked Results</h2>
          <p>{results.length} mock records sorted by final score.</p>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Trademark</th>
              <th>Score</th>
              <th>Nice Class</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Numbers</th>
              <th>Why It Ranked</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={`${result.expedienteNumber}-${result.name}`}>
                <td className="rank">#{result.rank}</td>
                <td>
                  <strong>{result.name}</strong>
                  <span>{result.goodsServicesDescription}</span>
                </td>
                <td>
                  <div className={`score-badge ${getScoreTone(result.finalScore)}`}>
                    {result.finalScore}
                  </div>
                  <div className="score-bar" aria-hidden="true">
                    <span style={{ width: `${result.finalScore}%` }} />
                  </div>
                  <small>Name: {result.nameSimilarityScore}</small>
                </td>
                <td>{result.niceClass}</td>
                <td>
                  <span className="status">{result.status}</span>
                </td>
                <td>{result.owner}</td>
                <td>
                  <span>Exp. {result.expedienteNumber}</span>
                  <span>Reg. {result.registrationNumber ?? "Not available"}</span>
                </td>
                <td>{result.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
