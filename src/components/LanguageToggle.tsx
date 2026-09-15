import type { Dictionary, Language } from "@/i18n";

interface LanguageToggleProps {
  language: Language;
  labels: Dictionary["language"];
  onLanguageChange: (language: Language) => void;
}

export function LanguageToggle({ language, labels, onLanguageChange }: LanguageToggleProps) {
  return (
    <div className="language-toggle" aria-label={labels.label}>
      <button
        type="button"
        className={language === "en" ? "active" : undefined}
        aria-pressed={language === "en"}
        onClick={() => onLanguageChange("en")}
      >
        {labels.english}
      </button>
      <button
        type="button"
        className={language === "es" ? "active" : undefined}
        aria-pressed={language === "es"}
        onClick={() => onLanguageChange("es")}
      >
        {labels.spanish}
      </button>
    </div>
  );
}
