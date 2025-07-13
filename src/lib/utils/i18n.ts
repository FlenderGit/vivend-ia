/*if import.meta.env.DEV is true, we will use a local messages file for development purposes.
 * In production, we will use the Chrome i18n API to fetch messages.
 */


export function i18n(key: string) {
    console.log("i18n called with key:", key);
    if (import.meta.env.DEV) {
        const PATH = "../../../_locales/fr/messages.json";
        type Messages = Record<string, Record<string, { message: string }>>;
        const messages: Messages = import.meta.glob("../../../_locales/fr/messages.json", {
            eager: true,
            import: "default",
        });
        console.log("Messages found:", messages,messages[PATH]);
        if (!messages || !messages[PATH]) {
            console.error("Messages not found for key:", key);
            return key;
        }
        const message = messages[PATH][key];
        return message?.message || key;
    }
    return chrome.i18n.getMessage(key) || key;
}