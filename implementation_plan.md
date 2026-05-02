# Full-Stack Portfolio — Implementation Plan

## Overview

A premium, futuristic full-stack developer portfolio for **Neeraj Songade** featuring:
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express.js + MongoDB + JWT
- **Admin Panel**: Protected dashboard for content management
- **Deployment-ready**: Vercel (frontend) + Render (backend) + MongoDB Atlas (DB)

---

## Folder Structure

```
d:\Projects\Neeraj Portfolio\
├── client/          ← React + Vite frontend
│   ├── src/
│   │   ├── components/     ← Reusable UI components
│   │   ├── pages/          ← Page-level components
│   │   ├── context/        ← Auth context
│   │   ├── hooks/          ← Custom hooks
│   │   ├── utils/          ← API helpers
│   │   └── assets/         ← Images, icons
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/          ← Express backend
    ├── models/      ← Mongoose schemas
    ├── routes/      ← API route handlers
    ├── controllers/ ← Business logic
    ├── middleware/  ← JWT auth middleware
    └── index.js     ← Entry point
```

---

## Proposed Changes

### Phase 1: Backend (server/)

#### [NEW] server/index.js
Express app entry, CORS, MongoDB connection

#### [NEW] server/models/Project.js
Mongoose schema for projects

#### [NEW] server/models/Skill.js
Mongoose schema for skills

#### [NEW] server/models/Message.js
Mongoose schema for contact messages

#### [NEW] server/models/Admin.js
Mongoose schema for admin user

#### [NEW] server/routes/auth.js
POST `/api/auth/login` → JWT login

#### [NEW] server/routes/projects.js
GET/POST/PUT/DELETE `/api/projects`

#### [NEW] server/routes/skills.js
GET/POST/PUT/DELETE `/api/skills`

#### [NEW] server/routes/contact.js
POST `/api/contact` + GET `/api/messages`

#### [NEW] server/controllers/*.js
Business logic for each route

#### [NEW] server/middleware/auth.js
JWT verification middleware

#### [NEW] server/.env.example
Environment variable template

---

### Phase 2: Frontend (client/)

#### [NEW] client/src/App.jsx
Root router with React Router v6

#### [NEW] client/src/pages/Home.jsx
All portfolio sections assembled

#### [NEW] client/src/pages/Admin.jsx
Admin dashboard page

#### [NEW] client/src/components/Navbar.jsx
Fixed navbar with scroll detection

#### [NEW] client/src/components/Hero.jsx
Animated hero with typing effect + particles

#### [NEW] client/src/components/About.jsx
About section with animated cards

#### [NEW] client/src/components/Skills.jsx
Dynamic skills from API with animated bars

#### [NEW] client/src/components/Projects.jsx
Dynamic projects from API with cards

#### [NEW] client/src/components/Achievements.jsx
Static achievements section

#### [NEW] client/src/components/Contact.jsx
Contact form with backend submission

#### [NEW] client/src/components/ScrollProgress.jsx
Scroll progress indicator

#### [NEW] client/src/components/Particles.jsx
Canvas-based floating particle animation

#### [NEW] client/src/context/AuthContext.jsx
JWT auth state management

#### [NEW] client/src/utils/api.js
Axios instance with interceptors

---

## UI/UX Design

- **Theme**: Deep space dark (`#0a0a0f` base)
- **Accent**: Electric cyan/violet gradient (`#00d4ff` → `#9b59b6`)
- **Glass cards**: `backdrop-blur` + semi-transparent borders
- **Animations**: Framer Motion page transitions, stagger children, float keyframes
- **Particles**: Canvas-based anti-gravity floating dots
- **Typography**: Inter + Space Grotesk (Google Fonts)
- **Scroll**: Smooth scroll + custom scrollbar

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/login | No | Admin login, returns JWT |
| GET | /api/projects | No | List all projects |
| POST | /api/projects | Yes | Create project |
| PUT | /api/projects/:id | Yes | Update project |
| DELETE | /api/projects/:id | Yes | Delete project |
| GET | /api/skills | No | List all skills |
| POST | /api/skills | Yes | Create skill |
| PUT | /api/skills/:id | Yes | Update skill |
| DELETE | /api/skills/:id | Yes | Delete skill |
| POST | /api/contact | No | Submit contact message |
| GET | /api/messages | Yes | List all messages |

---

## Verification Plan

### Automated Tests
- Frontend dev server starts: `npm run dev` in client/
- Backend starts: `npm run dev` in server/
- API endpoints respond correctly via browser

### Manual Verification
- All sections render correctly
- Typing animation works
- Particle effects visible
- Projects load from API
- Contact form submits successfully
- Admin login works with JWT
- Admin can CRUD projects and skills
