# JobTrackr

A full-stack job application tracker built to manage and monitor job applications during placement season.

## Overview

JobTrackr lets a user log job applications, track their status through the hiring pipeline (Applied → OA/Screening → Interview → Offer/Rejected), and update them as things progress. Built as a portfolio project alongside placement prep.

## Tech Stack

**Frontend:** React (Vite) + React Router 
**Backend:** Node.js + Express
**Database:** MySQL
**Auth:** JWT
**Deployment:** AWS (S3 + CloudFront for frontend, EC2 + RDS for backend)

## Core Features

- User signup/login (JWT auth)
- Add a job application
- View all job applications
- Update job status
- Edit job details
- Delete a job application
- Search and filter applications by status
- AI resume match score (Google Gemini) against a job description

## Database Schema

### users
| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| name | VARCHAR | |
| email | VARCHAR, UNIQUE | |
| password | VARCHAR | hashed |
| created_at | TIMESTAMP | auto |

### jobs
| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| user_id | INT, FK → users.id | |
| company_name | VARCHAR | required |
| role | VARCHAR | required |
| status | ENUM | Applied, OA, Interview, Offer, Rejected |
| job_link | VARCHAR | optional |
| notes | TEXT | optional |
| date_applied | DATE | required |
| created_at | TIMESTAMP | auto |
| updated_at | TIMESTAMP | auto-updated |

## API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/auth/me | Get the logged-in user |
| GET | /api/jobs | Get all jobs for logged-in user |
| GET | /api/jobs/:id | Get one job |
| POST | /api/jobs | Add a new job |
| PUT | /api/jobs/:id | Update a job - send only the fields to change (e.g. `{ "status": "Interview" }`) |
| DELETE | /api/jobs/:id | Delete a job |
| POST | /api/ai/resume-match | Multipart: `resume` (PDF, ≤5 MB) + `job_description`; returns score, verdict, strengths, gaps |

All routes except register/login need an `Authorization: Bearer <token>` header.

## Folder Structure

```
jobtrackr/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   └── jobController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── userModel.js
│   │   └── jobModel.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   └── jobRoutes.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── database/
│   ├── schema.sql
│   └── migrations/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## Architecture

```
User → CloudFront → S3 (React build)
                         |
                         v
                  EC2 (Node/Express API)
                         |
                         v
                  RDS (MySQL)
```

## Running locally

**Prerequisites:** Node.js 18+ and MySQL 8.

1. **Database**
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   Already created the tables with an older `schema.sql`? Run `database/migrations/001_widen_job_columns.sql` once instead.

2. **Backend** (runs on http://localhost:8000)
   ```bash
   cd backend
   cp .env.example .env   # fill in DB credentials, JWT_SECRET and (optionally) GEMINI_API_KEY
   npm install
   npm run dev
   ```

3. **Frontend** (runs on http://localhost:5173)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   In development the Vite dev server proxies `/api` to the backend, so no frontend `.env` is needed.
   For a production build set `VITE_API_URL` (see `frontend/.env.example`) before `npm run build`.

The resume match feature needs a `GEMINI_API_KEY` in `backend/.env`; without it the endpoint returns 503 and the rest of the app works normally.

## Status

Core features complete — auth, job CRUD, status tracking, search/filter and AI resume match. Next up: AWS deployment.
