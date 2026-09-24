# JobTrackr Frontend — Setup

## 1. Install
cd frontend
npm install

## 2. Point it at your backend
In development nothing is needed: the Vite dev server proxies /api to
http://localhost:8000 (see vite.config.js).

For a deployed build, copy .env.example to .env and set
VITE_API_URL to your EC2 URL, e.g. https://api.example.com/api

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
    auth.js     -> register / login / me calls
    jobs.js     -> job CRUD calls
    ai.js       -> resume match upload
  context/
    AuthContext.jsx -> holds "am I logged in" state, stores the JWT
  components/   -> reusable UI (JobCard, JobModal, AiModal, etc.)
  pages/        -> Login, Register, Dashboard
  App.jsx       -> routing + protected route
  theme.js      -> colors and shared styles

## Note on the AI feature
The Resume Match modal calls POST /api/ai/resume-match on the backend,
which sends the PDF + job description to Google Gemini.
Set GEMINI_API_KEY in backend/.env to enable it.
