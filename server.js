const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth.routes");
const jobsRoutes = require("./routes/jobs.routes");
const applicationsRoutes = require("./routes/applications.routes");
const adminRoutes = require("./routes/admin.routes");
console.log("Loaded Routes:", {
    authRoutes: typeof authRoutes,
    jobsRoutes: typeof jobsRoutes,
    applicationsRoutes: typeof applicationsRoutes,
    adminRoutes: typeof adminRoutes,
  });
  
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", jobsRoutes);
app.use("/api", applicationsRoutes);
app.use("/api", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "SkillBoard API is running" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
