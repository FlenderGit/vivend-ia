export {
    timestampToHour
} from './date';

export {
    authenticateUser
} from './auth';

export function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getWebsiteUrl(): Promise<string> {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                resolve(tabs[0].url || '');
            } else {
                resolve('');
            }
        });
    });
}
