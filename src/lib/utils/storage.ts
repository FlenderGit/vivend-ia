
export interface IStorage<T> {
    get(key: string): Promise<T | null>;
    set(key: string, value: T): Promise<void>;
    remove(key: string): Promise<void>;
}

export class ExtensionStorage<T> implements IStorage<T> {
    async get(key: string): Promise<T | null> {
        return new Promise((resolve) => {
            chrome.storage.local.get([key], (result) => {
                resolve(result[key] || null);
            });
        });
    }

    async set(key: string, value: T): Promise<void> {
        return new Promise((resolve) => {
            chrome.storage.local.set({ [key]: value }, () => {
                resolve();
            });
        });
    }

    async remove(key: string): Promise<void> {
        return new Promise((resolve) => {
            chrome.storage.local.remove([key], () => {
                resolve();
            });
        });
    }
}