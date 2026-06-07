import fs from "fs";
import path from "path";
import { getConnection } from "./connection.js";

async function initializeDatabase() {
  try {
    const connection = await getConnection();

    // Read schema file
    const schemaPath = path.join(
      path.dirname(new URL(import.meta.url).pathname),
      "schema.sql",
    );
    const schema = fs.readFileSync(schemaPath, "utf-8");

    // Split by semicolon and execute each statement
    const statements = schema.split(";").filter((stmt) => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log("✓ Executed:", statement.substring(0, 50) + "...");
      }
    }

    connection.release();
    console.log("\n✓ Database initialized successfully!");
    process.exit(0);
  } catch (error) {
    console.error("✗ Database initialization failed:", error);
    process.exit(1);
  }
}

initializeDatabase();
