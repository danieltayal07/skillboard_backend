const prisma = require("../config/prisma");

const getJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        employer: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        employer: { select: { name: true } }
      }
    });

    if (!job) return res.status(404).json({ error: "Job not found" });

    res.json({ job });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const createJob = async (req, res) => {
  try {
    const employerId = req.user.id;

    const job = await prisma.job.create({
      data: {
        ...req.body,
        employerId
      }
    });

    res.status(201).json({ job });
  } catch (err) {
    res.status(500).json({ error: "Cannot create job" });
  }
};

const updateJob = async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    const employerId = req.user.id;

    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) return res.status(404).json({ error: "Job not found" });

    if (job.employerId !== employerId)
      return res.status(403).json({ error: "Not authorized to update this job" });

    const updated = await prisma.job.update({
      where: { id: jobId },
      data: req.body
    });

    res.json({ updated });
  } catch (err) {
    res.status(500).json({ error: "Cannot update job" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    const loggedIn = req.user;

    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) return res.status(404).json({ error: "Job not found" });

    if (loggedIn.role !== "admin" && job.employerId !== loggedIn.id)
      return res.status(403).json({ error: "Not allowed" });

    await prisma.job.delete({ where: { id: jobId } });

    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ error: "Cannot delete job" });
  }
};

const getEmployerJobs = async (req, res) => {
  try {
    const employerId = req.user.id;

    const jobs = await prisma.job.findMany({
      where: { employerId },
      orderBy: { createdAt: "desc" }
    });

    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ error: "Cannot fetch jobs" });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs
};
