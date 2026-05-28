document.addEventListener("DOMContentLoaded", async () => {

    // Wait for nav.js to set currentUser
    const user = await requireLogin();
    if (!user) return;
    window.currentUser = user;

    const currency = user.currency;

    const startPeriodInput = document.getElementById("start-period");
    const endPeriodInput   = document.getElementById("end-period");
    const totalSpentEl     = document.getElementById("total-spent");
    const topCategoryEl    = document.getElementById("top-category");
    const numReceiptsEl    = document.getElementById("num-receipts");
    const needsBudgetStatusEl    = document.getElementById("needs-budget-status");
    const wantsBudgetStatusEl    = document.getElementById("wants-budget-status");
    const needsBudgetRemainingEl = document.getElementById("needs-budget-remaining");
    const wantsBudgetRemainingEl = document.getElementById("wants-budget-remaining");
    const needsBudgetFillEl      = document.getElementById("needs-budget-fill");
    const wantsBudgetFillEl      = document.getElementById("wants-budget-fill");

    // ── Set default interval to current month ──
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const firstOfMonth = `${year}-${month}-01`;
    const lastOfMonth = new Date(year, now.getMonth() + 1, 0);
    const lastOfMonthStr = `${year}-${month}-${String(lastOfMonth.getDate()).padStart(2, "0")}`;
    startPeriodInput.value = firstOfMonth;
    endPeriodInput.value = lastOfMonthStr;

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

    // ── Filter receipts by selected interval ──
    function getFilteredReceipts() {
        const start = startPeriodInput.value;
        const end = endPeriodInput.value;
        if (!start && !end) return allReceipts;

        const minDate = start && end && start > end ? end : start;
        const maxDate = start && end && start > end ? start : end;

        return allReceipts.filter((r) => {
            if (minDate && r.date < minDate) return false;
            if (maxDate && r.date > maxDate) return false;
            return true;
        });
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
        updateBudgetOverview(filtered);
    }

    // ── Budget overview ──
    function updateBudgetOverview(filtered) {
        const categoryType = Object.fromEntries(allCategories.map((c) => [c.name, c.type]));

        const needsSpent = filtered.reduce((sum, r) => categoryType[r.category] === "Need" ? sum + r.total : sum, 0);
        const wantsSpent = filtered.reduce((sum, r) => categoryType[r.category] === "Want" ? sum + r.total : sum, 0);
        const needsBudget = parseFloat(user.needs_budget || 0);
        const wantsBudget = parseFloat(user.wants_budget || 0);

        const needsLeft = needsBudget - needsSpent;
        const wantsLeft = wantsBudget - wantsSpent;

        needsBudgetStatusEl.textContent = needsBudget > 0
            ? `${needsSpent.toFixed(2)} / ${needsBudget.toFixed(2)} ${currency}`
            : `0.00 / 0.00 ${currency}`;
        wantsBudgetStatusEl.textContent = wantsBudget > 0
            ? `${wantsSpent.toFixed(2)} / ${wantsBudget.toFixed(2)} ${currency}`
            : `0.00 / 0.00 ${currency}`;

        needsBudgetRemainingEl.textContent = needsBudget > 0
            ? (needsLeft >= 0
                ? `${needsLeft.toFixed(2)} ${currency} left`
                : `Over budget by ${Math.abs(needsLeft).toFixed(2)} ${currency}`)
            : "Set a needs budget in profile.";
        wantsBudgetRemainingEl.textContent = wantsBudget > 0
            ? (wantsLeft >= 0
                ? `${wantsLeft.toFixed(2)} ${currency} left`
                : `Over budget by ${Math.abs(wantsLeft).toFixed(2)} ${currency}`)
            : "Set a wants budget in profile.";

        const needsPercent = needsBudget > 0 ? Math.min((needsSpent / needsBudget) * 100, 100) : 0;
        const wantsPercent = wantsBudget > 0 ? Math.min((wantsSpent / wantsBudget) * 100, 100) : 0;

        needsBudgetFillEl.style.width = `${needsPercent}%`;
        wantsBudgetFillEl.style.width = `${wantsPercent}%`;
        needsBudgetFillEl.style.background = needsBudget > 0 && needsSpent > needsBudget ? "#f87171" : "linear-gradient(90deg,#60a5fa,#3b82f6)";
        wantsBudgetFillEl.style.background = wantsBudget > 0 && wantsSpent > wantsBudget ? "#ef4444" : "linear-gradient(90deg,#fbbf24,#f97316)";
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

    startPeriodInput.addEventListener("change", updateStats);
    endPeriodInput.addEventListener("change", updateStats);
    await loadData();
});
