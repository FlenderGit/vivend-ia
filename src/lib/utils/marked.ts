import { createHighlighterCoreSync, type HighlighterCore } from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";
import { Marked } from "marked"
import catppuccin_frappe from "@shikijs/themes/catppuccin-frappe";
import rust from "@shikijs/langs/rust";
import elm from "@shikijs/langs/elm";
import { markedHighlight } from "marked-highlight";

let highlighter: HighlighterCore | undefined;
function get_highlighter(): HighlighterCore | undefined {
    if (import.meta.env.VITE_FEATURES_CODE_PREVIEW === 'true' && !highlighter) {
        highlighter = createHighlighterCoreSync({
            themes: [
                catppuccin_frappe
            ],
        langs: [
            rust,
            elm
        ],
        engine: createJavaScriptRegexEngine()
    });
}
    return highlighter;
}

export function get_marked(): Marked {
    const marked = new Marked(
        markedHighlight({
            langPrefix: '',
            highlight(code, lang, info) {
                const core = get_highlighter();
                if (core && lang) {
                    const loaded_languages = core.getLoadedLanguages();
                    if (loaded_languages.includes(lang)) {
                        return core.codeToHtml(code, { lang, theme: 'catppuccin-frappe', transformers: [
                            {
                                pre(hast) {
                                    // hast.properties['data-lang'] = lang;
                                    return hast;
                                }
                            }
                        ] });
                    }
                    console.warn(`Language '${lang}' is not loaded`);
                    return code;
                }
                return code;
            }
        }),
       {
            renderer: {
                code(this: any, ...args: any[]) {
                    console.log(args);
                    const token = args[0];
                    const code = token.text;
                    const lang = token.lang || '';
                    
                    return `
                        <div style="background: #303446" class="border border-border rounded-md overflow-hidden px-4 py-2">
                            <div data-lang="${lang}">
                                <span class="text-white/60 text-sm">${lang}</span>
                            </div>
                            <pre class="text-white/80"><code class="language-${lang}">${code}</code></pre>
                        </div>
                    `;
                    
                }
            }
        }, 
    );

    

    return marked;
}