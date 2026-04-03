
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
    return document.cookie.split("; ").reduce((acc, part) => {
        const [key, val] = part.split("=");
        return key === name ? decodeURIComponent(val) : acc;
    }, null);
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// ── Auth helpers ──

function getLoggedInUser() {
    const username = getCookie("loggedInUser");
    if (!username) return null;
    return users.find((u) => u.username === username) || null;
}

function logout() {
    deleteCookie("loggedInUser");
    window.location.href = "login.html";
}


function requireLogin() {
    if (!getLoggedInUser()) {
        window.location.href = "login.html";
    }
}

function requireGuest() {
    if (getLoggedInUser()) {
        window.location.href = "index.html";
    }
}