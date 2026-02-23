# Development Guide

This guide will help you set up, test, and develop the AI Block extension.

## Quick Start

### 1. Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `ai-block` directory
5. The extension icon should appear in your toolbar

### 2. Test the Extension

#### Using the Test Page

1. Open `test.html` in Chrome
2. Click the AI Block extension icon
3. The popup should show "Elements blocked on this page: 0" initially
4. Elements with `data-ad-details` or `data-promoted` attributes won't be visible
5. Toggle settings and click "Save Settings" to see changes

#### Testing on Real Sites

Visit these sites to see blocking in action:
- amazon.com - Search for any product
- google.com - Search for anything
- youtube.com - Visit the homepage
- reddit.com - Browse any subreddit

### 3. Viewing Console Logs

To debug the extension:

1. **Popup logs**: Right-click the extension icon → "Inspect popup"
2. **Content script logs**: Press F12 on any webpage → Console tab
3. **Background script logs**: Go to `chrome://extensions/` → Click "service worker" under AI Block

## File Overview

### manifest.json
- Extension metadata and configuration
- Defines permissions, icons, scripts
- Uses Manifest V3 (latest standard)

### background/background.js
- Service worker (runs in background)
- Handles extension installation
- Initializes default settings
- Coordinates between popup and content scripts

### content/content.js
- Runs on every webpage
- Applies blocking rules based on domain
- Uses MutationObserver for dynamic content
- Communicates blocked count to popup

### popup/
- **popup.html**: User interface structure
- **popup.css**: Styling (gradient theme, toggles)
- **popup.js**: UI logic and settings management

### config/domains.js
- Reference file with default domain mappings
- Not loaded by extension (duplicated in background.js)
- Useful for adding new domains

## Making Changes

### Adding a New Domain

1. Edit `background/background.js`
2. Add entry to `defaultMappings` object:

```javascript
'newsite.com': {
  name: 'New Site',
  enabled: true,
  selectors: [
    '.ad-class',
    '[data-ad-attribute]'
  ]
}
```

3. Go to `chrome://extensions/`
4. Click the refresh icon on AI Block
5. Test on the new site

### Finding CSS Selectors

**Method 1: Chrome DevTools**
1. Right-click element → Inspect
2. Note the class names, IDs, or data attributes
3. Test selector in Console: `document.querySelectorAll('.your-selector')`

**Method 2: Copy Selector**
1. Right-click element in Elements panel
2. Copy → Copy selector
3. Use this as a starting point (may need simplification)

**Tips:**
- Prefer data attributes (more stable): `[data-ad-id]`
- Use specific classes: `.sponsored-content`
- Avoid generic classes: `.container`, `.item`
- Test selectors return only target elements

### Modifying the UI

**Colors:**
- Primary gradient: `#667eea` to `#764ba2`
- Edit in `popup/popup.css` under `.btn-primary` and `header`

**Layout:**
- Popup width: 400px (set in `popup/popup.css` body)
- Add new sections in `popup/popup.html`
- Style in `popup/popup.css`

### Storage Structure

Settings stored in `chrome.storage.sync`:

```javascript
{
  isEnabled: true,  // Master toggle
  domainMappings: {
    'domain.com': {
      name: 'Site Name',
      enabled: true,
      selectors: ['...']
    }
  }
}
```

## Testing Checklist

- [ ] Extension loads without errors
- [ ] Popup opens and displays correctly
- [ ] Master toggle works
- [ ] Domain toggles work
- [ ] Settings save and persist
- [ ] Elements block on configured domains
- [ ] Blocked count updates
- [ ] Dynamic content gets blocked
- [ ] No console errors

## Common Issues

### Extension Won't Load
- Check for syntax errors in JavaScript files
- Verify manifest.json is valid JSON
- Check console in chrome://extensions/ (Errors button)

### Elements Not Blocking
- Verify selectors are correct (test in DevTools)
- Check domain is enabled in settings
- Ensure master toggle is on
- Check content script logs for errors

### Popup Not Showing Settings
- Check if storage is initialized (Background script logs)
- Verify popup.js is loading (Inspect popup → Console)
- Check for JavaScript errors in popup

### Changes Not Applying
- Click refresh icon on chrome://extensions/
- Hard refresh webpage (Ctrl+Shift+R)
- Check if settings were saved

## Advanced Development

### Adding Keyboard Shortcuts

1. Add to manifest.json:
```json
"commands": {
  "toggle-blocking": {
    "suggested_key": {
      "default": "Ctrl+Shift+B"
    },
    "description": "Toggle blocking on/off"
  }
}
```

2. Handle in background.js:
```javascript
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-blocking') {
    // Toggle logic
  }
});
```

### Adding Options Page

1. Create `options/options.html`
2. Add to manifest.json:
```json
"options_page": "options/options.html"
```

### Performance Tips

- Selectors are cached per page load
- MutationObserver only watches relevant changes
- Storage syncs across devices (15 KB limit)
- Use local storage for larger data

## Publishing to Chrome Web Store

1. Create a ZIP file of the extension directory
2. Register as Chrome Web Store developer ($5 one-time fee)
3. Upload ZIP at [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
4. Fill in store listing details
5. Submit for review

## Contributing

When adding features:
1. Test on multiple websites
2. Check console for errors
3. Verify settings persist
4. Update README if needed
5. Test on fresh installation

## Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
