---
name: Browser Extension Making
description: Comprehensive guidelines and best practices for creating and maintaining modern browser extensions using Manifest V3.
---

# Browser Extension Making Skill

This skill equips the AI agent with the knowledge and best practices for developing modern, secure, and performant browser extensions using **Manifest V3**.

## 1. Project Structure
A standard browser extension should have the following structure:
- `manifest.json`: The core configuration file.
- `background.js` (or `service_worker.js`): For background tasks and event handling.
- `content.js`: Scripts injected into web pages to read or modify the DOM.
- `popup/`: Directory containing HTML, CSS, and JS for the action popup.
- `options/`: Directory containing the options page for extension settings.
- `assets/` or `icons/`: Directory for images and icons (16x16, 48x48, 128x128).

## 2. Manifest V3 Essentials
Manifest V3 introduces significant changes for security and performance:
- **`manifest_version`**: Must be set to `3`.
- **Service Workers**: Replaces background pages. They are event-driven and terminate when not in use. Use `chrome.runtime.onInstalled`, `chrome.runtime.onMessage`, etc.
- **Action API**: `chrome.browserAction` and `chrome.pageAction` are consolidated into `chrome.action`.
- **Declarative Net Request**: Replaces the blocking `webRequest` API for intercepting network requests. It uses rulesets declared in the manifest.
- **Host Permissions**: Separated from standard permissions. Users must explicitly grant them.

## 3. Component Guidelines

### Background Scripts (Service Workers)
- Service workers are ephemeral. Do not rely on global variables for state.
- Use `chrome.storage.local` or `chrome.storage.session` to persist state.
- Handle extension installation and updates via `chrome.runtime.onInstalled.addListener`.

### Content Scripts
- Use content scripts to interact with the DOM of specific web pages.
- Content scripts run in an isolated world. They cannot access variables created by the page's scripts, but they share the same DOM.
- Communicate with the background script using message passing (`chrome.runtime.sendMessage` and `chrome.runtime.onMessage.addListener`).

### Popup and Options Pages
- Provide user interfaces for interacting with the extension.
- Cannot use inline scripts (`<script>...<script>`) due to Content Security Policy (CSP). All scripts must be external (`<script src="popup.js"></script>`).

## 4. Message Passing
Extensions use message passing to communicate between components.
- **One-time requests**: Use `chrome.runtime.sendMessage` and `chrome.runtime.onMessage`.
- **Long-lived connections**: Use `chrome.runtime.connect` and `chrome.runtime.onConnect`.

Example of sending a message from a content script to a background script:
```javascript
// content.js
chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  console.log(response.farewell);
});
```

```javascript
// background.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting === "hello")
      sendResponse({farewell: "goodbye"});
  }
);
```

## 5. Storage APIs
Use `chrome.storage` for storing data, not `localStorage`.
- `chrome.storage.local`: Data is stored locally and is NOT synced across browsers.
- `chrome.storage.sync`: Data is synced across browsers if the user is logged in.
- `chrome.storage.session`: Data is kept in memory and cleared when the browser session ends.

## 6. Security & Best Practices
- **Content Security Policy (CSP)**: Extension pages are subject to CSP. Avoid inline scripts and `eval()`.
- **Validate Inputs**: Always sanitize and validate data received from web pages or user inputs before processing or rendering it.
- **Minimal Permissions**: Only request permissions necessary for the extension to function. Use `optional_permissions` where possible.
- **Avoid Heavy Operations in Content Scripts**: Keep content scripts lightweight so they do not slow down web pages. Delegate heavy processing to the background service worker.

## 7. Common Use Cases & Code Snippets

### Injecting CSS Dynamically
```javascript
chrome.scripting.insertCSS({
  target: { tabId: tabId },
  files: ["styles.css"]
});
```

### Executing Code in Tab
```javascript
chrome.scripting.executeScript({
  target: { tabId: tab.id },
  function: () => { document.body.style.backgroundColor = 'red'; } // Or pass a file via `files` array
});
```

### Using Declarative Net Request (Blocking/Modifying Requests)
Update `manifest.json`:
```json
{
  "declarative_net_request": {
    "rule_resources": [{
      "id": "ruleset_1",
      "enabled": true,
      "path": "rules.json"
    }]
  },
  "permissions": ["declarativeNetRequest"]
}
```

## Review & Workflow
When building or extending a browser extension, always:
1. Ensure you have properly declared permissions and host permissions in `manifest.json`.
2. Check if background tasks are suited for a service worker's ephemeral nature.
3. Keep logic clean and modularize it across background, popup, and content scripts as appropriate.
