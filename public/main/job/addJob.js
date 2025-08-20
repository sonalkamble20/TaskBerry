// public/main/add job/addJob.js
document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  if (!userId || userId === "undefined" || userId === "null") {
    window.location.href = "../login/login.html";
    return;
  }

  const welcomeEl = document.getElementById("welcomeUser");
  const logoutBtn = document.getElementById("logoutBtn");
  const jobForm = document.getElementById("jobForm");
  const jobNameInput = document.getElementById("jobname");
  const descInput = document.getElementById("description");
  const tbody = document.getElementById("jobList");
  const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");

  if (welcomeEl && username) welcomeEl.textContent = `Welcome, ${username}`;
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      window.location.href = "../login/login.html";
    });
  }

  const selected = new Set();

  const STATUS_META = {
    red:    { label: "Not started yet! 😞", emoji: "💤" },
    yellow: { label: "In progress... 🤕",     emoji: "⏳" },
    green:  { label: "Completed! 😄",       emoji: "✅" }
  };

  const statusKey = () => `taskberryStatus_${userId}`;
  const getStatusMap = () => {
    try { return JSON.parse(localStorage.getItem(statusKey())) || {}; }
    catch { return {}; }
  };
  const saveStatusMap = (map) => localStorage.setItem(statusKey(), JSON.stringify(map));
  const setJobStatus = (jobId, status) => {
    const map = getStatusMap();
    map[jobId] = status;
    saveStatusMap(map);
  };
  const getJobStatus = (jobId) => {
    const map = getStatusMap();
    return map[jobId] || null;
  };

  const escapeHTML = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  function updateBulkDeleteState() {
    if (!deleteSelectedBtn) return;
    deleteSelectedBtn.disabled = selected.size === 0;
  }

  async function addJob(jobname, description) {
    try {
      const res = await fetch("http://localhost:3000/job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobname, description, userId })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.message || `Failed to add job (${res.status}).`);
        return;
      }
      if (data && data.JobID != null) {
        setJobStatus(String(data.JobID), "red"); // default new task → red
      }
    } catch (err) {
      console.error("Add Job error:", err);
      alert("Error adding job. Please try again.");
    }
  }

  async function loadJobs() {
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="5">Loading jobs…</td></tr>`;
    try {
      const res = await fetch(`http://localhost:3000/job/${userId}`);
      if (!res.ok) {
        const text = await res.text();
        console.error("Jobs load failed:", res.status, text);
        tbody.innerHTML = `<tr><td colspan="5">Failed to load jobs (${res.status}).</td></tr>`;
        return;
      }
      const data = await res.json();
      if (Array.isArray(data) && data.length) {
        displayJobs(data);
      } else {
        tbody.innerHTML = `<tr><td colspan="5">No jobs found.</td></tr>`;
      }
    } catch (err) {
      console.error("Error loading jobs:", err);
      tbody.innerHTML = `<tr><td colspan="5">Failed to load jobs.</td></tr>`;
    }
  }

  function renderStatusBlock(jobId) {
    const current = getJobStatus(String(jobId));
    const active = (s) => (current === s ? " active" : "");
    return `
      <div class="status-wrap" data-id="${jobId}">
        <div class="status-dots">
          <button type="button" class="status-dot red${active("red")}" data-status="red" title="Not started"></button>
          <button type="button" class="status-dot yellow${active("yellow")}" data-status="yellow" title="In progress"></button>
          <button type="button" class="status-dot green${active("green")}" data-status="green" title="Completed"></button>
        </div>
        <div class="status-label"></div>
      </div>
    `;
  }

  function applyStatusUI(jobId, wrap) {
    const current = getJobStatus(String(jobId)) || "red";
    wrap.querySelectorAll(".status-dot").forEach(d => d.classList.remove("active"));
    const dot = wrap.querySelector(`.status-dot.${current}`);
    if (dot) dot.classList.add("active");
    const { label, emoji } = STATUS_META[current];
    const labelEl = wrap.querySelector(".status-label");
    if (labelEl) labelEl.textContent = `${emoji} ${label}`;
  }

  function displayJobs(jobs) {
    if (!tbody) return;
    selected.clear();
    updateBulkDeleteState();
    tbody.innerHTML = "";

    jobs.forEach((job) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="col-select"><input type="checkbox" class="row-select" data-id="${job.JobID}"/></td>
        <td class="col-id">${job.JobID}</td>
        <td class="col-name">${escapeHTML(job.Jobname)}</td>
        <td class="col-desc">${escapeHTML(job.Description)}</td>
        <td class="col-status">${renderStatusBlock(job.JobID)}</td>
      `;
      tbody.appendChild(tr);

      const wrap = tr.querySelector(".status-wrap");
      if (wrap) applyStatusUI(job.JobID, wrap);
    });
  }

  tbody.addEventListener("change", (e) => {
    const cb = e.target.closest(".row-select");
    if (!cb) return;
    const id = cb.getAttribute("data-id");
    if (cb.checked) selected.add(id);
    else selected.delete(id);
    updateBulkDeleteState();
  });

  tbody.addEventListener("click", (e) => {
    const dot = e.target.closest(".status-dot");
    if (!dot) return;
    const wrap = dot.closest(".status-wrap");
    const jobId = wrap?.getAttribute("data-id");
    const status = dot.getAttribute("data-status");
    if (!jobId || !status) return;
    setJobStatus(String(jobId), status);
    applyStatusUI(jobId, wrap);
  });

  deleteSelectedBtn?.addEventListener("click", async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected job(s)?`)) return;
    try {
      await Promise.all([...selected].map(id =>
        fetch(`http://localhost:3000/job/${id}`, { method: "DELETE" })
      ));
      selected.clear();
      updateBulkDeleteState();
      await loadJobs();
    } catch (err) {
      console.error("Bulk delete error:", err);
      alert("Failed to delete one or more jobs.");
    }
  });

  if (jobForm) {
    jobForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const jobname = (jobNameInput?.value || "").trim();
      const description = (descInput?.value || "").trim();
      if (!jobname) {
        alert("Please enter a job name.");
        return;
      }
      await addJob(jobname, description);
      jobForm.reset();
      await loadJobs();
    });
  }

  loadJobs();
});
