---

# ✅ **README.md (Backend) — COPY THIS INTO skillboard-backend**

```md
# SkillBoard – Backend API  
### Express.js + Prisma ORM + PostgreSQL | Full Job Portal REST API

This is the backend API for **SkillBoard**, a job portal system with authentication, job listings, applications, admin tools, sorting, filtering, and pagination.

### 🔗 API Root  
https://skillboard-backend.onrender.com/api

---

## 🚀 Features

### 🔐 Authentication (JWT)
- Signup & Login  
- Password hashing with bcrypt  
- Middleware authentication  
- Role-based access control  

### 💼 Jobs API
- Create job *(employer only)*  
- Get all jobs  
- Search, filter, sort, paginate  
- Get job by ID  
- Update job  
- Delete job *(admin/employer)*  

### 📄 Applications API
- Apply for job (Applicant)  
- View own applications  
- View employer applications  
- Update application status (Admin/Employer)

### 🛠️ Admin API
- Get all users + pagination  
- Get all jobs + pagination  
- Delete any user  
- Delete any job  

---

## 🏗️ Tech Stack

| Tech | Purpose |
|------|---------|
| Node.js | Server |
| Express.js | Routing |
| Prisma ORM | DB Access |
| PostgreSQL | Database |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT Auth |
| CORS | Cross-origin requests |
| Render | API hosting |

---

## 📁 Folder Structure
skillboard-backend/
├── controllers/
│    ├── auth.controller.js
│    ├── jobs.controller.js
│    ├── applications.controller.js
│    └── admin.controller.js
├── routes/
├── middleware/
├── config/
│    └── prisma.js
├── prisma/
│    └── schema.prisma
├── server.js
└── .env

---

## 🔗 Key API Endpoints

### Auth
POST /api/auth/signup
POST /api/auth/login

### Jobs

GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs          (Employer)
PUT    /api/jobs/:id      (Employer)
DELETE /api/jobs/:id      (Admin/Employer)

### Applications
POST   /api/jobs/:id/applications
GET    /api/applications/my
GET    /api/employer/applications
PUT    /api/applications/:id/status

### Admin
GET    /api/admin/users?page=1&limit=5
DELETE /api/admin/users/:id

GET    /api/admin/jobs?page=1&limit=5
DELETE /api/admin/jobs/:id

---

---

## 🚀 Deployment
Backend deployed on **Render**:

**https://skillboard-backend.onrender.com/api**

Database hosted on **Render PostgreSQL**.

---

## ✅ Evaluation Requirements (Fully Met)

### ✔ CRUD Operations (Non-auth)
- Create Job  
- Create Application  
- Read Jobs  
- Read Applications  
- Update Job  
- Update Application Status  
- Delete User  
- Delete Job  

### ✔ Pagination (Admin, Jobs)
Backend supports `page` and `limit` query parameters.

### ✔ Search, Filter, Sort
All implemented in the backend and working on the frontend.

### ✔ Fully Hosted & Connected
Frontend ↔ Backend ↔ Database all live.

---

## 📘 License
This backend is for educational and demonstration purposes.
