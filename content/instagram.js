// Social Sentry - Instagram Content Script
// Implements unified global settings:
// - global_blockShorts -> IG Reels
// - global_blockFeed -> IG Home Feed

(function () {
    const DEFAULT_SETTINGS = {
        global_blockShorts: true,
        global_blockFeed: false
    };

    let currentSettings = { ...DEFAULT_SETTINGS };

    // --- Load Settings ---
    function loadSettings() {
        return new Promise(resolve => {
            try {
                chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS), (res) => {
                    resolve(res || DEFAULT_SETTINGS);
                });
            } catch {
                resolve(DEFAULT_SETTINGS);
            }
        });
    }

    // --- Regex Helpers ---
    function isOnReelsRoute() {
        return /(^|\.)instagram\.com\/reels?(\/|$|\?)/.test(location.href);
    }

    function isOnHomeFeedRoute() {
        const { pathname } = location;
        return pathname === '/' || pathname === '';
    }

    // --- Main Toggler (CSS Attribute Injection) ---
    function updateDOMAttributes() {
        const html = document.documentElement;

        // 1. Block Shorts (Reels)
        if (currentSettings.global_blockShorts) {
            html.setAttribute('data-block-reels', 'true');
        } else {
            html.removeAttribute('data-block-reels');
        }

        // 2. Block Home Feed
        const shouldHideHome = !!currentSettings.global_blockFeed && isOnHomeFeedRoute();
        if (shouldHideHome) {
            html.setAttribute('data-hide-home-feed', 'true');
        } else {
            html.removeAttribute('data-hide-home-feed');
        }
    }

    // --- Redirect Logic ---
    let isGoingBack = false;
    function checkRedirects() {
        // If blocking shorts is enabled and user tries to view a reel
        if (currentSettings.global_blockShorts) {
            if (isOnReelsRoute()) {
                if (!isGoingBack) {
                    isGoingBack = true;
                    // Go to home if accessing reel
                    window.location.replace("https://www.instagram.com/");
                }
            }
        }
    }

    // --- Mutation Observer ---
    function setupObserver() {
        const observer = new MutationObserver(() => {
            updateDOMAttributes();
            checkRedirects();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- Event Listeners ---
    async function init() {
        currentSettings = await loadSettings();
        updateDOMAttributes();
        checkRedirects();
        setupObserver();

        // Listen for storage changes
        chrome.storage.onChanged.addListener((changes) => {
            let changed = false;
            for (const key of Object.keys(DEFAULT_SETTINGS)) {
                if (changes[key]) {
                    currentSettings[key] = changes[key].newValue;
                    changed = true;
                }
            }
            if (changed) {
                updateDOMAttributes();
                checkRedirects();
            }
        });
    }

    // Run
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Immediate run for CSS injection to prevent flash
    loadSettings().then(s => {
        currentSettings = s;
        updateDOMAttributes();
    });

})();
