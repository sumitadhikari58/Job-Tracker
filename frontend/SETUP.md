# JobTrackr Frontend — Setup

## 1. Install
cd frontend
npm install

## 2. Point it at your backend
The .env file has:
VITE_API_URL=http://localhost:8000/api

That matches your Express server. When you deploy, change this to your EC2 URL.

## 3. Run
npm run dev

Opens on http://localhost:5173

## 4. Make sure your backend is running too
In another terminal, from backend/:
node server.js   (or nodemon server.js)

## Folder map
src/
  api/          -> talks to your Express backend (axios)
    client.js   -> axios instance + attaches JWT to every request
    auth.js     -> register / login calls
    jobs.js     -> job CRUD calls
  context/
    AuthContext.jsx -> holds "am I logged in" state, stores the JWT
  components/   -> reusable UI (JobCard, JobModal, AiModal, etc.)
  pages/        -> Login, Register, Dashboard
  App.jsx       -> routing + protected route
  theme.js      -> colors and shared styles

## Note on the AI feature
The Resume Match modal calls POST /api/ai/resume-match on your backend.
That endpoint isn't built yet — it's the one remaining backend piece.
Everything else (auth + job CRUD) is wired to routes you already built.
