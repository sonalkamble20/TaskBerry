const express = require("express");
const Job = require("../models/job");
const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const jobs = await Job.getAllJobsByUser(userId);
    res.send(jobs);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

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
