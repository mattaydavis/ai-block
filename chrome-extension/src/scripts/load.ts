import { defaultRemover } from "./blockElements";

let domainMappings = {};
let isEnabled = true;
let blockedCount = 0;
let debounceTimeout: number | null = null;

// Get the current domain
function getCurrentDomain() {
  const hostname = window.location.hostname;
  // Remove www. prefix if present
  return hostname.replace(/^www\./, "");
}

// Check if current domain matches any configured domain
function getMatchingDomain(currentDomain: string) {
  for (const domain in domainMappings) {
    if (currentDomain.includes(domain)) {
      console.log("In matching domain", domain);
      return domain;
    }
  }
  return null;
}

// Inject blocking CSS on first run
function injectBlockingStyles() {
  if (document.getElementById("ai-block-styles")) return;

  const style = document.createElement("style");
  style.id = "ai-block-styles";
  style.textContent = "[data-ai-blocked] { display: none !important; }";
  document.head.appendChild(style);
}

// Apply blocking rules for current domain
function applyBlockingRules() {
  if (!isEnabled) return;

  const currentDomain = getCurrentDomain();
  const matchingDomain = getMatchingDomain(currentDomain);

  if (matchingDomain && domainMappings[matchingDomain]) {
    const domainConfig = domainMappings[matchingDomain];
    console.log(
      "Applying blocking rules for domain",
      matchingDomain,
      domainConfig
    );
    if (domainConfig.enabled) {
      if (domainConfig.custom && typeof domainConfig.custom === "function") {
        domainConfig.custom();
      }
      if (domainConfig.selectors && Array.isArray(domainConfig.selectors)) {
        defaultRemover(domainConfig.selectors);
      }
    }
  }
}

// Initialize the content script
async function initialize() {
  try {
    // Get settings from storage
    const result = await chrome.storage.sync.get([
      "domainMappings",
      "isEnabled",
    ]);

    if (result.domainMappings) {
      domainMappings = result.domainMappings;
    }

    if (result.isEnabled !== undefined) {
      isEnabled = result.isEnabled;
    }

    // Inject CSS for blocking
    injectBlockingStyles();

    // Apply initial blocking
    applyBlockingRules();

    // Set up mutation observer to block dynamically added elements
    // Debounce to avoid excessive blocking calls on rapid DOM changes
    const observer = new MutationObserver((mutations) => {
      const domainConfig = domainMappings[matchingDomain];
      console.log(
        "Applying blocking rules for domain",
        matchingDomain,
        domainConfig
      );
      if (domainConfig.enabled) {
        if (domainConfig.custom && typeof domainConfig.custom === "function") {
          domainConfig.custom();
        }
        if (domainConfig.selectors && Array.isArray(domainConfig.selectors)) {
          defaultRemover(domainConfig.selectors);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "updateSettings") {
        domainMappings = request.domainMappings;
        isEnabled = request.isEnabled;
        applyBlockingRules();
        sendResponse({ success: true, blockedCount });
      } else if (request.action === "getBlockedCount") {
        sendResponse({ blockedCount });
      }
      return true;
    });
  } catch (error) {
    console.error("AI Block: Initialization error", error);
  }
}

// Start when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}
