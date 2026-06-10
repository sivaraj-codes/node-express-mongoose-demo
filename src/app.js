import express from "express";
import cors from "cors";
import userRoutes from "./features/users/user.route.js";
import { errorHandler } from "./shared/middlewares/errorHandler.js";
import { AppError } from "./shared/errors/AppError.js";
import { HTTP_STATUS } from "./constants/responseConstants.js";

const app = express();

// ── Middleware ──
app.use(express.json());
app.use(cors());

// ── Health check ─
app.get("/", (req, res) => {
  res.send("Welcome API Home");
});

// ── Feature routes ──────
app.use("/api/v1/users", userRoutes);

// ── 404 handler (after all routes) ───
app.use((req, res, next) => {
  next(new AppError(`Cannot ${req.method} ${req.path}`, HTTP_STATUS.NOT_FOUND));
});

// ── Global error handler (must be last) ───────
app.use(errorHandler);

export default app;
