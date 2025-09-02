/// <reference types="svelte" />
/// <reference types="vite/client" />
declare const __VERSION__: string;
declare const __APP_NAME__: string;

interface ImportMetaEnv {
    VITE_FEATURES_CODE_PREVIEW: string;
    VITE_FEATURES_DISPLAY_CHARTS: string;
    VITE_AZURE_CLIENT_ID: string;
    VITE_AZURE_TENANT_ID: string;
    VITE_AZURE_REDIRECT_URI: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}