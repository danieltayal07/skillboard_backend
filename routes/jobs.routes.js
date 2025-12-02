const express = require("express");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs
} = require("../controllers/jobs.controller");

const router = express.Router();

// Public routes
router.get("/jobs", getJobs);
router.get("/jobs/:id", getJobById);

// Employer-only routes
router.post("/jobs", auth, requireRole("employer"), createJob);
router.put("/jobs/:id", auth, requireRole("employer"), updateJob);
router.delete("/jobs/:id", auth, deleteJob);  

// Employer dashboard jobs
router.get("/employer/jobs", auth, requireRole("employer"), getEmployerJobs);

module.exports = router;
