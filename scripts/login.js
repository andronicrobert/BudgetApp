requireGuest();

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("login-form");
    const errorMsg = document.getElementById("login-error");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        const user = users.find((u) => u.username === username && u.password === password);

        if (user) {
            setCookie("loggedInUser", user.username, 7); 
            window.location.href = "index.html";
        } else {
            errorMsg.textContent = "Invalid username or password.";
            errorMsg.style.display = "block";
        }
    });
});