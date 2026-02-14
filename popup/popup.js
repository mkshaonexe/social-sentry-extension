// Social Sentry Popup Logic
// Handlers for Unified Global Toggles

document.addEventListener('DOMContentLoaded', async () => {

    // UI Elements
    const toggles = {
        global_blockShorts: document.getElementById('global_blockShorts'),
        global_blockFeed: document.getElementById('global_blockFeed'),
        global_blockNotifications: document.getElementById('global_blockNotifications'),
        global_blockComments: document.getElementById('global_blockComments'),
        global_motivationMode: document.getElementById('global_motivationMode')
    };

    // Load initial state
    const settings = await loadSettings();

    // Apply state to UI
    for (const [key, element] of Object.entries(toggles)) {
        if (element) {
            element.checked = !!settings[key];

            // Add listener
            element.addEventListener('change', (e) => {
                saveSetting(key, e.target.checked);
            });
        }
    }

});

function loadSettings() {
    return new Promise(resolve => {
        chrome.storage.local.get(null, (result) => {
            resolve(result || {});
        });
    });
}

function saveSetting(key, value) {
    chrome.storage.local.set({ [key]: value }, () => {
        console.log(`Saved ${key}: ${value}`);
    });
}
