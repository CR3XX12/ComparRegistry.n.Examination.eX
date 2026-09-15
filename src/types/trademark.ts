export type ResultExplanationKey =
  | "exactMatch"
  | "containsQueryNoClass"
  | "containsQueryWithClass"
  | "queryContainsName"
  | "veryClose"
  | "moderate"
  | "relatedClass"
  | "lowSimilarity";

export interface TrademarkRecord {
  name: string;
  niceClass: number;
  status: "Registered" | "Pending" | "Expired" | "Opposed" | "Cancelled";
  owner: string;
  expedienteNumber: string;
  registrationNumber?: string;
  applicationType?: string;
  markType?: string;
  filingDate?: string;
}

export interface TrademarkSearchResult extends TrademarkRecord {
  rank: number;
  nameSimilarityScore: number;
  finalScore: number;
  explanation: {
    key: ResultExplanationKey;
    values?: Record<string, string | number>;
  };
}
