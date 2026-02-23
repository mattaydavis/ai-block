// Background service worker
// Handles extension initialization and coordination

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // First time installation - set up default configuration
    await initializeDefaultSettings();
    console.log('AI Block: Extension installed successfully');
  } else if (details.reason === 'update') {
    console.log('AI Block: Extension updated');
  }
});

// Initialize default settings
async function initializeDefaultSettings() {
  try {
    // Load default domain mappings
    const defaultMappings = {
      'amazon.com': {
        name: 'Amazon',
        enabled: true,
        selectors: [
          '[data-component-type="sp-sponsored-result"]',
          '.s-result-item[data-component-type="sp-sponsored-result"]',
          'div[data-ad-details]',
          '.AdHolder'
        ]
      },
      'google.com': {
        name: 'Google',
        enabled: true,
        selectors: [
          '.ads-ad',
          '[data-text-ad]',
          '.uEierd',
          '.commercial-unit-desktop-top'
        ]
      },
      'youtube.com': {
        name: 'YouTube',
        enabled: true,
        selectors: [
          'ytd-display-ad-renderer',
          'ytd-promoted-sparkles-web-renderer',
          '.video-ads',
          'ytd-ad-slot-renderer'
        ]
      },
      'facebook.com': {
        name: 'Facebook',
        enabled: true,
        selectors: [
          '[data-pagelet*="FeedUnit_"]',
          'div[data-ad-preview="message"]',
          '[data-ad-comet-preview]'
        ]
      },
      'twitter.com': {
        name: 'Twitter/X',
        enabled: true,
        selectors: [
          '[data-testid="placementTracking"]',
          'div[data-ad-details]',
          '[data-testid="promotedIndicator"]'
        ]
      },
      'reddit.com': {
        name: 'Reddit',
        enabled: true,
        selectors: [
          '[data-promoted="true"]',
          '.promotedlink',
          'shreddit-ad-post'
        ]
      }
    };

    await chrome.storage.sync.set({
      domainMappings: defaultMappings,
      isEnabled: true
    });
  } catch (error) {
    console.error('AI Block: Error initializing settings', error);
  }
}

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(['domainMappings', 'isEnabled'], (result) => {
      sendResponse(result);
    });
    return true; // Keep message channel open for async response
  }
});
