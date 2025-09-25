// main.js

// --- COMMUNITY ---
async function loadCommunity() {
  try {
    const res = await fetch("/api/community");
    const feed = await res.json();

    const container = document.getElementById("communityFeed");
    container.innerHTML = "";

    if (feed.length === 0) {
      container.innerHTML = "<p class='text-gray-400'>No community activity yet.</p>";
    } else {
      feed.forEach(item => {
        const div = document.createElement("div");
        div.className = "bg-gray-800 p-4 rounded-lg shadow-md";
        div.innerHTML = `<strong>${item.user}:</strong> ${item.message}`;
        container.appendChild(div);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

// --- REPORTS ---
async function loadReports() {
  try {
    const res = await fetch("/api/reports");
    const reports = await res.json();

    const tbody = document.getElementById("historyBody");
    tbody.innerHTML = "";

    if (reports.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6">📄 No data yet</td></tr>`;
    } else {
      reports.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="py-3 px-4">${r.date}</td>
          <td class="py-3 px-4">${r.travelCO2}</td>
          <td class="py-3 px-4">${r.electricityCO2}</td>
          <td class="py-3 px-4">${r.foodCO2}</td>
          <td class="py-3 px-4 font-semibold">${r.totalCO2}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

// --- LEADERBOARD ---
async function loadLeaderboard() {
  try {
    const res = await fetch("/api/leaderboard");
    const leaderboard = await res.json();

    const tbody = document.getElementById("leaderboardBody");
    tbody.innerHTML = "";

    if (leaderboard.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" class="text-center py-6">🏆 No leaderboard data yet</td></tr>`;
    } else {
      leaderboard.forEach(entry => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="py-3 px-4">${entry.rank}</td>
          <td class="py-3 px-4">${entry.user}</td>
          <td class="py-3 px-4">${entry.totalCO2}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

// --- INITIAL LOAD ---
document.addEventListener("DOMContentLoaded", () => {
  loadCommunity();
  loadReports();
  loadLeaderboard();
});
