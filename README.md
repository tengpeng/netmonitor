# Network Diagnose Chrome Extension

A minimal Chrome extension that surfaces your current connection stats and recent problematic network requests.

## Features
- Displays downlink, RTT, effective connection type, and data-saver state when supported by the browser.
- Tracks all network requests using the `webRequest` API and summarizes successes, HTTP errors (4xx/5xx), and network failures.
- Lists the 25 most recent problematic requests with method, URL, status (when available), and timestamp.

## Usage
1. Open **chrome://extensions** in Chromium-based browsers and enable **Developer mode**.
2. Click **Load unpacked** and select the `extension/` folder from this repository.
3. Pin the "Network Diagnose" action and open it to view live stats. Use the **Refresh** button to request an updated snapshot.

## Notes
- The connection metrics rely on the Network Information API. Some desktop browsers do not expose these fields; in that case a hint appears in the popup.
- The extension monitors all URLs via `<all_urls>` to catch failures across sites. You can adjust this in `manifest.json` if you want a narrower scope.
