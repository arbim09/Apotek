# Backend Apotek - NestJS + PostgreSQL

Setup awal backend untuk aplikasi apotek menggunakan NestJS dan PostgreSQL.

## Struktur Proyek

```
src/
├── config/
│   └── configuration.ts    # Konfigurasi aplikasi dari environment
├── modules/
│   └── products/           # Module produk/obat
│       ├── controllers/
│       ├── services/
│       ├── entities/
│       ├── dto/
│       └── products.module.ts
├── app.module.ts           # Root module
└── main.ts                 # Entry point
```

## Fitur

- ✅ NestJS framework dengan TypeScript
- ✅ PostgreSQL database dengan TypeORM
- ✅ Environment configuration (.env)
- ✅ Modular architecture
- ✅ CRUD operations untuk produk
- ✅ Validation dengan class-validator
- ✅ Database migration ready (synchronize di development)

## Instalasi

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup database PostgreSQL:
   - Buat database `apotek_db`
   - Atur kredensial di file `.env`

3. Jalankan aplikasi:
   ```bash
   # Development mode
   npm run start:dev

   # Production build
   npm run build
   npm run start:prod
   ```

## Environment Variables

Copy file `.env.example` ke `.env` dan sesuaikan:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=apotek_db

# Application
APP_PORT=3000
APP_ENV=development
APP_NAME=Apotek Backend

# JWT (untuk autentikasi nanti)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

## API Endpoints

### Products

- `GET /products` - Get all active products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product permanently
- `PATCH /products/:id/soft-delete` - Soft delete product

## Development

```bash
# Run in development mode dengan hot reload
npm run start:dev

# Run tests
npm run test
npm run test:e2e

# Lint code
npm run lint
```

## Database Migration

Untuk development, `synchronize: true` diaktifkan secara otomatis. Untuk production, gunakan migrations:

```bash
# Generate migration
npm run typeorm:generate -- -n MigrationName

# Run migration
npm run typeorm:run

# Revert migration
npm run typeorm:revert
```

## Tech Stack

- **NestJS** - Node.js framework
- **TypeORM** - ORM untuk PostgreSQL
- **PostgreSQL** - Database
- **class-validator** - Data validation
- **@nestjs/config** - Configuration management
- **@nestjs/typeorm** - TypeORM integration

## Next Steps

1. Implement authentication (JWT)
2. Add users module
3. Add transactions module
4. Add inventory management
5. Add reporting
6. Add unit tests