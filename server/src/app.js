
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import tradingRoutes from "./routes/trading.routes.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    const requestOrigin = new URL(origin).origin;
    const allowedOrigin = new URL(env.CLIENT_URL).origin;

    callback(null, requestOrigin === allowedOrigin);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Throttle Trade API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/trading", tradingRoutes);

// Keep error middleware after all routes.
app.use(errorHandler);

export default app;
