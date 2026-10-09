const { port, validateEnvironment } = require("./config/env");
const { initializeDatabase } = require("./db/schema");
const app = require("./app");

async function start() {
  validateEnvironment();
  await initializeDatabase();
  app.listen(port, () => console.log(`Entertainment API listening on port ${port}`));
}

start().catch((error) => {
  console.error("Failed to start Entertainment API", error);
  process.exit(1);
});
