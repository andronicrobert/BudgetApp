requireLogin();

document.addEventListener("DOMContentLoaded", () => {
    const user = getLoggedInUser();
    const navUser = document.getElementById("nav-user");
    if (navUser && user) {
        navUser.textContent = user.name.split(" ")[0];
    }
});