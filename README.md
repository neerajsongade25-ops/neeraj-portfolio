# Neeraj Songade — Portfolio Website

A premium, futuristic full-stack developer portfolio built with the MERN stack.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Setup Backend
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and credentials
npm install
npm run dev
```

### Setup Frontend
```bash
cd client
npm install
npm run dev
```

### Access
- **Portfolio**: http://localhost:5173
- **Admin Login**: http://localhost:5173/admin/login
- **API**: http://localhost:5000/api



> ⚠️ Change these in `server/.env` before deploying!

## 📁 Structure
```
├── client/          # React + Vite + Tailwind + Framer Motion
└── server/          # Node.js + Express + MongoDB
    ├── models/      # Mongoose schemas
    ├── routes/      # API routes
    ├── controllers/ # Business logic
    └── middleware/  # JWT auth
```

## 🌐 API Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/login | No | Admin login |
| GET | /api/projects | No | Get projects |
| POST | /api/projects | Yes | Create project |
| PUT | /api/projects/:id | Yes | Update project |
| DELETE | /api/projects/:id | Yes | Delete project |
| GET | /api/skills | No | Get skills |
| POST | /api/contact | No | Submit message |
| GET | /api/contact/messages | Yes | View messages |


