const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth.routes");
const jobsRoutes = require("./routes/jobs.routes");
const applicationsRoutes = require("./routes/applications.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", jobsRoutes);          // /api/jobs...
app.use("/api", applicationsRoutes);  // /api/applications...
app.use("/api", adminRoutes);


// Health check
app.get("/", (req, res) => {
  res.json({ message: "SkillBoard API is running" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
