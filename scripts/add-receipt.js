function populateSelect(selectElement) {
    const user = getLoggedInUser();
    const userCategories = categories.filter((c) => c.userId === user.id);
    userCategories.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.name;
        option.textContent = cat.name;
        selectElement.appendChild(option);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    populateSelect(document.getElementById("category"));
    populateSelect(document.getElementById("category1"));

    const addItemBtn = document.getElementById("add-item-btn");
    const itemsBody = document.getElementById("items-body");

    addItemBtn.addEventListener("click", (e) => {
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
        populateSelect(row.querySelector("select"));
    });

    itemsBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item")) {
            e.target.closest("tr").remove();
        }
    });
});