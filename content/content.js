// Content script - runs on all web pages
// Blocks elements based on domain-specific rules

(function() {
  'use strict';

  let domainMappings = {};
  let isEnabled = true;
  let blockedCount = 0;

  // Get the current domain
  function getCurrentDomain() {
    const hostname = window.location.hostname;
    // Remove www. prefix if present
    return hostname.replace(/^www\./, '');
  }

  // Check if current domain matches any configured domain
  function getMatchingDomain(currentDomain) {
    for (const domain in domainMappings) {
      if (currentDomain.includes(domain)) {
        return domain;
      }
    }
    return null;
  }

  // Hide elements matching the selectors
  function blockElements(selectors) {
    if (!selectors || selectors.length === 0) return;

    selectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (!element.hasAttribute('data-ai-blocked')) {
            element.style.display = 'none';
            element.setAttribute('data-ai-blocked', 'true');
            blockedCount++;
          }
        });
      } catch (e) {
        console.warn(`AI Block: Invalid selector "${selector}"`, e);
      }
    });
  }

  // Apply blocking rules for current domain
  function applyBlockingRules() {
    if (!isEnabled) return;

    const currentDomain = getCurrentDomain();
    const matchingDomain = getMatchingDomain(currentDomain);

    if (matchingDomain && domainMappings[matchingDomain]) {
      const domainConfig = domainMappings[matchingDomain];
      if (domainConfig.enabled) {
        blockElements(domainConfig.selectors);
      }
    }
  }

  // Initialize the content script
  async function initialize() {
    try {
      // Get settings from storage
      const result = await chrome.storage.sync.get(['domainMappings', 'isEnabled']);
      
      if (result.domainMappings) {
        domainMappings = result.domainMappings;
      }
      
      if (result.isEnabled !== undefined) {
        isEnabled = result.isEnabled;
      }

      // Apply initial blocking
      applyBlockingRules();

      // Set up mutation observer to block dynamically added elements
      const observer = new MutationObserver((mutations) => {
        applyBlockingRules();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Listen for messages from popup
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'updateSettings') {
          domainMappings = request.domainMappings;
          isEnabled = request.isEnabled;
          applyBlockingRules();
          sendResponse({ success: true, blockedCount });
        } else if (request.action === 'getBlockedCount') {
          sendResponse({ blockedCount });
        }
        return true;
      });

    } catch (error) {
      console.error('AI Block: Initialization error', error);
    }
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
