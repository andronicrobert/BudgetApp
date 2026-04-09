document.addEventListener("DOMContentLoaded", async () => {

    // Wait for nav.js to set currentUser
    const user = await requireLogin();
    if (!user) return;
    window.currentUser = user;

    const currency = user.currency;

    const periodInput    = document.getElementById("period");
    const totalSpentEl   = document.getElementById("total-spent");
    const topCategoryEl  = document.getElementById("top-category");
    const numReceiptsEl  = document.getElementById("num-receipts");

    // ── Set default period to current month ──
    const now = new Date();
    periodInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    let allReceipts  = [];
    let allCategories = [];
    let barChart = null;
    let pieChart = null;

    // ── Fetch data from API ──
    async function loadData() {
        const [receiptsRes, categoriesRes] = await Promise.all([
            api("get_receipts.php"),
            api("get_categories.php")
        ]);

        allReceipts   = await receiptsRes.json();
        allCategories = await categoriesRes.json();

        updateStats();
    }

    // ── Filter receipts by selected period ──
    function getFilteredReceipts() {
        const selected = periodInput.value;
        if (!selected) return allReceipts;
        return allReceipts.filter((r) => r.date.startsWith(selected));
    }

    // ── Calculate top category ──
    function getTopCategory(filtered) {
        if (filtered.length === 0) return "—";
        const totals = {};
        filtered.forEach((r) => {
            totals[r.category] = (totals[r.category] || 0) + r.total;
        });
        return Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
    }

    // ── Update stat cards ──
    function updateStats() {
        const filtered = getFilteredReceipts();

        const totalSpent = filtered.reduce((sum, r) => sum + r.total, 0);
        totalSpentEl.textContent  = `${totalSpent.toFixed(2)} ${currency}`;
        topCategoryEl.textContent = getTopCategory(filtered);
        numReceiptsEl.textContent = filtered.length;

        updateCharts(filtered);
    }

    // ── Charts ──
    function updateCharts(filtered) {
        const totals = {};
        allCategories.forEach((c) => totals[c.name] = 0);
        filtered.forEach((r) => {
            if (totals[r.category] !== undefined) {
                totals[r.category] += r.total;
            }
        });

        const labels = Object.keys(totals);
        const values = Object.values(totals);
        const chartColors = ["#a78bfa", "#34d399", "#fbbf24", "#f87171", "#60a5fa", "#f472b6"];

        const barCtx = document.getElementById("bar-chart").getContext("2d");
        if (barChart) barChart.destroy();
        barChart = new Chart(barCtx, {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: `Spent (${currency})`,
                    data: values,
                    backgroundColor: chartColors.slice(0, labels.length),
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { font: { family: "Arial" } } },
                    x: { ticks: { font: { family: "Arial" } } }
                }
            }
        });

        const pieCtx = document.getElementById("pie-chart").getContext("2d");
        if (pieChart) pieChart.destroy();
        pieChart = new Chart(pieCtx, {
            type: "doughnut",
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: chartColors.slice(0, labels.length),
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "bottom", labels: { font: { family: "Arial" } } }
                }
            }
        });
    }

    periodInput.addEventListener("change", updateStats);
    await loadData();
});
