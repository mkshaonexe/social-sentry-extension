# Social Sentry — Focus Mode Extension

**Social Sentry** is a unified Chrome extension designed to eliminate distractions on Facebook and YouTube. It provides global controls to block short-form videos, home feeds, and notification badges, helping you stay focused and productive.

Developed by **MK Shaon**.

## Features

### 🛡️ Global Focus Control
- **Block Short Videos**: One toggle to block **Facebook Reels**, **Facebook Stories**, and **YouTube Shorts**.
  - *Effect*: Hides UI elements and redirects Shorts URLs to the home page.
- **Hide Feeds**: One toggle to hide **Facebook Home Feed** and **YouTube Home Feed & Recommendations**.
  - *Effect*: Keeps sidebars clean and removes algorithmic feeds.
- **Hide Notifications**: One toggle to hide **Facebook Notification Badges**.
  - *Effect*: Visual clutter and red badges are removed.

### 🚀 Extras (Platform Specific)
- **YouTube Comments**: Hide the comments section on YouTube.
- **Motivation Mode**: (Beta) Displays a random motivational quote on the YouTube home page.

## Installation

### 🌐 Chrome Web Store (Recommended)
You can install the extension directly from the [Chrome Web Store](https://chromewebstore.google.com/detail/social-sentry-%E2%80%94-focus-mod/ochghidlhpajencdlhlponjpgpfaghii).

### 🛠️ Manual Installation (Developer Mode)
If you prefer to install it manually from this repository:
1. Go to the [Releases](../../releases) page and download the latest version, or clone/download this repository.
2. Unzip the downloaded file if necessary.
3. Open Chrome and navigate to `chrome://extensions`.
4. Enable **Developer mode** (toggle in the top right).
5. Click **Load unpacked**.
6. Select the `social-sentry` folder.

## 📱 Other Platforms

Social Sentry is also available on other devices!
- **Android App**: We have a native Android app that blocks reels, short-form scrolling, limits app usage, and blocks adult content. [Get it on the Google Play Store](https://play.google.com/store/apps/details?id=com.socialsentry.ai).
- **Desktop Software**: We also offer a dedicated desktop software version.
- **Website**: Learn more at [socialsentry.online](https://socialsentry.online) or [socialsentry.app](https://socialsentry.app).

## Development

- **Manifest V3**
- **Unified Logic**: Shared `chrome.storage` keys for global features.
- **Premium UI**: Dark mode, glassmorphism, and smooth animations.

## Privacy

Social Sentry runs entirely on your device. No data is collected or transmitted.
