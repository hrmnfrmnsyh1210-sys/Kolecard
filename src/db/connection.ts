import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../../.env.local");

dotenv.config({ path: envPath });

// Debug: Log connection details
console.log("TiDB Connection Config:");
console.log("  Host:", process.env.TIDB_HOST);
console.log("  Port:", process.env.TIDB_PORT);
console.log("  User:", `'${process.env.TIDB_USER}'`); // Show quotes to detect whitespace
console.log("  Password length:", process.env.TIDB_PASSWORD?.length);
console.log("  Database:", process.env.TIDB_DATABASE);

const pool = mysql.createPool({
  host: process.env.TIDB_HOST,
  port: Number(process.env.TIDB_PORT) || 4000,
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  // database akan di-set setelah successful connection
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  ssl: { rejectUnauthorized: false },
});

export async function getConnection() {
  return pool.getConnection();
}

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log("✓ TiDB Cloud connection successful");
    return true;
  } catch (error) {
    console.error("✗ TiDB Cloud connection failed:", error);
    return false;
  }
}

export default pool;
