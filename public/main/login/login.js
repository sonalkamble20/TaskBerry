document.getElementById("login").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("uname").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    const id = data?.UserID ?? data?.userid ?? data?.id;
    const name = data?.Username ?? data?.username ?? data?.name ?? username;

    if (res.ok && id) {
      localStorage.setItem("userId", String(id));
      localStorage.setItem("username", String(name));
      window.location.href = "../job/post.html";  // from /main/login/ -> /main/job/
    } else {
      alert(data?.message || "Login failed. Please try again.");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("An error occurred while logging in. Please try again.");
  }
});
