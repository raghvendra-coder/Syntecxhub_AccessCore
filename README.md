# AccessCore Enterpr SaaS Management System

<div align="center">

![AccessCore Banner](https://via.placeholder.com/900x200/080e1a/2952ff?text=AccessCore+%E2%80%94+Enterprise+SaaS+Management)

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

**Production-ready enterprise user management platform built with the MERN stack.**
Role-based access control · Audit logging · Cron automation · Analytics dashboard

[Live Demo](#) · [Report Bug](issues) · [Request Feature](issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Routes](#-api-routes)
- [Folder Structure](#-folder-structure)
- [Security Features](#-security-features)
- [Deployment](#-deployment)
- [Future Improvements](#-future-improvements)

---

## 🚀 Overview

**AccessCore** is a full-stack enterprise SaaS management platform designed for teams that need robust user management, complete audit trails, and automated background jobs — all wrapped in a premium dark-mode UI.

Built as a production-ready reference architecture, it demonstrates:

- Clean MERN stack patterns at scale
- Secure JWT authentication with role-based access
- Comprehensive audit logging for compliance
- Automated scheduled tasks with node-cron
- Rich analytics dashboard with real-time charts
- Professional UI/UX comparable to commercial SaaS products
- One-click CSV Data Export for Analytics and Audit Trails

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with secure token handling
- bcrypt password hashing (12 salt rounds)
- Role-based access control (Admin / Manager / User)
- Protected routes on both frontend and backend
- Blocked user detection on every request

### 👥 User Management
- Full CRUD operations for user accounts
- Search, filter, and paginate users
- Block / Unblock users instantly
- Role promotion and demotion
- Department tracking

### 📋 Audit Log System
- Every action is automatically logged
- Tracks: actor, target, action type, IP, user agent, timestamp
- Advanced filtering by action, status, date range
- Beautiful timeline-style UI
- Admin-only secured API
- **One-click Export to CSV** for compliance reporting

### ⏰ Cron Job Automation
- 4 built-in scheduled tasks
- Manual trigger for any job
- Per-job execution history (last 50 runs)
- Enable/disable individual jobs
- Success/failure tracking with messages

### 📊 Analytics Dashboard
- User growth charts (7-day)
- Login activity area chart
- Role distribution breakdown
- Real-time activity feed
- Key metric stat cards
- **Dashboard Analytics Export** to CSV

### 🛡️ Enterprise Security
- Rate limiting (global + auth-specific)
- Helmet.js secure headers
- CORS configuration
- Input validation & sanitization
- Centralized error handling
- HTTP-only token pattern

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS v3 |
| **Routing** | React Router v6 |
| **State** | React Context API |
| **HTTP Client** | Axios |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JSON Web Tokens (JWT) |
| **Password** | bcryptjs |
| **Scheduling** | node-cron |
| **Security** | Helmet, express-rate-limit, cors |
| **Validation** | express-validator |
| **Logging** | Morgan |

---

## 📸 Screenshots

> _(Replace with actual screenshots after deployment)_

| Page | Description |
|------|-------------|
| `Landing Page` | Premium hero with features, stats, and testimonials |
| `Dashboard` | Analytics cards, charts, and activity feed |
| `User Management` | Searchable table with block/edit/delete actions |
| `Audit Logs` | Timeline-style log viewer with advanced filters |
| `Cron Jobs` | Job cards with execution history and manual trigger |

---

## 📦 Installation

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/accesscore.git
cd accesscore
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

The frontend will be available at `http://localhost:5173`  
The backend API will run on `http://localhost:5000`

### 4. Seed Admin User

Register your first account via the UI — the first user can be manually promoted to admin via MongoDB:

```js
// In MongoDB shell or Compass
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/accesscore

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# CORS
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔌 API Routes

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login & get JWT |
| GET | `/api/auth/me` | Protected | Get current user |
| POST | `/api/auth/logout` | Protected | Logout & log action |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin, Manager | List users (search, filter, paginate) |
| GET | `/api/users/:id` | Admin, Manager | Get user by ID |
| PUT | `/api/users/:id` | Admin | Update user |
| PATCH | `/api/users/:id/block` | Admin | Toggle block/unblock |
| DELETE | `/api/users/:id` | Admin | Delete user |

### Audit Logs
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/audit` | Admin | Get audit logs (filtered, paginated) |
| GET | `/api/audit/stats` | Admin | Get action breakdown stats |

### Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/analytics` | Admin, Manager | Full analytics payload |

### Cron Jobs
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/cron` | Admin | List all cron jobs |
| GET | `/api/cron/:name` | Admin | Get single job |
| POST | `/api/cron/:name/trigger` | Admin | Manually trigger job |
| PATCH | `/api/cron/:name/toggle` | Admin | Enable/disable job |

---

## 🗂 Folder Structure

```
accesscore/
├── backend/
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── audit.controller.js
│   │   ├── cron.controller.js
│   │   └── dashboard.controller.js
│   ├── routes/               # Express route definitions
│   ├── middleware/           # Auth, error, validation middleware
│   ├── models/               # Mongoose schemas
│   │   ├── User.model.js
│   │   ├── AuditLog.model.js
│   │   └── CronJob.model.js
│   ├── services/             # Business logic (audit service)
│   ├── utils/                # JWT, response helpers
│   ├── cron/                 # Scheduled job manager
│   ├── config/               # (Future: DB, mailer config)
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── pages/            # Route-level page components
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── UsersPage.jsx
    │   │   ├── AuditLogsPage.jsx
    │   │   └── CronJobsPage.jsx
    │   ├── layouts/          # DashboardLayout with sidebar
    │   ├── context/          # AuthContext (global state)
    │   ├── services/         # Axios API client
    │   ├── components/       # (Reusable UI components)
    │   ├── hooks/            # (Custom hooks)
    │   ├── utils/            # (Helper functions)
    │   ├── App.jsx           # Router + providers
    │   ├── main.jsx
    │   └── index.css         # Global styles + design tokens
    ├── .env.example
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🛡️ Security Features

| Feature | Implementation |
|---------|---------------|
| Password hashing | bcryptjs with 12 salt rounds |
| Token auth | JWT signed with secret, expires in 7 days |
| Rate limiting | 100 req/15min global; 20 req/15min on auth |
| Secure headers | Helmet.js (XSS, CSP, HSTS, etc.) |
| CORS | Whitelist-only origin with credentials |
| Input validation | express-validator on all mutation endpoints |
| Error handling | Centralized handler, no stack traces in prod |
| Body size limit | 10kb max request body |
| Blocked user check | Verified on every protected request |
| Sensitive fields | Password excluded from all query results |

---

## 🚀 Deployment

### Backend (Railway / Render / DigitalOcean)

1. Set all environment variables in your hosting dashboard
2. Set `NODE_ENV=production`
3. Use `npm start` as the start command
4. Ensure MongoDB Atlas URI is set

### Frontend (Vercel / Netlify)

1. Set `VITE_API_URL` to your backend URL
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add redirect rule: `/* → /index.html` (SPA routing)

### Docker (Optional)

```dockerfile
# Backend Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

---

## 🔭 Future Improvements

- [ ] Email verification on registration
- [ ] Password reset via email
- [ ] Two-factor authentication (TOTP)
- [ ] OAuth2 social login (Google, GitHub)
- [ ] Real-time notifications via WebSockets
- [ ] Custom cron job builder via UI
- [ ] Multi-tenant organization support
- [ ] API key management
- [ ] Light mode theme toggle
- [ ] Internationalization (i18n)
- [ ] Comprehensive test suite (Jest + Supertest)

---

## 📄 License

MIT © 2024 AccessCore

---

