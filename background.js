// Social Sentry Background Script
// Handles unified global settings and navigation redirects

// Default Unified Settings
const DEFAULT_SETTINGS = {
  // Global Toggles
  global_blockShorts: true,       // Blocks FB Reels & Stories + YT Shorts
  global_blockFeed: true,         // Blocks FB Feed + YT Feed/Recs
  global_blockNotifications: true,// Blocks FB Notification Badge
  
  // Platform Specific Extras
  global_blockComments: false,    // Blocks YT Comments
  global_motivationMode: false    // YT Motivation Mode
};

// Initialize default settings on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS), (result) => {
    const missing = {};
    let hasMissing = false;
    for (const key in DEFAULT_SETTINGS) {
      if (result[key] === undefined) {
        missing[key] = DEFAULT_SETTINGS[key];
        hasMissing = true;
      }
    }
    if (hasMissing) {
      chrome.storage.local.set(missing);
    }
  });
});

// YouTube Shorts Redirect Logic (Navigation based)
// We listen for navigation to /shorts/ and redirect to Home if checking is enabled
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return; // Only main frame

  const { global_blockShorts } = await chrome.storage.local.get('global_blockShorts');
  
  if (global_blockShorts && details.url.includes('/shorts/')) {
    chrome.tabs.update(details.tabId, { url: 'https://www.youtube.com/' });
  }
}, { url: [{ urlContains: '/shorts/' }] });
