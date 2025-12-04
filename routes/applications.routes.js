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

router.post("/jobs/:id/applications", auth, requireRole("applicant"), applyJob);
router.get("/employer/applications", auth, requireRole("employer"), getEmployerApplications);
router.get("/applications/my", auth, requireRole("applicant"), getMyApplications);
router.put("/applications/:id/status", auth, updateStatus);

module.exports = router;
