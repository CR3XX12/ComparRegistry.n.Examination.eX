import type { TrademarkRecord, TrademarkSearchResult } from "@/types/trademark";

const RELATED_NICE_CLASSES = new Set([18, 25, 28, 35]);

export function normalizeTrademarkName(value: string): string {
  return value
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function calculateLevenshteinDistance(first: string, second: string): number {
  const a = normalizeTrademarkName(first);
  const b = normalizeTrademarkName(second);

  if (a === b) {
    return 0;
  }

  if (a.length === 0) {
    return b.length;
  }

  if (b.length === 0) {
    return a.length;
  }

  const matrix = Array.from({ length: a.length + 1 }, (_, row) => [row]);

  for (let column = 1; column <= b.length; column += 1) {
    matrix[0][column] = column;
  }

  for (let row = 1; row <= a.length; row += 1) {
    for (let column = 1; column <= b.length; column += 1) {
      const cost = a[row - 1] === b[column - 1] ? 0 : 1;

      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

export function calculateStringSimilarity(first: string, second: string): number {
  const a = normalizeTrademarkName(first);
  const b = normalizeTrademarkName(second);
  const longestLength = Math.max(a.length, b.length);

  if (longestLength === 0) {
    return 1;
  }

  const distance = calculateLevenshteinDistance(a, b);
  return Math.max(0, 1 - distance / longestLength);
}

export function calculatePhoneticSimilarity(first: string, second: string): number {
  const simplify = (value: string) =>
    normalizeTrademarkName(value)
      .replace(/[AEIOU]/g, "")
      .replace(/[CKQ]/g, "K")
      .replace(/[YI]/g, "I")
      .replace(/(.)\1+/g, "$1");

  const a = simplify(first);
  const b = simplify(second);

  if (!a || !b) {
    return 0;
  }

  if (a === b) {
    return 1;
  }

  return calculateStringSimilarity(a, b);
}

function getNameSimilarityScore(query: string, trademarkName: string): number {
  const normalizedQuery = normalizeTrademarkName(query);
  const normalizedName = normalizeTrademarkName(trademarkName);

  if (!normalizedQuery) {
    return 0;
  }

  if (normalizedQuery === normalizedName) {
    return 100;
  }

  const containsScore =
    normalizedName.includes(normalizedQuery) || normalizedQuery.includes(normalizedName) ? 88 : 0;
  const stringScore = calculateStringSimilarity(normalizedQuery, normalizedName) * 100;
  const phoneticScore = calculatePhoneticSimilarity(normalizedQuery, normalizedName) * 100;

  return Math.round(Math.max(containsScore, stringScore * 0.82 + phoneticScore * 0.18));
}

function getClassAdjustment(record: TrademarkRecord): number {
  if (record.niceClass === 25) {
    return 5;
  }

  if (RELATED_NICE_CLASSES.has(record.niceClass)) {
    return 3;
  }

  return -4;
}

function explainResult(query: string, record: TrademarkRecord, nameSimilarityScore: number): string {
  const normalizedQuery = normalizeTrademarkName(query);
  const normalizedName = normalizeTrademarkName(record.name);

  if (normalizedQuery === normalizedName) {
    return "Exact match with the searched denomination.";
  }

  if (normalizedName.includes(normalizedQuery)) {
    return `Contains "${normalizedQuery}" and belongs to Nice class ${record.niceClass}.`;
  }

  if (normalizedQuery.includes(normalizedName)) {
    return `The searched denomination contains "${normalizedName}", so this shorter mark may be relevant.`;
  }

  if (nameSimilarityScore >= 80) {
    return `Very close spelling variation of ${normalizedQuery}.`;
  }

  if (nameSimilarityScore >= 62) {
    return `Moderate textual and phonetic similarity to ${normalizedQuery}.`;
  }

  if (RELATED_NICE_CLASSES.has(record.niceClass)) {
    return "Lower textual similarity, but the class is related to apparel, retail, bags, or sporting goods.";
  }

  return "Different brand name, low textual similarity.";
}

export function analyzeTrademarkSimilarity(
  query: string,
  records: TrademarkRecord[]
): TrademarkSearchResult[] {
  const normalizedQuery = normalizeTrademarkName(query);

  if (!normalizedQuery) {
    return [];
  }

  return records
    .map((record) => {
      const nameSimilarityScore = getNameSimilarityScore(normalizedQuery, record.name);
      const finalScore = Math.min(100, Math.max(0, nameSimilarityScore + getClassAdjustment(record)));

      return {
        ...record,
        rank: 0,
        nameSimilarityScore,
        finalScore,
        explanation: explainResult(normalizedQuery, record, nameSimilarityScore)
      };
    })
    .sort((a, b) => b.finalScore - a.finalScore || b.nameSimilarityScore - a.nameSimilarityScore)
    .map((result, index) => ({
      ...result,
      rank: index + 1
    }));
}
