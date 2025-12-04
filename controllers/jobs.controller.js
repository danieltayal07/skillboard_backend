const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // Or require("../config/prisma") if you use a singleton

// --- 1. Main Function: Get Jobs with Filters & Sorting ---
// const getJobs = async (req, res) => {
//   try {
//     const { keyword, location, type, salary, sort } = req.query;

//     // A. Build Prisma 'WHERE' Clause
//     const whereClause = {
//       AND: [
//         // Keyword Search (Title, Company, or Skills)
//         keyword ? {
//           OR: [
//             { title: { contains: keyword } }, 
//             { company: { contains: keyword } },
//             { skills: { contains: keyword } }
//           ]
//         } : {},

//         // Location Search
//         location ? {
//           location: { contains: location }
//         } : {},

//         // Job Type Filter
//         type && type !== 'all' ? {
//           type: { equals: type }
//         } : {}
//       ]
//     };

//     // B. Fetch from Database
//     let jobs = await prisma.job.findMany({
//       where: whereClause,
//       include: {
//         employer: { select: { id: true, name: true } }
//       },
//       orderBy: {
//         createdAt: 'desc' // Default DB sort
//       }
//     });

    const getJobs = async (req, res) => {
      try {
        const { keyword, location, type, salary, sort, page = 1, limit = 20 } = req.query;

        const where = {};
    
        if (keyword) {
          where.OR = [
            { title: { contains: keyword, mode: "insensitive" } },
            { skills: { contains: keyword, mode: "insensitive" } },
            { employer: { name: { contains: keyword, mode: "insensitive" } } }
          ];
        }
    
        if (location) {
          where.location = { contains: location, mode: "insensitive" };
        }
    
        if (type && type !== "all") {
          where.type = { equals: type };
        }
    
        const take = Number(limit) > 0 ? Number(limit) : 20;
        const skip = (Number(page) > 1 ? Number(page) - 1 : 0) * take;
    
        let jobs = await prisma.job.findMany({
          where,
          include: {
            employer: { select: { id: true, name: true } }
          },
          orderBy: {
            createdAt: "desc" 
          },
          skip,
          take
        });
    
        if (salary && salary !== "all") {
          const minSalary = salary === "100k+" ? 100000 : 50000;
          jobs = jobs.filter(job => getSalaryValue(job.salary) >= minSalary);
        }
    
        if (sort === "salary-high") {
          jobs.sort((a, b) => getSalaryValue(b.salary) - getSalaryValue(a.salary));
        } else if (sort === "salary-low") {
          jobs.sort((a, b) => getSalaryValue(a.salary) - getSalaryValue(b.salary));
        } else if (sort === "newest") {
          jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    
        const totalCount = await prisma.job.count({ where });
    
        res.json({ success: true, count: jobs.length, total: totalCount, page: Number(page), jobs });
      } catch (err) {
        console.error("getJobs error:", err);
        res.status(500).json({ error: "Server error fetching jobs" });
      }
    };

    const getSalaryValue = (str) => {
      if (!str) return 0;
      let clean = String(str).toLowerCase().replace(/,/g, "").replace(/\$/g, "").replace(/₹/g, "");
      const match = clean.match(/(\d+)(k?)/);
      if (match) {
        let num = parseInt(match[1], 10);
        if (match[2] === "k") num *= 1000;
        return num;
      }
      const n = parseFloat(clean);
      return Number.isNaN(n) ? 0 : n;
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

// --- 3. Create Job ---
const createJob = async (req, res) => {
  try {
    const employerId = req.user.id;
    const job = await prisma.job.create({
      data: { ...req.body, employerId }
    });
    res.status(201).json({ job });
  } catch (err) {
    res.status(500).json({ error: "Cannot create job" });
  }
};

// --- 4. Update Job (RESTORED) ---
const updateJob = async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    const employerId = req.user.id;

    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) return res.status(404).json({ error: "Job not found" });

    // Ensure only the owner can update
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

// --- 5. Delete Job ---
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

// --- 6. Get Employer's Specific Jobs ---
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
  updateJob, // <--- This was missing, causing the crash!
  deleteJob,
  getEmployerJobs
};