document.addEventListener("DOMContentLoaded", () => {

    const user = getLoggedInUser();

    const categoriesBody = document.getElementById("categories-body");
    const addCategoryBtn = document.getElementById("add-category-btn");
    const modalOverlay = document.getElementById("modal-overlay");
    const modalClose = document.getElementById("modal-close");
    const modalTitle = document.getElementById("modal-title");
    const modalName = document.getElementById("modal-name");
    const modalType = document.getElementById("modal-type");
    const modalSaveBtn = document.getElementById("modal-save-btn");

    let editingId = null;

    function getUserCategories() {
        return categories.filter((c) => c.userId === user.id);
    }

    function getCategoryTotal(name) {
        return receipts
            .filter((r) => r.userId === user.id && r.category === name)
            .reduce((sum, r) => sum + r.total, 0);
    }

    function updateSummary() {
        const userCats = getUserCategories();
        const needs = userCats.filter((c) => c.type === "Need");
        const wants = userCats.filter((c) => c.type === "Want");

        const needsTotal = needs.reduce((sum, c) => sum + getCategoryTotal(c.name), 0);
        const wantsTotal = wants.reduce((sum, c) => sum + getCategoryTotal(c.name), 0);

        document.getElementById("needs-total").textContent = `${needsTotal.toFixed(2)} ${user.currency}`;
        document.getElementById("needs-count").textContent = `${needs.length} ${needs.length === 1 ? "category" : "categories"}`;
        document.getElementById("wants-total").textContent = `${wantsTotal.toFixed(2)} ${user.currency}`;
        document.getElementById("wants-count").textContent = `${wants.length} ${wants.length === 1 ? "category" : "categories"}`;
    }

    function renderCategories() {
        categoriesBody.innerHTML = "";

        getUserCategories().forEach((cat) => {
            const total = getCategoryTotal(cat.name);
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${cat.name}</td>
                <td><span class="badge ${cat.type.toLowerCase()}">${cat.type}</span></td>
                <td>${total.toFixed(2)} ${user.currency}</td>
                <td>
                    <button class="action-btn rename-btn" data-id="${cat.id}">Rename</button>
                    <button class="action-btn delete-cat-btn" data-id="${cat.id}">Delete</button>
                </td>
            `;

            categoriesBody.appendChild(tr);
        });

        updateSummary();
        attachRowListeners();
    }

    function attachRowListeners() {
        document.querySelectorAll(".rename-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.dataset.id);
                const cat = categories.find((c) => c.id === id);
                if (!cat) return;
                openModal("rename", cat);
            });
        });

        document.querySelectorAll(".delete-cat-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.dataset.id);
                const index = categories.findIndex((c) => c.id === id);
                if (index !== -1) categories.splice(index, 1);
                renderCategories();
            });
        });
    }

    function openModal(mode, cat = null) {
        modalName.value = cat ? cat.name : "";
        modalType.value = cat ? cat.type : "Need";
        modalTitle.textContent = mode === "add" ? "Add Category" : "Rename Category";
        editingId = cat ? cat.id : null;
        modalOverlay.classList.add("active");
        modalName.focus();
    }

    function closeModal() {
        modalOverlay.classList.remove("active");
        editingId = null;
    }

    addCategoryBtn.addEventListener("click", () => openModal("add"));
    modalClose.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    modalSaveBtn.addEventListener("click", () => {
        const name = modalName.value.trim();
        const type = modalType.value;

        if (!name) {
            modalName.style.borderColor = "#e74c3c";
            return;
        }
        modalName.style.borderColor = "";

        if (editingId !== null) {
            const cat = categories.find((c) => c.id === editingId);
            if (cat) {
                const oldName = cat.name;
                cat.name = name;
                cat.type = type;
                receipts.forEach((r) => {
                    if (r.userId === user.id && r.category === oldName) r.category = name;
                });
            }
        } else {
            const newId = categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
            categories.push({ id: newId, userId: user.id, name, type });
        }

        closeModal();
        renderCategories();
    });

    modalName.addEventListener("keydown", (e) => {
        if (e.key === "Enter") modalSaveBtn.click();
    });

    renderCategories();
}); 