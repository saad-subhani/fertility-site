# Fertility Clinic – PHP Backend

## Quick Start

### 1. Database
Open phpMyAdmin / MySQL and run the entire file:

```
database.sql
```

### 2. Config
Edit `config/env.php`:

- `db_pass` → your MySQL password (empty for XAMPP default)
- `admin_username` / `admin_password` → change admin login
- `jwt_secret` → change in production

### 3. Run Backend

**Option A – PHP built-in server (recommended for dev):**
```bash
cd fertility-backend
php -S localhost:8000 router.php
```

**Option B – XAMPP:**
- Put `fertility-backend` inside `htdocs/`
- Access: `http://localhost/fertility-backend/api/...`

### 4. Frontend
Frontend already points to `http://localhost:8000`

```bash
cd fertility-site-main
npm install
npm run dev
```

### Admin Login
- URL: http://localhost:3000/admin/login
- Username: `admin`
- Password: `Admin@12345`

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/book.php | No | Submit booking (multipart) |
| POST | /api/admin/login.php | No | Login → JWT |
| GET | /api/admin/bookings.php | JWT | List + filter + search |
| GET | /api/admin/booking-detail.php?id= | JWT | Single booking |
| POST | /api/admin/update-status.php | JWT | Update status |

### Status Values
- `pending` – online payment, waiting verification
- `paid` – verified paid
- `paid_at_clinic` – will pay at clinic
