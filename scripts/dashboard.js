document.addEventListener("DOMContentLoaded", () => {

    const user = getLoggedInUser();
    const currency = user.currency;

    const periodInput = document.getElementById("period");
    const totalSpentEl = document.getElementById("total-spent");
    const topCategoryEl = document.getElementById("top-category");
    const numReceiptsEl = document.getElementById("num-receipts");

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    periodInput.value = currentMonth;

    function getFilteredReceipts() {
        const selected = periodInput.value;
        return receipts.filter((r) => {
            return r.userId === user.id && (!selected || r.date.startsWith(selected));
        });
    }

    function getUserCategories() {
        return categories.filter((c) => c.userId === user.id);
    }

    function getTopCategory(filtered) {
        if (filtered.length === 0) return "—";
        const totals = {};
        filtered.forEach((r) => {
            totals[r.category] = (totals[r.category] || 0) + r.total;
        });
        return Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
    }

    function updateStats() {
        const filtered = getFilteredReceipts();

        const totalSpent = filtered.reduce((sum, r) => sum + r.total, 0);
        totalSpentEl.textContent = `${totalSpent.toFixed(2)} ${currency}`;
        topCategoryEl.textContent = getTopCategory(filtered);
        numReceiptsEl.textContent = filtered.length;

        updateCharts(filtered);
    }

    let barChart = null;
    let pieChart = null;

    function updateCharts(filtered) {
        const userCats = getUserCategories();
        const totals = {};
        userCats.forEach((c) => totals[c.name] = 0);
        filtered.forEach((r) => {
            if (totals[r.category] !== undefined) {
                totals[r.category] += r.total;
            }
        });

        const labels = Object.keys(totals);
        const values = Object.values(totals);

        const chartColors = [
            "#a78bfa", "#34d399", "#fbbf24", "#f87171", "#60a5fa", "#f472b6"
        ];

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
                    borderRadius: 6,
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
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { font: { family: "Arial" } }
                    }
                }
            }
        });
    }

    periodInput.addEventListener("change", updateStats);
    updateStats();
});