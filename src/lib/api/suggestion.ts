import { api, safeRequest } from "./base";


type ResponseGetSuggestions = {
    suggestions: string[];
};

export async function fetch_suggestions(url: URL | null): Promise<ResponseGetSuggestions> {

    if (!url) {
        return { suggestions: [] };
    }

    console.log("Fetching suggestions for URL:", url);
    const response = await safeRequest(api.get<ResponseGetSuggestions>(`suggestions?url=${encodeURIComponent(url.href)}`).json());
    return response.match(
        (data) => data,
        (error) => {
            throw error;
        }
    );
}