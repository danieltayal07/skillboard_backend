const prisma = require("../config/prisma");

// --------------------------------------------------
// GET ALL USERS
// --------------------------------------------------
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.json({ users });
  } catch (err) {
    console.error("Admin get users error:", err);
    res.status(500).json({ error: "Cannot fetch users" });
  }
};

// --------------------------------------------------
// DELETE USER (Admin only)
// --------------------------------------------------
const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Cascade delete apps & jobs
    await prisma.application.deleteMany({ where: { userId: id } });
    await prisma.job.deleteMany({ where: { employerId: id } });

    await prisma.user.delete({ where: { id } });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Admin delete user error:", err);
    res.status(500).json({ error: "Cannot delete user" });
  }
};

// --------------------------------------------------
// GET ALL JOBS
// --------------------------------------------------
const getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        employer: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ jobs });
  } catch (err) {
    console.error("Admin get jobs error:", err);
    res.status(500).json({ error: "Cannot fetch jobs" });
  }
};

// --------------------------------------------------
// DELETE ANY JOB (Admin only)
// --------------------------------------------------
const deleteJobAdmin = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return res.status(404).json({ error: "Job not found" });

    // Delete applications related to job
    await prisma.application.deleteMany({ where: { jobId: id } });

    await prisma.job.delete({ where: { id } });

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Admin delete job error:", err);
    res.status(500).json({ error: "Cannot delete job" });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJobAdmin
};
