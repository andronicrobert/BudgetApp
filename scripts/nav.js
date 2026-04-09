document.addEventListener("DOMContentLoaded", async () => {
    const user = await requireLogin();
    if (!user) return;

    // Store user globally for other scripts on the same page
    window.currentUser = user;

    const navUser = document.getElementById("nav-user");
    if (navUser) {
        navUser.textContent = user.name.split(" ")[0];
    }
});
