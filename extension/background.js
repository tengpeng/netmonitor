const stats = {
  total: 0,
  successes: 0,
  failures: 0,
  errors: 0,
  lastUpdated: null
};

const problematicRequests = [];
const MAX_PROBLEM_ENTRIES = 25;

function recordProblem(details, category) {
  const entry = {
    url: details.url,
    method: details.method,
    statusCode: details.statusCode || null,
    error: details.error || null,
    type: category,
    timestamp: Date.now()
  };

  problematicRequests.unshift(entry);
  if (problematicRequests.length > MAX_PROBLEM_ENTRIES) {
    problematicRequests.pop();
  }
}

chrome.webRequest.onCompleted.addListener(
  (details) => {
    stats.total += 1;
    stats.lastUpdated = Date.now();

    if (details.statusCode >= 400) {
      stats.failures += 1;
      recordProblem(details, "http_error");
    } else {
      stats.successes += 1;
    }
  },
  { urls: ["<all_urls>"] }
);

chrome.webRequest.onErrorOccurred.addListener(
  (details) => {
    stats.total += 1;
    stats.errors += 1;
    stats.lastUpdated = Date.now();
    recordProblem(details, "network_error");
  },
  { urls: ["<all_urls>"] }
);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "getStats") {
    sendResponse({ stats, problematicRequests });
  }
});
