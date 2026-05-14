async function populateSelect(selectElement) {
    const res = await api("get_categories.php");
    const categories = await res.json();
    categories.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.name;
        option.textContent = cat.name;
        selectElement.appendChild(option);
    });
}

document.addEventListener("DOMContentLoaded", async () => {

    const user = await requireLogin();
    if (!user) return;

    const addItemBtn = document.getElementById("add-item-btn");
    const itemsBody  = document.getElementById("items-body");
    const form       = document.getElementById("receipt-form");
    const urlParams = new URLSearchParams(window.location.search);
    const receiptId = urlParams.get('edit');
    const isEditMode = receiptId !== null;

    if (isEditMode) {
        document.querySelector('h2').textContent = 'Edit Receipt';
        document.querySelector('.submit-button').textContent = 'Update Receipt';

        // Fetch all data needed for pre-population
        const [receiptsRes] = await Promise.all([
            api("get_receipts.php"),
            populateSelect(document.getElementById("category"))
        ]);

        const receipts = await receiptsRes.json();
        const receiptToEdit = receipts.find(r => r.id === parseInt(receiptId));

        if (receiptToEdit) {
            // Pre-fill form fields
            document.getElementById("merchant").value = receiptToEdit.merchant;
            document.getElementById("receipt-date").value = receiptToEdit.date;
            document.getElementById("payment").value = receiptToEdit.paymentMethod;
            document.getElementById("currency-receipt").value = receiptToEdit.currency;
            document.getElementById("category").value = receiptToEdit.category;

            const isAuto = receiptToEdit.items.length === 1 && receiptToEdit.items[0].name === 'Total';
            const formTypeSelect = document.getElementById("form-type");
            formTypeSelect.value = isAuto ? 'auto' : 'manual';
            formTypeSelect.dispatchEvent(new Event('change'));

            if (isAuto) {
                document.getElementById("total").value = receiptToEdit.total;
            } else {
                itemsBody.innerHTML = ''; // Clear default row
                receiptToEdit.items.forEach(item => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td><input type="text" value="${item.name}"></td>
                        <td><input type="number" value="${item.qty}"></td>
                        <td><input type="number" step="0.01" value="${item.price.toFixed(2)}"></td>
                        <td><button class="remove-item">✖</button></td>
                    `;
                    itemsBody.appendChild(row);
                });
            }
        }
    } else {
        await populateSelect(document.getElementById("category"));
    }

    // ── Add item row ──
    addItemBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text"></td>
            <td><input type="number" value="1"></td>
            <td><input type="number" step="0.01"></td>
            <td><button class="remove-item">✖</button></td>
        `;

        itemsBody.appendChild(row);
    });

    // ── Remove item row ──
    itemsBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item")) {
            e.target.closest("tr").remove();
        }
    });

    // ── Submit form ──
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formType = document.getElementById("form-type").value;
        const merchant = document.getElementById("merchant").value.trim();
        const date     = document.getElementById("receipt-date").value;
        const payment  = document.getElementById("payment").value;
        const currency = document.getElementById("currency-receipt").value;

        if (!merchant || !date) return;

        let total, items;
        const category = document.getElementById("category").value;
        if (!category) return alert("Please select a category.");

        if (formType === "auto") {
            total    = parseFloat(document.getElementById("total").value) || 0;
            items    = [{ name: "Total", qty: 1, price: total }];
        } else {
            // Collect items from table rows
            const rows = itemsBody.querySelectorAll("tr");
            items = [...rows].map((row) => {
                const inputs  = row.querySelectorAll("input");
                return {
                    name:  inputs[0].value.trim(),
                    qty:   parseInt(inputs[1].value) || 1,
                    price: parseFloat(inputs[2].value) || 0,
                };
            }).filter((item) => item.name);

            total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
        }

        const payload = {
            merchant,
            date,
            category,
            paymentMethod: payment,
            currency,
            total,
            items
        };

        let res;
        if (isEditMode) {
            payload.id = receiptId;
            res = await api("update_receipt.php", "POST", payload);
        } else {
            res = await api("add_receipt.php", "POST", payload);
        }

        if (res.ok) {
            window.location.href = "receipts.html";
        } else {
            const data = await res.json();
            alert(data.error || "Failed to save receipt.");
        }
    });
});
