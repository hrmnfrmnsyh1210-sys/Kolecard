# 🗄️ TiDB Cloud Setup Guide untuk Kolecard

Panduan lengkap untuk mengintegrasikan TiDB Cloud sebagai database untuk proyek Kolecard.

## 📋 Prerequisites

- Node.js 18+
- npm atau yarn
- Akun TiDB Cloud (https://tidbcloud.com)
- Cluster TiDB Cloud yang sudah dibuat

## 1️⃣ Setup TiDB Cloud Cluster

### Langkah-langkah:

1. **Login ke TiDB Cloud Console** → https://tidbcloud.com/console
2. **Create Cluster** atau gunakan existing cluster
3. **Get Connection Details:**
   - Klik cluster Anda
   - Pilih "Connect"
   - Copy credentials:
     - **Host**: `{your-cluster}.tidbcloud.com`
     - **Port**: `4000`
     - **Username**: `root` atau custom username
     - **Password**: Password yang Anda set
     - **Database**: Buat database baru atau gunakan `kolecard`

### Opsi Koneksi:

- **Public Endpoint** (recommended untuk development)
- **VPC Endpoint** (untuk production)

## 2️⃣ Setup Environment Variables

Buat file `.env.local` di root project:

```bash
# TiDB Cloud Connection
TIDB_HOST=your-cluster.tidbcloud.com
TIDB_PORT=4000
TIDB_USER=root
TIDB_PASSWORD=your_secure_password
TIDB_DATABASE=kolecard

# Server
SERVER_PORT=5000
NODE_ENV=development

# Frontend API URL (untuk development lokal)
VITE_API_URL=http://localhost:5000/api
```

**⚠️ PENTING:**

- Jangan commit `.env.local` ke repository
- File `.env.local` sudah di `.gitignore`
- Gunakan `.env.example` sebagai template

## 3️⃣ Install Dependencies

```bash
npm install
```

Ini akan install:

- `mysql2`: MySQL driver untuk Node.js
- `express`: Backend server
- `concurrently`: Untuk run multiple npm scripts
- Dependencies lainnya

## 4️⃣ Initialize Database Schema

Jalankan script untuk membuat tables:

```bash
npm run db:init
```

Script ini akan:

- Connect ke TiDB Cloud
- Execute semua SQL statements dari `src/db/schema.sql`
- Create tables: `users`, `cards`, `listings`, `offers`

Output yang diharapkan:

```
✓ Executed: CREATE TABLE IF NOT EXISTS users...
✓ Executed: CREATE TABLE IF NOT EXISTS cards...
✓ Executed: CREATE TABLE IF NOT EXISTS listings...
✓ Executed: CREATE TABLE IF NOT EXISTS offers...

✓ Database initialized successfully!
```

## 5️⃣ Jalankan Development Server

Pilih salah satu:

### Option A: Backend & Frontend Terpisah

**Terminal 1** - Frontend (Vite):

```bash
npm run dev
# Akan running di http://localhost:3000
```

**Terminal 2** - Backend (Express):

```bash
npm run dev:server
# Akan running di http://localhost:5000
```

### Option B: Backend & Frontend Bersamaan

```bash
npm run dev:all
# Menjalankan Vite + Express secara concurrent
```

## 6️⃣ Verify Setup

### Check Health Endpoint:

```bash
curl http://localhost:5000/health
# Response: {"status":"ok"}
```

### Check Database Connection:

```bash
npm run dev:server
# Akan melihat message: "✓ TiDB Cloud connection successful"
```

## 7️⃣ API Endpoints

Sekarang aplikasi Anda punya API endpoints:

### Users

- `POST /api/users/login` - Login/Create user
- `GET /api/users/:id` - Get user by ID
- `GET /api/users` - Get all users

### Cards

- `POST /api/cards` - Create card
- `GET /api/cards/:id` - Get card
- `GET /api/cards/owner/:ownerId` - Get user's cards
- `GET /api/cards` - Get all cards

### Listings

- `POST /api/listings` - Create listing
- `GET /api/listings/:id` - Get listing
- `GET /api/listings` - Get active listings
- `GET /api/listings/seller/:sellerId` - Get seller's listings
- `PATCH /api/listings/:id/status` - Update listing status

### Offers

- `POST /api/offers` - Create offer
- `GET /api/offers/:id` - Get offer
- `GET /api/offers/card/:cardId` - Get offers for card
- `GET /api/offers/buyer/:buyerId` - Get buyer's offers
- `PATCH /api/offers/:id/status` - Update offer status

## 8️⃣ Update Frontend Store (Optional)

Untuk menggunakan database instead of localStorage, update `src/store.tsx`:

```typescript
// Replace localStorage logic dengan API calls
import { userAPI, cardAPI, listingAPI, offerAPI } from "./lib/api-client";

// Contoh:
const login = async (username: string) => {
  const user = await userAPI.login(username);
  setUser(user);
};
```

## ⚡ Troubleshooting

### Koneksi Gagal?

1. Check `.env.local` credentials
2. Verify TiDB Cloud network access settings
3. Pastikan cluster status "Available"
4. Test dengan: `npm run dev:server`

### Database Error?

1. Run `npm run db:init` untuk ulang schema
2. Check MySQL console di TiDB Cloud untuk manual queries
3. Verify table existence: `SHOW TABLES;`

### Port Conflict?

- Frontend: Change port di vite.config.ts
- Backend: Set `SERVER_PORT=6000` di .env.local

## 🔒 Security Notes

**Development:**

- `.env.local` untuk local credentials
- MySQL3306 port hanya untuk localhost

**Production:**

- Use environment variables dari hosting service
- Enable SSL/TLS untuk connections
- Use VPC Endpoint (TiDB Cloud Private Link)
- Rotate passwords regularly
- Restrict IP whitelist di TiDB Cloud console

## 📚 Useful Resources

- [TiDB Cloud Docs](https://docs.pingcap.com/tidbcloud/)
- [TiDB SQL Reference](https://docs.pingcap.com/tidb/stable/sql-statements)
- [mysql2 Documentation](https://github.com/sidorares/node-mysql2)
- [Express Documentation](https://expressjs.com/)

---

**Questions?** Refer ke TiDB Cloud documentation atau MySQL2 repository.
