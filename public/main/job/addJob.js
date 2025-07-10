document.addEventListener("DOMContentLoaded", function () {
  const userId = localStorage.getItem("userId");
  let editingJobId = null;

  if (!userId) {
    alert("User not logged in. Please log in first.");
    window.location.href = "../login/login.html";
    return;
  }

  fetch(`http://localhost:3000/job/${userId}`)
    .then(response => response.json())
    .then(data => {
      if (data && Array.isArray(data)) {
        displayJobs(data);
      }
    })
    .catch(error => {
      console.error("Error loading jobs:", error);
      alert("Failed to load jobs.");
    });

  document.getElementById("post").addEventListener("submit", function (event) {
    event.preventDefault();

    const jobname = document.getElementById("jobname").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!jobname) {
      alert("Please enter a job name.");
      return;
    }

    const job = {
      jobname,
      description,
      userId
    };

    const method = editingJobId ? "PUT" : "POST";
    const url = editingJobId
      ? `http://localhost:3000/job/${editingJobId}`
      : "http://localhost:3000/job";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(job)
    })
      .then(response => response.json())
      .then(data => {
        alert(editingJobId ? "Job updated!" : "Job posted!");
        location.reload();
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Something went wrong.");
      });

    editingJobId = null;
  });

  function displayJobs(jobs) {
    const jobsContainer = document.querySelector("#jobList");
    jobsContainer.innerHTML = "";

    jobs.forEach(job => {
      const jobRow = document.createElement("tr");
      jobRow.classList.add("job-row");

      const jobIdCell = document.createElement("td");
      jobIdCell.classList.add("job-cell");
      jobIdCell.textContent = job.JobID;

      const jobNameCell = document.createElement("td");
      jobNameCell.classList.add("job-cell");
      jobNameCell.textContent = job.Jobname;

      const jobDescCell = document.createElement("td");
      jobDescCell.classList.add("job-cell");
      jobDescCell.textContent = job.Description;

      const actionCell = document.createElement("td");

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => populateForm(job);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => deleteJob(job.JobID);

      actionCell.appendChild(editBtn);
      actionCell.appendChild(deleteBtn);

      jobRow.appendChild(jobIdCell);
      jobRow.appendChild(jobNameCell);
      jobRow.appendChild(jobDescCell);
      jobRow.appendChild(actionCell);

      jobsContainer.appendChild(jobRow);
    });
  }

  function populateForm(job) {
    document.getElementById("jobname").value = job.Jobname;
    document.getElementById("description").value = job.Description;
    editingJobId = job.JobID;
  }

  function deleteJob(jobId) {
    if (!confirm("Are you sure you want to delete this job?")) return;

    fetch(`http://localhost:3000/job/${jobId}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => {
        alert("Job deleted.");
        location.reload();
      })
      .catch(err => {
        console.error("Delete error:", err);
        alert("Failed to delete.");
      });
  }
});
