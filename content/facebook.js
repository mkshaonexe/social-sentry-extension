// Social Sentry - Facebook Content Script
// Implements unified global settings:
// - global_blockShorts -> FB Reels & Stories
// - global_blockFeed -> FB Home Feed
// - global_blockNotifications -> FB Notification Badges

(function () {
    const DEFAULT_SETTINGS = {
        global_blockShorts: true,
        global_blockFeed: true,
        global_blockNotifications: true
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
        return /(^|\.)facebook\.com\/reels(\/|$|\?)/.test(location.href);
    }

    function isOnSingleReelRoute() {
        return /(^|\.)facebook\.com\/reel(\/|$)/.test(location.href);
    }

    function isOnHomeFeedRoute() {
        const { pathname, search } = location;
        if (!pathname || pathname === '/' || pathname === '/home.php') return true;
        try {
            const params = new URLSearchParams(search);
            // Some home variants
            if (params.has('sk') && /^h_/i.test(params.get('sk'))) return true;
            if (params.has('home')) return true;
        } catch { }
        return false;
    }

    // --- Main Toggler (CSS Attribute Injection) ---
    function updateDOMAttributes() {
        const html = document.documentElement;

        // 1. Block Shorts (Reels & Stories)
        if (currentSettings.global_blockShorts) {
            if (!isOnReelsRoute()) {
                html.setAttribute('data-block-reels', 'true');
                html.setAttribute('data-block-stories', 'true');
            } else {
                // If user is explicitly on /reels, we might allow it unless we want to block the whole page
                // For now, let's block the *access point* everywhere else.
                // If they navigate directly to /reels, we have a redirect logic below.
            }
        } else {
            html.removeAttribute('data-block-reels');
            html.removeAttribute('data-block-stories');
        }

        // 2. Block Home Feed
        const shouldHideHome = !!currentSettings.global_blockFeed && isOnHomeFeedRoute();
        if (shouldHideHome) {
            html.setAttribute('data-hide-home-feed', 'true');
            html.setAttribute('data-hide-sidebars', 'true'); // Cleaner look
        } else {
            html.removeAttribute('data-hide-home-feed');
            html.removeAttribute('data-hide-sidebars');
        }

        // 3. Block Notifications
        if (currentSettings.global_blockNotifications) {
            html.setAttribute('data-hide-notifications', 'true');
        } else {
            html.removeAttribute('data-hide-notifications');
        }
    }

    // --- Redirect Logic ---
    function checkRedirects() {
        // If blocking shorts is enabled and user tries to view a single reel
        if (currentSettings.global_blockShorts) {
            if (isOnReelsRoute() || isOnSingleReelRoute()) {
                // Redirect to main feed (or blank if feed is blocked, but safely away from reels)
                // If feed is blocked, they usually see a quote or blank page on home.
                // Just redirect to root.
                location.replace('https://www.facebook.com/?ref=social_sentry_redirect');
            }
        }
    }

    // --- Feature Specific Logic (DOM Manipulation) ---

    // Clean notification badges periodically because React re-renders them
    function scrubNotificationBadges() {
        if (!currentSettings.global_blockNotifications) return;

        // Common selectors for badges
        const badgeSelectors = [
            '[aria-label*="Notifications" i] span',
            '[aria-label*="Messenger" i] span',
            'a[href*="notifications"] span', // Generic fallback
            'div[aria-label*="unread"]'
        ];

        document.querySelectorAll(badgeSelectors.join(',')).forEach(el => {
            // Heuristic: usually small, distinct color (red/blue), contains number
            if (el.innerText && /\d+/.test(el.innerText)) {
                el.style.display = 'none';
            }
        });
    }

    // --- Mutation Observer ---
    function setupObserver() {
        const observer = new MutationObserver(() => {
            updateDOMAttributes();
            checkRedirects();
            scrubNotificationBadges();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- Event Listeners ---
    async function init() {
        currentSettings = await loadSettings();
        updateDOMAttributes();
        checkRedirects();
        setupObserver();

        // Listen for storage changes (Unified Keys)
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
