// Social Sentry Background Script
// Handles unified global settings and navigation redirects

// Default Unified Settings
const DEFAULT_SETTINGS = {
  // Global Toggles
  global_blockShorts: true,       // Blocks FB Reels & Stories + YT Shorts
  global_blockFeed: false,        // Blocks FB Feed + YT Feed/Recs (Default OFF)
  global_blockNotifications: false,// Blocks FB Notification Badge (Default OFF)

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

// --- Alarm for Timed Toggle-Off ---
const ALARM_NAME = 'enableShortsBlocker';

chrome.storage.onChanged.addListener((changes) => {
  // If shortsReenableAt is set, create the alarm
  if (changes.shortsReenableAt && changes.shortsReenableAt.newValue) {
    const reenableTime = changes.shortsReenableAt.newValue;
    chrome.alarms.create(ALARM_NAME, {
      when: reenableTime
    });
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    // Re-enable the shorts blocker and clear the reenable timestamp
    chrome.storage.local.set({
      global_blockShorts: true,
      shortsReenableAt: null
    });
  }
});
