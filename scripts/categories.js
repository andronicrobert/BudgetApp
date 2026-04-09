document.addEventListener("DOMContentLoaded", async () => {

    const user = await requireLogin();
    if (!user) return;

    const categoriesBody = document.getElementById("categories-body");
    const addCategoryBtn = document.getElementById("add-category-btn");
    const modalOverlay   = document.getElementById("modal-overlay");
    const modalClose     = document.getElementById("modal-close");
    const modalTitle     = document.getElementById("modal-title");
    const modalName      = document.getElementById("modal-name");
    const modalType      = document.getElementById("modal-type");
    const modalSaveBtn   = document.getElementById("modal-save-btn");

    let categories = [];
    let receipts   = [];
    let editingId  = null;
    let editingOldName = null;

    // ── Fetch data ──
    async function loadData() {
        const [catRes, recRes] = await Promise.all([
            api("get_categories.php"),
            api("get_receipts.php")
        ]);
        categories = await catRes.json();
        receipts   = await recRes.json();
        renderCategories();
    }

    // ── Get total spent for a category ──
    function getCategoryTotal(name) {
        return receipts
            .filter((r) => r.category === name)
            .reduce((sum, r) => sum + parseFloat(r.total), 0);
    }

    // ── Update summary cards ──
    function updateSummary() {
        const needs = categories.filter((c) => c.type === "Need");
        const wants = categories.filter((c) => c.type === "Want");

        const needsTotal = needs.reduce((sum, c) => sum + getCategoryTotal(c.name), 0);
        const wantsTotal = wants.reduce((sum, c) => sum + getCategoryTotal(c.name), 0);

        document.getElementById("needs-total").textContent  = `${needsTotal.toFixed(2)} ${user.currency}`;
        document.getElementById("needs-count").textContent  = `${needs.length} ${needs.length === 1 ? "category" : "categories"}`;
        document.getElementById("wants-total").textContent  = `${wantsTotal.toFixed(2)} ${user.currency}`;
        document.getElementById("wants-count").textContent  = `${wants.length} ${wants.length === 1 ? "category" : "categories"}`;
    }

    // ── Render Table ──
    function renderCategories() {
        categoriesBody.innerHTML = "";

        categories.forEach((cat) => {
            const total = getCategoryTotal(cat.name);
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${cat.name}</td>
                <td><span class="badge ${cat.type.toLowerCase()}">${cat.type}</span></td>
                <td>${total.toFixed(2)} ${user.currency}</td>
                <td>
                    <button class="action-btn rename-btn" data-id="${cat.id}" data-name="${cat.name}">Rename</button>
                    <button class="action-btn delete-cat-btn" data-id="${cat.id}">Delete</button>
                </td>
            `;

            categoriesBody.appendChild(tr);
        });

        updateSummary();
        attachRowListeners();
    }

    // ── Row listeners ──
    function attachRowListeners() {
        document.querySelectorAll(".rename-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id   = parseInt(btn.dataset.id);
                const name = btn.dataset.name;
                const cat  = categories.find((c) => c.id === id);
                if (!cat) return;
                openModal("rename", cat);
            });
        });

        document.querySelectorAll(".delete-cat-btn").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const id = parseInt(btn.dataset.id);
                await api("delete_category.php", "POST", { id });
                await loadData();
            });
        });
    }

    // ── Modal ──
    function openModal(mode, cat = null) {
        modalName.value        = cat ? cat.name : "";
        modalType.value        = cat ? cat.type : "Need";
        modalTitle.textContent = mode === "add" ? "Add Category" : "Rename Category";
        editingId              = cat ? cat.id : null;
        editingOldName         = cat ? cat.name : null;
        modalOverlay.classList.add("active");
        modalName.focus();
    }

    function closeModal() {
        modalOverlay.classList.remove("active");
        editingId      = null;
        editingOldName = null;
    }

    addCategoryBtn.addEventListener("click", () => openModal("add"));
    modalClose.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // ── Save ──
    modalSaveBtn.addEventListener("click", async () => {
        const name = modalName.value.trim();
        const type = modalType.value;

        if (!name) {
            modalName.style.borderColor = "#e74c3c";
            return;
        }
        modalName.style.borderColor = "";

        if (editingId !== null) {
            await api("update_category.php", "POST", {
                id: editingId,
                name,
                type,
                oldName: editingOldName
            });
        } else {
            await api("add_category.php", "POST", { name, type });
        }

        closeModal();
        await loadData();
    });

    modalName.addEventListener("keydown", (e) => {
        if (e.key === "Enter") modalSaveBtn.click();
    });

    await loadData();
});
