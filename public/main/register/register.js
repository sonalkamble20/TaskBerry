document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("register").addEventListener("submit", function (event) {
      event.preventDefault();
  
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
  
      fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Username: username, Password: password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.UserID) {
          alert("Registration successful!");
          window.location.href = "../login/login.html";
        } else {
          alert("Registration failed: " + data.message);
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Something went wrong. Try again.");
      });
    });
  });
  