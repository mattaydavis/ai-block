# AI Block

A Chrome browser extension that blocks unwanted elements on web pages based on domain-specific rules. Easily configure which domains and elements you want to block.

## Features

- 🚫 **Domain-Based Blocking**: Block specific elements on websites like Amazon, Google, YouTube, Facebook, Twitter, and Reddit
- ⚙️ **Easy Configuration**: Toggle blocking on/off for each domain through a user-friendly popup interface
- 🎯 **CSS Selector Support**: Uses CSS selectors to precisely target elements to block
- 📊 **Real-Time Stats**: See how many elements have been blocked on the current page
- 🔄 **Dynamic Blocking**: Automatically blocks elements as they load, including dynamically added content
- 💾 **Persistent Settings**: Your preferences are saved and synced across devices

## Installation

### Install from Chrome Web Store (Coming Soon)
The extension will be available in the Chrome Web Store soon.

### Manual Installation (Developer Mode)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/mattaydavis/ai-block.git
   cd ai-block
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" by toggling the switch in the top right corner

4. Click "Load unpacked" button

5. Select the `ai-block` directory (the root folder containing `manifest.json`)

6. The extension should now be installed and active!

## Usage

1. **Click the extension icon** in your Chrome toolbar to open the settings popup

2. **Master Toggle**: Use the toggle at the top to enable/disable the extension entirely

3. **Domain Settings**: Toggle individual domains on/off to control which sites have element blocking active

4. **Save Settings**: Click the "Save Settings" button to apply your changes

5. **View Stats**: The popup shows how many elements have been blocked on the current page

## Default Blocked Elements

The extension comes pre-configured with selectors for common ad and sponsored content on:

- **Amazon**: Sponsored product results and ads
- **Google**: Search ads and sponsored results
- **YouTube**: Display ads and promoted content
- **Facebook**: Sponsored posts and ads
- **Twitter/X**: Promoted tweets and ads
- **Reddit**: Promoted posts and ads

## Customization

### Adding New Domains

To add blocking rules for additional domains, edit the `background/background.js` file and add new entries to the `defaultMappings` object:

```javascript
'example.com': {
  name: 'Example Site',
  enabled: true,
  selectors: [
    '.ad-container',
    '[data-ad-slot]',
    '#sponsored-content'
  ]
}
```

### Finding Selectors

To find the right CSS selectors for elements you want to block:

1. Right-click on the element you want to block
2. Select "Inspect" to open Chrome DevTools
3. Find the element in the HTML structure
4. Look for unique class names, IDs, or data attributes
5. Add the selector to the domain's `selectors` array

## Project Structure

```
ai-block/
├── manifest.json          # Extension configuration
├── background/
│   └── background.js      # Service worker for extension lifecycle
├── content/
│   └── content.js         # Content script that blocks elements
├── popup/
│   ├── popup.html         # Settings popup interface
│   ├── popup.css          # Popup styling
│   └── popup.js           # Popup functionality
├── config/
│   └── domains.js         # Default domain mappings (reference)
└── icons/
    ├── icon16.png         # 16x16 icon
    ├── icon48.png         # 48x48 icon
    └── icon128.png        # 128x128 icon
```

## Development

### Making Changes

1. Edit the relevant files in your local copy
2. Go to `chrome://extensions/`
3. Click the refresh icon on the AI Block extension card
4. Test your changes

### Technologies Used

- **Manifest V3**: Latest Chrome extension API
- **Chrome Storage API**: For persistent settings
- **MutationObserver**: For dynamic content blocking
- **CSS**: For popup styling

## Privacy

- All settings are stored locally in Chrome's storage
- No data is collected or transmitted to external servers
- The extension only runs on pages you visit and only blocks elements based on your configuration

## License

See [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Add support for new domains

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
