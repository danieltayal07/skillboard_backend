# Setup Instructions

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your database:**
   - Update the `DATABASE_URL` in `.env` file with your MySQL credentials
   - Format: `mysql://username:password@host:port/database_name`
   - Example: `mysql://root:mypassword@localhost:3306/capstone_db`

3. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

4. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```
   - This will create the database tables (User, Account, Session, VerificationToken)

5. **Start the server:**
   ```bash
   npm run dev
   ```

## Environment Variables

The `.env` file has been created with default values. **You must update the `DATABASE_URL`** with your actual MySQL database credentials before running migrations.

### Required Variables:
- `DATABASE_URL` - MySQL connection string
- `NEXTAUTH_SECRET` - Secret key for JWT tokens (already generated)

### Optional Variables:
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3001)
- `NEXTAUTH_URL` - Auth.js URL (default: http://localhost:3000)

## Testing the API

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `token` from the login response.

### 4. Access Protected Route
```bash
curl http://localhost:3000/api/protected \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Get Current User
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Verify database credentials in `.env`
- Check if the database exists (create it if needed)

### Migration Issues
- Make sure Prisma Client is generated: `npm run prisma:generate`
- Check database connection string format
- Ensure database user has CREATE TABLE permissions

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set in `.env`
- Check token expiration (default: 7 days)
- Ensure Authorization header format: `Bearer <token>`

## Next Steps

- Update `DATABASE_URL` in `.env` with your MySQL credentials
- Run migrations to create database tables
- Start developing your API endpoints!

