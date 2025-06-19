chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel
    .open({ tabId: tab.id })
    .catch((err) => console.error("Erreur ouverture sidePanel :", err));
});

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  console.log("Message reçu dans background.js :", message);
  if (message.action === "openPanel") {
    chrome.sidePanel
      .open({ tabId: sender.tab.id })
      .then(() => sendResponse({ success: true }))
      .catch((err) => {
        console.error("Erreur ouverture sidePanel :", err);
        sendResponse({ success: false, error: err.message });
      });

    return true;
  }

  sendResponse({ success: false, error: "Unknown message type" });
});

chrome.commands.onCommand.addListener((command) => {
  console.log("Commande reçue:", command);
  
  if (command === "open-sidepanel") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.sidePanel.open({ tabId: tabs[0].id })
          .then(() => console.log("SidePanel ouvert via commande"))
          .catch((err) => console.error("Erreur:", err));
      }
    });
  }
});