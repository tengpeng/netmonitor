function formatTimestamp(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleTimeString();
}

function updateConnectionInfo() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const hint = document.getElementById("connection-hint");

  if (!connection) {
    hint.textContent = "Network Information API is not available in this browser.";
    return;
  }

  document.getElementById("downlink").textContent = `${connection.downlink ?? "—"} Mbps`;
  document.getElementById("rtt").textContent = `${connection.rtt ?? "—"} ms`;
  document.getElementById("effectiveType").textContent = connection.effectiveType ?? "—";
  document.getElementById("saveData").textContent = connection.saveData ? "On" : "Off";
  document.getElementById("connection-updated").textContent = new Date().toLocaleTimeString();

  hint.textContent = "Connection details update automatically when the browser reports changes.";

  connection.addEventListener("change", updateConnectionInfo, { once: true });
}

function renderProblems(problematicRequests) {
  const list = document.getElementById("problem-list");
  const hint = document.getElementById("problem-hint");
  list.innerHTML = "";

  if (!problematicRequests.length) {
    hint.textContent = "No failing requests observed yet.";
    return;
  }

  hint.textContent = "Only the 25 most recent errors are shown.";

  problematicRequests.forEach((entry) => {
    const li = document.createElement("li");
    const label = entry.type === "network_error" ? "Network" : "HTTP";
    const status = entry.statusCode ? ` • Status ${entry.statusCode}` : "";
    const error = entry.error ? ` • ${entry.error}` : "";

    li.innerHTML = `
      <div class="problem-header">
        <span class="badge ${entry.type}">${label}</span>
        <span class="method">${entry.method}</span>
        <span class="url" title="${entry.url}">${entry.url}</span>
      </div>
      <div class="problem-meta">${formatTimestamp(entry.timestamp)}${status}${error}</div>
    `;

    list.appendChild(li);
  });
}

function refreshStats() {
  chrome.runtime.sendMessage({ type: "getStats" }, ({ stats, problematicRequests }) => {
    document.getElementById("total").textContent = stats.total;
    document.getElementById("success").textContent = stats.successes;
    document.getElementById("failure").textContent = stats.failures;
    document.getElementById("network-error").textContent = stats.errors;
    document.getElementById("stats-updated").textContent = formatTimestamp(stats.lastUpdated);

    renderProblems(problematicRequests);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateConnectionInfo();
  refreshStats();

  document.getElementById("refresh").addEventListener("click", () => {
    updateConnectionInfo();
    refreshStats();
  });
});
