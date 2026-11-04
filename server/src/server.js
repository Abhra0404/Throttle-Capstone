import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.log(`Throttle Trade API running on port ${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});