document.addEventListener("DOMContentLoaded", () => {

    const addItemBtn = document.getElementById("add-item-btn");
    const itemsBody = document.getElementById("items-body");

    console.log(itemsBody); // debug

    addItemBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const row = document.createElement("tr");

        row.innerHTML = `
            <td><input type="text"></td>
            <td><input type="number" value="1"></td>
            <td><input type="number" step="0.01"></td>
            <td><select><option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="take-out">Take-out</option></select></td>
            <td><button class="remove-item">✖</button></td>
        `;

        itemsBody.appendChild(row);
        
    });
    itemsBody.addEventListener("click", (e) => {

        if(e.target.classList.contains("remove-item")){
            e.target.closest("tr").remove();
        }
    
    });
});
