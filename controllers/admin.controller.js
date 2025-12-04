const prisma = require("../config/prisma");

const getAllUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        },
        skip,
        take: limit
      }),
      prisma.user.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({ page, limit, total, totalPages, users });

  } catch (err) {
    console.error("Admin get users error:", err);
    res.status(500).json({ error: "Cannot fetch users" });
  }
};

// DELETE FUNCTIONALITY - ADMIN CAN DELETE ANY USER
const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    await prisma.application.deleteMany({ where: { userId: id } });
    await prisma.job.deleteMany({ where: { employerId: id } });

    await prisma.user.delete({ where: { id } });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Admin delete user error:", err);
    res.status(500).json({ error: "Cannot delete user" });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        include: {
          employer: { select: { name: true } }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.job.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({ page, limit, total, totalPages, jobs });

  } catch (err) {
    console.error("Admin get jobs error:", err);
    res.status(500).json({ error: "Cannot fetch jobs" });
  }
};

// DELETE FUNCTIONALITY  - ADMIN CAN DELETE ANY JOB LISTED
const deleteJobAdmin = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return res.status(404).json({ error: "Job not found" });

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
