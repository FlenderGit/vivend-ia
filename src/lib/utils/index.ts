export {
    timestampToHour
} from './date';

export function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getWebsiteUrl(): Promise<string> {
    return new Promise((resolve, reject) => {
        if (import.meta.env.DEV) return resolve('http://localhost:5173');
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                resolve(tabs[0].url || '');
            } else {
                reject(new Error("No active tab found"));
            }
        });
    });
}

export function snake_to_title(str: string): string {
    return str.replace(/_/g, " ").replace(/^\w/, c => c.toUpperCase());
  }