export interface TrademarkRecord {
  name: string;
  niceClass: number;
  status: "Registered" | "Pending" | "Expired" | "Opposed" | "Cancelled";
  owner: string;
  expedienteNumber: string;
  registrationNumber?: string;
  goodsServicesDescription: string;
}

export interface TrademarkSearchResult extends TrademarkRecord {
  rank: number;
  nameSimilarityScore: number;
  finalScore: number;
  explanation: string;
}
