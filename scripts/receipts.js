document.addEventListener("DOMContentLoaded", () => {

    const user = getLoggedInUser();

    const receiptsBody = document.getElementById("receipts-body");
    const selectAll = document.getElementById("select-all");
    const deleteSelectedBtn = document.getElementById("delete-selected-btn");
    const modalOverlay = document.getElementById("modal-overlay");
    const modalClose = document.getElementById("modal-close");
    const modalEditBtn = document.getElementById("modal-edit-btn");
    const modalDeleteBtn = document.getElementById("modal-delete-btn");

    let currentReceiptId = null;


    function getUserReceipts() {
        return receipts.filter((r) => r.userId === user.id);
    }


    function renderReceipts() {
        receiptsBody.innerHTML = "";

        getUserReceipts().forEach((receipt) => {
            const tr = document.createElement("tr");
            tr.dataset.id = receipt.id;

            tr.innerHTML = `
                <td><input type="checkbox" class="row-checkbox"></td>
                <td>${receipt.merchant}</td>
                <td>${receipt.category}</td>
                <td>${receipt.total.toFixed(2)} ${receipt.currency}</td>
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
        const all = document.querySelectorAll(".row-checkbox");
        const checked = document.querySelectorAll(".row-checkbox:checked");
        selectAll.checked = all.length > 0 && all.length === checked.length;
    }


    selectAll.addEventListener("change", () => {
        document.querySelectorAll(".row-checkbox").forEach((cb) => {
            cb.checked = selectAll.checked;
        });
        updateDeleteBtn();
    });


    deleteSelectedBtn.addEventListener("click", () => {
        const ids = getCheckedIds();
        ids.forEach((id) => {
            const index = receipts.findIndex((r) => r.id === id);
            if (index !== -1) receipts.splice(index, 1);
        });
        renderReceipts();
    });


    function openModal(id) {
        const receipt = receipts.find((r) => r.id === id);
        if (!receipt) return;

        currentReceiptId = id;

        document.getElementById("modal-merchant").textContent = receipt.merchant;
        document.getElementById("modal-date").textContent = formatDate(receipt.date);
        document.getElementById("modal-payment").textContent = receipt.paymentMethod;
        document.getElementById("modal-currency").textContent = receipt.currency;
        document.getElementById("modal-category").textContent = receipt.category;
        document.getElementById("modal-total").textContent = `${receipt.total.toFixed(2)} ${receipt.currency}`;

        const modalItemsBody = document.getElementById("modal-items-body");
        modalItemsBody.innerHTML = "";

        receipt.items.forEach((item) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>${item.price.toFixed(2)}</td>
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

    modalDeleteBtn.addEventListener("click", () => {
        const index = receipts.findIndex((r) => r.id === currentReceiptId);
        if (index !== -1) receipts.splice(index, 1);
        closeModal();
        renderReceipts();
    });

    modalEditBtn.addEventListener("click", () => {
        window.location.href = `add-receipt.html?edit=${currentReceiptId}`;
    });

    renderReceipts();
});