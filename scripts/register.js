document.addEventListener("DOMContentLoaded", async () => {

    // Redirect to dashboard if already logged in
    await requireGuest();

    const form = document.getElementById("register-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const name = document.getElementById("name").value;
        const currency = document.getElementById("currency").value;

        const res = await api("login.php", "POST", { username, password });

        if (res.ok) {
            window.location.href = "index.html";
        } else {
            const data = await res.json();
            errorMsg.textContent = data.error || "Invalid username or password.";
            errorMsg.style.display = "block";
        }
    });
});
