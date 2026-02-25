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

    // Timer Modal Elements
    const timerModal = document.getElementById('timerModal');
    const btn1min = document.getElementById('btn1min');
    const btn5min = document.getElementById('btn5min');
    const btn10min = document.getElementById('btn10min');
    const btnCancel = document.getElementById('btnCancelTimer');

    // Load initial state
    const settings = await loadSettings();

    // Apply state to UI
    for (const [key, element] of Object.entries(toggles)) {
        if (element) {
            element.checked = !!settings[key];

            // Add listener
            element.addEventListener('change', (e) => {
                if (key === 'global_blockShorts' && !e.target.checked) {
                    // Prevent immediate save, show modal
                    e.target.checked = true; // revert visually until they pick a time
                    timerModal.classList.add('show');
                } else {
                    // For all other toggles or turning Shorts ON
                    if (key === 'global_blockShorts' && e.target.checked) {
                        // Clear any pending alarm
                        chrome.storage.local.set({ shortsReenableAt: null });
                    }
                    saveSetting(key, e.target.checked);
                }
            });
        }
    }

    // Modal Action Handlers
    function setTimer(minutes) {
        const reenableAt = Date.now() + minutes * 60 * 1000;

        // Save both the toggle off state and the alarm timestamp
        chrome.storage.local.set({
            global_blockShorts: false,
            shortsReenableAt: reenableAt
        }, () => {
            toggles.global_blockShorts.checked = false;
            timerModal.classList.remove('show');
        });
    }

    btn1min.addEventListener('click', () => setTimer(1));
    btn5min.addEventListener('click', () => setTimer(5));
    btn10min.addEventListener('click', () => setTimer(10));

    btnCancel.addEventListener('click', () => {
        timerModal.classList.remove('show');
    });

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
