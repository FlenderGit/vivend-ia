import { createHighlighterCoreSync } from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";
import { Marked } from "marked"
import catppuccin_frappe from "@shikijs/themes/catppuccin-frappe";
import rust from "@shikijs/langs/rust";
import elm from "@shikijs/langs/elm";
import { markedHighlight } from "marked-highlight";

if (import.meta.env.VITE_FEATURES_CODE_PREVIEW) {
    const highlighterPromise = createHighlighterCoreSync({
        themes: [
            catppuccin_frappe
        ],
        langs: [
            rust,
            elm
        ],
        engine: createJavaScriptRegexEngine()
    })
}

export function get_marked(): Marked {
    return new Marked(
        markedHighlight({

            highlight(code, lang, info) {
                if (import.meta.env.VITE_FEATURES_CODE_PREVIEW) {
                    return highlighterPromise.codeToHtml(code, { lang, theme: 'catppuccin-frappe' });
                }
                return "Code not supported";
            }
        })
    )
}