const { Pool } = require("pg");

const config = process.env.INSTANCE_CONNECTION_NAME
  ? {
      host: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || "entertainment_app",
      max: Number(process.env.DB_POOL_SIZE || 5),
    }
  : {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
    };

module.exports = new Pool(config);
