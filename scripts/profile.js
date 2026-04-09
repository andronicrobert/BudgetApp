document.addEventListener("DOMContentLoaded", async () => {

    const user = await requireLogin();
    if (!user) return;

    let editing = false;

    // ── Load profile ──
    async function loadProfile() {
        // Avatar initials
        const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase();
        document.getElementById("profile-avatar").textContent   = initials;
        document.getElementById("profile-name").textContent     = user.name;
        document.getElementById("profile-username").textContent = `@${user.username}`;

        // Settings fields
        document.getElementById("setting-name").value     = user.name;
        document.getElementById("setting-username").value = user.username;
        document.getElementById("setting-password").value = user.password;
        document.getElementById("setting-currency").value = user.currency;
        document.getElementById("setting-salary").value   = user.salary;
        document.getElementById("setting-budget").value   = user.budget;

        // Stats
        const [receiptsRes, categoriesRes] = await Promise.all([
            api("get_receipts.php"),
            api("get_categories.php")
        ]);

        const receipts   = await receiptsRes.json();
        const categories = await categoriesRes.json();

        const totalSpent = receipts.reduce((sum, r) => sum + parseFloat(r.total), 0);

        let topCategory = "—";
        if (receipts.length > 0) {
            const totals = {};
            receipts.forEach((r) => {
                totals[r.category] = (totals[r.category] || 0) + parseFloat(r.total);
            });
            topCategory = Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
        }

        document.getElementById("stat-receipts").textContent     = receipts.length;
        document.getElementById("stat-total").textContent        = `${totalSpent.toFixed(2)} ${user.currency}`;
        document.getElementById("stat-top-category").textContent = topCategory;
        document.getElementById("stat-categories").textContent   = categories.length;

        // Update nav name
        const navUser = document.getElementById("nav-user");
        if (navUser) navUser.textContent = user.name.split(" ")[0];
    }

    // ── Edit toggle ──
    const editToggleBtn  = document.getElementById("edit-toggle-btn");
    const settingsActions = document.getElementById("settings-actions");
    const fields = ["setting-name", "setting-username", "setting-password", "setting-currency", "setting-salary", "setting-budget"];

    function setEditing(state) {
        editing = state;
        fields.forEach((id) => {
            document.getElementById(id).disabled = !state;
        });
        settingsActions.style.display = state ? "flex" : "none";
        editToggleBtn.style.display   = state ? "none" : "block";
    }

    editToggleBtn.addEventListener("click", () => setEditing(true));

    document.getElementById("cancel-settings-btn").addEventListener("click", () => {
        setEditing(false);
        loadProfile();
    });

    // ── Save settings ──
    document.getElementById("save-settings-btn").addEventListener("click", async () => {
        const name     = document.getElementById("setting-name").value.trim();
        const username = document.getElementById("setting-username").value.trim().toLowerCase();
        const password = document.getElementById("setting-password").value.trim();
        const currency = document.getElementById("setting-currency").value;
        const salary   = parseFloat(document.getElementById("setting-salary").value) || 0;
        const budget   = parseFloat(document.getElementById("setting-budget").value) || 0;

        if (!name || !username || !password) return;

        const res = await api("update_user.php", "POST", { name, username, password, currency, salary, budget });

        if (res.ok) {
            // Update local user object so the page reflects changes immediately
            user.name     = name;
            user.username = username;
            user.password = password;
            user.currency = currency;
            user.salary   = salary;
            user.budget   = budget;

            setEditing(false);
            await loadProfile();
        } else {
            const data = await res.json();
            alert(data.error || "Failed to save settings.");
        }
    });

    await loadProfile();
});
