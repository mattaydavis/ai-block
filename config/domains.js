// Default domain-to-element mappings
// Each domain can have multiple selectors to block
const DEFAULT_DOMAIN_MAPPINGS = {
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
      '.uEierd', // Sponsored results
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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEFAULT_DOMAIN_MAPPINGS };
}
