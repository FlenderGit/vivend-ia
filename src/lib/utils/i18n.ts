
// User key json ./../../../_locales/en/messages.json
import messages from "../../../_locales/fr/messages.json";

type TranslationKey = keyof typeof messages;

/**
 * if import.meta.env.DEV is true, we will use a local messages file for development purposes.
 * In production, we will use the Chrome i18n API to fetch messages.
 */
export function t(key: TranslationKey, substitutions?: string[]) {
  console.log("i18n called with key:", key, "with substitutions:", substitutions);
  if (import.meta.env.MODE === "web") {
    const fullLanguage = navigator.language || navigator.userLanguage;
    const shortLanguage = fullLanguage.split("-")[0];

    type Messages = Record<string, Record<string, { message: string }>>;
    const messageFiles: Messages = import.meta.glob(
      "../../../_locales/*/messages.json",
      {
        eager: true,
        import: "default",
      }
    );

    // Essayer plusieurs chemins dans l'ordre de préférence
    const possiblePaths = [
      `../../../_locales/${fullLanguage}/messages.json`, // fr-FR
      `../../../_locales/${shortLanguage}/messages.json`, // fr
      `../../../_locales/en/messages.json`, // fallback
    ];

    const messages = possiblePaths
      .map((path) => messageFiles[path])
      .find((msg) => msg !== undefined);

    if (!messages) {
      console.error("No messages found for language:", fullLanguage);
      return key;
    }

    const message = messages[key];
    return message?.message || key;
  }
  return chrome.i18n.getMessage(key, substitutions) || key;
}
