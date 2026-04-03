const select = document.getElementById("form-type");

const autoFields = document.querySelector(".form-auto");
const manualFields = document.querySelector(".form-manual");

function updateForm() {

    autoFields.style.display = "none";
    manualFields.style.display = "none";

    if(select.value === "manual"){
        manualFields.style.display = "block";
    }
    else if(select.value === "auto"){
        autoFields.style.display = "block";
    }
}

updateForm();

select.addEventListener("change", updateForm);