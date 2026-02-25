# Market Research: Reels and Shorts Blockers

## Objective
To research the top Chrome extensions that block addictive short-form video content (YouTube Shorts, Instagram Reels, Facebook Reels) and to identify user pain points, complaints, and feature requests actively discussed on social media (Reddit, Twitter, etc.).

---

## 1. Top 5 Competitors in the Market (Chrome Web Store)

These extensions represent the current standard for users looking to block addictive features.

### 1) Unhook - Remove YouTube Recommended Videos
- **Primary Function:** Blocks YouTube Shorts, related videos, comments, and homepage recommendations.
- **Downloads:** 1,000,000+ (estimated from reviews)
- **Rating:** 4.7/5 (based on ~3.8k reviews)
- **Monetization:** Free to use, relies on user donations.
- **Key Features:** Highly granular toggles for hiding specific parts of the YouTube UI.

### 2) UnDistracted
- **Primary Function:** Hides distracting elements on Facebook, YouTube, Twitter, and Reddit (including YT Shorts and FB Reels).
- **Downloads:** 100,000+
- **Rating:** 4.7/5 (based on ~581 reviews)
- **Monetization:** Freemium / Free
- **Key Features:** Multi-platform support, allows users to selectively hide the feed, comments, and sidebar.

### 3) Clean YouTube - Hide YouTube Shorts, Comments & Thumbnails
- **Primary Function:** Specific to YouTube, cleans up the UI by hiding Shorts, comments, and thumbnails.
- **Downloads:** 80,000+
- **Rating:** 4.9/5 (based on 325 ratings)
- **Monetization:** Free
- **Key Features:** Excellent user rating, lightweight, specifically tackles the visual clutter of YouTube.

### 4) IGPlus / Antigram
- **Primary Function:** Focuses purely on Instagram. Blocks the Explore page, Reels, stories, and suggested followers.
- **Rating:** Very highly reviewed across productivity forums.
- **Monetization:** Free / Open Source.
- **Key Features:** Redirects users to their "Following" feed automatically, bypassing the algorithmic "For You" page. 

### 5) Facebook / FREE Reels Blocker
- **Primary Function:** Blurs or completely hides Reels and Shorts across FB and YouTube.
- **Rating:** 3.6/5 to 4.5/5 (varies by specific fork/version)
- **Monetization:** Free
- **Key Features:** Performs real-time dynamic blocking of newly injected Reels content as the user scrolls.

---

## 2. Social Media Deep Dive & User Feedback (Reddit / Twitter)

By scouring communities like `r/nosurf`, `r/productivity`, and `r/youtube`, we identified the major gaps in current solutions:

### A. Major Issues & Bugs with Existing Tools
1. **The "Cat and Mouse" Game with Google/Meta:**
   - Existing extensions break frequently. Users complain that YouTube and Facebook routinely update their CSS/DOM structures, bypassing the blockers. Extensions often take days to update, leaving users exposed to the addictive content again. (e.g., Unhook sometimes fails to hide the Shorts shelf until an update is pushed).
2. **Inconsistency on Mobile:**
   - While blockers work well on Chrome desktop, users are desperate for solutions that work seamlessly on iOS devices (due to Apple's strict extension policies). Android users have to resort to modded apps (like ReVanced) or risk downloading older APKs.
3. **Ad Blocker Conflicts:**
   - Users trying to use uBlock Origin with custom filters report that it breaks other parts of the site or fails to block the dynamically loaded Reels.
4. **"Zombie" Extensions:**
   - Some extensions have bugs where they continue to block or distort the UI even after being disabled.

### B. Highly Requested Features that are Missing
1. **"Break" or "Allowance" Timers (Auto-On):**
   - Users don't want to permanently block Reels; sometimes they just want 5 minutes. They request a feature where they can "Unblock for 5 minutes" and have the extension automatically lock it down afterward. (This aligns perfectly with your "Auto-On Reels Blocker" feature).
2. **Cross-Platform Sync & Network Blocking:**
   - Parents want a network-level or synchronized way to block Shorts/Reels across all devices, rather than installing and managing 5 different extensions per device.
3. **Granular "Blurring" vs. "Hiding":**
   - Some users prefer content to be blurred with a warning message (adding intentional friction) rather than completely removed, which can cause layout jumping or a jarring experience.
4. **Analytics/Reality Check:**
   - Users want an extension that blocks the Reel *and* shows them a harsh reality check (e.g., "You have been scrolling for 2 hours today. Are you sure you want to watch this?"). 

### Conclusion for Social Sentry:
To dominate this market, **Social Sentry** should focus on:
1. **Robust DOM-Observer Blocking:** Ensuring the blocker doesn't break when FB/YT updates their code.
2. **The "Auto-On" Timeout Feature:** This is highly requested and sets the extension apart from simple CSS-hiders.
3. **Multi-platform support within one cohesive UI.**
