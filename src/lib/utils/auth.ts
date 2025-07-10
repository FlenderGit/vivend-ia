import { api, safeRequest, type ResultAsyncApi } from "../api/base";
import type { User } from "../types";
import { err, errAsync, ok, Result, ResultAsync } from "neverthrow";

const EXTENSION_ID = chrome.runtime.id;

const AZURE_CONFIG = {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    tenantId: import.meta.env.VITE_AZURE_TENANT_ID,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI,
    scopes: ["openid", "profile", "email"],
    // state: chrome.identity.getRedirectURL()
    state: `https://${EXTENSION_ID}.chromiumapp.org/`,
}

const AZURE_ENDPOINT = `https://login.microsoftonline.com/${AZURE_CONFIG.tenantId}/oauth2/v2.0`;

export function authenticateUser(): ResultAsyncApi<User> {
    if (!AZURE_CONFIG.clientId || !AZURE_CONFIG.tenantId || !AZURE_CONFIG.redirectUri) {
        return errAsync(new Error("Azure configuration is incomplete."));
    }
    return launchWebAuthFlow()
        .andThen(extractTokenFromUrl)
        .andThen(getDataFromToken)
}

function launchWebAuthFlow(): ResultAsync<string, Error> {
    const url = buildAuthUrl();
    console.log("Launching web auth flow with URL:", url);
    return ResultAsync.fromPromise(
        new Promise<string>((resolve, reject) => {
            chrome.identity.launchWebAuthFlow(
                { url, interactive: true },
                (redirectUrl?: string) => {
                    if (chrome.runtime.lastError || !redirectUrl) {
                        reject(new Error(chrome.runtime.lastError?.message || "Authentication failed"));
                        return;
                    }
                    console.log("Redirect URL:", redirectUrl);
                    resolve(redirectUrl);
                }
            );
        }),
        (error) => {
            console.error("Authentication error:", error);
            return error instanceof Error ? error : new Error("Authentication failed");
        }
    );
}

function buildAuthUrl(): string {
    const params = new URLSearchParams({
        client_id: AZURE_CONFIG.clientId,
        response_type: "code",
        redirect_uri: AZURE_CONFIG.redirectUri,
        scope: AZURE_CONFIG.scopes.join(" "),
        state: AZURE_CONFIG.state,
    });
    return `${AZURE_ENDPOINT}/authorize?${params.toString()}`;
}


function extractTokenFromUrl(url: string): Result<string, Error> {
    const parsedUrl = new URL(url);
    const params = new URLSearchParams(parsedUrl.search);
    const code = params.get("oauth");
    console.log("Extracted code from URL:", code);
    if (!code) {
        return err(new Error("Authorization code not found in the URL"));
    }
    return ok(code);
}

function getDataFromToken(token: string): ResultAsyncApi<User> {
    return safeRequest<User>(api.post("auth/user", {
        json: { token },
        headers: {
            "Content-Type": "application/json",
        },
    }).json()).mapErr((error) => {
        console.error("Error fetching user data:", error)
        return error instanceof Error ? error : new Error("Failed to fetch user data")
    });
}