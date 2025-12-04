const prisma = require("../config/prisma");

// UPDATE FUNCTIONALITY 
const applyJob = async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    const userId = req.user.id;
    const exists = await prisma.application.findFirst({
      where: { jobId, userId }
    });

    if (exists)
      return res.status(400).json({ error: "Already applied" });

    const app = await prisma.application.create({
      data: { jobId, userId }
    });

    res.status(201).json({ app });
  } catch (err) {
    res.status(500).json({ error: "Cannot apply" });
  }
};

const getEmployerApplications = async (req, res) => {
  try {
    const employerId = req.user.id;

    const apps = await prisma.application.findMany({
      where: {
        job: { employerId }
      },
      include: {
        user: { select: { name: true, email: true } },
        job: { select: { title: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ apps });
  } catch (err) {
    res.status(500).json({ error: "Cannot fetch applications" });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            employer: { select: { name: true } }
          }
        }
      }
    });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: "Cannot fetch user applications" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const appId = Number(req.params.id);
    const { status } = req.body;

    const app = await prisma.application.findUnique({
      where: { id: appId },
      include: { job: true }
    });

    if (!app) return res.status(404).json({ error: "Application not found" });

    const loggedIn = req.user;

    if (loggedIn.role !== "admin" && app.job.employerId !== loggedIn.id)
      return res.status(403).json({ error: "Not allowed" });

    const updated = await prisma.application.update({
      where: { id: appId },
      data: { status }
    });

    res.json({ updated });
  } catch (err) {
    res.status(500).json({ error: "Cannot update status" });
  }
};

module.exports = {
  applyJob,
  getEmployerApplications,
  getMyApplications,
  updateStatus
};
