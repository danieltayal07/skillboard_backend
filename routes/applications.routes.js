const express = require("express");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");

const {
  applyJob,
  getEmployerApplications,
  getMyApplications,
  updateStatus
} = require("../controllers/applications.controller");

const router = express.Router();

// Apply to job (Applicant)
router.post("/jobs/:id/applications", auth, requireRole("applicant"), applyJob);

// Employer dashboard
router.get("/employer/applications", auth, requireRole("employer"), getEmployerApplications);

// Applicant dashboard
router.get("/applications/my", auth, requireRole("applicant"), getMyApplications);

// Update status (Employer or Admin)
router.put("/applications/:id/status", auth, updateStatus);

module.exports = router;
