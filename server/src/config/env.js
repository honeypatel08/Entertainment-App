require("dotenv").config();

const required = ["JWT_SECRET", "TMDB_API_KEY"];

function validateEnvironment() {
  const missing = required.filter((name) => !process.env[name]);
  if (!process.env.DATABASE_URL && !process.env.INSTANCE_CONNECTION_NAME) {
    missing.push("DATABASE_URL or INSTANCE_CONNECTION_NAME");
  }
  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
}

module.exports = {
  port: Number(process.env.PORT || 8080),
  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  validateEnvironment,
};
