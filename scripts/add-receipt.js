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

    await populateSelect(document.getElementById("category"));
    await populateSelect(document.getElementById("category1"));

    const addItemBtn = document.getElementById("add-item-btn");
    const itemsBody  = document.getElementById("items-body");
    const form       = document.getElementById("receipt-form");

    // ── Add item row ──
    addItemBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text"></td>
            <td><input type="number" value="1"></td>
            <td><input type="number" step="0.01"></td>
            <td><select></select></td>
            <td><button class="remove-item">✖</button></td>
        `;

        itemsBody.appendChild(row);
        await populateSelect(row.querySelector("select"));
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

        let category, total, items;

        if (formType === "auto") {
            category = document.getElementById("category").value;
            total    = parseFloat(document.getElementById("total").value) || 0;
            items    = [{ name: "Total", qty: 1, price: total }];
        } else {
            // Collect items from table rows
            const rows = itemsBody.querySelectorAll("tr");
            items = [...rows].map((row) => {
                const inputs  = row.querySelectorAll("input");
                const select  = row.querySelector("select");
                return {
                    name:  inputs[0].value.trim(),
                    qty:   parseInt(inputs[1].value) || 1,
                    price: parseFloat(inputs[2].value) || 0,
                };
            }).filter((item) => item.name);

            category = items.length > 0
                ? itemsBody.querySelector("tr select").value
                : "";
            total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
        }

        const res = await api("add_receipt.php", "POST", {
            merchant,
            date,
            category,
            paymentMethod: payment,
            currency,
            total,
            items
        });

        if (res.ok) {
            window.location.href = "receipts.html";
        } else {
            const data = await res.json();
            alert(data.error || "Failed to save receipt.");
        }
    });
});
