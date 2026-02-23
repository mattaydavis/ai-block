// Popup script - handles user interaction with the extension settings

document.addEventListener('DOMContentLoaded', async () => {
  const masterToggle = document.getElementById('masterToggle');
  const statusText = document.getElementById('statusText');
  const domainsList = document.getElementById('domainsList');
  const saveButton = document.getElementById('saveButton');
  const blockedCountElement = document.getElementById('blockedCount');

  let domainMappings = {};
  let isEnabled = true;

  // Load settings from storage
  async function loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['domainMappings', 'isEnabled']);
      
      if (result.domainMappings) {
        domainMappings = result.domainMappings;
      }
      
      if (result.isEnabled !== undefined) {
        isEnabled = result.isEnabled;
      }

      updateUI();
      await updateBlockedCount();
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  // Update the UI based on current settings
  function updateUI() {
    // Update master toggle
    masterToggle.checked = isEnabled;
    statusText.textContent = isEnabled ? 'Enabled' : 'Disabled';

    // Clear and rebuild domains list
    domainsList.innerHTML = '';

    Object.entries(domainMappings).forEach(([domain, config]) => {
      const domainItem = createDomainItem(domain, config);
      domainsList.appendChild(domainItem);
    });
  }

  // Create a domain item element
  function createDomainItem(domain, config) {
    const item = document.createElement('div');
    item.className = 'domain-item';

    const info = document.createElement('div');
    info.className = 'domain-info';

    const name = document.createElement('div');
    name.className = 'domain-name';
    name.textContent = config.name;

    const url = document.createElement('div');
    url.className = 'domain-url';
    url.textContent = domain;

    const selectors = document.createElement('div');
    selectors.className = 'domain-selectors';
    selectors.textContent = `${config.selectors.length} selector(s)`;

    info.appendChild(name);
    info.appendChild(url);
    info.appendChild(selectors);

    const toggle = document.createElement('label');
    toggle.className = 'switch';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = config.enabled;
    checkbox.addEventListener('change', (e) => {
      domainMappings[domain].enabled = e.target.checked;
    });

    const slider = document.createElement('span');
    slider.className = 'slider';

    toggle.appendChild(checkbox);
    toggle.appendChild(slider);

    item.appendChild(info);
    item.appendChild(toggle);

    return item;
  }

  // Save settings to storage
  async function saveSettings() {
    try {
      await chrome.storage.sync.set({
        domainMappings: domainMappings,
        isEnabled: isEnabled
      });

      // Notify all content scripts about the update
      const tabs = await chrome.tabs.query({});
      tabs.forEach(tab => {
        if (tab.url && !tab.url.startsWith('chrome://')) {
          chrome.tabs.sendMessage(tab.id, {
            action: 'updateSettings',
            domainMappings: domainMappings,
            isEnabled: isEnabled
          }).catch((error) => {
            // Content script not loaded on this tab
            console.debug(`Could not update tab ${tab.id}:`, error.message);
          });
        }
      });

      // Visual feedback
      saveButton.textContent = 'Saved!';
      setTimeout(() => {
        saveButton.textContent = 'Save Settings';
      }, 1500);

      await updateBlockedCount();
    } catch (error) {
      console.error('Error saving settings:', error);
      saveButton.textContent = 'Error saving';
      setTimeout(() => {
        saveButton.textContent = 'Save Settings';
      }, 1500);
    }
  }

  // Get blocked count from current tab
  async function updateBlockedCount() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id && tab.url && !tab.url.startsWith('chrome://')) {
        chrome.tabs.sendMessage(tab.id, { action: 'getBlockedCount' }, (response) => {
          if (chrome.runtime.lastError) {
            // Content script not loaded on this page
            console.debug('Content script not available:', chrome.runtime.lastError.message);
            return;
          }
          if (response && response.blockedCount !== undefined) {
            blockedCountElement.textContent = response.blockedCount;
          }
        });
      }
    } catch (error) {
      console.debug('Cannot get blocked count:', error.message);
    }
  }

  // Event listeners
  masterToggle.addEventListener('change', (e) => {
    isEnabled = e.target.checked;
    statusText.textContent = isEnabled ? 'Enabled' : 'Disabled';
  });

  saveButton.addEventListener('click', saveSettings);

  // Initialize
  await loadSettings();
});
