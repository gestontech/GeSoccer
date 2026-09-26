import { getLocales } from "expo-localization";

const supportedLanguages = [
  "fr",
  "en",
  "es",
  "pt",
];

export function getDeviceLanguage() {
  const locale = getLocales()?.[0];

  const language =
    locale?.languageCode?.toLowerCase();

  if (
    language &&
    supportedLanguages.includes(language)
  ) {
    return language;
  }

  return "en";
}
