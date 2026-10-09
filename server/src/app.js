const express = require("express");
const cors = require("cors");
const { corsOrigins } = require("./config/env");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || corsOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Origin is not allowed by CORS"));
  },
}));

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/favorites", require("./routes/favorites"));
app.use("/api/movies", require("./routes/movies"));

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = Number(error.status);
  res.status(Number.isInteger(status) && status >= 400 && status < 600 ? status : 500).json({
    error: typeof error.message === "string" && status ? error.message : "Server error",
  });
});

module.exports = app;
