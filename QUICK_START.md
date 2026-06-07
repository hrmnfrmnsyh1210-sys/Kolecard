# 🚀 Quick Start Cheatsheet - Kolecard + TiDB Cloud

## 1. Setup (First Time Only)

```bash
# 1. Update .env.local dengan TiDB Cloud credentials
# Edit d:\Kolecard\.env.local dengan:
# TIDB_HOST=your-cluster.tidbcloud.com
# TIDB_PORT=4000
# TIDB_USER=root
# TIDB_PASSWORD=your_password
# TIDB_DATABASE=kolecard

# 2. Install dependencies
npm install

# 3. Initialize database schema
npm run db:init

# ✓ Database siap!
```

## 2. Development (Daily Use)

### Option A: Jalankan terpisah (recommended untuk debugging)

**Terminal 1:**

```bash
npm run dev
# Frontend: http://localhost:3000
```

**Terminal 2:**

```bash
npm run dev:server
# Backend: http://localhost:5000
```

### Option B: Jalankan bersamaan

```bash
npm run dev:all
# Kedua-duanya akan running
```

## 3. Verify Connection

```bash
# Test API health
curl http://localhost:5000/health

# Output: {"status":"ok"}
```

## 4. Common Commands

```bash
npm run lint          # Check TypeScript
npm run build         # Build untuk production
npm run clean         # Clear build artifacts
npm run db:init       # Re-initialize database (hati-hati: drop existing data)
```

## 5. Database Queries (Manual)

Via TiDB Cloud Console:

1. Go to https://tidbcloud.com/console
2. Click your cluster
3. Go to "SQL Editor" tab
4. Run queries

Common queries:

```sql
-- Lihat semua tables
SHOW TABLES;

-- Lihat users
SELECT * FROM users;

-- Lihat cards
SELECT * FROM cards;

-- Lihat listings active
SELECT * FROM listings WHERE status = 'Active';

-- Lihat offers pending
SELECT * FROM offers WHERE status = 'Pending';
```

## 6. Troubleshooting Checklist

```
❓ Port 5000/3000 sudah digunakan?
→ Kill process atau change PORT di .env.local

❓ Database connection error?
→ Check .env.local credentials
→ Verify TiDB Cloud cluster status "Available"
→ Test dengan: npm run dev:server

❓ Tables tidak terlihat?
→ Run: npm run db:init

❓ API returns 500?
→ Check terminal server logs
→ Verify data format di request body
```

## 7. File Structure

```
src/
├── db/
│   ├── connection.ts      # TiDB Cloud connection pool
│   ├── schema.sql         # Table definitions
│   ├── init.ts           # Database initialization script
│   └── queries.ts        # Data access layer
├── api/
│   └── routes.ts         # Express API endpoints
├── lib/
│   └── api-client.ts     # Frontend HTTP client
├── server.ts             # Express server entry point
└── store.tsx             # React context (update untuk API)
```

## 8. Next Steps

- [ ] Update `src/store.tsx` untuk menggunakan API calls instead of localStorage
- [ ] Add authentication (JWT or sessions)
- [ ] Add validation/error handling di backend
- [ ] Setup deployment (Vercel for frontend, Railway/Render for backend)
- [ ] Setup CI/CD pipeline

---

**Need more details?** Check [TIDB_SETUP.md](TIDB_SETUP.md)
