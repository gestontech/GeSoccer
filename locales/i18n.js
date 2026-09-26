import { getDeviceLanguage } from "./getLanguage";
import { translations } from "./translations";

export function getTranslations() {
  const language = getDeviceLanguage();

  return {
    language,
    t: translations[language] || translations.en,
  };
}
