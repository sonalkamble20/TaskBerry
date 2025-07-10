document.getElementById("listUsers").addEventListener("click", function() {
    fetch("http://localhost:3000/user/getUsers")
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                displayUsers(data);
            } else {
                alert("No users found.");
            }
        })
        .catch(error => {
            console.error("Error fetching users:", error);
            alert("Failed to fetch users.");
        });
});

function displayUsers(users) {
    const usersContainer = document.getElementById("usersContainer");
    usersContainer.innerHTML = "";  // Clear the existing content

    users.forEach(user => {
        const userElement = document.createElement("div");
        userElement.classList.add("user");
        userElement.textContent = `User ID: ${user.UserID}, Username: ${user.Username}`;
        usersContainer.appendChild(userElement);
    });
}
