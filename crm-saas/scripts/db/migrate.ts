import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

import fs from "fs";
import { db } from "@crm/database";
const migrationsDir = path.join(
  __dirname,
  "../../packages/database/migrations"
);

async function runMigrations() {
  try {
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      if (!file.endsWith(".sql")) continue;

      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf8");

      console.log(`Running migration: ${file}`);

      await db.query(sql);
    }

    console.log("✅ All migrations completed");
    process.exit(0);

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigrations();