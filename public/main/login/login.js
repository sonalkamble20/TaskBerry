document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login").addEventListener('submit', function(event) {
        event.preventDefault();

        const userName = document.getElementById("uname").value;
        const password = document.getElementById("password").value;

        const user = {
            username: userName,
            password: password
        };

        console.log("User logging in: ", user);

        fetch('http://localhost:3000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);  // e.g. "Invalid username or password"
            } else {
                console.log("Login successful:", data);

                // ✅ Save the user ID returned from backend
                localStorage.setItem("userId", data.UserID);
                localStorage.setItem("user", JSON.stringify(data)); // optional

                // ✅ Redirect to post.html
                window.location.href = "../../main/job/post.html";
            }
        })
        .catch(error => console.log("Error:", error));
    });
});
