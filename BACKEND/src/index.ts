import dns from "dns";
dns.setServers(['8.8.8.8', '8.8.4.4'])
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "cors"
import errorHandler from "./middleware/errorHandler";
import taskRoutes from "./routes/taskRoutes"
import authRoutes from "./routes/authRoutes"

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
import { Router } from "express";
const testRouter = Router();
testRouter.post("/forgot-password", (req, res) => {
  res.json({ success: true, message: "INLINE TEST WORKS" });
});
app.use("/auth-test", testRouter);


// MIDDLEWARE

// CORS — allows frontend to talk to backend
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "https://taskduty-manager.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON
app.use(express.json());

// Parse form data
app.use(express.urlencoded({extended:true}))



// ROUTES
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

// Health check — to confirm server is running
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Manager API is running",
  });
});


// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Frontend URL: ${process.env.CLIENT_URL}`);
});

export default app;