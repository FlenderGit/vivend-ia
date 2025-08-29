import { api, safeRequest, type ResultAsyncApi } from "../api/base";
import type { User } from "../types";
import { err, errAsync, ok, okAsync, Result, ResultAsync } from "neverthrow";

type Token = string;

type AuthResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

type AzureConfig = {
  clientId: string;
  tenantId: string;
  redirectUri: string;
  scopes: string[];
};
const AZURE_CONFIG = {
      clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
      tenantId: import.meta.env.VITE_AZURE_TENANT_ID,
      redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI,
      scopes: ["openid", "profile", "email"],
};

const AZURE_ENDPOINT = `https://login.microsoftonline.com/${AZURE_CONFIG.tenantId}/oauth2/v2.0`;

abstract class Authentificator {
  protected _config: AzureConfig;
  protected _credentials: CredentialsInfo | null = null;
  constructor(config: AzureConfig) {
    this._config = config;
  }
  abstract get_access_token(): ResultAsyncApi<Token>;
  

  public isJwtValid(): boolean {
    return this._credentials ? this._credentials.isJwtValid() : false;
  }

  get access_token(): Token | null {
    return this._credentials ? this._credentials.accessToken : null;
  }

  protected abstract retrieve_token_from_storage(): ResultAsyncApi<CredentialsInfo>;


  protected auth_flow(go_get_access_token: boolean = false): ResultAsyncApi<CredentialsInfo> {
    const result_local_credentials = this.retrieve_token_from_storage()
      .andThen((credentials) => {
        console.log("Retrieved credentials from storage:", credentials);
        if (credentials.isJwtValid()) {
          this._credentials = credentials;
          return ok(credentials);
        }
        return err(new Error("Stored token is invalid or expired."));
      })

    if (!go_get_access_token) {
      return result_local_credentials;
    }
    return result_local_credentials
      .orElse(() => this.get_access_token().andThen(this.exchange_token_for_jwt))
      .map(CredentialsInfo.fromJson);
  }

  public authenticate(auto_access: boolean = false): ResultAsyncApi<User> {
    return this.auth_flow(auto_access)
      .andThen(this.store_token)
      .andThen((credentials) => {
        console.log("Current credentials stored:", credentials);
        this._credentials = credentials;
        return this.get_user_info(credentials);
      });
  }

  protected buildAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this._config.clientId,
      response_type: "code",
      redirect_uri: this._config.redirectUri,
      scope: this._config.scopes.join(" "),
      state
    });
    return `${AZURE_ENDPOINT}/authorize?${params.toString()}`;
  }

  protected extractTokenFromUrl(url: string): Result<Token, Error> {
    const parsedUrl = new URL(url);
    const params = new URLSearchParams(parsedUrl.search);
    const code = params.get("oauth");
    console.log("Extracted code from URL:", code);
    if (!code) {
      return err(new Error("Authorization code not found in the URL"));
    }
    return ok(code);
  }

  public get_user_info(credentials: CredentialsInfo): ResultAsyncApi<User> {
    return safeRequest(
      api
        .post("auth/user", {
          headers: {
            Authorization: `Bearer ${credentials.accessToken}`,
          },
        })
        .json()
    );
  }

  public exchange_token_for_jwt(token: Token): ResultAsyncApi<AuthResponse> {
    return safeRequest(api.get("auth/azure/callback", { searchParams: { code: token } }).json());
  }

  abstract store_token(credentials: CredentialsInfo): ResultAsyncApi<CredentialsInfo>;

  abstract clear_token(): ResultAsyncApi<void>;

  public logout(): void {
    this.clear_token().map(() => {
      this._credentials = null;
      return;
    });
  }

}

class WebAuthentificator extends Authentificator {
  constructor(config: AzureConfig) {
    super(config);
  }
  get_access_token(): ResultAsyncApi<Token> {
    const state = window.location.href;
    const url = this.buildAuthUrl(state);
    console.log("Opening auth window with URL:", url);
    const w = 600;
    const h = 700;
const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop  = window.screenTop  !== undefined ? window.screenTop  : window.screenY;

  const width  = window.innerWidth  ? window.innerWidth  : document.documentElement.clientWidth  ? document.documentElement.clientWidth  : screen.width;
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  const left = Math.round(dualScreenLeft + (width  - w) / 2);
  const top  = Math.round(dualScreenTop  + (height - h) / 2);

  // features : NB -> pas d'accolades, liste séparée par des virgules
  const features = [
    `width=${w}`,
    `height=${h}`,
    `left=${left}`,
    `top=${top}`,
    'popup=yes',
    'menubar=no',
    'toolbar=no',
    'location=no',
    'status=no',
    'resizable=yes',
    'scrollbars=yes'
  ].join(',');
    const authWindow = window.open(url, "AzureAuth", features);
    if (!authWindow) {
      return errAsync(new Error("Failed to open authentication window"));
    }
    return ResultAsync.fromPromise(
      new Promise<string>((resolve, reject) => {
        const interval = setInterval(() => {
          console.log("Checking auth window status...");
          try {
            if (authWindow.closed) {
              clearInterval(interval);
              reject(new Error("Authentication window was closed by the user"));
            }
            if (authWindow.location.href.startsWith(state)) {
              const redirectUrl = authWindow.location.href;
              clearInterval(interval);
              authWindow.close();
              console.log("Auth window redirected to:", redirectUrl);
              resolve(redirectUrl);
            }
          } catch (error) {
            // Ignore DOMException for cross-origin access
          }
        }, 1000);
      }),
      (error) => {
        console.error("Authentication error:", error);
        return error instanceof Error
          ? error
          : new Error("Authentication failed");
      }
    ).andThen(this.extractTokenFromUrl);
  }

  store_token(credentials: CredentialsInfo): ResultAsyncApi<CredentialsInfo> {
    return errAsync(new Error("Web token storage is not implemented yet."));
  }

  clear_token(): ResultAsyncApi<void> {
    return errAsync(new Error("Web token storage is not implemented yet."));
  }



  protected retrieve_token_from_storage(): ResultAsyncApi<CredentialsInfo> {
    return errAsync(new Error("Web token storage is not implemented yet."));
  }
}

class ExtensionAuthentificator extends Authentificator {
  private _extensionId: string = chrome.runtime.id;
  private _redirectUri: string = `https://${this._extensionId}.chromiumapp.org/`;
  constructor(config: AzureConfig) {
    super(config);
  }
  get_access_token(): ResultAsyncApi<Token> {
    return this.launchWebAuthFlow()
      .andThen(this.extractTokenFromUrl);
  }

  protected retrieve_token_from_storage(): ResultAsyncApi<CredentialsInfo> {
    return ResultAsync.fromPromise(
      chrome.storage.local.get("auth"),
      (error) => new Error(`Failed to retrieve auth: ${error}`)
    ).andThen((result) => {
      console.log("Retrieved auth from storage:", result);

      if (!result.auth) {
        return errAsync(new Error("No auth data found in storage"));
      }

      const auth = result.auth._data;
      if (!auth) {
        return errAsync(new Error("No auth data found in storage"));
      }
      return okAsync(CredentialsInfo.fromJson(auth));
    });
  }

  private launchWebAuthFlow(): ResultAsync<string, Error> {
    const url = this.buildAuthUrl(this._redirectUri);
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
            resolve(redirectUrl);
          }
        );
      }),
      (error) => {
        console.error("Authentication error:", error);
        return error instanceof Error
          ? error
          : new Error("Authentication failed");
      }
    );
  }

  public store_token(credentials: CredentialsInfo): ResultAsyncApi<CredentialsInfo> {
    if (!credentials) {
      return errAsync(new Error("No credentials to store"));
    }
    return ResultAsync.fromPromise(
      chrome.storage.local.set({ auth: credentials }),
      (error) => new Error(`Failed to store auth: ${error}`)
    ).map(() => credentials);
  }

  public clear_token(): ResultAsyncApi<void> {
    return ResultAsync.fromPromise(
      chrome.storage.local.remove("auth"),
      (error) => new Error(`Failed to clear auth: ${error}`)
    ).map(() => undefined);
  }
}



export const authenticator = get_authentificator();

function get_authentificator(): Authentificator {
  if (import.meta.env.MODE === "web") {
    return new WebAuthentificator(AZURE_CONFIG);
  } else if (import.meta.env.MODE === "extension") {
    return new ExtensionAuthentificator(AZURE_CONFIG);
  } else if (import.meta.env.DEV) {
    return new WebAuthentificator(AZURE_CONFIG);
  } else {
    throw new Error("Unsupported environment for authentication");
  }
}

export class CredentialsInfo {

  constructor(
    private _data: AuthResponse,
    private _lastRefresh: number = Date.now()
  ) {}

  public static fromJson(json: any): CredentialsInfo {
    return new CredentialsInfo(json);
  }

  public isJwtValid(): boolean {
    const now = Date.now();
    console.log("Checking JWT validity:", now, this._lastRefresh + this._data.expires_in * 1000);
    return now < this._lastRefresh + this._data.expires_in * 1000;
  }

  get accessToken(): Token {
    return this._data.access_token;
  }



}