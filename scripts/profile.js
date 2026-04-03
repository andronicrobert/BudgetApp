document.addEventListener("DOMContentLoaded", () => {

    let user = getLoggedInUser();
    let editing = false;


    function loadProfile() {
        user = getLoggedInUser();


        const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase();
        document.getElementById("profile-avatar").textContent = initials;
        document.getElementById("profile-name").textContent = user.name;
        document.getElementById("profile-username").textContent = `@${user.username}`;


        document.getElementById("setting-name").value = user.name;
        document.getElementById("setting-username").value = user.username;
        document.getElementById("setting-password").value = user.password;
        document.getElementById("setting-currency").value = user.currency;
        document.getElementById("setting-salary").value = user.salary;
        document.getElementById("setting-budget").value = user.budget;

        const userReceipts = receipts.filter((r) => r.userId === user.id);
        const totalSpent = userReceipts.reduce((sum, r) => sum + r.total, 0);
        const userCategories = categories.filter((c) => c.userId === user.id);

        let topCategory = "—";
        if (userReceipts.length > 0) {
            const totals = {};
            userReceipts.forEach((r) => {
                totals[r.category] = (totals[r.category] || 0) + r.total;
            });
            topCategory = Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
        }

        document.getElementById("stat-receipts").textContent = userReceipts.length;
        document.getElementById("stat-total").textContent = `${totalSpent.toFixed(2)} ${user.currency}`;
        document.getElementById("stat-top-category").textContent = topCategory;
        document.getElementById("stat-categories").textContent = userCategories.length;
    }

    // ── Edit toggle ──
    const editToggleBtn = document.getElementById("edit-toggle-btn");
    const settingsActions = document.getElementById("settings-actions");
    const fields = ["setting-name", "setting-username", "setting-password", "setting-currency", "setting-salary", "setting-budget"];

    function setEditing(state) {
        editing = state;
        fields.forEach((id) => {
            const el = document.getElementById(id);
            el.disabled = !state;
        });
        settingsActions.style.display = state ? "flex" : "none";
        editToggleBtn.style.display = state ? "none" : "block";
    }

    editToggleBtn.addEventListener("click", () => setEditing(true));

    document.getElementById("cancel-settings-btn").addEventListener("click", () => {
        setEditing(false);
        loadProfile(); 
    });

    document.getElementById("save-settings-btn").addEventListener("click", () => {
        const newName = document.getElementById("setting-name").value.trim();
        const newUsername = document.getElementById("setting-username").value.trim().toLowerCase();
        const newPassword = document.getElementById("setting-password").value.trim();
        const newCurrency = document.getElementById("setting-currency").value;
        const newSalary = parseFloat(document.getElementById("setting-salary").value) || 0;
        const newBudget = parseFloat(document.getElementById("setting-budget").value) || 0;

        if (!newName || !newUsername || !newPassword) return;

        const userIndex = users.findIndex((u) => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex].name = newName;
            users[userIndex].username = newUsername;
            users[userIndex].password = newPassword;
            users[userIndex].currency = newCurrency;
            users[userIndex].salary = newSalary;
            users[userIndex].budget = newBudget;

            setCookie("loggedInUser", newUsername, 7);
        }

        setEditing(false);
        loadProfile();
    });

    loadProfile();
});