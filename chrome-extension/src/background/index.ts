import "webextension-polyfill";
import { exampleThemeStorage } from "@extension/storage";
import { blockElements } from "../scripts/blockElements";

exampleThemeStorage.get().then((theme) => {
  console.log("theme", theme);
});

// Background service worker
// Handles extension initialization and coordination

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    // First time installation - set up default configuration
    await initializeDefaultSettings();
    console.log("AI Block: Extension installed successfully");
  } else if (details.reason === "update") {
    console.log("AI Block: Extension updated");
  }
});

// Initialize default settings
async function initializeDefaultSettings() {
  try {
    // Load default domain mappings
    const defaultMappings = blockElements;

    await chrome.storage.sync.set({
      domainMappings: defaultMappings,
      isEnabled: true,
    });
  } catch (error) {
    console.error("AI Block: Error initializing settings", error);
  }
}

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSettings") {
    chrome.storage.sync.get(["domainMappings", "isEnabled"], (result) => {
      sendResponse(result);
    });
    return true; // Keep message channel open for async response
  }
});

console.log("Background loaded");
console.log(
  "Edit 'chrome-extension/src/background/index.ts' and save to reload."
);
