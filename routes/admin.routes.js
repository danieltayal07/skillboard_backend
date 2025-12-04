const express = require("express");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");
const {
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJobAdmin
} = require("../controllers/admin.controller");

const router = express.Router();

router.get("/admin/users", auth, requireRole("admin"), getAllUsers);
router.get("/admin/jobs", auth, requireRole("admin"), getAllJobs);

router.delete("/admin/users/:id", auth, requireRole("admin"), deleteUser);
router.delete("/admin/jobs/:id", auth, requireRole("admin"), deleteJobAdmin);

module.exports = router;
