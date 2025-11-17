import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.js";
import { authenticate } from "../middleware/auth.js";

// Load environment variables
dotenv.config();
console.log('FRONTEND_URL set to:', process.env.FRONTEND_URL);
// Validate required environment variables
const requiredEnvVars = ['PRISMA_DATABASE_URL', 'NEXTAUTH_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file');
  process.exit(1);
}
const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:3001",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3001"
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Additional CORS headers middleware (fallback)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3001",
    "http://localhost:3001",
    "http://127.0.0.1:3001"
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Skill Board API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: {
        signup: "POST /api/auth/signup",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me",
        logout: "POST /api/auth/logout"
      }
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
app.use("/api/auth", authRoutes);

// NextAuth.js routes (for session management)
// Note: For a pure Express backend, you might want to use a different approach
// This is a simplified version. For production, consider using express-session
// or implementing JWT tokens directly.
app.use("/api/auth/nextauth", async (req, res) => {
  // This would typically be handled by NextAuth's API routes
  // For Express, you can integrate it differently or use JWT directly
  res.json({
    message: "NextAuth endpoint - integrate with your frontend",
  });
});

// Protected route example
app.get("/api/protected", authenticate, (req, res) => {
  res.json({
    success: true,
    message: "This is a protected route",
    user: req.user,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// 404 handler - must be last
app.use((req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
    method: req.method,
  });
});

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth routes: http://localhost:${PORT}/api/auth`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error(`💡 Try: lsof -ti:${PORT} | xargs kill -9`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;