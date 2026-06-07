import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../");
const envPath = path.resolve(projectRoot, ".env.local");

console.log("📂 Loading from:", envPath);
console.log("📂 File exists?", fs.existsSync(envPath) ? "✓ Yes" : "✗ No");

dotenv.config({ path: envPath });

async function testTiDBConnection() {
  console.log("🔍 Testing TiDB Cloud Connection...\n");

  console.log("📋 Credentials dari .env.local:");
  console.log("   Host:", process.env.TIDB_HOST);
  console.log("   Port:", process.env.TIDB_PORT);
  console.log("   User:", process.env.TIDB_USER);
  console.log(
    "   Password: (hidden)",
    process.env.TIDB_PASSWORD ? "✓ set" : "✗ not set",
  );
  console.log("   Database:", process.env.TIDB_DATABASE);
  console.log("");

  try {
    console.log("⏳ Connecting to TiDB Cloud...");

    // Step 1: Connect without database
    console.log("\n📍 Step 1: Connect to server (without specifying database)");
    const pool1 = mysql.createPool({
      host: process.env.TIDB_HOST,
      port: Number(process.env.TIDB_PORT) || 4000,
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 1,
    });

    const conn1 = await pool1.getConnection();
    await conn1.ping();
    console.log("   ✅ Connected successfully!");

    // Step 2: Check if database exists
    console.log("\n📍 Step 2: Check existing databases");
    const [databases] = await conn1.execute("SHOW DATABASES");
    console.log("   Available databases:");
    (databases as any[]).forEach((db) => {
      console.log(`     - ${db.Database}`);
    });

    const dbExists = (databases as any[]).some(
      (db) => db.Database === "kolecard",
    );
    if (dbExists) {
      console.log('   ✅ Database "kolecard" exists!');
    } else {
      console.log('   ⚠️  Database "kolecard" NOT FOUND');
      console.log("   → Creating database...");
      await conn1.execute("CREATE DATABASE kolecard");
      console.log('   ✅ Database "kolecard" created!');
    }

    // Step 3: Connect to kolecard database
    console.log('\n📍 Step 3: Connect to "kolecard" database');
    const pool2 = mysql.createPool({
      host: process.env.TIDB_HOST,
      port: Number(process.env.TIDB_PORT) || 4000,
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: "kolecard",
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 1,
    });

    const conn2 = await pool2.getConnection();
    await conn2.ping();
    console.log('   ✅ Connected to "kolecard" database!');

    // Step 4: Check tables
    console.log("\n📍 Step 4: Check existing tables");
    const [tables] = await conn2.execute("SHOW TABLES");
    if ((tables as any[]).length === 0) {
      console.log("   ⚠️  No tables found");
      console.log('   → Run "npm run db:init" to create tables');
    } else {
      console.log("   Tables found:");
      (tables as any[]).forEach((tbl) => {
        const tableName = Object.values(tbl)[0];
        console.log(`     - ${tableName}`);
      });
    }

    await conn1.end();
    await conn2.end();
    await pool1.end();
    await pool2.end();

    console.log("\n✅ All checks passed!");
    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Connection failed:");
    console.error("   Error:", error.message);

    if (error.message.includes("Access denied")) {
      console.error("\n💡 Troubleshooting:");
      console.error("   1. Check username/password in .env.local");
      console.error("   2. Go to TiDB Cloud console → Cluster → Connect");
      console.error("   3. Copy fresh credentials");
      console.error("   4. Update .env.local");
    } else if (error.message.includes("getaddrinfo")) {
      console.error("\n💡 Troubleshooting:");
      console.error("   1. Check if host is correct");
      console.error("   2. Check internet connection");
      console.error("   3. TiDB Cloud server might be down");
    }

    console.error("\nFull error:");
    console.error(error);
    process.exit(1);
  }
}

testTiDBConnection();
