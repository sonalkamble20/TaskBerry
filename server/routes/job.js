const express = require("express");
const Job = require("../models/job");
const router = express.Router();

// list jobs for a user
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ message: "User ID is required" });
    const jobs = await Job.getAllJobsByUser(userId);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// add a job
router.post("/", async (req, res) => {
  try {
    const { jobname, description, userId } = req.body;
    if (!jobname || !userId) {
      return res.status(400).json({ message: "Job name and user ID are required" });
    }
    const newJob = await Job.addJob({ jobname, description, userId });
    res.status(201).json(newJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error, could not add job" });
  }
});

// update a job
router.put("/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const { jobname, description } = req.body;
    const updated = await Job.updateJob(jobId, jobname, description);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update job" });
  }
});

// delete a job
router.delete("/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    await Job.deleteJob(jobId);
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete job" });
  }
});

module.exports = router;
