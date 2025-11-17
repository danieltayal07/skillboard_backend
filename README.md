# Backend API

A Node.js backend with Express, Prisma, MySQL, and Auth.js for authentication.

## Features

- ✅ User signup and login
- ✅ JWT-based authentication
- ✅ Protected routes with middleware
- ✅ Prisma ORM with MySQL
- ✅ Auth.js integration
- ✅ Password hashing with bcrypt

## Prerequisites

- Node.js (v18 or higher)
- MySQL database
- npm or yarn

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/database_name"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   PORT=3000
   FRONTEND_URL="http://localhost:3001"
   ```

   To generate a secure `NEXTAUTH_SECRET`, run:
   ```bash
   openssl rand -base64 32
   ```

3. **Set up the database:**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate
   ```

4. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

- **POST** `/api/auth/signup` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe" // optional
  }
  ```

- **POST** `/api/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **GET** `/api/auth/me` - Get current user (protected)
  - Requires: Authorization header with Bearer token

- **POST** `/api/auth/logout` - Logout user (protected)
  - Requires: Authorization header with Bearer token

### Protected Routes

- **GET** `/api/protected` - Example protected route
  - Requires: Authorization header with Bearer token

### Health Check

- **GET** `/health` - Server health check

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

Or use cookies (if using NextAuth session tokens).

## Project Structure

```
backend/
├── config/
│   └── auth.js          # Auth.js configuration
├── middleware/
│   └── auth.js          # Authentication middleware
├── routes/
│   └── auth.js          # Authentication routes
├── prisma/
│   └── schema.prisma    # Prisma schema
├── server.js            # Main server file
├── package.json
└── .env                 # Environment variables (create this)
```

## Database Schema

The Prisma schema includes:
- `User` - User accounts
- `Account` - OAuth accounts (for future OAuth integration)
- `Session` - User sessions
- `VerificationToken` - Email verification tokens

## Development

- View database with Prisma Studio:
  ```bash
  npm run prisma:studio
  ```

- Create a new migration:
  ```bash
  npm run prisma:migrate
  ```

## Notes

- Passwords are hashed using bcrypt with 10 salt rounds
- JWT tokens are signed with `NEXTAUTH_SECRET`
- CORS is enabled for the frontend URL specified in `.env`

# skillboard_backend
