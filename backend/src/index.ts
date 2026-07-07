import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import queueRoutes from "./routes/queue.routes";
import tokenRoutes from "./routes/token.routes";
import analyticsRoutes from "./routes/analytics.routes";

const app = express();

app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.use("/auth", authRoutes);
app.use("/queues", queueRoutes);
app.use("/tokens", tokenRoutes);
app.use("/analytics", analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Queue Management API listening on port ${env.port} (${env.nodeEnv})`);
});
