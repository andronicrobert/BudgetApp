// ── API helper ──
async function api(endpoint, method = "GET", body = null) {
    const options = {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin"
    };
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(`api/${endpoint}`, options);
    return res;
}

// ── Auth helpers ──
async function requireLogin() {
    const res = await api("get_user.php");
    if (!res.ok) {
        window.location.href = "login.html";
        return null;
    }
    return await res.json();
}

async function requireGuest() {
    const res = await api("get_user.php");
    if (res.ok) {
        window.location.href = "index.html";
    }
}

async function logout() {
    await api("logout.php", "POST");
    window.location.href = "login.html";
}
