# JobTrackr

A full-stack job application tracker built to manage and monitor job applications during placement season.

## Overview

JobTrackr lets a user log job applications, track their status through the hiring pipeline (Applied → OA/Screening → Interview → Offer/Rejected), and update them as things progress. Built as a portfolio project alongside placement prep.

## Tech Stack

**Frontend:** React + Tailwind CSS
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
| GET | /api/jobs | Get all jobs for logged-in user |
| POST | /api/jobs | Add a new job |
| PUT | /api/jobs/:id | Update a job (status/details) |
| DELETE | /api/jobs/:id | Delete a job |

## Folder Structure

```
jobtrackr/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── jobController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── userModel.js
│   │   └── jobModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── jobRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
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

## Status

In progress — backend setup and schema design underway.