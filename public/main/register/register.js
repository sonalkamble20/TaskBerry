document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("register");
  if (!form) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Username: username, Password: password })
      });

      const data = await res.json();

      const id = data?.UserID ?? data?.userid ?? data?.id;
      const name = data?.Username ?? data?.username ?? data?.name ?? username;

      if (res.ok && id) {
        localStorage.setItem("userId", String(id));
        localStorage.setItem("username", String(name));

        window.location.href = "../job/post.html";
      } else {
        alert(data?.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Something went wrong. Try again.");
    }
  });
});
