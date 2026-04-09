document.addEventListener("DOMContentLoaded", async () => {

    const user = await requireLogin();
    if (!user) return;

    const receiptsBody     = document.getElementById("receipts-body");
    const selectAll        = document.getElementById("select-all");
    const deleteSelectedBtn = document.getElementById("delete-selected-btn");
    const modalOverlay     = document.getElementById("modal-overlay");
    const modalClose       = document.getElementById("modal-close");
    const modalEditBtn     = document.getElementById("modal-edit-btn");
    const modalDeleteBtn   = document.getElementById("modal-delete-btn");

    let receipts = [];
    let currentReceiptId = null;

    // ── Fetch receipts from API ──
    async function loadReceipts() {
        const res = await api("get_receipts.php");
        receipts = await res.json();
        renderReceipts();
    }

    // ── Render Table ──
    function renderReceipts() {
        receiptsBody.innerHTML = "";

        receipts.forEach((receipt) => {
            const tr = document.createElement("tr");
            tr.dataset.id = receipt.id;

            tr.innerHTML = `
                <td><input type="checkbox" class="row-checkbox"></td>
                <td>${receipt.merchant}</td>
                <td>${receipt.category}</td>
                <td>${parseFloat(receipt.total).toFixed(2)} ${receipt.currency}</td>
                <td>${formatDate(receipt.date)}</td>
            `;

            tr.addEventListener("click", (e) => {
                if (e.target.type === "checkbox") return;
                openModal(receipt.id);
            });

            tr.querySelector(".row-checkbox").addEventListener("change", () => {
                updateDeleteBtn();
                updateSelectAll();
            });

            receiptsBody.appendChild(tr);
        });

        updateDeleteBtn();
        updateSelectAll();
    }

    // ── Helpers ──
    function formatDate(dateStr) {
        const [year, month, day] = dateStr.split("-");
        return `${day}/${month}/${year}`;
    }

    function getCheckedIds() {
        return [...document.querySelectorAll(".row-checkbox:checked")]
            .map((cb) => parseInt(cb.closest("tr").dataset.id));
    }

    function updateDeleteBtn() {
        deleteSelectedBtn.disabled = getCheckedIds().length === 0;
    }

    function updateSelectAll() {
        const all     = document.querySelectorAll(".row-checkbox");
        const checked = document.querySelectorAll(".row-checkbox:checked");
        selectAll.checked = all.length > 0 && all.length === checked.length;
    }

    // ── Select All ──
    selectAll.addEventListener("change", () => {
        document.querySelectorAll(".row-checkbox").forEach((cb) => {
            cb.checked = selectAll.checked;
        });
        updateDeleteBtn();
    });

    // ── Bulk Delete ──
    deleteSelectedBtn.addEventListener("click", async () => {
        const ids = getCheckedIds();
        await Promise.all(ids.map((id) => api("delete_receipt.php", "POST", { id })));
        await loadReceipts();
    });

    // ── Modal ──
    function openModal(id) {
        const receipt = receipts.find((r) => r.id === id);
        if (!receipt) return;

        currentReceiptId = id;

        document.getElementById("modal-merchant").textContent = receipt.merchant;
        document.getElementById("modal-date").textContent     = formatDate(receipt.date);
        document.getElementById("modal-payment").textContent  = receipt.paymentMethod;
        document.getElementById("modal-currency").textContent = receipt.currency;
        document.getElementById("modal-category").textContent = receipt.category;
        document.getElementById("modal-total").textContent    = `${parseFloat(receipt.total).toFixed(2)} ${receipt.currency}`;

        const modalItemsBody = document.getElementById("modal-items-body");
        modalItemsBody.innerHTML = "";

        receipt.items.forEach((item) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>${parseFloat(item.price).toFixed(2)}</td>
                <td>${(item.qty * item.price).toFixed(2)}</td>
            `;
            modalItemsBody.appendChild(tr);
        });

        modalOverlay.classList.add("active");
    }

    function closeModal() {
        modalOverlay.classList.remove("active");
        currentReceiptId = null;
    }

    modalClose.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // ── Modal Delete ──
    modalDeleteBtn.addEventListener("click", async () => {
        await api("delete_receipt.php", "POST", { id: currentReceiptId });
        closeModal();
        await loadReceipts();
    });

    // ── Modal Edit ──
    modalEditBtn.addEventListener("click", () => {
        window.location.href = `add-receipt.html?edit=${currentReceiptId}`;
    });

    await loadReceipts();
});
