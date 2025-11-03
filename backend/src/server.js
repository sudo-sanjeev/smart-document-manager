require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { initDB } = require("./utils/database");

// Import routes
const documentRoutes = require("./routes/documentRoutes");
const folderRoutes = require("./routes/folderRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.CORS_ORIGIN,
    ].filter(Boolean),
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "AI Document Vault API is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/documents", documentRoutes);
app.use("/api/folders", folderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File too large",
        message: "File size exceeds the maximum limit",
      });
    }
    return res.status(400).json({
      success: false,
      error: "File upload error",
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not found",
    message: "The requested resource was not found",
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    await initDB();
    console.log("✅ Database initialized");

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀  AI Document Vault Backend Server Running       ║
║                                                       ║
║   📍  Port: ${PORT}                                      ║
║   🌍  Environment: ${
        process.env.NODE_ENV || "development"
      }                   ║
║   🔗  URL: http://localhost:${PORT}                     ║
║   🤖  AI: Anthropic Claude (Configured)               ║
║                                                       ║
║   📡  API Endpoints:                                  ║
║      GET    /health                                   ║
║      POST   /api/documents/upload                     ║
║      GET    /api/documents                            ║
║      GET    /api/documents/:id                        ║
║      GET    /api/documents/:id/content                ║
║      DELETE /api/documents/:id                        ║
║      POST   /api/folders                              ║
║      GET    /api/folders                              ║
║      GET    /api/folders/tree                         ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
