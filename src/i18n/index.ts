import en from "./en.json";
import es from "./es.json";

export type Language = "en" | "es";
export type Dictionary = typeof en;

export const dictionaries: Record<Language, Dictionary> = {
  en,
  es
};

export function formatMessage(
  template: string,
  values: Record<string, string | number | undefined>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}
