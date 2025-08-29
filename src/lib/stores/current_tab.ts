import { readable } from "svelte/store";

export const current_tab_store = readable<URL | null>(null, (set) => {

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log("Initial tab:", tabs);
        if (tabs[0]) {
            const url = new URL(tabs[0].url);
            set(url);
        }
    });

    console.log("Setting up current_tab_store");
    function updateTab(tabId, changeInfo, tab) {
        console.log("Tab updated:", tab, changeInfo);
        if (changeInfo.url && changeInfo.url && tab.url) {
            const url = new URL(tab.url);
            set(url);
        }
    }
    chrome.tabs.onUpdated.addListener(updateTab);

    async function activatedTabs(activeInfo) {
        console.log("Tab changed:", activeInfo);
        const tab = await chrome.tabs.get(activeInfo.tabId);
        if (tab) {
            // Get hostname only
            const url = new URL(tab.url);
            set(url);
        }
    }
    chrome.tabs.onActivated.addListener(activatedTabs);

    return () => {
        chrome.tabs.onUpdated.removeListener(updateTab);
        chrome.tabs.onActivated.removeListener(activatedTabs);
    };

});