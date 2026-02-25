// Social Sentry - YouTube Content Script
// Implements unified global settings:
// - global_blockShorts -> YT Shorts (Redirect + Hide UI)
// - global_blockFeed -> YT Feed & Recommendations
// - global_blockComments -> YT Comments
// - global_motivationMode -> Motivation Mode (Quotes)

(function () {
    const DEFAULT_SETTINGS = {
        global_blockShorts: true,
        global_blockFeed: false,
        global_blockComments: false,
        global_motivationMode: false
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

    // --- Quote Generator for Motivation Mode ---
    const QUOTES = [
        "The expert in anything was once a beginner. - Helen Hayes",
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Education is the key to unlocking the world, a passport to freedom. - Oprah Winfrey",
        "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
        "Learning is not attained by chance, it must be sought for with ardor and diligence. - Abigail Adams",
        "Strive for progress, not perfection. - Unknown",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
        "The best way to predict the future is to create it. - Peter Drucker",
        "Believe you can and you're halfway there. - Theodore Roosevelt",
        "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
        "The mind is everything. What you think you become. - Buddha"
    ];

    function displayMotivationQuote() {
        if (document.querySelector('.social-sentry-quote')) return;

        const quoteIdx = Math.floor(Math.random() * QUOTES.length);
        const [text, author] = QUOTES[quoteIdx].split(' - ');

        const container = document.createElement('div');
        container.className = 'social-sentry-quote';
        container.innerHTML = `
      <div class="quote-text">"${text}"</div>
      <div class="quote-author">- ${author}</div>
    `;

        // Insert into primary area if possible, or body
        const primary = document.querySelector('#primary');
        if (primary) {
            primary.prepend(container);
        } else {
            document.body.appendChild(container);
        }
    }

    function removeMotivationQuote() {
        const el = document.querySelector('.social-sentry-quote');
        if (el) el.remove();
    }

    // --- Main Toggler (CSS Attributes + JS Logic) ---
    function updateDOMAttributes() {
        const html = document.documentElement;
        const body = document.body;

        // 1. Block Shorts
        if (currentSettings.global_blockShorts) {
            body.classList.add('hide-shorts-enabled');
        } else {
            body.classList.remove('hide-shorts-enabled');
        }

        // 2. Block Feed
        if (currentSettings.global_blockFeed) {
            body.classList.add('hide-feed-enabled');
        } else {
            body.classList.remove('hide-feed-enabled');
        }

        // 3. Block Comments
        if (currentSettings.global_blockComments) {
            body.classList.add('hide-comments-enabled');
        } else {
            body.classList.remove('hide-comments-enabled');
        }

        // 4. Motivation Mode
        const isHome = location.pathname === '/';
        if (currentSettings.global_motivationMode && isHome) {
            body.classList.add('motivation-mode-enabled');
            displayMotivationQuote();
        } else {
            body.classList.remove('motivation-mode-enabled');
            removeMotivationQuote();
        }
    }

    // --- Redirect Logic ---
    function checkShortsRedirect() {
        if (currentSettings.global_blockShorts && location.pathname.includes('/shorts/')) {
            location.replace('https://www.youtube.com/');
        }
    }

    // --- DOM Cleanup (Shorts Shelves) ---
    function removeShortsShelves() {
        if (!currentSettings.global_blockShorts) return;

        // Remove "Shorts" shelves from Home/Search
        const shelves = document.querySelectorAll('ytd-rich-section-renderer, ytd-reel-shelf-renderer');
        shelves.forEach(shelf => {
            if (shelf.innerText.includes('Shorts') || shelf.querySelector('ytd-reel-shelf-renderer')) {
                shelf.style.display = 'none';
            }
        });

        // Remove shorts navigation button
        const navItems = document.querySelectorAll('ytd-mini-guide-entry-renderer, ytd-guide-entry-renderer');
        navItems.forEach(item => {
            const aria = item.getAttribute('aria-label') || '';
            const title = item.innerText || '';
            if (aria.includes('Shorts') || title.includes('Shorts')) {
                item.style.display = 'none';
            }
        });
    }

    // --- Observer ---
    function setupObserver() {
        const observer = new MutationObserver(() => {
            updateDOMAttributes();
            checkShortsRedirect();
            removeShortsShelves();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- Initialization ---
    async function init() {
        currentSettings = await loadSettings();
        updateDOMAttributes();
        checkShortsRedirect();
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
                checkShortsRedirect();
            }
        });
    }

    // Run
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Navigate event (SPA)
    window.addEventListener('yt-navigate-finish', () => {
        updateDOMAttributes(); // Re-check motivation mode on nav
        checkShortsRedirect();
    });

})();
