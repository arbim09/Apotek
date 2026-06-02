# 🚀 Insomnia Setup Guide - Apotek Backend API

Panduan lengkap untuk menggunakan Insomnia sebagai API testing tool.

## 📥 Instalasi Insomnia

### Windows/Mac/Linux
1. Download dari https://insomnia.rest/download
2. Install aplikasi
3. Buka Insomnia

## 📦 Import Collection

### Langkah-langkah:
1. Buka Insomnia
2. Klik **"Create"** → **"Import from file"**
3. Pilih file `backend/insomnia-collection.json`
4. Workspace **"Apotek Backend API"** akan ter-import otomatis

## ⚙️ Setup Environment Variables

### Development Environment sudah tersedia dengan default values:
```
base_url: http://localhost:3000
api_prefix: /api
access_token: (kosong, akan diisi setelah login)
refresh_token: (kosong, akan diisi setelah login)
```

### Jika ingin mengubah base URL:
1. Klik tab **"Manage Environments"** (di samping kanan)
2. Pilih **"Development"**
3. Edit `base_url` sesuai kebutuhan (contoh: `http://localhost:3001`)
4. Simpan

## 🧪 Testing API Endpoints

### 1️⃣ Login (POST /api/auth/login)
```
Request:
{
  "email": "admin@apotek.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": { ... },
  "redirect_to": "/admin/dashboard"
}
```

**Setelah login:**
- Copy `access_token` dari response
- Klik **"Manage Environments"** → **"Development"**
- Paste ke field `access_token`
- Copy `refresh_token` ke field `refresh_token`
- Simpan

### 2️⃣ Get Profile (GET /api/auth/profile)
Mengambil data profile user yang sedang login.

**Headers yang digunakan:**
- `Authorization: Bearer {{ access_token }}`

**Requirements:**
- Harus sudah login dan punya `access_token`

### 3️⃣ Change Password (POST /api/auth/change-password)
```
Request body:
{
  "current_password": "password123",
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

**Requirements:**
- Harus sudah login dan punya `access_token`

### 4️⃣ Refresh Token (POST /api/auth/refresh)
```
Request body:
{
  "refresh_token": "{{ refresh_token }}"
}

Response:
{
  "access_token": "eyJhbGc... (new token)",
  "refresh_token": "eyJhbGc... (new refresh token)"
}
```

**Gunakan ketika:**
- Access token sudah expired (15 menit)
- Ingin mendapatkan token baru tanpa login ulang

### 5️⃣ Validate Token (POST /api/auth/validate-token)
Mengecek apakah token masih valid.

**Headers yang digunakan:**
- `Authorization: Bearer {{ access_token }}`

**Response jika valid:**
```json
{
  "valid": true,
  "user": {
    "sub": "user-id",
    "email": "admin@apotek.com",
    "role": "admin"
  }
}
```

### 6️⃣ Logout (POST /api/auth/logout)
Menghapus session dan me-revoke semua tokens.

**Headers yang digunakan:**
- `Authorization: Bearer {{ access_token }}`

**Setelah logout:**
- Hapus `access_token` dari environment variables
- Hapus `refresh_token` dari environment variables

## 💡 Tips & Tricks

### Auto-refresh Token saat Expired
Insomnia tidak auto-refresh token, jadi ketika access_token expired (15m):
1. Buka request **"Refresh Token"**
2. Gunakan `refresh_token` yang sudah disimpan di environment
3. Copy `access_token` baru ke environment
4. Lanjutkan testing

### Save Custom Environment
Jika ingin multiple environments (Dev, Staging, Prod):
1. **"Manage Environments"** → **"+"**
2. Buat environment baru (contoh: "Production")
3. Set base_url ke production server
4. Switch environment sesuai kebutuhan

### Debug Response
Insomnia menampilkan response detail:
- **"Response"** tab - lihat JSON response
- **"Timeline"** tab - lihat durasi request
- **"Cookies"** tab - lihat cookies yang dikirim

### Pretty-print JSON
Response JSON otomatis ter-format rapi di Insomnia, tapi jika ingin copy:
1. Klik **"Pretty"** button di response area
2. Select all dan copy

## 🔒 Security Notes

### JANGAN:
- ❌ Share `access_token` atau `refresh_token` di public repository
- ❌ Hardcode credentials di collection file
- ❌ Commit environment file dengan token ke git

### DO:
- ✅ Simpan tokens hanya di local Insomnia
- ✅ Gunakan `.env` untuk credentials lokal
- ✅ Rotate tokens secara berkala

## 🐛 Troubleshooting

### Error: "Cannot find module"
- Backend belum dijalankan
- Jalankan: `cd backend && npm run start:dev`

### Error: 401 Unauthorized
- `access_token` sudah expired
- Gunakan request "Refresh Token"
- Update `access_token` di environment

### Error: CORS error
- Backend CORS configuration mungkin tidak sesuai
- Check `.env` → `CORS_ORIGIN`
- Backend harus running di `http://localhost:3000`

### Token tidak ter-update otomatis
- Insomnia tidak bisa auto-extract dari response
- Manual copy-paste ke environment variable
- Atau gunakan Postman dengan "Tests" script jika butuh automation

## 📝 Next Steps

Setelah berhasil test semua endpoints:
1. Develop module lain (Products, Categories, etc)
2. Add endpoints baru ke collection
3. Maintain environment variables

Selamat testing! 🎉